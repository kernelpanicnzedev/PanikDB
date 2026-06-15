import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export function validateGhlSignature(req: Request, res: Response, next: NextFunction): void {
  const signature =
    (req.headers['x-ghl-signature'] as string) ??
    (req.headers['x-hub-signature-256'] as string);

  if (!signature) {
    res.status(401).json({ error: 'Missing webhook signature' });
    return;
  }

  const hmac = crypto.createHmac('sha256', env.ghlWebhookSecret);
  hmac.update(req.body as Buffer);
  const expected = 'sha256=' + hmac.digest('hex');

  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      res.status(401).json({ error: 'Invalid webhook signature' });
      return;
    }
  } catch {
    res.status(401).json({ error: 'Signature validation error' });
    return;
  }

  next();
}
