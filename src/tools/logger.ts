import * as fs from 'fs';
import { LogEntry } from '../types/index';

export class Logger {
  private logFilePath?: string;

  constructor(logFilePath?: string) {
    this.logFilePath = logFilePath;
  }

  log(level: 'INFO' | 'WARN' | 'ERROR', component: string, message: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
    };

    const line = JSON.stringify(entry);
    process.stdout.write(line + '\n');

    if (this.logFilePath) {
      fs.appendFileSync(this.logFilePath, line + '\n', 'utf8');
    }
  }
}

export const logger = new Logger();
