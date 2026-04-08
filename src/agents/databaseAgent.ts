import * as path from 'path';
import { FileWriter } from '../tools/fileWriter';
import { RetryMechanism } from '../tools/retryMechanism';
import { logger } from '../tools/logger';
import { ollamaChat } from '../tools/ollamaClient';
import { Task } from '../types/index';

interface MigrationFile {
  fileName: string;
  content: string;
}

export class DatabaseAgent {
  private fileWriter = new FileWriter();
  private retry = new RetryMechanism();

  async execute(task: Task, outputDir: string, context: string): Promise<void> {
    logger.log('INFO', 'DatabaseAgent', `Executing task: ${task.description}`);

    await this.retry.execute(
      async () => {
        const files = await this.generateFiles(task.description, context);
        this.validateSql(files);
        this.writeFiles(files, outputDir);
      },
      { taskId: task.id, agentType: 'DATABASE' }
    );

    logger.log('INFO', 'DatabaseAgent', 'Database schema generation complete');
  }

  private async generateFiles(description: string, context: string): Promise<MigrationFile[]> {
    logger.log('INFO', 'DatabaseAgent', 'Generating 001_init.sql...');

    const sql = await ollamaChat([
      {
        role: 'system',
        content: `You are a senior PostgreSQL database architect. The app being built: ${description}\n\nContext: ${context}\n\nGenerate ONLY the SQL migration file content (001_init.sql).\nRequirements:\n- Use CREATE TABLE IF NOT EXISTS\n- Include primary keys (SERIAL or UUID), foreign keys, NOT NULL constraints\n- Add created_at TIMESTAMP DEFAULT NOW() columns\n- Return ONLY the raw SQL, no markdown, no explanation.`,
      },
      {
        role: 'user',
        content: `Generate the PostgreSQL schema for: ${description}`,
      },
    ]);

    const cleaned = sql
      .replace(/^```[\w]*\n?/m, '')
      .replace(/\n?```\s*$/m, '')
      .trim();

    return [{ fileName: '001_init.sql', content: cleaned }];
  }

  private validateSql(files: MigrationFile[]): void {
    for (const file of files) {
      if (!file.content || file.content.trim().length === 0) {
        throw new Error(`DatabaseAgent: "${file.fileName}" is empty`);
      }
      if (!/CREATE|INSERT|ALTER/i.test(file.content)) {
        throw new Error(`DatabaseAgent: "${file.fileName}" contains no valid SQL statements`);
      }
    }
  }

  private writeFiles(files: MigrationFile[], outputDir: string): void {
    for (const file of files) {
      const fullPath = path.join(outputDir, 'database', file.fileName);
      const result = this.fileWriter.write(fullPath, file.content);
      if (!result.success) throw new Error(result.error);
    }
  }
}
