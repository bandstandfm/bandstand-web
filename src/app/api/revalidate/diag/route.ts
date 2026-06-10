import { NextResponse } from 'next/server';

/**
 * TEMPORARY diagnostic endpoint to figure out why the REVALIDATE_SECRET
 * comparison keeps returning 401. Reveals length + first/last 4 chars of
 * what Vercel has stored, plus a sha256 prefix so we can compare against
 * the backend's known value WITHOUT either side ever sending the full
 * secret over the wire.
 *
 * DELETE THIS FILE once the webhook is confirmed working.
 *
 * GET /api/revalidate/diag
 */
export async function GET() {
  const raw = process.env.REVALIDATE_SECRET ?? '';
  const trimmed = raw.trim();

  // sha256 prefix (16 chars) — enough to verify equality, never reveals
  // the secret itself.
  const enc = new TextEncoder().encode(trimmed);
  const hashBuf = await crypto.subtle.digest('SHA-256', enc);
  const hash = Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16);

  // Detect "looks like quoted" — user may have pasted with quotes.
  const looksQuoted =
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"));

  return NextResponse.json({
    configured: raw.length > 0,
    rawLength: raw.length,
    trimmedLength: trimmed.length,
    hadWhitespace: raw !== trimmed,
    looksQuoted,
    firstFour: trimmed.slice(0, 4),
    lastFour: trimmed.slice(-4),
    sha256Prefix: hash,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  });
}
