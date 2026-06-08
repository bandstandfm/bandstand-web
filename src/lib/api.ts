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
  /**
   * Chicago-local YYYY-MM-DD computed by the backend.
   *
   * Prefer this over slicing `date` — `date` is a UTC ISO string and 8pm
   * Chicago shows are stored as `T01:00:00+00:00` of the *next* UTC day,
   * so the UTC prefix lies. The backend started populating this field in
   * June 2026; older clients/cached responses may be missing it, hence
   * `eventChicagoDateKey()` falls back to computing it client-side.
   */
  chicago_date?: string;
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
 * Return the Chicago-local YYYY-MM-DD bucket for an event.
 *
 * If the backend has supplied `chicago_date` (June 2026+), use it directly.
 * Otherwise fall back to parsing `date` and converting to America/Chicago,
 * which is what the website used to do everywhere.
 *
 * Why this matters: the backend stores `date` as a UTC ISO string where
 * `T01:00:00+00:00` is the convention for 8pm Chicago shows — so the first
 * 10 chars are the *next* day's date in UTC. Slicing them silently moved
 * Saturday-evening shows to "Sunday", evening Editor's Picks to "tomorrow",
 * etc.
 */
export function eventChicagoDateKey(e: { date?: string; chicago_date?: string }): string {
  if (e.chicago_date) return e.chicago_date;
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
