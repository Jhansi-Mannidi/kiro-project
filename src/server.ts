import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import { Orchestrator } from './orchestrator/orchestrator';
import { logger } from './tools/logger';

// Catch unhandled promise rejections so the process doesn't die silently
process.on('unhandledRejection', (reason) => {
  logger.log('ERROR', 'Server', `Unhandled rejection: ${reason}`);
});
process.on('uncaughtException', (err) => {
  logger.log('ERROR', 'Server', `Uncaught exception: ${err.message}`);
});

const app = express();
const PORT = process.env.API_PORT ?? 4000;
const SERVER_TIMEOUT = 30 * 60 * 1000; // 30 minutes

app.use(cors());
app.use(express.json());

// Increase timeout for long-running generation requests
app.use((req, res, next) => {
  res.setTimeout(SERVER_TIMEOUT);
  next();
});

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body as { prompt?: string };

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ success: false, error: 'Prompt is required' });
  }

  logger.log('INFO', 'APIServer', `Received generation request: "${prompt.slice(0, 80)}"`);

  // Set a long timeout for this specific request
  req.setTimeout(25 * 60 * 1000);
  res.setTimeout(25 * 60 * 1000);

  try {
    const outputDir = path.resolve(process.env.OUTPUT_DIR ?? './output');
    logger.log('INFO', 'APIServer', `Output directory: ${outputDir}`);
    const orchestrator = new Orchestrator(outputDir);
    const result = await orchestrator.generate(prompt);
    if (!res.headersSent) {
      return res.json(result);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.log('ERROR', 'APIServer', `Generation error: ${message}`);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, error: message });
    }
  }
});

// Returns all generated files with their content for the UI file viewer
app.get('/api/files', (req, res) => {
  const outputPath = (req.query.path as string) || './output';

  function walk(dir: string, base: string): Array<{ path: string; content: string }> {
    const results: Array<{ path: string; content: string }> = [];
    if (!fs.existsSync(dir)) return results;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      const fullPath = path.join(dir, entry.name);
      const relPath = path.relative(base, fullPath);
      if (entry.isDirectory()) {
        results.push(...walk(fullPath, base));
      } else {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          results.push({ path: relPath, content });
        } catch {
          results.push({ path: relPath, content: '(binary file)' });
        }
      }
    }
    return results;
  }

  const files = walk(outputPath, outputPath);
  res.json({ files });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ollama: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434' });
});

