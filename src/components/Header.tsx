import Link from 'next/link';

export default function Header() {
  return (
    <header className="absolute top-0 inset-x-0 z-30">
      <div className="max-w-page mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-serif text-2xl text-ink leading-none">B</span>
          <span className="text-sm tracking-[0.18em] uppercase text-ink/85 font-medium">Bandstand</span>
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
