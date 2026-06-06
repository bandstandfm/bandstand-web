// Thin client for the existing Bandstand FastAPI backend.
// Every fetch uses Next's revalidate: 60 so pages stay fresh without
// hammering the API on every request. Cached server-side at Vercel's edge.

const BASE = process.env.BANDSTAND_API || 'https://live-jazz-chicago.preview.emergentagent.com';

export type Event = {
  event_id: string;
  artist_id: string;
  artist_name: string;
  artist_image_url?: string | null;
  venue_id: string;
  venue_name: string;
  venue_address?: string;
  venue_phone?: string;
  venue_website?: string;
  date: string;
  time?: string;
  cover_charge?: string;
  description?: string;
  editors_pick?: boolean;
  status: string;
};

export type Venue = {
  venue_id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  image_url?: string;
  neighborhood?: string;
  latitude?: number;
  longitude?: number;
};

export type Artist = {
  artist_id: string;
  name: string;
  bio?: string;
  image_url?: string;
  spotify_url?: string;
  apple_music_url?: string;
};

async function get<T>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      next: { revalidate },
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchUpcomingEvents(): Promise<Event[]> {
  const data = await get<Event[]>('/api/events?when=upcoming');
  return data || [];
}

/**
 * Convert an event's UTC `date` string to a Chicago-local YYYY-MM-DD bucket.
 *
 * Why this exists: backend stores `date` as a UTC ISO timestamp where the
 * convention is `T01:00:00+00:00` for an 8pm Chicago show (since 8pm CDT =
 * 01:00 UTC the *next* day). The mobile app handles this by parsing the UTC
 * datetime and then re-rendering it in Chicago timezone — see
 * `app/(tabs)/index.tsx`. The website used to just slice the first 10 chars
 * of the UTC string, which silently bucketed every Saturday evening show
 * under "Sunday".
 */
export function eventChicagoDateKey(e: { date?: string }): string {
  const raw = e.date || '';
  if (!raw) return '';
  // `en-CA` locale formats dates as YYYY-MM-DD, which is exactly what we need.
  return new Date(raw).toLocaleDateString('en-CA', {
    timeZone: 'America/Chicago',
  });
}

/** Chicago-local YYYY-MM-DD for "today". */
export function chicagoTodayKey(): string {
  return new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Chicago',
  });
}

export async function fetchTodaysEditorsPick(): Promise<Event | null> {
  const events = await fetchUpcomingEvents();
  const today = chicagoTodayKey();
  const picks = events
    .filter((e) => e.editors_pick && eventChicagoDateKey(e) === today)
    // Sort by start time so the *early* set of a multi-set night is featured.
    // (Garcia's, Jazz Showcase, etc. often book 7pm + 9:30pm of the same band.)
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  if (picks.length) return picks[0];
  // No pick today? Return the next future editors_pick.
  const futurePicks = events
    .filter((e) => e.editors_pick)
    .sort((a, b) => {
      const dc = eventChicagoDateKey(a).localeCompare(eventChicagoDateKey(b));
      return dc !== 0 ? dc : (a.time || '').localeCompare(b.time || '');
    });
  return futurePicks[0] || null;
}

export async function fetchVenues(): Promise<Venue[]> {
  const data = await get<Venue[]>('/api/venues');
  return data || [];
}

export async function fetchTonightsCount(): Promise<number> {
  const events = await fetchUpcomingEvents();
  const today = chicagoTodayKey();
  return events.filter((e) => eventChicagoDateKey(e) === today).length;
}
