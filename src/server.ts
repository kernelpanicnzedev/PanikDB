import './config/env'; // validate env at startup
import express from 'express';
import { env } from './config/env';
import { webhookRouter } from './routes/webhook';

const app = express();

// Raw body parser MUST come before the webhook router so signature validation
// can compute HMAC against the unmodified buffer
app.use('/webhook', express.raw({ type: 'application/json', limit: '1mb' }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/webhook', webhookRouter);

app.listen(env.port, () => {
  console.log(`PanikDB chatbot server running on port ${env.port} (${env.nodeEnv})`);
});

export default app;
