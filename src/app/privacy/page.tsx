import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Bandstand handles your data.',
};

export default function Privacy() {
  return (
    <article className="max-w-2xl mx-auto px-6 pt-32 pb-16 prose prose-invert prose-headings:font-serif prose-headings:text-ink prose-p:text-ink/75 prose-a:text-brand prose-strong:text-ink prose-li:text-ink/75">
      <p className="text-brand text-xs tracking-[0.22em] uppercase font-medium">Legal</p>
      <h1 className="font-serif text-5xl text-ink mt-2 mb-2">Privacy Policy</h1>
      <p className="text-ink/50 text-sm">Last updated: July 4, 2026</p>

      <p>Bandstand (&ldquo;<strong>Bandstand</strong>,&rdquo; &ldquo;<strong>we</strong>,&rdquo; &ldquo;<strong>us</strong>&rdquo;) is an editorial app for live jazz, currently active in Chicago, New York, Kansas City, and Washington DC. This policy explains what data we collect, why, and what we do (and don&apos;t do) with it. We try to be plain-spoken; if anything below is unclear, write <a href="mailto:support@bandstand.fm">support@bandstand.fm</a>.</p>

      <h2>What we collect</h2>
      <p><strong>Account info.</strong> Bandstand supports three sign-in methods:</p>
      <ul>
        <li><strong>Email one-time code</strong> — we store your email address and issue a short-lived login code. We never store passwords.</li>
        <li><strong>Sign in with Apple</strong> — we receive an opaque Apple user identifier and, if you consent, your email (or a private relay email).</li>
        <li><strong>Sign in with Google</strong> — we receive your Google user identifier and email address.</li>
      </ul>
      <p><strong>Favorites, follows, and RSVPs.</strong> If you favorite a venue, follow an artist, or tap &ldquo;I&apos;m going&rdquo; on a show, we store that association so we can show you your own activity on your devices.</p>
      <p><strong>City preference.</strong> The city you last browsed (Chicago, NYC, etc.) is remembered so the app opens where you left off. We do not use GPS or IP-based geolocation.</p>
      <p><strong>Push notification tokens.</strong> If you opt in to Editor&apos;s Pick or Week Ahead alerts, we store your device&apos;s Expo push token so we can deliver those notifications. You can disable notifications at any time in the app, or in your device settings.</p>
      <p><strong>Payment and supporter data.</strong> If you tip Bandstand or make a monthly donation as a Sideman / Bandleader / Patron / Producer supporter, our payment processor (Stripe) collects your payment information directly. Bandstand receives only a customer identifier, the tier or amount, and (for monthly donations) renewal status. We never see or store your full card number or CVV. If you leave a supporter message, we retain the message text alongside your tier.</p>
      <p><strong>Outbound link taps.</strong> When you tap a &ldquo;Buy Tickets,&rdquo; venue website, Spotify, Apple Music, or similar external link inside the app, we log the tap (event id, venue id, artist id, target domain, timestamp) so we can measure editorial reach and share aggregate referral data with partner venues. We do <em>not</em> follow you off the app or track what you do on the destination site.</p>
      <p><strong>Basic diagnostics.</strong> Standard server logs (IP address, timestamps, requested URLs) for security and uptime monitoring. Logs are rotated and discarded within 30 days. If the app crashes we also collect a crash report via Sentry (device model, OS version, stack trace &mdash; no personal content).</p>

      <h2>What we do NOT collect</h2>
      <ul>
        <li>We do not sell, rent, or share your data with advertisers.</li>
        <li>We do not use third-party advertising or ad-network SDKs (no Google Ads, no Meta / Facebook Pixel).</li>
        <li>We do not use marketing-analytics SDKs (no Segment, no Mixpanel, no Amplitude).</li>
        <li>We do not access your contacts, photos, microphone, camera, or precise location.</li>
        <li>We do not access your calendar unless you tap &ldquo;Add to calendar&rdquo; on a show &mdash; and even then we only <em>write</em> the event you asked us to add.</li>
      </ul>

      <h2>Who we share data with</h2>
      <p>Only the third parties strictly required to make the app work:</p>
      <ul>
        <li><strong>Apple</strong> and <strong>Google</strong> &mdash; for sign-in authentication only.</li>
        <li><strong>Resend</strong> &mdash; to send login codes and supporter confirmation emails.</li>
        <li><strong>Expo / Apple Push / Google FCM</strong> &mdash; to deliver push notifications you opted into.</li>
        <li><strong>Stripe</strong> &mdash; to process payments for tips and monthly donations.</li>
        <li><strong>Sentry</strong> &mdash; to receive anonymized crash reports and diagnose bugs.</li>
        <li><strong>Tavily</strong> &mdash; to look up publicly-available biographical information about performing artists. Tavily never receives your personal data.</li>
        <li><strong>OpenAI / Anthropic / Google (Gemini)</strong> &mdash; to generate short artist biographies from public web sources. These providers never receive your personal data.</li>
        <li><strong>MongoDB Atlas</strong> &mdash; our database host.</li>
        <li><strong>Emergent</strong> &mdash; our application hosting provider.</li>
        <li><strong>Vercel</strong> &mdash; hosts this marketing website (bandstand.fm).</li>
        <li><strong>Cloudflare</strong> &mdash; DNS and DDoS protection for our domain.</li>
      </ul>
      <p>No advertising networks. No data brokers. No &ldquo;partners.&rdquo;</p>

      <h2>Where data lives</h2>
      <p>All Bandstand data is stored on servers in the United States. If you sign in from outside the US, your data is transferred and stored in the US under standard contractual clauses.</p>

      <h2>How long we keep data</h2>
      <ul>
        <li><strong>Account info, favorites, follows, RSVPs:</strong> until you delete your account (in-app or by email).</li>
        <li><strong>Payment records:</strong> retained as long as required by tax law and Stripe&apos;s obligations (typically 7 years).</li>
        <li><strong>Server access logs:</strong> 30 days.</li>
        <li><strong>Crash reports:</strong> 90 days.</li>
        <li><strong>Outbound-tap logs:</strong> 12 months, then aggregated and anonymized.</li>
      </ul>

      <h2>Your rights</h2>
      <p>You can delete your account and all associated data at any time from inside the Bandstand app: <strong>Profile &rarr; Delete Account</strong>. Deletion is immediate and removes your account, favorites, follows, RSVPs, and supporter messages. Payment records may be retained where required by law but will no longer be linked to your account.</p>
      <p>If you can&apos;t access the app (for example, you&apos;ve lost your device), you can also request deletion by emailing <a href="mailto:support@bandstand.fm">support@bandstand.fm</a> from the email address you signed in with. We process email deletion requests within 14 days.</p>
      <p>If you are in the EU or UK, you have rights under GDPR to access, correct, port, or restrict processing of your data. If you are in California, you have equivalent rights under CCPA / CPRA. Use the same email address.</p>

      <h2>Children</h2>
      <p>Bandstand is intended for users 13 and older. We do not knowingly collect data from anyone under 13. If you believe a child has provided us data, email <a href="mailto:support@bandstand.fm">support@bandstand.fm</a> and we will delete it.</p>

      <h2>Security</h2>
      <p>All data in transit is encrypted with TLS. Session tokens and sign-in codes are stored using platform-standard secure storage (iOS Keychain / Android Keystore) on your device. Payment card data is handled exclusively by Stripe and never touches Bandstand&apos;s servers.</p>

      <h2>Changes</h2>
      <p>If we change this policy, we&apos;ll update the &ldquo;Last updated&rdquo; date and, for material changes, notify you via push notification or an in-app banner.</p>

      <h2>Contact</h2>
      <p>Bandstand<br /><a href="mailto:support@bandstand.fm">support@bandstand.fm</a></p>
    </article>
  );
}
