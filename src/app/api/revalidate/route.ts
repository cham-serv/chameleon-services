/**
 * ISR On-Demand Revalidation Endpoint
 *
 * POST /api/revalidate
 *
 * Called by the engine (via afterChange hooks) when content changes
 * in Payload CMS. Invalidates specific ISR cache tags so the next
 * request fetches fresh data.
 *
 * Authentication: HMAC-SHA256 signature in the x-revalidate-signature header.
 * The engine signs the JSON body with the shared REVALIDATE_SECRET.
 *
 * Request body:
 *   {
 *     "tags": ["tenant:atlas-demo", "products:atlas-demo"],
 *     "tenant": "atlas-demo",
 *     "collection": "products",
 *     "operation": "update",
 *     "timestamp": 1692000000000
 *   }
 *
 * Rate limiting: Rejects requests with timestamps older than 5 minutes
 * to prevent replay attacks.
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;
const MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes

type RevalidateBody = {
  tags: string[];
  tenant: string;
  collection: string;
  operation: string;
  timestamp: number;
};

export async function POST(req: NextRequest) {
  // ── Auth check ──────────────────────────────────────────────────────────────
  if (!REVALIDATE_SECRET) {
    console.error('[revalidate] REVALIDATE_SECRET not configured');
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const signature = req.headers.get('x-revalidate-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
  }

  // ── Parse body ──────────────────────────────────────────────────────────────
  let body: RevalidateBody;
  let rawBody: string;

  try {
    rawBody = await req.text();
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // ── Verify HMAC signature ─────────────────────────────────────────────────
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(REVALIDATE_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // ── Replay protection ─────────────────────────────────────────────────────
  if (body.timestamp && Date.now() - body.timestamp > MAX_AGE_MS) {
    return NextResponse.json({ error: 'Expired request' }, { status: 400 });
  }

  // ── Validate tags ─────────────────────────────────────────────────────────
  if (!Array.isArray(body.tags) || body.tags.length === 0) {
    return NextResponse.json({ error: 'No tags provided' }, { status: 400 });
  }

  if (body.tags.length > 20) {
    return NextResponse.json({ error: 'Too many tags (max 20)' }, { status: 400 });
  }

  // ── Revalidate ────────────────────────────────────────────────────────────
  const revalidated: string[] = [];

  for (const tag of body.tags) {
    // Sanitize tag — only allow alphanumeric, hyphens, colons, underscores
    if (!/^[a-zA-Z0-9:_-]+$/.test(tag)) {
      console.warn(`[revalidate] Skipping invalid tag: "${tag}"`);
      continue;
    }

    try {
      revalidateTag(tag, 'default');
      revalidated.push(tag);
    } catch (error) {
      console.error(`[revalidate] Failed to revalidate tag "${tag}":`, error);
    }
  }

  console.log(
    `[revalidate] tenant=${body.tenant} collection=${body.collection} op=${body.operation} tags=[${revalidated.join(', ')}]`,
  );

  return NextResponse.json({
    revalidated,
    timestamp: Date.now(),
  });
}
