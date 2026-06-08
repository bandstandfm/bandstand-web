// Lightweight server-side error alerting.
//
// Fires an email via Resend when something we care about goes wrong:
//   - lib/api.ts has exhausted its retries on a backend fetch
//   - a page-level render-guard has tripped (impossible-by-data state)
//
// Design notes:
// - Best-effort: a failure to send an alert MUST NOT mask the underlying
//   error or break the page render. All paths catch.
// - In-memory dedupe per `key` with a 15-minute suppression window. On a
//   warm serverless instance this means exactly one email per key per
//   15min. On a cold-start fresh instance you may get a second email
//   (acceptable — under-alerting is worse than over-alerting).
// - No SDK, just fetch to the Resend REST API. One less dependency to
//   audit, one less thing to break on Next 16's bundler choices.
// - Requires env vars `RESEND_API_KEY` and `ALERT_EMAIL_TO`. If either is
//   absent the function is a silent no-op — useful in dev, and means a
//   failed env-var setup on Vercel doesn't take the site down.

const SUPPRESS_WINDOW_MS = 15 * 60 * 1000; // 15 min

// Module-level state. Persists across invocations on the same warm
// Vercel function instance.
const lastSentAt = new Map<string, number>();

interface AlertContext {
  route?: string;
  deploymentId?: string;
  region?: string;
  vercelEnv?: string;
  extra?: Record<string, unknown>;
}

/**
 * Fire-and-forget alert send. Awaited only briefly (max 2.5s) so it can't
 * delay an ISR render by more than a heartbeat even if Resend is slow.
 *
 * Always returns — never throws, never rejects. The caller can safely
 * `await sendAlert(...)` right before their own throw.
 */
export async function sendAlert(
  key: string,
  message: string,
  context: AlertContext = {},
): Promise<void> {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.ALERT_EMAIL_TO;
    if (!apiKey || !to) {
      // Env vars not configured — silently no-op. (We log once per key to
      // catch the case where someone forgot to set them on Vercel.)
      if (!lastSentAt.has(`__warned:${key}`)) {
        console.warn(
          `[alert] skipping send for key=${key}: RESEND_API_KEY or ALERT_EMAIL_TO not set`,
        );
        lastSentAt.set(`__warned:${key}`, Date.now());
      }
      return;
    }

    const now = Date.now();
    const last = lastSentAt.get(key) || 0;
    if (now - last < SUPPRESS_WINDOW_MS) {
      // Within suppression window — log a single line so the noise still
      // shows up in Vercel logs (just no email).
      console.warn(
        `[alert] suppressed key=${key} (last sent ${Math.round((now - last) / 1000)}s ago, window=${SUPPRESS_WINDOW_MS / 1000}s)`,
      );
      return;
    }
    // Optimistically mark sent BEFORE the network call so two near-
    // simultaneous failures don't both fire.
    lastSentAt.set(key, now);

    const chicagoTime = new Date().toLocaleString('en-US', {
      timeZone: 'America/Chicago',
      dateStyle: 'medium',
      timeStyle: 'long',
    });

    const lines = [
      `Time (Chicago): ${chicagoTime}`,
      `Key:            ${key}`,
      ``,
      `Message:`,
      `  ${message}`,
      ``,
      `Context:`,
      `  Route:         ${context.route || '(unknown)'}`,
      `  Vercel env:    ${context.vercelEnv || process.env.VERCEL_ENV || '(unknown)'}`,
      `  Region:        ${context.region || process.env.VERCEL_REGION || '(unknown)'}`,
      `  Deployment id: ${context.deploymentId || process.env.VERCEL_DEPLOYMENT_ID || '(unknown)'}`,
    ];
    if (context.extra && Object.keys(context.extra).length) {
      lines.push(``, `Extra:`);
      for (const [k, v] of Object.entries(context.extra)) {
        lines.push(`  ${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`);
      }
    }
    lines.push(
      ``,
      `---`,
      `Further alerts for this key are suppressed for ${SUPPRESS_WINDOW_MS / 60_000} minutes.`,
      `Logs: https://vercel.com/  →  bandstand-web  →  Functions  →  Logs`,
      `Backend: https://live-jazz-chicago.preview.emergentagent.com/api/events?when=upcoming`,
    );
    const body = lines.join('\n');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Bandstand Alerts <onboarding@resend.dev>',
          to,
          subject: `[bandstand-alerts] ${key}`,
          text: body,
        }),
        signal: controller.signal,
        cache: 'no-store',
      });
      if (!res.ok) {
        // Resend failure — log and move on. Roll back the dedupe so the
        // next failure has a chance to actually send.
        const text = await res.text().catch(() => '');
        console.error(`[alert] Resend POST failed: HTTP ${res.status} ${text}`);
        lastSentAt.delete(key);
      }
    } catch (e) {
      console.error(`[alert] Resend POST exception:`, e);
      lastSentAt.delete(key);
    } finally {
      clearTimeout(timer);
    }
  } catch (e) {
    // Absolute outer catch — alerts should never crash the caller.
    try {
      console.error('[alert] sendAlert top-level exception:', e);
    } catch {
      /* nothing else we can do */
    }
  }
}
