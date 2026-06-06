import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { fetchUpcomingEvents, fetchVenues } from '@/lib/api';
import { formatDateLong, formatTime } from '@/lib/format';
import { eventSchema, jsonLdScript } from '@/lib/seo';

export const revalidate = 600; // 10 min

type Params = { event_id: string };

async function loadEvent(eventId: string) {
  const [events, venues] = await Promise.all([
    fetchUpcomingEvents(),
    fetchVenues(),
  ]);
  const event = events.find((e) => e.event_id === eventId);
  if (!event) return { event: null, venue: null, related: [] as typeof events };
  const venue = venues.find((v) => v.venue_id === event.venue_id) || null;
  // “More at this venue” sidebar: next 5 upcoming at same venue, sorted by date.
  const related = events
    .filter((e) => e.venue_id === event.venue_id && e.event_id !== event.event_id)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);
  return { event, venue, related };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { event_id } = await params;
  const { event, venue } = await loadEvent(event_id);
  if (!event) {
    return {
      title: 'Show not found',
      robots: { index: false, follow: false },
    };
  }
  const date = formatDateLong(event.date);
  const title = `${event.artist_name} at ${event.venue_name} — ${date}`;
  const description = event.description
    ? event.description.slice(0, 160)
    : `${event.artist_name} live at ${event.venue_name} in Chicago${event.time ? ` at ${formatTime(event.time)}` : ''}${event.cover_charge ? ` · ${event.cover_charge}` : ''}.`;

  return {
    title,
    description,
    alternates: { canonical: `https://bandstand.fm/shows/${event.event_id}` },
    openGraph: {
      title,
      description,
      url: `https://bandstand.fm/shows/${event.event_id}`,
      type: 'website',
      ...(event.artist_image_url
        ? { images: [{ url: event.artist_image_url, width: 1200, height: 630 }] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(event.artist_image_url ? { images: [event.artist_image_url] } : {}),
    },
    other: venue ? { 'geo.placename': venue.name } : {},
  };
}

export default async function ShowPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { event_id } = await params;
  const { event, venue, related } = await loadEvent(event_id);
  if (!event) notFound();

  const ld = eventSchema(event, venue || undefined);

  return (
    <article className="max-w-page mx-auto px-6 pt-16 pb-24">
      {/* Event JSON-LD — the magic that puts us in Google's events carousel */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(ld) }}
      />

      <nav className="text-xs text-ink/45 tracking-wide uppercase">
        <Link href="/tonight" className="hover:text-brand">All shows</Link>
        <span className="mx-2">/</span>
        <Link href={`/venues/${event.venue_id}`} className="hover:text-brand">
          {event.venue_name}
        </Link>
      </nav>

      <div className="mt-6 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <div className="aspect-[4/3] rounded-xl bg-white/5 overflow-hidden relative">
            {event.artist_image_url ? (
              <Image
                src={event.artist_image_url}
                alt={event.artist_name}
                fill
                priority
                sizes="(min-width: 1024px) 640px, 100vw"
                className="object-cover"
              />
            ) : null}
          </div>
        </div>

        <div className="lg:col-span-5">
          {event.editors_pick ? (
            <p className="text-brand text-[10px] tracking-widest uppercase font-semibold">
              ★ Editor&rsquo;s Pick
            </p>
          ) : null}
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl text-ink leading-[1.05]">
            {event.artist_name}
          </h1>
          <p className="mt-3 text-ink/65 text-lg">
            at <Link href={`/venues/${event.venue_id}`} className="text-brand hover:text-brandShine">{event.venue_name}</Link>
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-y-5 text-sm">
            <dt className="text-ink/40 uppercase tracking-wider text-xs">When</dt>
            <dd className="text-ink">
              {formatDateLong(event.date)}
              {event.time ? <><br /><span className="text-ink/65">{formatTime(event.time)}</span></> : null}
            </dd>

            <dt className="text-ink/40 uppercase tracking-wider text-xs">Cover</dt>
            <dd className="text-ink">{event.cover_charge || 'Free'}</dd>

            {event.venue_address ? (
              <>
                <dt className="text-ink/40 uppercase tracking-wider text-xs">Where</dt>
                <dd className="text-ink">{event.venue_address}</dd>
              </>
            ) : null}

            {event.venue_phone ? (
              <>
                <dt className="text-ink/40 uppercase tracking-wider text-xs">Phone</dt>
                <dd>
                  <a href={`tel:${event.venue_phone}`} className="text-brand hover:text-brandShine">
                    {event.venue_phone}
                  </a>
                </dd>
              </>
            ) : null}
          </dl>

          {event.description ? (
            <p className="mt-8 text-ink/70 leading-relaxed">{event.description}</p>
          ) : null}

          {event.venue_website ? (
            <a
              href={event.venue_website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-8 px-5 py-3 rounded-xl border border-white/20 hover:border-brand hover:text-brand transition text-ink"
            >
              Visit venue website &rarr;
            </a>
          ) : null}
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-20">
          <h2 className="font-serif text-2xl text-ink">
            Coming up at {event.venue_name}
          </h2>
          <ul className="mt-6 divide-y divide-white/10">
            {related.map((e) => (
              <li key={e.event_id}>
                <Link
                  href={`/shows/${e.event_id}`}
                  className="flex justify-between py-4 hover:text-brand transition"
                >
                  <span className="text-ink">{e.artist_name}</span>
                  <span className="text-ink/45 text-sm">{formatDateLong(e.date)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
