export interface GhlWebhookPayload {
  type: string;
  locationId: string;
  contactId: string;
  conversationId: string;
  messageType: 'SMS' | 'Email' | 'Live Chat' | 'IG' | 'FB' | string;
  direction?: 'inbound' | 'outbound';
  userId?: string;
  body: string;
  dateAdded: string;
  attachments?: string[];
}

export interface RetrievedChunk {
  id: string;
  content: string;
  sourceFile: string;
  chunkIndex: number;
  similarity: number;
}

export interface RagResult {
  answer: string;
  retrievedChunks: RetrievedChunk[];
  wasGrounded: boolean;
}

export interface CombinedRagResult {
  combinedAnswer: string;
  allChunks: RetrievedChunk[];
  fullyGrounded: boolean;
}

export type Intent = 'BOOK_CONSULTATION' | 'GENERAL_INQUIRY' | 'HOT_LEAD' | 'UNANSWERED';

export interface ClassificationResult {
  intent: Intent;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  reasoning: string;
}

export interface KbChunk {
  content: string;
  chunkIndex: number;
  sourceFile: string;
  metadata: Record<string, string>;
}

export interface ConversationLogEntry {
  ghl_conversation_id: string;
  ghl_contact_id: string;
  user_message: string;
  decomposed_questions: string[];
  retrieved_chunks: RetrievedChunk[];
  bot_response: string;
  intent: Intent;
  workflow_triggered: string;
}
