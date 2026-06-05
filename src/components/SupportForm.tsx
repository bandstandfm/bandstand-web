'use client';
import { useState } from 'react';

export default function SupportForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          topic: data.get('topic'),
          message: data.get('message'),
          // honeypot — if filled, the request is a bot
          website: data.get('website'),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('sent');
      form.reset();
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Something went wrong');
    }
  }

  if (status === 'sent') {
    return (
      <div className="mt-10 border border-brand/40 bg-brand/5 rounded-xl p-6">
        <p className="text-brand font-semibold">Got it — thank you.</p>
        <p className="text-ink/75 mt-2">We&apos;ll reply from <span className="text-brand">support@bandstand.fm</span>, usually within a day. Often sooner.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm text-ink/70">Your name</span>
          <input name="name" required type="text" autoComplete="name" className="mt-1 w-full bg-surface border border-white/10 focus:border-brand outline-none rounded-lg px-3 py-2.5 text-ink" />
        </label>
        <label className="block">
          <span className="text-sm text-ink/70">Email</span>
          <input name="email" required type="email" autoComplete="email" className="mt-1 w-full bg-surface border border-white/10 focus:border-brand outline-none rounded-lg px-3 py-2.5 text-ink" />
        </label>
      </div>
      <label className="block">
        <span className="text-sm text-ink/70">What&apos;s this about?</span>
        <select name="topic" defaultValue="general" className="mt-1 w-full bg-surface border border-white/10 focus:border-brand outline-none rounded-lg px-3 py-2.5 text-ink">
          <option value="general">General question</option>
          <option value="venue">Submit a venue / show</option>
          <option value="correction">Correction to a listing</option>
          <option value="account">Account / data deletion</option>
          <option value="press">Press / partnership</option>
        </select>
      </label>
      <label className="block">
        <span className="text-sm text-ink/70">Message</span>
        <textarea name="message" required rows={6} className="mt-1 w-full bg-surface border border-white/10 focus:border-brand outline-none rounded-lg px-3 py-2.5 text-ink"></textarea>
      </label>
      {/* Honeypot — hidden from real users, bots fill anything */}
      <input name="website" type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <button type="submit" disabled={status === 'sending'} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand text-bg font-semibold hover:bg-brandShine disabled:opacity-60 transition">
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </form>
  );
}
