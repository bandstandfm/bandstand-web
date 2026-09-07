import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Bandstand Chicago.',
};

export default function About() {
  return (
    <article className="max-w-2xl mx-auto px-6 pt-32 pb-16">
      <p className="text-brand text-xs tracking-[0.22em] uppercase font-medium">About</p>
      <h1 className="font-serif text-5xl sm:text-6xl text-ink mt-2 leading-[1.05]">Built by a fan, for fans.</h1>
      <div className="mt-8 space-y-6 text-ink/80 leading-relaxed text-lg">
        <p>
          Bandstand Chicago started in 2026 to fill a simple need: one place to see every live jazz show happening in Chicago tonight, curated by someone who actually goes to the shows and knows the rooms.
        </p>
        <p>
          Chicago has the third-deepest jazz scene in the United States after New York and New Orleans — the Green Mill, the Jazz Showcase, Andy&apos;s, Constellation, the Logan Center, Winter&apos;s. On any given night there are 30 to 100 shows happening. But until Bandstand, there was nowhere to see them all in one place.
        </p>
        <p>
          Existing apps either auto-list everything (so a Friday-night cover band ends up next to a Marquis Hill record release, devaluing both) or list almost nothing. We built Bandstand on a simple rule: every show is reviewed by a human, every venue is verified, and one show per day gets the editor&apos;s pick.
        </p>
        <p>
          The app is free. It doesn&apos;t sell ads. It doesn&apos;t sell your data. It accepts tips from listeners who want to support what we&apos;re doing.
        </p>
      </div>
    </article>
  );
}
