'use client';

import Link from 'next/link';
import { useEffect } from 'react';

/**
 * Catch-all error boundary. If anything in the React tree throws (e.g.
 * backend returns malformed JSON, an upstream timeout we didn't catch),
 * the visitor still sees a polished page and gets nudged back to the
 * homepage instead of a stack trace or a white screen.
 *
 * Must be a client component per Next.js conventions.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to the browser console for our own debugging; in production
    // Vercel captures this in the Logs tab too.
    console.error('Bandstand site error:', error);
  }, [error]);

  return (
    <main className="max-w-page mx-auto px-6 pt-32 pb-32 text-center">
      <p className="text-brand text-xs tracking-[0.22em] uppercase font-medium">
        Off-beat
      </p>
      <h1 className="mt-3 font-serif text-5xl sm:text-6xl text-ink leading-[1.05]">
        Something went sideways.
      </h1>
      <p className="mt-6 max-w-xl mx-auto text-ink/70 leading-relaxed">
        We hit an unexpected snag rendering this page. The team is
        notified. Try again in a moment, or head back to the front page.
      </p>
      <div className="mt-10 flex flex-wrap gap-3 justify-center">
        <button
          onClick={reset}
          className="inline-flex items-center px-5 py-3 rounded-xl bg-brand text-bg font-medium hover:bg-brandShine transition"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center px-5 py-3 rounded-xl border border-white/20 text-ink hover:border-brand hover:text-brand transition"
        >
          Bandstand home
        </Link>
      </div>
    </main>
  );
}
