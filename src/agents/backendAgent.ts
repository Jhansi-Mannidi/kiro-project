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

// Files to generate one at a time
const BACKEND_FILES = [
  {
    // Use hardcoded known-good versions — LLMs hallucinate bad semver
    filePath: 'package.json',
    instruction: `Return ONLY this exact JSON, do not change version numbers:
{
  "name": "generated-app-backend",
  "version": "1.0.0",
  "scripts": { "start": "node server.js", "dev": "nodemon server.js" },
  "dependencies": { "express": "^4.18.0", "cors": "^2.8.5", "pg": "^8.11.0", "dotenv": "^16.0.0" },
  "devDependencies": { "nodemon": "^3.0.0" }
}`,
  },
  { filePath: '.env.example', instruction: 'Generate ONLY a .env.example file with DATABASE_URL=postgresql://user:password@localhost:5432/dbname and PORT=3000. Return ONLY the raw file content.' },
  { filePath: 'server.js', instruction: 'Generate ONLY the server.js entry point for an Express app. Use require(). Include cors, express.json() middleware, import routes, and a basic error handler. Return ONLY the raw JavaScript code.' },
  { filePath: 'routes/index.js', instruction: 'Generate ONLY the routes/index.js file that mounts all route modules. Use express.Router(). Return ONLY the raw JavaScript code.' },
  { filePath: 'controllers/mainController.js', instruction: 'Generate ONLY the controllers/mainController.js file with controller functions relevant to the app. Use async/await. Return ONLY the raw JavaScript code.' },
  { filePath: 'models/db.js', instruction: 'Generate ONLY the models/db.js file that creates and exports a pg Pool instance using DATABASE_URL from process.env. Return ONLY the raw JavaScript code.' },
];

export class BackendAgent {
  private fileWriter = new FileWriter();
  private retry = new RetryMechanism();

  async execute(task: Task, outputDir: string, context: string): Promise<void> {
    logger.log('INFO', 'BackendAgent', `Executing task: ${task.description}`);

    await this.retry.execute(
      async () => {
        const files = await this.generateFiles(task.description, context);
        this.writeFiles(files, outputDir);
      },
      { taskId: task.id, agentType: 'BACKEND' }
    );

    logger.log('INFO', 'BackendAgent', 'Backend code generation complete');
  }

  private async generateFiles(description: string, context: string): Promise<GeneratedFile[]> {
    const results: GeneratedFile[] = [];

    for (const file of BACKEND_FILES) {
      logger.log('INFO', 'BackendAgent', `Generating ${file.filePath}...`);

      const content = await ollamaChat([
        {
          role: 'system',
          content: `You are a senior Node.js developer. The app being built: ${description}\n\nContext: ${context}\n\n${file.instruction}\n\nReturn ONLY the raw file content. No markdown fences, no explanation, no JSON wrapping.`,
        },
        {
          role: 'user',
          content: `Generate the ${file.filePath} file for this app: ${description}`,
        },
      ]);

      // Strip any accidental markdown fences
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
      const fullPath = path.join(outputDir, 'backend', file.filePath);
      const result = this.fileWriter.write(fullPath, file.content);
      if (!result.success) throw new Error(result.error);
    }
  }
}
