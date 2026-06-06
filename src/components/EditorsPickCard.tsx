import Link from 'next/link';
import Image from 'next/image';
import type { Event } from '@/lib/api';

function formatDate(iso: string) {
  const day = (iso || '').slice(0, 10);
  if (!day) return '';
  const d = new Date(day + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function formatTime(t?: string) {
  if (!t) return '';
  const [hh, mm] = t.split(':').map(Number);
  if (isNaN(hh)) return t;
  const period = hh >= 12 ? 'pm' : 'am';
  const h = hh % 12 || 12;
  return mm ? `${h}:${String(mm).padStart(2, '0')}${period}` : `${h}${period}`;
}

export default function EditorsPickCard({ event }: { event: Event }) {
  const img = event.artist_image_url ||
    'https://images.pexels.com/photos/164693/pexels-photo-164693.jpeg?auto=compress&w=940';
  return (
    <Link
      href={`/shows/${event.event_id}`}
      className="block relative bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 hover:border-brand/40 transition group"
    >
      <div className="relative aspect-[16/10] w-full bg-bg">
        <Image
          src={img}
          alt={event.artist_name}
          fill
          sizes="(min-width: 1024px) 720px, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/15 border border-brand/40 text-brand text-xs tracking-widest uppercase font-medium">
          <span className="text-base leading-none">★</span> Editor&apos;s Pick
        </div>
      </div>
      <div className="p-6 sm:p-8">
        <p className="text-brand text-xs tracking-[0.2em] uppercase font-medium">{formatDate(event.date)} · {formatTime(event.time)}</p>
        <h3 className="mt-2 font-serif text-3xl sm:text-4xl text-ink leading-tight">{event.artist_name}</h3>
        <p className="mt-1 text-ink/70">at {event.venue_name}</p>
        {event.cover_charge ? (
          <p className="mt-3 text-ink/55 text-sm">{event.cover_charge}</p>
        ) : null}
        {event.description ? (
          <p className="mt-4 text-ink/75 leading-relaxed line-clamp-3">{event.description}</p>
        ) : null}
        <p className="mt-5 text-brand text-sm group-hover:text-brandShine transition">
          View show details &rarr;
        </p>
      </div>
    </Link>
  );
}
