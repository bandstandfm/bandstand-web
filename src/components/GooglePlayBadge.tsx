export default function GooglePlayBadge() {
  // Coming-soon placeholder. We'll swap the href once the Google Play
  // listing goes live; until then, render an in-line "coming soon" badge
  // that visually matches the App Store badge so the CTA strip reads as
  // a coherent pair.
  return (
    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white text-black">
      {/* Official Google Play triangular play icon, rendered in the brand's
          four colours. Sized to match the App Store badge SVG (22x22). */}
      <svg width="22" height="22" viewBox="0 0 512 512" aria-hidden>
        <path fill="#34A853" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z"/>
        <path fill="#FBBC04" d="M104.6 499L325.3 277.7l60.1 60.1L104.6 499z"/>
        <path fill="#4285F4" d="M483.7 227.3l-98.4-56.6-67 67 67 67 99-56.6c19.3-15.2 19.3-45.7-.6-60.8z"/>
        <path fill="#EA4335" d="M104.6 13c-9.6 5-15.6 14.5-15.6 28.5v429c0 14 6 23.5 15.6 28.5l221.7-243-221.7-243z"/>
      </svg>
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-widest opacity-70">Coming Soon</span>
        <span className="text-base font-semibold">Google Play</span>
      </div>
    </div>
  );
}
