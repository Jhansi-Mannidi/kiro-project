import 'dotenv/config';
import * as readline from 'readline';
import { Orchestrator } from './orchestrator/orchestrator';
import { logger } from './tools/logger';

async function askPrompt(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('📝 Describe the app you want to build:\n> ', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  const prompt = await askPrompt();

  if (!prompt) {
    process.exit(1);
  }

  const ollamaUrl = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';
  logger.log('INFO', 'Main', `Using Ollama at ${ollamaUrl} with model ${process.env.OLLAMA_MODEL ?? 'llama3'}`);
  logger.log('INFO', 'Main', `Generating application for: "${prompt}"`);

  const outputDir = process.env.OUTPUT_DIR ?? './output';
  const orchestrator = new Orchestrator(outputDir);
  const result = await orchestrator.generate(prompt);

  if (result.success) {
    console.log(`\n✅ Application generated successfully!`);
    console.log(`📁 Output directory: ${result.outputPath}`);
    console.log(`\nTo run your app:`);
    console.log(`  cd ${result.outputPath}`);
    console.log(`  docker-compose up --build`);
  } else {
    console.error(`\n❌ Generation failed: ${result.error}`);
    process.exit(1);
  }
}

main().catch((err) => {
  logger.log('ERROR', 'Main', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
