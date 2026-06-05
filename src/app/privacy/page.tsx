import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Bandstand Chicago handles your data.',
};

export default function Privacy() {
  return (
    <article className="max-w-2xl mx-auto px-6 pt-32 pb-16 prose prose-invert prose-headings:font-serif prose-headings:text-ink prose-p:text-ink/75 prose-a:text-brand prose-strong:text-ink">
      <p className="text-brand text-xs tracking-[0.22em] uppercase font-medium">Legal</p>
      <h1 className="font-serif text-5xl text-ink mt-2 mb-2">Privacy Policy</h1>
      <p className="text-ink/50 text-sm">Last updated: June 5, 2026</p>

      <p>Bandstand Chicago (“<strong>Bandstand</strong>,” “<strong>we</strong>,” “<strong>us</strong>”) is an editorial app for Chicago&apos;s live jazz scene. This policy explains what data we collect, why, and what we do (and don&apos;t do) with it. We try to be plain-spoken; if anything below is unclear, write <a href="mailto:support@bandstand.fm">support@bandstand.fm</a>.</p>

      <h2>What we collect</h2>
      <p><strong>Account info.</strong> When you sign in with Google or Apple, we receive your email address and a unique account identifier. We never receive your password.</p>
      <p><strong>Favorites and RSVPs.</strong> If you favorite a venue, follow an artist, or tap “I&apos;m going” on a show, we store that association so we can show you your own activity on your devices.</p>
      <p><strong>Push notification tokens.</strong> If you opt in to Editor&apos;s Pick or Week Ahead alerts, we store your device&apos;s Expo push token so we can deliver those notifications. You can disable notifications at any time in the app or in iOS Settings.</p>
      <p><strong>Basic diagnostics.</strong> Standard server logs (IP address, timestamps, requested URLs) for security and uptime monitoring. Logs are rotated and discarded within 30 days.</p>

      <h2>What we do NOT collect</h2>
      <ul>
        <li>We do not sell, rent, or share your data with advertisers.</li>
        <li>We do not use third-party analytics SDKs in the app (no Google Analytics, no Facebook Pixel, no Segment).</li>
        <li>We do not access your contacts, photos, microphone, or location.</li>
      </ul>

      <h2>Who we share data with</h2>
      <p>Only the third parties strictly required to make the app work:</p>
      <ul>
        <li><strong>Google</strong> and <strong>Apple</strong> — for sign-in authentication only.</li>
        <li><strong>Expo / Apple Push / Google FCM</strong> — to deliver push notifications you opted into.</li>
        <li><strong>MongoDB Atlas</strong> — our database host.</li>
        <li><strong>Vercel</strong> — hosts this marketing website (bandstand.fm).</li>
      </ul>
      <p>No advertising networks. No data brokers. No “partners.”</p>

      <h2>Where data lives</h2>
      <p>All Bandstand data is stored on servers in the United States. If you sign in from outside the US, your data is transferred and stored in the US under standard contractual clauses.</p>

      <h2>Your rights</h2>
      <p>You can request deletion of your account and all associated data by emailing <a href="mailto:support@bandstand.fm">support@bandstand.fm</a> from the email address you signed in with. We process deletion requests within 14 days.</p>
      <p>If you are in the EU or California, you have additional rights under GDPR and CCPA respectively, including the right to access, correct, or port your data. Same email address.</p>

      <h2>Children</h2>
      <p>Bandstand is intended for users 13 and older. We do not knowingly collect data from anyone under 13.</p>

      <h2>Changes</h2>
      <p>If we change this policy, we&apos;ll update the “Last updated” date and, for material changes, notify you via push notification or an in-app banner.</p>

      <h2>Contact</h2>
      <p>Bandstand Chicago<br /><a href="mailto:support@bandstand.fm">support@bandstand.fm</a></p>
    </article>
  );
}
