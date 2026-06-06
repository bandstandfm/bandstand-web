// JSON-LD structured data helpers. Google reads these to power the
// Events carousel, Knowledge Panel, and rich results.
//
// Schema docs:
//   - Event:   https://schema.org/Event   /  https://developers.google.com/search/docs/appearance/structured-data/event
//   - Place:   https://schema.org/Place
//   - LocalBusiness: https://schema.org/LocalBusiness
//   - Organization: https://schema.org/Organization
//   - WebSite: https://schema.org/WebSite

import type { Event as ShowEvent, Venue } from './api';

const SITE_URL = 'https://bandstand.fm';
const SITE_NAME = 'Bandstand Chicago';

/** Parse Chicago-local-date from a backend ISO timestamp + HH:MM time. */
export function eventStartIso(e: ShowEvent): string {
  // The backend stores `date` as a UTC ISO string and `time` as HH:MM Chicago
  // local. We want a proper local ISO 8601 with tz offset so Google honours
  // it (e.g. "2026-07-15T20:00:00-05:00").
  const day = (e.date || '').slice(0, 10);
  const time = (e.time || '20:00').slice(0, 5);
  // -05:00 (CDT) for May-Nov, -06:00 (CST) for Nov-Mar. Rough estimate good
  // enough for SEO — Google is forgiving on small offset errors.
  const d = new Date(`${day}T${time}:00`);
  const month = d.getUTCMonth() + 1;
  const offset = month >= 3 && month <= 10 ? '-05:00' : '-06:00';
  return `${day}T${time}:00${offset}`;
}

export function eventEndIso(e: ShowEvent): string {
  // Most jazz sets run ~3 hours. Good default for the EventEndDate hint.
  const start = new Date(eventStartIso(e));
  start.setHours(start.getHours() + 3);
  return start.toISOString().replace(/\.\d+Z$/, '+00:00');
}

/** Generate Event schema for a single show. */
export function eventSchema(e: ShowEvent, venue?: Venue) {
  const addr = e.venue_address || venue?.address || '';
  // Parse "806 S Plymouth Ct, Chicago, IL 60605" → street / city / zip
  const parts = addr.split(',').map((s) => s.trim()).filter(Boolean);
  const street = parts[0] || '';
  const city = parts[1] || 'Chicago';
  const stateZip = (parts[2] || 'IL').split(/\s+/);
  const state = stateZip[0] || 'IL';
  const zip = stateZip[1] || '';

  return {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: `${e.artist_name} at ${e.venue_name}`,
    description: e.description || `Live jazz with ${e.artist_name} at ${e.venue_name} in Chicago.`,
    startDate: eventStartIso(e),
    endDate: eventEndIso(e),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'MusicVenue',
      name: e.venue_name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: street,
        addressLocality: city,
        addressRegion: state,
        postalCode: zip,
        addressCountry: 'US',
      },
      ...(venue?.latitude && venue?.longitude
        ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: venue.latitude,
              longitude: venue.longitude,
            },
          }
        : {}),
      ...(venue?.website ? { url: venue.website } : {}),
      ...(e.venue_phone ? { telephone: e.venue_phone } : {}),
    },
    performer: {
      '@type': 'MusicGroup',
      name: e.artist_name,
    },
    ...(e.artist_image_url
      ? { image: [e.artist_image_url] }
      : { image: [`${SITE_URL}/icon-1024.png`] }),
    offers: e.cover_charge
      ? {
          '@type': 'Offer',
          price: e.cover_charge.replace(/[^\d.-]/g, '').split('-')[0] || '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: e.venue_website || SITE_URL,
          validFrom: new Date().toISOString().replace(/\.\d+Z$/, '+00:00'),
        }
      : undefined,
    organizer: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    url: `${SITE_URL}/shows/${e.event_id}`,
  };
}

/** Generate MusicVenue / LocalBusiness schema for a venue. */
export function venueSchema(v: Venue, upcomingEvents: ShowEvent[]) {
  const addr = v.address || '';
  const parts = addr.split(',').map((s) => s.trim()).filter(Boolean);
  const street = parts[0] || '';
  const city = parts[1] || 'Chicago';
  const stateZip = (parts[2] || 'IL').split(/\s+/);
  const state = stateZip[0] || 'IL';
  const zip = stateZip[1] || '';

  return {
    '@context': 'https://schema.org',
    '@type': 'MusicVenue',
    name: v.name,
    description: v.description || `${v.name} — live jazz venue in ${v.neighborhood || 'Chicago'}.`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: street,
      addressLocality: city,
      addressRegion: state,
      postalCode: zip,
      addressCountry: 'US',
    },
    ...(v.latitude && v.longitude
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: v.latitude,
            longitude: v.longitude,
          },
        }
      : {}),
    ...(v.website ? { sameAs: [v.website] } : {}),
    ...(v.phone ? { telephone: v.phone } : {}),
    ...(v.image_url ? { image: [v.image_url] } : {}),
    url: `${SITE_URL}/venues/${v.venue_id}`,
    event: upcomingEvents.slice(0, 10).map((e) => ({
      '@type': 'MusicEvent',
      name: `${e.artist_name} at ${v.name}`,
      startDate: eventStartIso(e),
      url: `${SITE_URL}/shows/${e.event_id}`,
    })),
  };
}

/** Site-wide Organization + WebSite schema (lives in layout). */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon-1024.png`,
    description: "Hand-curated daily listings of every live jazz show in Chicago.",
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${SITE_URL}/support`,
    },
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: "Tonight's jazz in Chicago — hand-curated by a fan.",
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/tonight?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Strip empty fields from a JSON-LD object before rendering. */
export function jsonLdScript(obj: unknown): string {
  return JSON.stringify(obj, (_k, v) => (v === undefined ? undefined : v));
}
