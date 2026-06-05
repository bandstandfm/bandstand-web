import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://bandstand.fm'),
  title: {
    default: 'Bandstand Chicago — Live jazz, hand-curated nightly',
    template: '%s | Bandstand',
  },
  description:
    "Tonight's jazz in Chicago. Hand-curated listings from the Green Mill, Jazz Showcase, Andy's, and every room in between — never auto-listed.",
  applicationName: 'Bandstand',
  keywords: ['Chicago jazz', 'live jazz tonight', 'jazz clubs Chicago', 'Green Mill', 'Jazz Showcase', 'Andy\'s Jazz Club', 'Editor\'s Pick'],
  authors: [{ name: 'Bandstand' }],
  openGraph: {
    type: 'website',
    url: 'https://bandstand.fm',
    title: 'Bandstand Chicago — Live jazz tonight',
    description: "Hand-curated listings of every jazz show in Chicago tonight.",
    images: [{ url: '/icon-1024.png', width: 1024, height: 1024 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bandstand Chicago',
    description: "Hand-curated jazz listings, every night in Chicago.",
    images: ['/icon-1024.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192' },
    ],
    apple: '/icon-1024.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
