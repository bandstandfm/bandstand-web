import Link from 'next/link';

/**
 * Site header — 2026 Bandstand rebrand wordmark.
 *
 * The mark is a Bebas Neue "BANDSTAND" set in tall narrow caps, anchored
 * by a small gold dot that doubles as the eighth-note grace mark used
 * throughout the brand system. Stripped the old serif "B" because it no
 * longer matches the in-app login screen or the new app icon.
 *
 * NOTE: intentionally NO Sign In link. This site is public-only marketing —
 * exposing a Sign In here would imply the website supports auth, but auth
 * lives exclusively in the mobile app / Expo web deploy.
 */
export default function Header() {
  return (
    <header className="absolute top-0 inset-x-0 z-30">
      <div className="max-w-page mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="Bandstand home">
          <span className="w-2 h-2 rounded-full bg-brand shadow-[0_0_12px_rgba(212,175,55,0.7)] transition-transform group-hover:scale-110" />
          <span className="font-display text-2xl tracking-[0.18em] text-ink leading-none">
            BANDSTAND
          </span>
        </Link>
        <nav className="hidden sm:flex items-center gap-7 text-sm text-ink/80">
          <Link href="/tonight" className="hover:text-brand transition">Tonight</Link>
          <Link href="/about" className="hover:text-brand transition">About</Link>
          <Link href="/support" className="hover:text-brand transition">Support</Link>
        </nav>
      </div>
    </header>
  );
}
