import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env';

const anthropic = new Anthropic({ apiKey: env.anthropicApiKey });

const MAX_QUESTIONS = 5;

export async function decomposeMessage(userMessage: string): Promise<string[]> {
  const prompt = `You are a message parser. Extract each distinct question or request from the user message below.
Return a JSON array of strings — one string per question or request.
If the message contains only one question or request, return an array with one item.
Do NOT add, infer, or expand beyond what the user explicitly asked.
Do NOT answer the questions.
Return ONLY valid JSON, no explanation, no markdown code fences.

User message:
"""
${userMessage}
"""`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text.trim() : '';
    const parsed: unknown = JSON.parse(text);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [userMessage];
    }

    const questions = (parsed as unknown[])
      .filter((q): q is string => typeof q === 'string' && q.trim().length > 0)
      .slice(0, MAX_QUESTIONS);

    return questions.length > 0 ? questions : [userMessage];
  } catch {
    return [userMessage];
  }
}
