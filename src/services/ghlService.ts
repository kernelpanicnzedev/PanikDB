import { env } from '../config/env';

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_HEADERS = {
  Authorization: `Bearer ${env.ghlApiKey}`,
  Version: '2021-07-28',
  'Content-Type': 'application/json',
};

async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError;
}

async function ghlFetch(path: string, options: RequestInit): Promise<void> {
  const response = await fetch(`${GHL_BASE}${path}`, {
    ...options,
    headers: { ...GHL_HEADERS, ...(options.headers ?? {}) },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`GHL API ${options.method} ${path} → ${response.status}: ${body}`);
  }
}

export async function sendConversationReply(
  conversationId: string,
  message: string,
  type: string = 'SMS',
): Promise<void> {
  await withRetry(() =>
    ghlFetch('/conversations/messages', {
      method: 'POST',
      body: JSON.stringify({ type, conversationId, message }),
    }),
  );
}

export async function tagContact(contactId: string, tag: string): Promise<void> {
  await withRetry(() =>
    ghlFetch(`/contacts/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify({ tags: [tag] }),
    }),
  );
}

export async function triggerWorkflow(workflowId: string, contactId: string): Promise<void> {
  await withRetry(() =>
    ghlFetch(`/contacts/${contactId}/workflow/${workflowId}`, {
      method: 'POST',
      body: JSON.stringify({}),
    }),
  );
}
