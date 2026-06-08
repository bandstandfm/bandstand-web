import Link from 'next/link';
import type { Metadata } from 'next';

/**
 * Custom 404 page. Replaces Next's bare-bones default with something
 * that matches the rest of the site and gives the visitor a way back.
 *
 * Hit by:
 *   - URLs we never had (typos, link rot)
 *   - Shows / venues that no longer exist (events.find returned null)
 */

export const metadata: Metadata = {
  title: 'Not found · Bandstand Chicago',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="max-w-page mx-auto px-6 pt-32 pb-32 text-center">
      <p className="text-brand text-xs tracking-[0.22em] uppercase font-medium">
        404
      </p>
      <h1 className="mt-3 font-serif text-5xl sm:text-6xl text-ink leading-[1.05]">
        That show&rsquo;s wrapped up.
      </h1>
      <p className="mt-6 max-w-xl mx-auto text-ink/70 leading-relaxed">
        The page you&rsquo;re looking for isn&rsquo;t around anymore &mdash; maybe the
        show has come and gone, or the link took a wrong turn. Plenty more
        live jazz happening tonight in Chicago.
      </p>
      <div className="mt-10 flex flex-wrap gap-3 justify-center">
        <Link
          href="/tonight"
          className="inline-flex items-center px-5 py-3 rounded-xl bg-brand text-bg font-medium hover:bg-brandShine transition"
        >
          See tonight&rsquo;s shows &rarr;
        </Link>
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
