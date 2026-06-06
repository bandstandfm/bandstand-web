// Small shared formatters reused on /tonight, /shows, /venues.

export function formatDateLong(iso: string): string {
  // Parse the full ISO timestamp and render it as Chicago-local. The backend
  // stores show dates as UTC strings where T01:00:00+00:00 = 8pm Chicago of
  // the *previous* UTC day, so we MUST convert to America/Chicago before
  // pulling the weekday/day-number out, or every Saturday-evening show will
  // print as "Sunday".
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
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