// Auto-deploy: runs docker compose up --build and returns the live URL
app.post('/api/deploy', async (req, res) => {
  const { outputPath, domain } = req.body as { outputPath: string; domain?: string };

  if (!outputPath || !fs.existsSync(outputPath)) {
    return res.status(400).json({ success: false, error: 'Invalid output path' });
  }

  const composePath = path.join(outputPath, 'docker-compose.yml');
  if (!fs.existsSync(composePath)) {
    return res.status(400).json({ success: false, error: 'docker-compose.yml not found' });
  }

  logger.log('INFO', 'Deploy', `Starting deployment from ${outputPath}`);

  // Fix depends_on format before deploying
  try {
    let compose = fs.readFileSync(composePath, 'utf8');
    compose = compose.replace(/depends_on:\s*(\w+)/g, (_m: string, svc: string) => `depends_on:\n      - ${svc}`);
    // Remove obsolete version field
    compose = compose.replace(/^version:.*\n/m, '');

    // Use external Render DB instead of local postgres
    const externalDb = process.env.DATABASE_URL;
    if (externalDb) {
      // Remove postgres service entirely
      compose = compose.replace(/\s+postgres:\s*\n(\s+[^\n]+\n)*/g, '\n');
      // Remove depends_on postgres references
      compose = compose.replace(/\s+depends_on:\s*\n\s+- postgres\n/g, '\n');
      compose = compose.replace(/depends_on:\s*\n\s+- postgres/g, '');
      // Replace DATABASE_URL with external one
      compose = compose.replace(
        /DATABASE_URL:.*$/m,
        `DATABASE_URL: "${externalDb}"`
      );
      // Remove volumes section referencing postgres
      compose = compose.replace(/\nvolumes:\s*\n(\s+\w+-postgres-data:[^\n]*\n?)+/g, '\n');
      logger.log('INFO', 'Deploy', 'Using external Render PostgreSQL database');
    }

    fs.writeFileSync(composePath, compose);
  } catch (e) {
    logger.log('WARN', 'Deploy', `Could not patch docker-compose: ${e}`);
  }

  // Fix frontend Dockerfile — ensure it uses multi-stage nginx build
  const frontendDockerfile = path.join(outputPath, 'frontend/Dockerfile');
  fs.writeFileSync(frontendDockerfile, `# Stage 1: Build with Vite
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve built files with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`);

  // Write nginx.conf to proxy /api to backend and allow iframe embedding
  fs.writeFileSync(path.join(outputPath, 'frontend/nginx.conf'), `server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # Allow embedding in iframes
    add_header X-Frame-Options "ALLOWALL";
    add_header Content-Security-Policy "frame-ancestors *";

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
`);

  // Fix backend routes — replace any require('./xxx') that points to missing files
  // with a stub that just exports an empty router
  const routesDir = path.join(outputPath, 'backend/routes');
  if (fs.existsSync(routesDir)) {
    const routeFiles = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));
    for (const rf of routeFiles) {
      const rfPath = path.join(routesDir, rf);
      let content = fs.readFileSync(rfPath, 'utf8');
      // Find all require('./xxx') calls and create stub files if missing
      const requires = content.matchAll(/require\(['"]\.\/(\w+)['"]\)/g);
      for (const match of requires) {
        const depName = match[1];
        const depPath = path.join(routesDir, `${depName}.js`);
        if (!fs.existsSync(depPath)) {
          fs.writeFileSync(depPath, `const express = require('express');\nconst router = express.Router();\nmodule.exports = router;\n`);
        }
      }
    }
  }

  // Inject /api/health route into backend server.js if missing
  const backendServerJs = path.join(outputPath, 'backend/server.js');
  if (fs.existsSync(backendServerJs)) {
    let serverContent = fs.readFileSync(backendServerJs, 'utf8');

    // Fix routes/index.js — ensure it exports a router, not an app
    const routesIndexPath = path.join(outputPath, 'backend/routes/index.js');
    if (fs.existsSync(routesIndexPath)) {
      let routesContent = fs.readFileSync(routesIndexPath, 'utf8');
      // Replace app.use(express.json()) and app.use(router) patterns with just module.exports = router
      if (routesContent.includes('const app = express()') || !routesContent.includes('module.exports')) {
        // Extract router.use lines
        const routerUseLines = routesContent.match(/router\.use\([^)]+\);/g) || [];
        const newRoutesContent = `const express = require('express');\nconst router = express.Router();\n\n${routerUseLines.join('\n')}\n\nmodule.exports = router;\n`;
        fs.writeFileSync(routesIndexPath, newRoutesContent);
        logger.log('INFO', 'Deploy', 'Fixed routes/index.js to export router');
      }
    }

    // Inject app.listen if missing
    if (!serverContent.includes('app.listen') && !serverContent.includes('.listen(')) {
      serverContent += `\n\nconst port = process.env.PORT || 3000;\napp.listen(port, () => console.log('Server started on port ' + port));\n`;
      fs.writeFileSync(backendServerJs, serverContent);
      logger.log('INFO', 'Deploy', 'Injected app.listen into backend/server.js');
    }

    // Inject health route if missing
    if (!serverContent.includes('/api/health') && !serverContent.includes("'/health'")) {
      serverContent = serverContent.replace(
        /app\.listen\s*\(/,
        `app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));\n\napp.listen(`
      );
      fs.writeFileSync(backendServerJs, serverContent);
      logger.log('INFO', 'Deploy', 'Injected /api/health route into backend/server.js');
    }
  }

  // Fix backend .env.example and inject actual DATABASE_URL
  const backendEnvExample = path.join(outputPath, 'backend/.env.example');
  const backendEnvFile = path.join(outputPath, 'backend/.env');
  const externalDb = process.env.DATABASE_URL || '';
  const envContent = `DATABASE_URL=${externalDb || 'postgresql://user:password@localhost:5432/dbname'}\nPORT=3000\n`;
  fs.writeFileSync(backendEnvExample, envContent);
  // Write actual .env so the backend uses it immediately
  fs.writeFileSync(backendEnvFile, envContent);
  logger.log('INFO', 'Deploy', `Backend .env configured with ${externalDb ? 'Render' : 'local'} database`);

  const backendPkg = path.join(outputPath, 'backend/package.json');
  if (fs.existsSync(backendPkg)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(backendPkg, 'utf8'));
      if (!pkg.scripts) pkg.scripts = {};
      if (!pkg.scripts.start) pkg.scripts.start = 'node server.js';
      fs.writeFileSync(backendPkg, JSON.stringify(pkg, null, 2));
    } catch { /* ignore */ }
  }

  // Fix frontend package.json — ensure build script exists
  const frontendPkg = path.join(outputPath, 'frontend/package.json');
  if (fs.existsSync(frontendPkg)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(frontendPkg, 'utf8'));
      if (!pkg.scripts) pkg.scripts = {};
      if (!pkg.scripts.build) pkg.scripts.build = 'vite build';
      if (!pkg.type) pkg.type = 'module';
      fs.writeFileSync(frontendPkg, JSON.stringify(pkg, null, 2));
    } catch { /* ignore */ }
  }

  // Fix frontend index.html — ensure it uses Vite's module script entry
  const indexHtml = path.join(outputPath, 'frontend/index.html');
  fs.writeFileSync(indexHtml, `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Generated App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`);

  // ── USE GENERATED CODE: Fix broken imports instead of replacing everything ──
  const frontendSrcDir = path.join(outputPath, 'frontend/src');
  fs.mkdirSync(frontendSrcDir, { recursive: true });

  // Fix main.jsx — ensure correct ReactDOM usage
  const mainJsx = path.join(frontendSrcDir, 'main.jsx');
  if (!fs.existsSync(mainJsx)) {
    fs.writeFileSync(mainJsx, `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);\n`);
  } else {
    let c = fs.readFileSync(mainJsx, 'utf8');
    // Fix ReactDOM.render → createRoot
    if (c.includes("from 'react-dom'") && !c.includes("from 'react-dom/client'")) {
      c = c.replace("from 'react-dom'", "from 'react-dom/client'");
    }
    if (c.includes('ReactDOM.render(') && !c.includes('createRoot')) {
      c = c.replace(/ReactDOM\.render\(\s*(<[\s\S]*?>)\s*,\s*document\.getElementById\(['"]root['"]\)\s*\)/,
        "ReactDOM.createRoot(document.getElementById('root')).render($1)");
    }
    fs.writeFileSync(mainJsx, c);
  }

  // Fix Switch → Routes (React Router v5 → v6)
  function fixReactRouterV6(content: string): string {
    return content
      .replace(/import\s*\{([^}]*)\bSwitch\b([^}]*)\}\s*from\s*['"]react-router-dom['"]/g,
        (_, before, after) => `import {${before}Routes${after}} from 'react-router-dom'`)
      .replace(/<Switch>/g, '<Routes>')
      .replace(/<\/Switch>/g, '</Routes>')
      .replace(/<Route\s+path="([^"]+)"\s+component=\{(\w+)\}\s*\/>/g,
        '<Route path="$1" element={<$2 />} />')
      .replace(/<Route\s+exact\s+path="([^"]+)"\s+component=\{(\w+)\}\s*\/>/g,
        '<Route path="$1" element={<$2 />} />');
  }

  // Scan and fix all JSX/JS files
  function repairFrontendFiles(dir: string): void {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) { repairFrontendFiles(fullPath); continue; }
      if (!/\.(jsx?|tsx?)$/.test(entry.name)) continue;

      let content = fs.readFileSync(fullPath, 'utf8');

      // Fix React Router v5 → v6
      content = fixReactRouterV6(content);

      // Create stub files for missing local imports
      const importMatches = [...content.matchAll(/import\s+(?:\w+|\{[^}]+\})\s+from\s+['"](\.[^'"]+)['"]/g)];
      for (const match of importMatches) {
        const importPath = match[1];
        const baseDir = path.dirname(fullPath);
        const exts = ['.jsx', '.js', '.tsx', '.ts', '/index.jsx', '/index.js'];
        const exists = exts.some(ext => fs.existsSync(path.join(baseDir, importPath + ext)));
        if (!exists && !importPath.includes('.css') && !importPath.includes('.svg')) {
          const stubName = path.basename(importPath).replace(/[^a-zA-Z0-9]/g, '') || 'Component';
          const stubPath = path.join(baseDir, importPath + '.jsx');
          fs.mkdirSync(path.dirname(stubPath), { recursive: true });
          fs.writeFileSync(stubPath,
            `export default function ${stubName}() { return <div style={{padding:20}}><h2>${stubName}</h2></div>; }\n`);
          logger.log('INFO', 'Deploy', `Created stub: ${stubPath}`);
        }
      }

      fs.writeFileSync(fullPath, content);
    }
  }

  repairFrontendFiles(frontendSrcDir);
  logger.log('INFO', 'Deploy', 'Frontend source repaired — using LLM-generated code');

  // Fix frontend vite.config.js — ensure it uses ESM
  const viteConfig = path.join(outputPath, 'frontend/vite.config.js');
  fs.writeFileSync(viteConfig, `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:3000' } },
});
`);

  // Find a free port for the frontend (start from 8080)
  const frontendPort = await findFreePort(8080);
  const backendPort = await findFreePort(3100);

  // Patch docker-compose.yml to use dynamic ports
  try {
    let compose = fs.readFileSync(composePath, 'utf8');
    compose = compose.replace(/- "80:80"/, `- "${frontendPort}:80"`);
    compose = compose.replace(/- "3000:3000"/, `- "${backendPort}:3000"`);
    fs.writeFileSync(composePath, compose);
  } catch { /* ignore */ }

  // Run docker compose up --build -d (detached)
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);

  try {
    logger.log('INFO', 'Deploy', 'Running docker compose up --build -d...');
    // Fix Docker credentials issue before pulling images
    const homeDir = process.env.HOME || '/root';
    const dockerConfigPath = `${homeDir}/.docker/config.json`;
    try {
      fs.writeFileSync(dockerConfigPath, JSON.stringify({ auths: {} }), 'utf8');
      logger.log('INFO', 'Deploy', 'Docker credentials reset');
    } catch { /* ignore */ }

    await execAsync('docker compose up --build -d', { cwd: outputPath, timeout: 10 * 60 * 1000 });
    // Build the URL — always use localhost:port (domain subdomains require DNS setup)
    const localUrl = `http://localhost:${frontendPort}`;
    logger.log('INFO', 'Deploy', `Deployment complete. Local URL: ${localUrl}`);

    // Try to get ngrok public URL if ngrok is running
    let publicUrl = localUrl;
    try {
      // Check if ngrok is running and get its tunnels
      const ngrokApi = await execAsync('curl -s http://localhost:4040/api/tunnels', { timeout: 3000 });
      const ngrokData = JSON.parse(ngrokApi.stdout);
      const tunnels = ngrokData?.tunnels || [];
      if (tunnels.length > 0) {
        // Use existing ngrok tunnel or start one for this port
        const existingTunnel = tunnels.find((t: { public_url: string }) => t.public_url.startsWith('https://'));
        if (existingTunnel) {
          publicUrl = existingTunnel.public_url;
          logger.log('INFO', 'Deploy', `Using existing ngrok tunnel: ${publicUrl}`);
        }
      }
    } catch {
      // ngrok not running — try to start a tunnel for this port
      try {
        execAsync(`ngrok http ${frontendPort} --log=stdout &`, { timeout: 2000 }).catch(() => {});
        await new Promise(r => setTimeout(r, 3000));
        const ngrokApi = await execAsync('curl -s http://localhost:4040/api/tunnels', { timeout: 3000 });
        const ngrokData = JSON.parse(ngrokApi.stdout);
        const tunnel = ngrokData?.tunnels?.find((t: { public_url: string }) => t.public_url.startsWith('https://'));
        if (tunnel) publicUrl = tunnel.public_url;
      } catch { /* ngrok not available, use local URL */ }
    }

    return res.json({ success: true, url: publicUrl, localUrl, frontendPort, backendPort, domain: domain || null });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.log('ERROR', 'Deploy', message);
    return res.status(500).json({ success: false, error: message });
  }
});

