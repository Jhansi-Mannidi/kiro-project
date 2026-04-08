import * as fs from 'fs';
import * as path from 'path';
import { logger } from './logger';

export class FileWriter {
  write(filePath: string, content: string): { success: boolean; error?: string } {
    logger.log('INFO', 'FileWriter', `Writing file: ${filePath}`);

    try {
      const dir = path.dirname(filePath);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, content, 'utf8');
      logger.log('INFO', 'FileWriter', `Successfully wrote file: ${filePath}`);
      return { success: true };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : String(err);
      const errorMsg = `Failed to write file "${filePath}": ${message}`;
      logger.log('ERROR', 'FileWriter', errorMsg);
      return { success: false, error: errorMsg };
    }
  }
}

export const fileWriter = new FileWriter();
