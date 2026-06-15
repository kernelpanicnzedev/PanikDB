import { Router } from 'express';
import { validateGhlSignature } from '../middleware/validateGhlSignature';
import { decomposeMessage } from '../services/decompositionService';
import { answerAllQuestions } from '../services/ragService';
import { classifyIntent, INTENT_TAGS } from '../services/intentService';
import * as ghl from '../services/ghlService';
import { supabase } from '../db/supabaseClient';
import { env } from '../config/env';
import type { GhlWebhookPayload, Intent } from '../types';

export const webhookRouter = Router();

function isOwnBotMessage(payload: GhlWebhookPayload): boolean {
  if (payload.direction === 'outbound') return true;
  if (env.ghlBotUserId && payload.userId === env.ghlBotUserId) return true;
  return false;
}

async function logConversation(entry: {
  conversationId: string;
  contactId: string;
  userMessage: string;
  questions: string[];
  allChunks: unknown[];
  botResponse: string;
  intent: Intent;
  workflowId: string;
}): Promise<void> {
  await supabase.from('conversation_log').insert({
    ghl_conversation_id: entry.conversationId,
    ghl_contact_id: entry.contactId,
    user_message: entry.userMessage,
    decomposed_questions: entry.questions,
    retrieved_chunks: entry.allChunks,
    bot_response: entry.botResponse,
    intent: entry.intent,
    workflow_triggered: entry.workflowId,
  });
}

async function processInboundMessage(payload: GhlWebhookPayload): Promise<void> {
  const { contactId, conversationId, body } = payload;

  try {
    const questions = await decomposeMessage(body);
    const { combinedAnswer, allChunks, fullyGrounded } = await answerAllQuestions(questions);
    const { intent } = await classifyIntent(body, combinedAnswer, fullyGrounded);

    await ghl.sendConversationReply(conversationId, combinedAnswer);

    const tag = INTENT_TAGS[intent];
    if (tag) {
      await ghl.tagContact(contactId, tag).catch((err) =>
        console.error('[webhook] tagContact failed:', err),
      );
    }

    const workflowId = env.workflows[intent];
    await ghl.triggerWorkflow(workflowId, contactId).catch((err) =>
      console.error('[webhook] triggerWorkflow failed:', err),
    );

    await logConversation({
      conversationId,
      contactId,
      userMessage: body,
      questions,
      allChunks,
      botResponse: combinedAnswer,
      intent,
      workflowId,
    }).catch((err) => console.error('[webhook] logConversation failed:', err));
  } catch (err) {
    console.error('[webhook] processInboundMessage error:', err);
    await ghl
      .sendConversationReply(
        conversationId,
        "I'm having trouble processing your request right now. A specialist will reach out to you shortly.",
      )
      .catch(() => {});
  }
}

webhookRouter.post(
  '/ghl',
  // express.raw is mounted in server.ts before this router
  validateGhlSignature,
  (req, res) => {
    let payload: GhlWebhookPayload;
    try {
      payload = JSON.parse((req.body as Buffer).toString()) as GhlWebhookPayload;
    } catch {
      res.status(400).json({ error: 'Invalid JSON body' });
      return;
    }

    if (payload.type !== 'InboundMessage' || isOwnBotMessage(payload)) {
      res.sendStatus(200);
      return;
    }

    // ACK immediately — GHL retries if we hold the connection open
    res.sendStatus(200);

    // Process asynchronously after ACK
    void processInboundMessage(payload);
  },
);
