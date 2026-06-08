import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchUpcomingEvents, fetchVenue, fetchVenues } from '@/lib/api';
import { formatDateLong, formatTime } from '@/lib/format';
import { venueSchema, jsonLdScript } from '@/lib/seo';

// Long ISR window — venue metadata changes rarely. Webhook revalidation
// (admin events approve/reject) updates the upcoming-shows list instantly.
export const revalidate = 86400; // 24h

type Params = { venue_id: string };

async function loadVenue(venueId: string) {
  // Fetch venue by id directly — survives `fetchVenues()` being slow or
  // momentarily incomplete. Falls back to the venue list if /api/venues/{id}
  // is missing (older backend) so the page still renders.
  const direct = await fetchVenue(venueId);
  let venue = direct;
  if (!venue) {
    const venues = await fetchVenues().catch(() => []);
    venue = venues.find((v) => v.venue_id === venueId) || null;
  }
  const events = await fetchUpcomingEvents().catch(() => []);
  const upcoming = events
    .filter((e) => e.venue_id === venueId)
    .sort((a, b) => a.date.localeCompare(b.date));
  return { venue, upcoming };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { venue_id } = await params;
  const { venue, upcoming } = await loadVenue(venue_id);
  if (!venue) {
    return { title: 'Venue not found', robots: { index: false, follow: false } };
  }
  const nextN = Math.min(upcoming.length, 30);
  const title = `${venue.name} — Live jazz schedule${venue.neighborhood ? ` in ${venue.neighborhood}` : ''}`;
  const description = venue.description
    ? venue.description.slice(0, 160)
    : `Upcoming jazz at ${venue.name}${venue.neighborhood ? ` (${venue.neighborhood}, Chicago)` : ' in Chicago'}. ${nextN} live shows on the calendar${venue.address ? ` · ${venue.address}` : ''}.`;

  return {
    title,
    description,
    alternates: { canonical: `https://bandstand.fm/venues/${venue.venue_id}` },
    openGraph: {
      title,
      description,
      url: `https://bandstand.fm/venues/${venue.venue_id}`,
      type: 'website',
      ...(venue.image_url
        ? { images: [{ url: venue.image_url, width: 1200, height: 630 }] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(venue.image_url ? { images: [venue.image_url] } : {}),
    },
  };
}

export default async function VenuePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { venue_id } = await params;
  const { venue, upcoming } = await loadVenue(venue_id);
  if (!venue) notFound();

  const ld = venueSchema(venue, upcoming);

  return (
    <article className="max-w-page mx-auto px-6 pt-16 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(ld) }}
      />

      <nav className="text-xs text-ink/45 tracking-wide uppercase">
        <Link href="/" className="hover:text-brand">Bandstand</Link>
        <span className="mx-2">/</span>
        <span>{venue.name}</span>
      </nav>

      <header className="mt-6 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="aspect-[4/3] rounded-xl bg-white/5 overflow-hidden relative">
            {venue.image_url ? (
              <Image
                src={venue.image_url}
                alt={venue.name}
                fill
                priority
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover"
              />
            ) : null}
          </div>
        </div>
        <div className="lg:col-span-7">
          {venue.neighborhood ? (
            <p className="text-brand text-[10px] tracking-widest uppercase font-semibold">
              {venue.neighborhood} · Chicago
            </p>
          ) : null}
          <h1 className="mt-2 font-serif text-5xl sm:text-6xl text-ink leading-[1.02]">
            {venue.name}
          </h1>
          {venue.description ? (
            <p className="mt-5 text-ink/70 leading-relaxed">{venue.description}</p>
          ) : null}
          <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-sm">
            {venue.address ? (
              <>
                <dt className="text-ink/40 uppercase tracking-wider text-xs">Address</dt>
                <dd className="text-ink">{venue.address}</dd>
              </>
            ) : null}
            {venue.phone ? (
              <>
                <dt className="text-ink/40 uppercase tracking-wider text-xs">Phone</dt>
                <dd>
                  <a href={`tel:${venue.phone}`} className="text-brand hover:text-brandShine">{venue.phone}</a>
                </dd>
              </>
            ) : null}
            {venue.website ? (
              <>
                <dt className="text-ink/40 uppercase tracking-wider text-xs">Website</dt>
                <dd>
                  <a href={venue.website} target="_blank" rel="noopener noreferrer" className="text-brand hover:text-brandShine">
                    Visit &rarr;
                  </a>
                </dd>
              </>
            ) : null}
          </dl>
        </div>
      </header>

      <section className="mt-16">
        <h2 className="font-serif text-3xl text-ink">
          Upcoming at {venue.name}
        </h2>
        {upcoming.length === 0 ? (
          <p className="mt-4 text-ink/55">No upcoming shows listed yet. Check back soon.</p>
        ) : (
          <ul className="mt-6 divide-y divide-white/10 border-t border-b border-white/10">
            {upcoming.slice(0, 30).map((e) => (
              <li key={e.event_id}>
                <Link
                  href={`/shows/${e.event_id}`}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-5 gap-2 hover:bg-white/5 -mx-2 px-2 transition rounded-md"
                >
                  <div className="flex-1">
                    <p className="text-ink text-lg font-serif">{e.artist_name}</p>
                    {e.cover_charge ? (
                      <p className="text-ink/40 text-xs mt-0.5">{e.cover_charge}</p>
                    ) : null}
                  </div>
                  <div className="text-sm text-ink/65 sm:text-right">
                    <p>{formatDateLong(e.date)}</p>
                    {e.time ? <p className="text-ink/45">{formatTime(e.time)}</p> : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
