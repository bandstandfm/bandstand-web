# Bandstand Web

Marketing website for [Bandstand Chicago](https://bandstand.fm) — hand-curated nightly listings of every live jazz show in Chicago.

## Stack
- **Next.js 15** App Router (static + ISR)
- **Tailwind CSS** with custom theme matching the iOS app
- **Vercel** hosting
- Pulls live data from the [Bandstand backend](https://github.com/bandstandfm/bandstand-app) (FastAPI + MongoDB)

## Run locally
```bash
yarn install
yarn dev
# → http://localhost:3100
```

## Required env vars
- `BANDSTAND_API` — base URL of the Bandstand FastAPI backend (default: preview URL)

## Pages
- `/` — Landing hero, today's Editor's Pick, venues grid
- `/about` — Editorial mission
- `/support` — Contact form + FAQ
- `/privacy` — Privacy Policy
- `/terms` — Terms of Service
- `/api/support` — POST proxy → backend `/api/contact`

## License
© Bandstand Chicago. All rights reserved.
