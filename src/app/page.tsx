import Link from 'next/link';
import HeroVideo from '@/components/HeroVideo';
import EditorsPickCard from '@/components/EditorsPickCard';
import VenuesGrid from '@/components/VenuesGrid';
import AppStoreBadge from '@/components/AppStoreBadge';
import {
  fetchTodaysEditorsPick,
  fetchVenues,
  fetchTonightsCount,
} from '@/lib/api';
import { sendAlert } from '@/lib/alert';

// ISR with a 1-hour window. Why this instead of `force-dynamic`:
//
// Every page render must call our FastAPI backend. If the Vercel serverless
// function or the backend pod has been idle, that first call takes 3-8s
// (function cold-start + MongoDB connection warmup). The user lands on a
// blank "0 shows tonight" page while the regeneration finishes — exactly
// the symptom Kyle kept hitting.
//
// ISR fixes this with stale-while-revalidate: the user gets the cached
// HTML *instantly*, and any regeneration happens in the background. The
// long window doesn't compromise freshness because:
//   1. The backend webhook flushes the cache the second data changes
//      (scrape, editor's pick toggle, approve/reject — all 6 write paths).
//   2. The 00:01 America/Chicago cron flushes when the date rolls over.
//   3. The 5-min backend keep-warm ping prevents the regeneration itself
//      from ever cold-starting in steady state.
export const revalidate = 3600; // 1h safety net — primary refresh is webhook-driven

