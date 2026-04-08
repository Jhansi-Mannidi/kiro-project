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

const DEVOPS_FILES = [
  {
    filePath: 'docker-compose.yml',
    instruction: `Generate ONLY the docker-compose.yml file.
Define three services:
- postgres: image postgres:15-alpine, env POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, named volume
- backend: build ./backend, port 3000:3000, env DATABASE_URL and PORT=3000
- frontend: build ./frontend, port 80:80
named volume for postgres data

CRITICAL: depends_on MUST always be a YAML list format like this:
  depends_on:
    - postgres

NEVER write: depends_on: postgres

Return ONLY the raw YAML content.`,
  },
  {
    filePath: 'backend/Dockerfile',
    instruction: `Generate ONLY the backend Dockerfile.
Use node:18-alpine. WORKDIR /app. Copy package.json, run npm install, copy source, expose 3000, CMD node server.js.
Return ONLY the raw Dockerfile content.`,
  },
  {
    filePath: 'frontend/Dockerfile',
    instruction: `Generate ONLY the frontend Dockerfile.
Stage 1: node:18-alpine, build the Vite app (npm run build).
Stage 2: nginx:alpine, copy built files from stage 1 to /usr/share/nginx/html, expose 80.
Return ONLY the raw Dockerfile content.`,
  },
];

export class DevOpsAgent {
  private fileWriter = new FileWriter();
  private retry = new RetryMechanism();

  async execute(task: Task, outputDir: string, context: string): Promise<void> {
    logger.log('INFO', 'DevOpsAgent', `Executing task: ${task.description}`);

    await this.retry.execute(
      async () => {
        const files = await this.generateFiles(task.description, context);
        this.validateFiles(files);
        this.writeFiles(files, outputDir);
      },
      { taskId: task.id, agentType: 'DEVOPS' }
    );

    logger.log('INFO', 'DevOpsAgent', 'DevOps configuration generation complete');
  }

  private async generateFiles(description: string, context: string): Promise<GeneratedFile[]> {
    const results: GeneratedFile[] = [];

    for (const file of DEVOPS_FILES) {
      logger.log('INFO', 'DevOpsAgent', `Generating ${file.filePath}...`);

      const content = await ollamaChat([
        {
          role: 'system',
          content: `You are a senior DevOps engineer. The app being built: ${description}\n\nContext: ${context}\n\n${file.instruction}\n\nReturn ONLY the raw file content. No markdown fences, no explanation.`,
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

      // Fix common LLM mistake: depends_on: service → depends_on:\n  - service
      const fixed = cleaned.replace(
        /depends_on:\s*(\w+)/g,
        (_match: string, svc: string) => `depends_on:\n      - ${svc}`
      );

      results.push({ filePath: file.filePath, content: fixed });
    }

    return results;
  }

  private validateFiles(files: GeneratedFile[]): void {
    const paths = files.map((f) => f.filePath);
    if (!paths.includes('docker-compose.yml')) {
      throw new Error('DevOpsAgent: docker-compose.yml was not generated');
    }
  }

  private writeFiles(files: GeneratedFile[], outputDir: string): void {
    for (const file of files) {
      const fullPath = path.join(outputDir, file.filePath);
      const result = this.fileWriter.write(fullPath, file.content);
      if (!result.success) throw new Error(result.error);
    }
  }
}
