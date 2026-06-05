import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms governing your use of Bandstand Chicago.',
};

export default function Terms() {
  return (
    <article className="max-w-2xl mx-auto px-6 pt-32 pb-16 prose prose-invert prose-headings:font-serif prose-headings:text-ink prose-p:text-ink/75 prose-a:text-brand prose-strong:text-ink">
      <p className="text-brand text-xs tracking-[0.22em] uppercase font-medium">Legal</p>
      <h1 className="font-serif text-5xl text-ink mt-2 mb-2">Terms of Service</h1>
      <p className="text-ink/50 text-sm">Last updated: June 5, 2026</p>

      <p>These Terms of Service (“<strong>Terms</strong>”) govern your use of the Bandstand Chicago app and the bandstand.fm website (together, the “<strong>Service</strong>”). By using the Service you agree to these Terms.</p>

      <h2>What Bandstand is</h2>
      <p>Bandstand is an editorial listing of live jazz shows in Chicago. We compile, curate, and present information about shows from public sources (venue websites, ticketing platforms, social media) and from manual editorial review. We do not sell tickets, book artists, or operate venues.</p>

      <h2>Information accuracy</h2>
      <p>We work hard to keep listings accurate, but show times, cover charges, and venue policies can change at any time. <strong>Always confirm details directly with the venue before going</strong>. Bandstand is not responsible for cancellations, rescheduled shows, sold-out shows, or any inconvenience caused by inaccurate listings.</p>

      <h2>Third-party links</h2>
      <p>We link out to venue websites, ticketing platforms, and streaming services. Some of these links may be affiliate links that earn Bandstand a small commission. This never affects what we recommend; affiliate revenue (and Editor&apos;s Picks) are determined purely by editorial judgment.</p>

      <h2>Your account</h2>
      <p>You&apos;re responsible for activity on your account. Don&apos;t share your sign-in. If you suspect unauthorized access, email <a href="mailto:support@bandstand.fm">support@bandstand.fm</a>.</p>

      <h2>Acceptable use</h2>
      <p>Don&apos;t use the Service to:</p>
      <ul>
        <li>Scrape, mirror, or republish our listings without permission.</li>
        <li>Submit false venue or show information.</li>
        <li>Attempt to disrupt or reverse-engineer the Service.</li>
        <li>Harass other users, venues, or artists.</li>
      </ul>

      <h2>Tips and contributions</h2>
      <p>If you choose to support Bandstand via Buy Me a Coffee or any future tipping mechanism, those payments are voluntary and non-refundable. They do not entitle you to any special access or features.</p>

      <h2>Termination</h2>
      <p>We can suspend or terminate accounts that violate these Terms. You can delete your own account at any time by emailing <a href="mailto:support@bandstand.fm">support@bandstand.fm</a>.</p>

      <h2>Disclaimers</h2>
      <p>The Service is provided “as is” without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service. Where the law does not permit a full disclaimer, our liability is limited to the amount you have paid us in the preceding 12 months (likely $0).</p>

      <h2>Changes</h2>
      <p>We may update these Terms occasionally. Material changes will be noted in the app or via email.</p>

      <h2>Governing law</h2>
      <p>These Terms are governed by the laws of the State of Illinois. Any dispute will be resolved in the state or federal courts located in Cook County, Illinois.</p>

      <h2>Contact</h2>
      <p>Bandstand Chicago<br /><a href="mailto:support@bandstand.fm">support@bandstand.fm</a></p>
    </article>
  );
}
