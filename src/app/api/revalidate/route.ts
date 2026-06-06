import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * On-demand cache invalidation endpoint.
 *
 * Called by the FastAPI backend whenever data that the website renders has
 * changed — after a scrape run, after an Editor's Pick toggle, after event
 * approval, etc. Eliminates the "5 minutes of stale data" window that pure
 * ISR causes, while still letting us serve cached HTML between updates.
 *
 * Auth: HMAC-ish — caller must send the shared REVALIDATE_SECRET in a
 * header. We do a constant-time compare to make brute-forcing impractical.
 *
 * Body (JSON):
 *   { paths?: string[], tags?: string[], all?: boolean }
 *
 * Returns: { ok: true, revalidated: { paths: [...], tags: [...] } }
 *
 * The endpoint is intentionally tiny — no DB, no logging beyond errors,
 * tiny payload — so it's cheap to call on every backend write.
 */

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function POST(req: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET || '';
  const provided =
    req.headers.get('x-revalidate-secret') ||
    req.nextUrl.searchParams.get('secret') ||
    '';

  if (!expected) {
    return NextResponse.json(
      { ok: false, error: 'REVALIDATE_SECRET not configured on server' },
      { status: 500 },
    );
  }
  if (!provided || !timingSafeEqual(provided, expected)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  let body: { paths?: string[]; tags?: string[]; all?: boolean };
  try {
    body = (await req.json()) ?? {};
  } catch {
    body = {};
  }

  // "all" is a hard refresh — useful after large scrapes or DB migrations.
  // It revalidates the root layout which cascades to every page.
  const paths = body.all ? ['/', '/tonight'] : body.paths || [];
  const tags = body.tags || [];

  const revalidatedPaths: string[] = [];
  for (const p of paths) {
    try {
      revalidatePath(p);
      revalidatedPaths.push(p);
    } catch (e) {
      console.error(`revalidatePath(${p}) failed:`, e);
    }
  }
  if (body.all) {
    try {
      revalidatePath('/', 'layout');
    } catch (e) {
      console.error('revalidatePath layout failed:', e);
    }
  }

  const revalidatedTags: string[] = [];
  for (const t of tags) {
    try {
      // Next 16 signature: revalidateTag(tag, { expire }). Use 0 for immediate.
      revalidateTag(t, { expire: 0 });
      revalidatedTags.push(t);
    } catch (e) {
      console.error(`revalidateTag(${t}) failed:`, e);
    }
  }

  return NextResponse.json({
    ok: true,
    revalidated: { paths: revalidatedPaths, tags: revalidatedTags },
  });
}

// GET is convenient for quick manual cache flushes from a terminal.
export async function GET(req: NextRequest) {
  return POST(req);
}
