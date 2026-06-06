// Small shared formatters reused on /tonight, /shows, /venues.

export function formatDateLong(iso: string): string {
  // "2026-07-15T01:00:00..." -> "Tuesday, July 15"
  const day = (iso || '').slice(0, 10);
  if (!day) return '';
  const d = new Date(`${day}T12:00:00`);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Chicago',
  });
}

export function formatTime(t?: string): string {
  if (!t) return '';
  // "20:00" -> "8:00 PM"
  const [hh, mm] = t.split(':');
  const h = parseInt(hh, 10);
  if (Number.isNaN(h)) return t;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = ((h + 11) % 12) + 1;
  return `${hour12}:${mm} ${ampm}`;
}

/** Chicago-local YYYY-MM-DD for today. */
export function chicagoToday(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });
}
