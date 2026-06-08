import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { chicagoTodayKey, eventChicagoDateKey, fetchUpcomingEvents } from '@/lib/api';
import { formatDateLong, formatTime } from '@/lib/format';

// ISR with a 1-hour window — see /app/website/src/app/page.tsx for the
// full rationale. force-dynamic caused cold-start blanks on first visit
// after idle. The webhook + midnight cron handle freshness; ISR handles
// resilience.
export const revalidate = 3600;

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

  return (
    <article className="max-w-page mx-auto px-6 pt-24 pb-32">
      <header className="mb-12">
        <p className="text-brand text-xs tracking-[0.22em] uppercase font-medium">
          {formatDateLong(`${today}T12:00:00-05:00`)} · Chicago
        </p>
        <h1 className="mt-3 font-serif text-5xl sm:text-6xl text-ink leading-[1.05]">
          Jazz tonight.
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
