import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { jsonLdScript, organizationSchema, websiteSchema } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL('https://bandstand.fm'),
  title: {
    default: 'Bandstand Chicago — Live jazz, hand-curated nightly',
    template: '%s | Bandstand Chicago',
  },
  description:
    "Tonight's jazz in Chicago. Hand-curated listings from the Green Mill, Jazz Showcase, Andy's, Constellation, the Logan Center and every room in between — never auto-listed.",
  applicationName: 'Bandstand',
  keywords: [
    'Chicago jazz',
    'live jazz Chicago',
    'jazz tonight Chicago',
    'jazz clubs Chicago',
    'Green Mill schedule',
    'Jazz Showcase Chicago',
    "Andy's Jazz Club",
    'Constellation Chicago',
    'Logan Center jazz',
    'live music Chicago tonight',
    "Editor's Pick jazz",
    'Chicago music venues',
  ],
  authors: [{ name: 'Bandstand Chicago' }],
  creator: 'Bandstand Chicago',
  publisher: 'Bandstand Chicago',
  alternates: {
    canonical: 'https://bandstand.fm',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bandstand.fm',
    siteName: 'Bandstand Chicago',
    title: 'Bandstand Chicago — Live jazz tonight',
    description:
      "Hand-curated listings of every jazz show in Chicago tonight. Never auto-listed.",
    images: [
      {
        url: '/icon-1024.png',
        width: 1024,
        height: 1024,
        alt: 'Bandstand Chicago',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bandstand Chicago',
    description: "Hand-curated jazz listings, every night in Chicago.",
    images: ['/icon-1024.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192' },
    ],
    apple: '/icon-1024.png',
  },
  category: 'music',
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Organization + WebSite JSON-LD: declared once site-wide.
            Lets Google build the Knowledge Panel and enable Sitelinks
            Searchbox on the brand SERP. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteSchema()) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
