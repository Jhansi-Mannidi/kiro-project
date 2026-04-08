import * as path from 'path';
import { FileWriter } from '../tools/fileWriter';
import { RetryMechanism } from '../tools/retryMechanism';
import { logger } from '../tools/logger';
import { ollamaChat } from '../tools/ollamaClient';
import { Task } from '../types/index';

interface GeneratedFile {
  filePath: string;
  content: string;
}

const FRONTEND_FILES = [
  {
    // Use hardcoded known-good versions — LLMs hallucinate bad semver
    filePath: 'package.json',
    instruction: `Return ONLY this exact JSON, do not change version numbers:
{
  "name": "generated-app-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview" },
  "dependencies": { "react": "^18.2.0", "react-dom": "^18.2.0", "react-router-dom": "^6.11.0", "axios": "^1.4.0" },
  "devDependencies": { "@vitejs/plugin-react": "^4.0.0", "vite": "^5.0.0" }
}`,
  },
  { filePath: 'index.html', instruction: 'Generate ONLY the index.html Vite entry file. Include <div id="root"></div> and a script tag pointing to /src/main.jsx. Return ONLY the raw HTML.' },
  { filePath: 'vite.config.js', instruction: `Return ONLY this exact content for vite.config.js:
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});` },
  { filePath: 'src/main.jsx', instruction: 'Generate ONLY the src/main.jsx entry point using ReactDOM.createRoot. Import App from ./App. Return ONLY the raw JSX code.' },
  { filePath: 'src/App.jsx', instruction: 'Generate ONLY the src/App.jsx root component. Use React Router with routes for the main pages. Return ONLY the raw JSX code.' },
  { filePath: 'src/pages/HomePage.jsx', instruction: 'Generate ONLY the src/pages/HomePage.jsx page component relevant to the app. Use functional component with hooks. Return ONLY the raw JSX code.' },
  { filePath: 'src/components/Layout.jsx', instruction: 'Generate ONLY the src/components/Layout.jsx component with a header, main content area, and footer. Return ONLY the raw JSX code.' },
  { filePath: 'src/api/api.js', instruction: 'Generate ONLY the src/api/api.js file using axios. Create an axios instance with baseURL from import.meta.env.VITE_API_URL or http://localhost:3000. Export functions to call the backend API. Return ONLY the raw JavaScript.' },
];

export class FrontendAgent {
  private fileWriter = new FileWriter();
  private retry = new RetryMechanism();

  async execute(task: Task, outputDir: string, context: string): Promise<void> {
    logger.log('INFO', 'FrontendAgent', `Executing task: ${task.description}`);

    await this.retry.execute(
      async () => {
        const files = await this.generateFiles(task.description, context);
        this.writeFiles(files, outputDir);
      },
      { taskId: task.id, agentType: 'FRONTEND' }
    );

    logger.log('INFO', 'FrontendAgent', 'Frontend code generation complete');
  }

  private async generateFiles(description: string, context: string): Promise<GeneratedFile[]> {
    const results: GeneratedFile[] = [];

    for (const file of FRONTEND_FILES) {
      logger.log('INFO', 'FrontendAgent', `Generating ${file.filePath}...`);

      const content = await ollamaChat([
        {
          role: 'system',
          content: `You are a senior React developer. The app being built: ${description}\n\nContext: ${context}\n\n${file.instruction}\n\nReturn ONLY the raw file content. No markdown fences, no explanation, no JSON wrapping.`,
        },
        {
          role: 'user',
          content: `Generate the ${file.filePath} file for this app: ${description}`,
        },
      ]);

      const cleaned = content
        .replace(/^```[\w]*\n?/m, '')
        .replace(/\n?```\s*$/m, '')
        .trim();

      results.push({ filePath: file.filePath, content: cleaned });
    }

    return results;
  }

  private writeFiles(files: GeneratedFile[], outputDir: string): void {
    for (const file of files) {
      const fullPath = path.join(outputDir, 'frontend', file.filePath);
      const result = this.fileWriter.write(fullPath, file.content);
      if (!result.success) throw new Error(result.error);
    }
  }
}
