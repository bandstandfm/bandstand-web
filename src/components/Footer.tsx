import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="max-w-page mx-auto px-6 py-12 flex flex-col gap-8 sm:flex-row sm:justify-between sm:items-start text-sm">
        <div className="max-w-sm">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl text-ink">B</span>
            <span className="text-sm tracking-[0.18em] uppercase text-ink/85 font-medium">Bandstand Chicago</span>
          </div>
          <p className="mt-3 text-ink/55 leading-relaxed">
            Hand-curated listings of live jazz happening in Chicago tonight, every night. Made by a fan, for fans.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-3 text-ink/70">
          <div className="flex flex-col gap-2">
            <p className="text-ink/40 text-xs uppercase tracking-widest mb-1">Product</p>
            <Link href="/" className="hover:text-brand transition">Tonight</Link>
            <Link href="/about" className="hover:text-brand transition">About</Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-ink/40 text-xs uppercase tracking-widest mb-1">Help</p>
            <Link href="/support" className="hover:text-brand transition">Support</Link>
            <a href="mailto:support@bandstand.fm" className="hover:text-brand transition">support@bandstand.fm</a>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-ink/40 text-xs uppercase tracking-widest mb-1">Legal</p>
            <Link href="/privacy" className="hover:text-brand transition">Privacy</Link>
            <Link href="/terms" className="hover:text-brand transition">Terms</Link>
          </div>
        </div>
      </div>
      <div className="max-w-page mx-auto px-6 pb-10 text-xs text-ink/30">
        © {new Date().getFullYear()} Bandstand Chicago. All rights reserved.
      </div>
    </footer>
  );
}
