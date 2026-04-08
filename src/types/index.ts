/**
 * Shared TypeScript interfaces and enums for the AI App Generator system.
 */

export enum AgentType {
  PLANNER = 'PLANNER',
  BACKEND = 'BACKEND',
  FRONTEND = 'FRONTEND',
  DATABASE = 'DATABASE',
  DEVOPS = 'DEVOPS',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface Task {
  id: string;
  agentType: AgentType;
  description: string;
  sequenceNumber: number;
  status: TaskStatus;
  context?: Record<string, unknown>;
}

export interface TaskPlan {
  tasks: Task[];
  prompt: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  component: string;
  message: string;
}

export interface GenerationResult {
  success: boolean;
  outputPath: string;
  error?: string;
  tasks: Task[];
}
