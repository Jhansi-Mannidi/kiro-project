import * as path from 'path';
import * as fs from 'fs';
import { AgentType, GenerationResult, Task, TaskPlan, TaskStatus } from '../types/index';
import { logger } from '../tools/logger';
import { terminalExecutor } from '../tools/terminalExecutor';
import { PlannerAgent } from '../agents/plannerAgent';
import { BackendAgent } from '../agents/backendAgent';
import { FrontendAgent } from '../agents/frontendAgent';
import { DatabaseAgent } from '../agents/databaseAgent';
import { DevOpsAgent } from '../agents/devopsAgent';
const MAX_PROMPT_LENGTH = 4000;
const TASK_TIMEOUT_MS = 120_000; // 2 minutes per task

export class Orchestrator {
  private planner: PlannerAgent;
  private backendAgent: BackendAgent;
  private frontendAgent: FrontendAgent;
  private databaseAgent: DatabaseAgent;
  private devopsAgent: DevOpsAgent;
  private outputDir: string;

  constructor(outputDir?: string) {
    this.outputDir = outputDir ?? process.env.OUTPUT_DIR ?? './output';
    this.planner = new PlannerAgent();
    this.backendAgent = new BackendAgent();
    this.frontendAgent = new FrontendAgent();
    this.databaseAgent = new DatabaseAgent();
    this.devopsAgent = new DevOpsAgent();
  }

  // ── 1. Prompt validation ──────────────────────────────────────────────────

  private validatePrompt(prompt: string): void {
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt must not be empty or contain only whitespace.');
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
      throw new Error(`Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters (got ${prompt.length}).`);
    }
  }

  // ── 2. Task execution loop ────────────────────────────────────────────────

  async generate(prompt: string): Promise<GenerationResult> {
    this.validatePrompt(prompt);

    // Each generation gets a unique timestamped output directory
    const timestamp = Date.now();
    const slug = prompt.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
    this.outputDir = path.resolve(this.outputDir, `${slug}-${timestamp}`);
    fs.mkdirSync(this.outputDir, { recursive: true });

    logger.log('INFO', 'Orchestrator', `Starting generation for prompt: "${prompt.slice(0, 80)}..."`);
    logger.log('INFO', 'Orchestrator', `Output directory: ${this.outputDir}`);

    // Plan
    let plan: TaskPlan;
    try {
      plan = await this.planner.plan(prompt);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.log('ERROR', 'Orchestrator', `Planning failed: ${msg}`);
      return { success: false, outputPath: this.outputDir, error: msg, tasks: [] };
    }

    const completedContext: string[] = [];
    const tasks = plan.tasks;

    for (const task of tasks) {
      task.status = TaskStatus.IN_PROGRESS;
      logger.log('INFO', 'Orchestrator', `Starting task [${task.sequenceNumber}] ${task.agentType}: ${task.description}`);

      try {
        await this.runWithTimeout(
          () => this.dispatchTask(task, completedContext.join('\n')),
          TASK_TIMEOUT_MS,
          task
        );

        task.status = TaskStatus.COMPLETED;
        completedContext.push(`[${task.agentType}] ${task.description}`);
        logger.log('INFO', 'Orchestrator', `Completed task [${task.sequenceNumber}] ${task.id} (${task.agentType})`);

        // Run npm install after backend/frontend generation
        await this.runPostInstall(task);

      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        task.status = TaskStatus.FAILED;
        logger.log('ERROR', 'Orchestrator', `Task [${task.sequenceNumber}] ${task.id} failed after retries: ${msg}`);
        return {
          success: false,
          outputPath: this.outputDir,
          error: `Task ${task.sequenceNumber} (${task.agentType}) failed: ${msg}`,
          tasks,
        };
      }
    }

    // ── 4. Validate output structure ────────────────────────────────────────
    this.validateOutputStructure();

    logger.log('INFO', 'Orchestrator', `Generation complete. Output: ${this.outputDir}`);
    return { success: true, outputPath: this.outputDir, tasks };
  }

  // ── Dispatch to the right agent ───────────────────────────────────────────

  private async dispatchTask(task: Task, context: string): Promise<void> {
    switch (task.agentType) {
      case AgentType.BACKEND:
        return this.backendAgent.execute(task, this.outputDir, context);
      case AgentType.FRONTEND:
        return this.frontendAgent.execute(task, this.outputDir, context);
      case AgentType.DATABASE:
        return this.databaseAgent.execute(task, this.outputDir, context);
      case AgentType.DEVOPS:
        return this.devopsAgent.execute(task, this.outputDir, context);
      default:
        throw new Error(`Unknown agent type: ${task.agentType}`);
    }
  }

  // ── Timeout wrapper ───────────────────────────────────────────────────────

  private runWithTimeout<T>(fn: () => Promise<T>, ms: number, task: Task): Promise<T> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Task [${task.sequenceNumber}] timed out after ${ms}ms`));
      }, ms);

      fn()
        .then((result) => { clearTimeout(timer); resolve(result); })
        .catch((err) => { clearTimeout(timer); reject(err); });
    });
  }

  // ── npm install after code generation ────────────────────────────────────

  private async runPostInstall(task: Task): Promise<void> {
    const dirs: Partial<Record<AgentType, string>> = {
      [AgentType.BACKEND]: path.join(this.outputDir, 'backend'),
      [AgentType.FRONTEND]: path.join(this.outputDir, 'frontend'),
    };

    const dir = dirs[task.agentType];
    if (!dir) return;

    const pkgJson = path.join(dir, 'package.json');
    if (!fs.existsSync(pkgJson)) {
      logger.log('WARN', 'Orchestrator', `No package.json found in ${dir}, skipping npm install`);
      return;
    }

    logger.log('INFO', 'Orchestrator', `Running npm install in ${dir}`);
    const result = await terminalExecutor.run('npm install', dir);
    if (!result.success) {
      logger.log('WARN', 'Orchestrator', `npm install failed in ${dir}: ${result.error}`);
    }
  }

  // ── Output structure validation ───────────────────────────────────────────

  private validateOutputStructure(): void {
    const required = [
      path.join(this.outputDir, 'frontend'),
      path.join(this.outputDir, 'backend'),
      path.join(this.outputDir, 'database'),
      path.join(this.outputDir, 'docker-compose.yml'),
    ];

    for (const p of required) {
      if (!fs.existsSync(p)) {
        logger.log('WARN', 'Orchestrator', `Expected output path missing: ${p}`);
      }
    }
  }
}
