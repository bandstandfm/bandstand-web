// Live Google Play badge — links to the Bandstand Live listing.
// The `pcampaignid=web_share` tracking parameter is intentionally stripped
// so referrals from the marketing site aren't misattributed as web-share
// installs inside the Play Console attribution reports.
const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=fm.bandstand.app";

export default function GooglePlayBadge() {
  return (
    <a
      href={GOOGLE_PLAY_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get Bandstand on Google Play"
      className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white text-black transition hover:bg-white/90 active:scale-[0.98]"
    >
      {/* Official Google Play triangular play icon in the brand's four
          colours. Sized to match the App Store badge SVG (22x22). */}
      <svg width="22" height="22" viewBox="0 0 512 512" aria-hidden>
        <path fill="#34A853" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z"/>
        <path fill="#FBBC04" d="M104.6 499L325.3 277.7l60.1 60.1L104.6 499z"/>
        <path fill="#4285F4" d="M483.7 227.3l-98.4-56.6-67 67 67 67 99-56.6c19.3-15.2 19.3-45.7-.6-60.8z"/>
        <path fill="#EA4335" d="M104.6 13c-9.6 5-15.6 14.5-15.6 28.5v429c0 14 6 23.5 15.6 28.5l221.7-243-221.7-243z"/>
      </svg>
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-widest opacity-70">Get it on</span>
        <span className="text-base font-semibold">Google Play</span>
      </div>
    </a>
  );
}
