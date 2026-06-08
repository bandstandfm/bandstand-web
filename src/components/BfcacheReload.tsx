'use client';

import { useEffect } from 'react';

/**
 * Force a fresh fetch when the page is restored from the browser's
 * back-forward cache (bfcache).
 *
 * Why this exists: even with server-side `cache-control: no-store, must-
 * revalidate`, mobile Safari (and to a lesser extent iOS Chrome) keeps a
 * frozen snapshot of the rendered page in bfcache when the tab is
 * backgrounded. The user reopens the tab hours later and sees yesterday's
 * shows — not because Vercel is caching, but because the *browser* is.
 *
 * The `pageshow` event fires when the page is shown, including bfcache
 * restores. `event.persisted === true` means it came out of bfcache.
 * Reloading guarantees a fresh server render — the only way to defeat
 * Safari's bfcache short of disabling it entirely (which we don't want;
 * bfcache is a huge perf win for legitimate back-button navigation
 * *within a session*).
 *
 * Cost: an extra page load only on the (rare) bfcache-restore event.
 * Day-to-day in-session navigation (clicking links, hitting back) is
 * unaffected.
 *
 * Mounted globally from `app/layout.tsx` so every route inherits the
 * behavior. Client-only by definition — runs only in the browser.
 */
export default function BfcacheReload() {
  useEffect(() => {
    function onPageShow(e: PageTransitionEvent) {
      // `persisted` is true iff the page came out of bfcache.
      if (e.persisted) {
        // Bypass any service-worker or HTTP cache — go all the way to the origin.
        window.location.reload();
      }
    }
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);
  return null;
}