async function findFreePort(start: number): Promise<number> {
  const net = await import('net');
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(start, () => {
      const port = (server.address() as { port: number }).port;
      server.close(() => resolve(port));
    });
    server.on('error', () => resolve(findFreePort(start + 1)));
  });
}

// Test runner — validates generated project structure and code quality
app.post('/api/test', async (req, res) => {
  const { outputPath, prompt } = req.body as { outputPath: string; prompt: string };
  const tests: Array<{ name: string; description: string; status: string; error?: string }> = [];

  function check(name: string, description: string, fn: () => void) {
    try { fn(); tests.push({ name, description, status: 'pass' }); }
    catch (e: unknown) { tests.push({ name, description, status: 'fail', error: e instanceof Error ? e.message : String(e) }); }
  }

  // 1. Project structure tests
  check('Project Structure', 'Output directory exists', () => {
    if (!fs.existsSync(outputPath)) throw new Error(`Directory not found: ${outputPath}`);
  });
  check('Frontend Directory', '/frontend directory exists', () => {
    if (!fs.existsSync(path.join(outputPath, 'frontend'))) throw new Error('Missing /frontend directory');
  });
  check('Backend Directory', '/backend directory exists', () => {
    if (!fs.existsSync(path.join(outputPath, 'backend'))) throw new Error('Missing /backend directory');
  });
  check('Database Directory', '/database directory exists', () => {
    if (!fs.existsSync(path.join(outputPath, 'database'))) throw new Error('Missing /database directory');
  });
  check('Docker Compose', 'docker-compose.yml exists at root', () => {
    if (!fs.existsSync(path.join(outputPath, 'docker-compose.yml'))) throw new Error('Missing docker-compose.yml');
  });

  // 2. Backend tests
  check('Backend server.js', 'server.js entry point exists', () => {
    if (!fs.existsSync(path.join(outputPath, 'backend/server.js'))) throw new Error('Missing backend/server.js');
  });
  check('Backend package.json', 'package.json with dependencies', () => {
    const p = path.join(outputPath, 'backend/package.json');
    if (!fs.existsSync(p)) throw new Error('Missing backend/package.json');
    const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (!pkg.dependencies?.express) throw new Error('express not in dependencies');
  });
  check('Backend Routes', 'routes directory exists', () => {
    if (!fs.existsSync(path.join(outputPath, 'backend/routes'))) throw new Error('Missing backend/routes/');
  });
  check('Backend Controllers', 'controllers directory exists', () => {
    if (!fs.existsSync(path.join(outputPath, 'backend/controllers'))) throw new Error('Missing backend/controllers/');
  });
  check('Backend Dockerfile', 'Dockerfile exists for backend', () => {
    if (!fs.existsSync(path.join(outputPath, 'backend/Dockerfile'))) throw new Error('Missing backend/Dockerfile');
  });

  // 3. Frontend tests
  check('Frontend package.json', 'package.json with React', () => {
    const p = path.join(outputPath, 'frontend/package.json');
    if (!fs.existsSync(p)) throw new Error('Missing frontend/package.json');
    const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (!pkg.dependencies?.react) throw new Error('react not in dependencies');
  });
  check('Frontend index.html', 'index.html entry file exists', () => {
    if (!fs.existsSync(path.join(outputPath, 'frontend/index.html'))) throw new Error('Missing frontend/index.html');
  });
  check('Frontend src/', 'src directory with components', () => {
    if (!fs.existsSync(path.join(outputPath, 'frontend/src'))) throw new Error('Missing frontend/src/');
  });
  check('Frontend App.jsx', 'Root App component exists', () => {
    const hasApp = fs.existsSync(path.join(outputPath, 'frontend/src/App.jsx')) ||
                   fs.existsSync(path.join(outputPath, 'frontend/src/App.tsx'));
    if (!hasApp) throw new Error('Missing frontend/src/App.jsx');
  });
  check('Frontend Dockerfile', 'Dockerfile exists for frontend', () => {
    if (!fs.existsSync(path.join(outputPath, 'frontend/Dockerfile'))) throw new Error('Missing frontend/Dockerfile');
  });

  // 4. Database tests
  check('SQL Migrations', 'At least one .sql migration file', () => {
    const dbDir = path.join(outputPath, 'database');
    if (!fs.existsSync(dbDir)) throw new Error('Missing /database directory');
    const sqlFiles = fs.readdirSync(dbDir).filter(f => f.endsWith('.sql'));
    if (sqlFiles.length === 0) throw new Error('No .sql migration files found');
  });
  check('SQL Syntax', 'Migration contains CREATE TABLE', () => {
    const dbDir = path.join(outputPath, 'database');
    const sqlFiles = fs.readdirSync(dbDir).filter(f => f.endsWith('.sql'));
    const content = fs.readFileSync(path.join(dbDir, sqlFiles[0]), 'utf8');
    if (!/CREATE\s+TABLE/i.test(content)) throw new Error('No CREATE TABLE statement found in migration');
  });

  // 5. Docker tests
  check('Docker Compose Services', 'docker-compose.yml has required services', () => {
    const content = fs.readFileSync(path.join(outputPath, 'docker-compose.yml'), 'utf8');
    if (!content.includes('postgres')) throw new Error('Missing postgres service in docker-compose.yml');
    if (!content.includes('backend')) throw new Error('Missing backend service in docker-compose.yml');
    if (!content.includes('frontend')) throw new Error('Missing frontend service in docker-compose.yml');
  });
  check('Docker depends_on', 'depends_on uses list format', () => {
    const content = fs.readFileSync(path.join(outputPath, 'docker-compose.yml'), 'utf8');
    if (/depends_on:\s+\w+\s*\n/.test(content)) throw new Error('depends_on must be a list (use "- service"), not a scalar');
  });

  res.json({ tests, summary: { total: tests.length, passed: tests.filter(t => t.status === 'pass').length, failed: tests.filter(t => t.status === 'fail').length } });
});
app.listen(PORT, () => {
  logger.log('INFO', 'APIServer', `API server running at http://localhost:${PORT}`);
});
