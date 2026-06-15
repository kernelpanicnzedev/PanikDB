import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env';
import { supabase } from '../db/supabaseClient';
import { embedText } from './embeddingService';
import type { CombinedRagResult, RagResult, RetrievedChunk } from '../types';

const anthropic = new Anthropic({ apiKey: env.anthropicApiKey });

const CANNED_NO_MATCH =
  "I don't have information about that in my knowledge base. Let me connect you with a specialist who can help — would that work for you?";

const GROUNDING_SYSTEM_PROMPT = `You are a helpful customer service assistant for a law firm specialising in debt consolidation and short-term loans.
You MUST answer ONLY using the context passages provided below.

CRITICAL RULES:
1. If the context passages do not contain enough information to fully answer the question, respond EXACTLY with:
   "I don't have information about that in my knowledge base. Let me connect you with a specialist who can help — would that work for you?"
   Do not add anything else to that response.
2. Do NOT draw on general legal knowledge not present in the provided context.
3. Do NOT cite laws, statutes, or regulations unless explicitly quoted in the context.
4. Answer only what is asked. Do not volunteer extra information.
5. For multi-part questions, label each part of your answer clearly (e.g. "Regarding your first question:").
6. Keep your tone professional but approachable.`;

async function searchKb(embedding: number[]): Promise<RetrievedChunk[]> {
  const { data, error } = await supabase.rpc('match_kb_chunks', {
    query_embedding: embedding,
    match_threshold: env.similarityThreshold,
    match_count: env.maxRetrievalChunks,
  });

  if (error) throw new Error(`KB search failed: ${error.message}`);
  if (!data || data.length === 0) return [];

  return (data as Array<{
    id: string;
    content: string;
    source_file: string;
    chunk_index: number;
    similarity: number;
  }>).map((row) => ({
    id: row.id,
    content: row.content,
    sourceFile: row.source_file,
    chunkIndex: row.chunk_index,
    similarity: row.similarity,
  }));
}

function buildContext(chunks: RetrievedChunk[]): string {
  let context = chunks
    .map((c, i) => `[Passage ${i + 1} from ${c.sourceFile}]\n${c.content}`)
    .join('\n\n');

  if (context.length > env.maxContextChars) {
    context = context.slice(0, env.maxContextChars);
  }
  return context;
}

export async function answerQuestion(question: string): Promise<RagResult> {
  const embedding = await embedText(question);
  const chunks = await searchKb(embedding);

  if (chunks.length === 0) {
    return { answer: CANNED_NO_MATCH, retrievedChunks: [], wasGrounded: false };
  }

  const context = buildContext(chunks);
  const userPrompt = `CONTEXT:\n---\n${context}\n---\n\nQUESTION: ${question}\n\nAnswer based ONLY on the context above.`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: GROUNDING_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const answer =
    message.content[0].type === 'text' ? message.content[0].text : CANNED_NO_MATCH;

  return { answer, retrievedChunks: chunks, wasGrounded: true };
}

export async function answerAllQuestions(questions: string[]): Promise<CombinedRagResult> {
  const results = await Promise.all(questions.map((q) => answerQuestion(q)));

  const combinedAnswer =
    results.length === 1
      ? results[0].answer
      : results
          .map((r, i) => (questions.length > 1 ? `**Question ${i + 1}:** ${r.answer}` : r.answer))
          .join('\n\n---\n\n');

  const allChunks = results.flatMap((r) => r.retrievedChunks);
  const fullyGrounded = results.every((r) => r.wasGrounded);

  return { combinedAnswer, allChunks, fullyGrounded };
}
