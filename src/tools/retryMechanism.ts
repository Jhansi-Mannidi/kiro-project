import { logger, Logger } from './logger';

export interface RetryOptions {
  taskId: string;
  agentType: string;
  maxRetries?: number;
}

export class RetryMechanism {
  private readonly defaultMaxRetries = 3;
  private readonly logger: Logger;

  constructor(loggerInstance: Logger = logger) {
    this.logger = loggerInstance;
  }

  async execute<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
    const maxRetries = options.maxRetries ?? this.defaultMaxRetries;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        const message = error instanceof Error ? error.message : String(error);

        this.logger.log('WARN', 'RetryMechanism', `Attempt ${attempt} failed: ${message}`);

        if (attempt < maxRetries) {
          const delay = 1000 * Math.pow(2, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    const finalMessage = lastError instanceof Error ? lastError.message : String(lastError);
    this.logger.log(
      'ERROR',
      'RetryMechanism',
      `All ${maxRetries} attempts exhausted for taskId=${options.taskId}, agentType=${options.agentType}, error=${finalMessage}`
    );

    throw lastError;
  }
}

export const retryMechanism = new RetryMechanism();
