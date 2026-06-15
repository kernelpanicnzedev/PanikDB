import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env';
import type { ClassificationResult, Intent } from '../types';

const anthropic = new Anthropic({ apiKey: env.anthropicApiKey });

export const INTENT_TAGS: Record<Intent, string | null> = {
  BOOK_CONSULTATION: 'consultation-requested',
  HOT_LEAD: 'hot-lead',
  UNANSWERED: 'needs-human',
  GENERAL_INQUIRY: null,
};

export const INTENT_PRIORITY: Intent[] = ['HOT_LEAD', 'UNANSWERED', 'BOOK_CONSULTATION', 'GENERAL_INQUIRY'];

export async function classifyIntent(
  userMessage: string,
  botResponse: string,
  fullyGrounded: boolean,
): Promise<ClassificationResult> {
  const prompt = `Classify the customer intent based on the conversation below.
Return a JSON object with keys: intent, confidence, reasoning.
Do not include markdown code fences. Return ONLY valid JSON.

Intent options (choose exactly one):
- HOT_LEAD: Customer shows urgency ("ASAP", "court date", "bailiffs", "can't pay"), mentions large sums, or has strong buying signals. Takes priority over all other intents.
- BOOK_CONSULTATION: Customer explicitly wants to speak with someone, schedule a call, or get personalised advice.
- UNANSWERED: The bot could not answer the question(s) from its knowledge base. Use this if fullyGrounded is false, unless HOT_LEAD signals are also present.
- GENERAL_INQUIRY: General questions, browsing, no strong signals.

Customer message: "${userMessage.replace(/"/g, '\\"')}"
Bot response: "${botResponse.slice(0, 300).replace(/"/g, '\\"')}"
Knowledge base covered the question: ${fullyGrounded}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text.trim() : '';
    const parsed = JSON.parse(text) as { intent: string; confidence: string; reasoning: string };

    const validIntents: Intent[] = ['HOT_LEAD', 'BOOK_CONSULTATION', 'UNANSWERED', 'GENERAL_INQUIRY'];
    const intent: Intent = validIntents.includes(parsed.intent as Intent)
      ? (parsed.intent as Intent)
      : 'GENERAL_INQUIRY';

    const validConfidence = ['HIGH', 'MEDIUM', 'LOW'];
    const confidence = validConfidence.includes(parsed.confidence)
      ? (parsed.confidence as 'HIGH' | 'MEDIUM' | 'LOW')
      : 'LOW';

    return { intent, confidence, reasoning: parsed.reasoning ?? '' };
  } catch {
    const fallback: Intent = fullyGrounded ? 'GENERAL_INQUIRY' : 'UNANSWERED';
    return { intent: fallback, confidence: 'LOW', reasoning: 'Classification parse error' };
  }
}
