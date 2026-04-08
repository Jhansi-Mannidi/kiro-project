import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import * as fs from 'fs';
import * as path from 'path';
import { Orchestrator } from './orchestrator/orchestrator';
import { logger } from './tools/logger';

const app = express();
const PORT = process.env.API_PORT ?? 4000;
const SERVER_TIMEOUT = 30 * 60 * 1000;

// ✅ GLOBAL CORS (FOR NORMAL REQUESTS)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ HANDLE PREFLIGHT
app.options('*', cors());

app.use(express.json());

// ✅ Increase timeout
app.use((req, res, next) => {
  res.setTimeout(SERVER_TIMEOUT);
  next();
});


// 🚀 MAIN API (IMPORTANT PART)
app.post('/api/generate', async (req, res) => {

  // 🔥🔥 VERY IMPORTANT (FIXES YOUR CORS ISSUE)
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { prompt } = req.body as { prompt?: string };

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ success: false, error: 'Prompt is required' });
  }

  logger.log('INFO', 'APIServer', `Received: "${prompt.slice(0, 80)}"`);

  req.setTimeout(SERVER_TIMEOUT);
  res.setTimeout(SERVER_TIMEOUT);

  // ✅ SSE HEADERS
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.flushHeaders();

  const sendEvent = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30000);

  try {
    const outputDir = path.resolve(process.env.OUTPUT_DIR ?? './output');

    sendEvent('log', { message: 'Starting agents...', level: 'info' });

    const orchestrator = new Orchestrator(outputDir);
    const result = await orchestrator.generate(prompt);

    clearInterval(heartbeat);

    sendEvent('done', result);
    res.end();

  } catch (err) {
    clearInterval(heartbeat);

    const message = err instanceof Error ? err.message : String(err);

    logger.log('ERROR', 'APIServer', message);

    sendEvent('error', { success: false, error: message });
    res.end();
  }
});


// ✅ HEALTH CHECK
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});


app.listen(PORT, () => {
  logger.log('INFO', 'APIServer', `Running on http://localhost:${PORT}`);
});