import Image from 'next/image';
import Link from 'next/link';
import type { Venue } from '@/lib/api';

export default function VenuesGrid({ venues }: { venues: Venue[] }) {
  // Filter to ones with images and a description; sort alphabetically.
  const list = venues
    .filter((v) => v.image_url)
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 12);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {list.map((v) => (
        <Link
          key={v.venue_id}
          href={`/venues/${v.venue_id}`}
          className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-surface block hover:border-brand/40 transition"
        >
          {v.image_url ? (
            <Image
              src={v.image_url}
              alt={v.name}
              fill
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
              unoptimized
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="font-serif text-xl text-ink leading-tight">{v.name}</h3>
            {v.neighborhood ? <p className="text-xs tracking-widest uppercase text-brand/85 mt-1">{v.neighborhood}</p> : null}
          </div>
        </Link>
      ))}
    </div>
  );
}
