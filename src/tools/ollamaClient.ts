/**
 * Minimal Ollama client using the native fetch API.
 * Calls the local Ollama REST API at http://localhost:11434
 * Model defaults to llama3 but can be overridden via OLLAMA_MODEL env var.
 */

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'llama3';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function ollamaChat(messages: Message[]): Promise<string> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: false,
      options: { temperature: 0.2 },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama request failed (${response.status}): ${text}`);
  }

  const data = (await response.json()) as { message?: { content?: string } };
  const content = data?.message?.content?.trim();
  if (!content) throw new Error('Ollama returned an empty response');
  return content;
}
