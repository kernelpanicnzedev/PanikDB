import dotenv from 'dotenv';
dotenv.config();

const required = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'GHL_API_KEY',
  'GHL_WEBHOOK_SECRET',
  'GHL_LOCATION_ID',
  'GHL_WORKFLOW_BOOK_CONSULTATION',
  'GHL_WORKFLOW_GENERAL_INQUIRY',
  'GHL_WORKFLOW_HOT_LEAD',
  'GHL_WORKFLOW_UNANSWERED',
] as const;

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

export const env = {
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  openaiApiKey: process.env.OPENAI_API_KEY!,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY!,
  ghlApiKey: process.env.GHL_API_KEY!,
  ghlWebhookSecret: process.env.GHL_WEBHOOK_SECRET!,
  ghlLocationId: process.env.GHL_LOCATION_ID!,
  ghlBotUserId: process.env.GHL_BOT_USER_ID ?? '',
  workflows: {
    BOOK_CONSULTATION: process.env.GHL_WORKFLOW_BOOK_CONSULTATION!,
    GENERAL_INQUIRY: process.env.GHL_WORKFLOW_GENERAL_INQUIRY!,
    HOT_LEAD: process.env.GHL_WORKFLOW_HOT_LEAD!,
    UNANSWERED: process.env.GHL_WORKFLOW_UNANSWERED!,
  },
  similarityThreshold: parseFloat(process.env.SIMILARITY_THRESHOLD ?? '0.75'),
  maxRetrievalChunks: parseInt(process.env.MAX_RETRIEVAL_CHUNKS ?? '5', 10),
  maxContextChars: parseInt(process.env.MAX_CONTEXT_CHARS ?? '8000', 10),
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
};
