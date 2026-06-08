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

async function get<T>(path: string, revalidate = 3600): Promise<T | null> {
  // Resilient fetch: 2 attempts with a sane per-request timeout. Why this
  // matters: the FastAPI backend's MongoDB pool can take 3-5s to warm on a
  // cold connection, and Vercel serverless cold-starts add their own
  // latency. Without retries, a single transient hiccup would make the
  // calling page render with `null` data (empty state) — which is what
  // Kyle kept seeing.
  //
  // The 8s per-attempt timeout sits comfortably below Vercel's 10s hobby-
  // tier function deadline. Two attempts with a 750ms gap gives us up to
  // ~17s of patience in the worst case while still leaving headroom.
  const ATTEMPTS = 2;
  const PER_ATTEMPT_TIMEOUT_MS = 8000;
  let lastErr: unknown = null;

  for (let i = 0; i < ATTEMPTS; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PER_ATTEMPT_TIMEOUT_MS);
    try {
      const res = await fetch(`${BASE}${path}`, {
        next: { revalidate },
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) {
        // 4xx/5xx from backend — don't retry, the path is just wrong
        // or the backend has a real bug. Returning null lets the page
        // render its empty state rather than throw at the user.
        return null;
      }
      return (await res.json()) as T;
    } catch (e) {
      clearTimeout(timer);
      lastErr = e;
      // Brief pause before retry to let an overloaded backend breathe.
      if (i < ATTEMPTS - 1) await new Promise((r) => setTimeout(r, 750));
    }
  }
  // All attempts failed. Log so Vercel captures it in their Logs tab —
  // important: previously this was silent, which made cold-start failures
  // invisible.
  console.error(`[bandstand-api] ${path} failed after ${ATTEMPTS} attempts:`, lastErr);
  return null;
}

export async function fetchUpcomingEvents(): Promise<Event[]> {
  const data = await get<Event[]>('/api/events?when=upcoming');
  return data || [];
}

/**
 * Fetch a single event by id, regardless of whether it's past or upcoming.
 *
 * Why this exists: the show page used to filter through the "upcoming"
 * list, which meant any link to a past show (push-notification deep links,
 * bookmarks of yesterday's Editor's Pick, App Store reviewers revisiting
 * a saved URL the next day) hit a hard 404. The backend's
 * /api/events/{id} endpoint serves any event by id, so a past show still
 * renders normally — preserving SEO, share URLs, and reviewer experience.
 */
export async function fetchEvent(eventId: string): Promise<Event | null> {
  return get<Event>(`/api/events/${encodeURIComponent(eventId)}`);
}

export async function fetchVenue(venueId: string): Promise<Venue | null> {
  return get<Venue>(`/api/venues/${encodeURIComponent(venueId)}`);
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
