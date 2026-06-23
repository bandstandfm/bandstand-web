import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { chicagoTodayKey, eventChicagoDateKey, fetchUpcomingEvents } from '@/lib/api';
import { sendAlert } from '@/lib/alert';
import { formatDateLong, formatTime } from '@/lib/format';

// Date-sensitive page → render on every request.
//
// Why we switched off ISR here (Jun 2026):
//   The header reads "today" via `chicagoTodayKey()`. With ISR, Vercel
//   captured a Wed Jun 24 render and kept serving it for days because:
//     1. The webhook cache flush only fires on data writes, not on the
//        calendar rolling over. A quiet 48 hours = stale "tonight".
//     2. `revalidate: 3600` is a STALE-WHILE-REVALIDATE window: traffic
//        is required to trigger regeneration. Low-traffic late nights
//        leave the cache frozen on yesterday's date.
//   `force-dynamic` removes the cache and forces a fresh `Date.now()`
//   on every hit. The cold-start penalty is mitigated by the homepage
//   ISR warmth + backend 5-min keep-warm — and tonight is the page
//   where freshness matters most, not throughput.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Jazz tonight in Chicago — live shows tonight',
  description:
    "Every live jazz show happening in Chicago tonight — the Green Mill, Jazz Showcase, Andy's, Constellation, and every room in between. Updated hourly.",
  alternates: { canonical: 'https://bandstand.fm/tonight' },
  openGraph: {
    title: 'Jazz tonight in Chicago',
    description: "Every live jazz show in Chicago tonight, hand-curated.",
    url: 'https://bandstand.fm/tonight',
    type: 'website',
  },
};

export default async function Tonight() {
  const events = await fetchUpcomingEvents();
  const today = chicagoTodayKey();
  const tonight = events
    .filter((e) => eventChicagoDateKey(e) === today)
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  // Render guard — see homepage rationale. An empty upcoming-events list
  // means the backend fetch returned an empty/corrupt payload (Chicago jazz
  // is never genuinely empty 30 days out). Throwing makes Next.js keep the
  // previously cached HTML on a failed ISR regen rather than poisoning the
  // cache with an empty "no shows tonight" page.
  //
  // We DO NOT throw on `tonight.length === 0` alone — that could be a real
  // (sad) state on, say, a major holiday + ice storm combo. We only throw
  // when the entire upcoming list is empty, which is the impossible-by-data
  // signal.
  if (events.length === 0) {
    const msg = '[render-guard /tonight] upcoming events list empty — aborting ISR cache write';
    await sendAlert('render-guard:/tonight', msg, {
      route: '/tonight',
      extra: { eventsLength: events.length, today, tonightLength: tonight.length },
    });
    throw new Error(msg);
  }

  return (
    <article className="max-w-page mx-auto px-6 pt-24 pb-32">
      <header className="mb-12">
        <p className="text-brand text-xs tracking-[0.22em] uppercase font-medium">
          {formatDateLong(`${today}T12:00:00-05:00`)} · Chicago
        </p>
        <h1 className="mt-3 font-display tracking-[0.04em] text-5xl sm:text-7xl text-ink leading-[0.98]">
          JAZZ <span className="text-brand font-accent tracking-[0.01em]">Tonight</span>
        </h1>
        <p className="mt-5 max-w-2xl text-ink/70 leading-relaxed">
          {tonight.length === 0
            ? "We don't have any verified jazz shows listed tonight. The roster is updated daily at 3am Central — check back tomorrow."
            : `${tonight.length} hand-curated live jazz shows happening across Chicago tonight. Tap any show for venue details, cover, and showtime.`}
        </p>
      </header>

      {tonight.length > 0 ? (
        <ul className="divide-y divide-white/10 border-t border-b border-white/10">
          {tonight.map((e) => (
            <li key={e.event_id}>
              <Link
                href={`/shows/${e.event_id}`}
                className="flex gap-5 py-6 hover:bg-white/5 -mx-2 px-2 transition rounded-lg"
              >
                <div className="shrink-0 w-20 h-20 sm:w-28 sm:h-28 rounded-md bg-white/5 overflow-hidden relative">
                  {e.artist_image_url ? (
                    <Image
                      src={e.artist_image_url}
                      alt={e.artist_name}
                      fill
                      sizes="(min-width: 640px) 112px, 80px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {e.editors_pick ? (
                      <span className="text-[10px] tracking-widest uppercase text-brand font-semibold">
                        ★ Editor&rsquo;s Pick
                      </span>
                    ) : null}
                    <span className="text-ink/55 text-xs tracking-wide uppercase">
                      {formatTime(e.time)}
                    </span>
                  </div>
                  <h2 className="mt-1 text-xl sm:text-2xl text-ink font-serif leading-tight">
                    {e.artist_name}
                  </h2>
                  <p className="mt-1 text-ink/70 text-sm">
                    {e.venue_name}
                    {e.cover_charge ? <span className="text-ink/40"> · {e.cover_charge}</span> : null}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-16 text-center">
        <p className="text-ink/55 text-sm">
          Want it on your phone? <Link href="/" className="text-brand hover:text-brandShine">Get the Bandstand app &rarr;</Link>
        </p>
      </div>
    </article>
  );
}