export default async function Home() {
  const [pick, venues, tonightCount] = await Promise.all([
    fetchTodaysEditorsPick(),
    fetchVenues(),
    fetchTonightsCount(),
  ]);

  // Render guard — if any of these are empty/missing, something is wrong
  // with the backend response and we should NOT cache a broken render. By
  // throwing here, Next.js discards this regeneration and keeps the
  // previously cached (good) HTML, instead of overwriting it with an
  // empty homepage.
  //
  // Pick can legitimately be null (Kyle hasn't curated today yet → fallback
  // picks the next future show), so we don't guard on it.
  // Venues count is a hard floor — Bandstand launched with 18 and is only
  // additive. 0 venues means the backend returned [] which means the fetch
  // either failed or returned a corrupt/empty payload. Either way: do not
  // cache.
  if (venues.length === 0) {
    const msg = '[render-guard /] venues list empty — aborting ISR cache write';
    await sendAlert('render-guard:/', msg, {
      route: '/',
      extra: { venuesLength: venues.length, tonightCount, hasPick: !!pick },
    });
    throw new Error(msg);
  }

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-end pb-16 sm:pb-24 overflow-hidden">
        <HeroVideo />
        <div className="relative max-w-page mx-auto px-6 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/45 border border-white/15">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            <span className="text-xs tracking-[0.18em] uppercase text-ink/90 font-medium">Chicago · Live Jazz</span>
          </div>
          <h1 className="mt-5 font-serif text-[clamp(48px,9vw,108px)] leading-[1.02] text-ink max-w-4xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            Tonight on the
            <br />
            <span className="italic text-brand">bandstand.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink/85 leading-relaxed">
            Every live jazz show happening in Chicago tonight — the Green Mill, Jazz Showcase, Andy&apos;s, Constellation, the Logan Center, and every room in between. Hand-curated by a fan, never auto-listed.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 items-center">
            <AppStoreBadge />
            <Link href="/tonight" className="inline-flex items-center px-5 py-3 rounded-xl border border-white/20 text-ink hover:border-brand hover:text-brand transition">
              See tonight&apos;s shows &rarr;
            </Link>
          </div>
          {tonightCount > 0 ? (
            <p className="mt-6 text-sm text-ink/55">
              <Link href="/tonight" className="hover:text-brand transition">
                <span className="text-brand font-semibold">{tonightCount}</span> show{tonightCount === 1 ? '' : 's'} listed tonight across 18 Chicago jazz rooms.
              </Link>
            </p>
          ) : null}
        </div>
      </section>

      {/* EDITOR'S PICK */}
      {pick ? (
        <section id="tonight" className="max-w-page mx-auto px-6 mt-12 sm:mt-20">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-5">
              <p className="text-brand text-xs tracking-[0.22em] uppercase font-medium">Tonight on Bandstand</p>
              <h2 className="mt-3 font-serif text-4xl sm:text-5xl text-ink leading-[1.05]">
                A single show worth your evening.
              </h2>
              <p className="mt-5 text-ink/70 leading-relaxed">
                Every day at noon Central, we publish one <span className="text-brand">Editor&apos;s Pick</span> — the show in Chicago we think you shouldn&apos;t miss. No algorithm. No ranking by ticket sales. Just one room, one act, one recommendation from a fan who&apos;s been to all of them.
              </p>
              <Link href="/support" className="inline-block mt-7 text-brand hover:text-brandShine transition">
                Suggest a show &rarr;
              </Link>
            </div>
            <div className="lg:col-span-7">
              <EditorsPickCard event={pick} />
              {tonightCount > 1 ? (
                <p className="mt-6 text-center sm:text-left">
                  <Link href="/tonight" className="inline-flex items-center text-brand hover:text-brandShine transition text-sm tracking-wide">
                    See all {tonightCount} shows happening in Chicago tonight &rarr;
                  </Link>
                </p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* VENUES */}
      <section className="max-w-page mx-auto px-6 mt-20 sm:mt-32">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-brand text-xs tracking-[0.22em] uppercase font-medium">18 Rooms</p>
            <h2 className="mt-2 font-serif text-4xl sm:text-5xl text-ink leading-[1.05]">Every jazz venue in Chicago.</h2>
          </div>
          <p className="max-w-md text-ink/65">
            From the Green Mill in Uptown to the Logan Center in Hyde Park — we cover every room booking live jazz nightly across the city.
          </p>
        </div>
        <VenuesGrid venues={venues} />
      </section>

      {/* WHAT BANDSTAND IS */}
      <section className="max-w-page mx-auto px-6 mt-24 sm:mt-32">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div>
            <div className="text-brand text-3xl font-serif">01</div>
            <h3 className="mt-3 text-xl text-ink font-medium">Hand-curated, not auto-listed.</h3>
            <p className="mt-2 text-ink/65 leading-relaxed">Every show is reviewed and tagged. We block the cover bands, the wedding gigs, and the “jazz‐ish” brunch. If it&apos;s here, it&apos;s the real thing.</p>
          </div>
          <div>
            <div className="text-brand text-3xl font-serif">02</div>
            <h3 className="mt-3 text-xl text-ink font-medium">One pick a day, 12pm CT.</h3>
            <p className="mt-2 text-ink/65 leading-relaxed">Notifications fire at noon — enough time to grab tickets, plan a sitter, decide where to eat first. Sunday morning gets a quick look at the week ahead.</p>
          </div>
          <div>
            <div className="text-brand text-3xl font-serif">03</div>
            <h3 className="mt-3 text-xl text-ink font-medium">Built by a fan.</h3>
            <p className="mt-2 text-ink/65 leading-relaxed">Bandstand isn&apos;t a ticketing platform or a music company — it&apos;s the listing app we wished existed for our own city. Now it exists.</p>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="max-w-page mx-auto px-6 mt-24 sm:mt-32">
        <div className="border border-white/10 rounded-2xl bg-surface px-8 py-12 sm:py-16 text-center">
          <h2 className="font-serif text-4xl sm:text-5xl text-ink">Hear it before everyone else does.</h2>
          <p className="mt-4 max-w-xl mx-auto text-ink/65">The Bandstand app is launching on the App Store this season. Until then, you can browse tonight&apos;s curation right here.</p>
          <div className="mt-7 inline-flex"><AppStoreBadge /></div>
        </div>
      </section>
    </>
  );
}
