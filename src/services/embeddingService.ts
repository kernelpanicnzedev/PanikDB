import OpenAI from 'openai';
import { env } from '../config/env';

const openai = new OpenAI({ apiKey: env.openaiApiKey });

const MODEL = 'text-embedding-3-small';

export async function embedText(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: MODEL,
    input: text.replace(/\n/g, ' '),
  });
  return response.data[0].embedding;
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: MODEL,
    input: texts.map((t) => t.replace(/\n/g, ' ')),
  });
  return response.data
    .sort((a, b) => a.index - b.index)
    .map((item) => item.embedding);
}
