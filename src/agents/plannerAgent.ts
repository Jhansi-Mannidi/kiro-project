import { v4 as uuidv4 } from 'uuid';
import { AgentType, Task, TaskPlan, TaskStatus } from '../types/index';
import { logger } from '../tools/logger';

export class PlannerAgent {
  async plan(prompt: string): Promise<TaskPlan> {
    logger.log('INFO', 'PlannerAgent', 'Creating task plan...');

    // Use a deterministic task plan — always the same 4 agents in the right order.
    // Local LLMs (llama3) are unreliable at returning strict JSON for planning,
    // but they excel at generating code for a specific task with a clear prompt.
    const tasks: Task[] = [
      {
        id: uuidv4(),
        agentType: AgentType.DATABASE,
        description: `Design and create a PostgreSQL database schema for: ${prompt}. Include all necessary tables with primary keys, foreign keys, indexes, and appropriate data types.`,
        sequenceNumber: 1,
        status: TaskStatus.PENDING,
      },
      {
        id: uuidv4(),
        agentType: AgentType.BACKEND,
        description: `Build a Node.js/Express REST API backend for: ${prompt}. Include all CRUD endpoints, middleware, error handling, and PostgreSQL integration.`,
        sequenceNumber: 2,
        status: TaskStatus.PENDING,
      },
      {
        id: uuidv4(),
        agentType: AgentType.FRONTEND,
        description: `Build a React frontend application for: ${prompt}. Include all pages, components, forms, and API integration with the backend.`,
        sequenceNumber: 3,
        status: TaskStatus.PENDING,
      },
      {
        id: uuidv4(),
        agentType: AgentType.DEVOPS,
        description: `Create Docker configuration for: ${prompt}. Include docker-compose.yml with frontend, backend, and postgres services, plus Dockerfiles for each service.`,
        sequenceNumber: 4,
        status: TaskStatus.PENDING,
      },
    ];

    logger.log('INFO', 'PlannerAgent', `Task plan created with ${tasks.length} tasks`);
    return { tasks, prompt };
  }
}
