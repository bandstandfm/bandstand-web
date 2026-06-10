import type { Metadata } from 'next';
import SupportForm from '@/components/SupportForm';

export const metadata: Metadata = {
  title: 'Support',
  description: 'Get help with Bandstand Chicago, submit a venue, or report an issue.',
};

const FAQS = [
  {
    q: 'How do I submit a venue or show?',
    a: 'Use the form below — we read every submission personally. New venues are typically added within a week of a successful editorial review.',
  },
  {
    q: 'A show on the app is wrong / cancelled / mispriced. How do I report it?',
    a: 'Use the form. Include the date, venue, and what\'s incorrect. We push fixes as soon as we verify with the venue.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Email support@bandstand.fm from the email address you signed in with. We delete accounts (and all associated data) within 14 days.',
  },
  {
    q: 'Why don\'t I see push notifications in Expo Go?',
    a: 'Remote push notifications were removed from Expo Go in SDK 53. The full version on the App Store and Google Play supports them.',
  },
  {
    q: 'Will Bandstand expand to other cities?',
    a: 'Yes. New York, New Orleans, Paris, and Buenos Aires are on the roadmap. Subscribe to the newsletter (coming soon) to hear when each launches.',
  },
  {
    q: 'Is Bandstand free?',
    a: 'Yes, 100%. We don\'t sell ads, sell data, or have a paywall. The app is supported by tips and optional affiliate links on “buy tickets” buttons.',
  },
];

export default function Support() {
  return (
    <section className="max-w-3xl mx-auto px-6 pt-32 pb-16">
      <p className="text-brand text-xs tracking-[0.22em] uppercase font-medium">Help</p>
      <h1 className="font-serif text-5xl text-ink mt-2">Support</h1>
      <p className="mt-4 text-ink/75 leading-relaxed">
        Something off in our listings? Run a Chicago jazz venue you&apos;d like included? Need to delete your account? Drop us a note — it&apos;s read personally, usually within a day.
      </p>
      <p className="mt-3 text-ink/55">
        Or email directly: <a href="mailto:support@bandstand.fm" className="text-brand hover:text-brandShine transition">support@bandstand.fm</a>
      </p>

      <SupportForm />

      <h2 className="font-serif text-3xl text-ink mt-20 mb-6">FAQ</h2>
      <div className="space-y-6">
        {FAQS.map((f) => (
          <div key={f.q} className="border-t border-white/10 pt-5">
            <h3 className="text-ink font-medium">{f.q}</h3>
            <p className="mt-2 text-ink/70 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
