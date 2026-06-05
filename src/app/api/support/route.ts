import { NextResponse } from 'next/server';

// Posts the contact form to the existing Bandstand FastAPI backend, which
// stores it in MongoDB and (later) can email a digest. Honeypot field
// `website` filters bots: any value = silent 200 (so we don't tip them off).
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.website) return NextResponse.json({ ok: true });
    const required = ['name', 'email', 'message'];
    for (const k of required) {
      if (!body[k] || String(body[k]).trim().length === 0) {
        return NextResponse.json({ ok: false, error: `Missing ${k}` }, { status: 400 });
      }
    }
    const api = process.env.BANDSTAND_API || 'https://live-jazz-chicago.preview.emergentagent.com';
    const r = await fetch(`${api}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: String(body.name).slice(0, 200),
        email: String(body.email).slice(0, 200),
        topic: String(body.topic || 'general').slice(0, 50),
        message: String(body.message).slice(0, 5000),
        source: 'bandstand.fm',
      }),
    });
    if (!r.ok) {
      return NextResponse.json({ ok: false, error: `Upstream ${r.status}` }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Server error' }, { status: 500 });
  }
}
