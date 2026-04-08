import { spawn } from 'child_process';
import { logger } from './logger';

export interface TerminalResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  error?: string;
}

export class TerminalExecutor {
  async run(command: string, cwd: string): Promise<TerminalResult> {
    logger.log('INFO', 'TerminalExecutor', `Running command: ${command} in ${cwd}`);

    return new Promise((resolve) => {
      const [cmd, ...args] = command.split(' ');
      const child = spawn(cmd, args, { cwd, shell: true });

      const stdoutChunks: string[] = [];
      const stderrChunks: string[] = [];

      child.stdout.on('data', (data: Buffer) => {
        const line = data.toString();
        stdoutChunks.push(line);
        logger.log('INFO', 'TerminalExecutor', line.trimEnd());
      });

      child.stderr.on('data', (data: Buffer) => {
        const line = data.toString();
        stderrChunks.push(line);
        logger.log('WARN', 'TerminalExecutor', line.trimEnd());
      });

      child.on('close', (exitCode: number | null) => {
        const code = exitCode ?? 1;
        const stdout = stdoutChunks.join('');
        const stderr = stderrChunks.join('');

        if (code === 0) {
          logger.log('INFO', 'TerminalExecutor', `Command completed successfully: ${command}`);
          resolve({ success: true, exitCode: 0, stdout, stderr });
        } else {
          const error = `Command failed with exit code ${code}`;
          logger.log('ERROR', 'TerminalExecutor', `${error}: ${command}`);
          resolve({ success: false, exitCode: code, stdout, stderr, error });
        }
      });

      child.on('error', (err: Error) => {
        const error = `Failed to start command: ${err.message}`;
        logger.log('ERROR', 'TerminalExecutor', error);
        resolve({ success: false, exitCode: 1, stdout: '', stderr: err.message, error });
      });
    });
  }
}

export const terminalExecutor = new TerminalExecutor();
