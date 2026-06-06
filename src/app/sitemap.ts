import type { MetadataRoute } from 'next';
import { fetchUpcomingEvents, fetchVenues } from '@/lib/api';

const SITE = 'https://bandstand.fm';

// ISR: regenerate the sitemap hourly so new events are discoverable fast.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, venues] = await Promise.all([
    fetchUpcomingEvents(),
    fetchVenues(),
  ]);

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE}/tonight`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${SITE}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE}/support`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${SITE}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${SITE}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  const venuePages: MetadataRoute.Sitemap = venues.map((v) => ({
    url: `${SITE}/venues/${v.venue_id}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Skip events that have already passed.
  const future = events.filter((e) => {
    const day = (e.date || '').slice(0, 10);
    return day >= now.toISOString().slice(0, 10);
  });
  const eventPages: MetadataRoute.Sitemap = future.map((e) => ({
    url: `${SITE}/shows/${e.event_id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...venuePages, ...eventPages];
}
