/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  // Bandstand backend lives at this URL. The Vercel env var BANDSTAND_API
  // takes precedence; this default exists only so the build doesn't
  // break if the env var is ever absent.
  //
  // NOTE: This USED to point at live-jazz-chicago.preview.emergentagent.com
  // because the deployed emergent.host instance had a separate MongoDB out
  // of sync with admin data. The preview environment was decommissioned
  // in July 2026 and now serves a "Loading..." placeholder, which broke
  // the Vercel build (see commit cb73be6 for the incident write-up).
  // emergent.host is now the single source of truth for both the mobile
  // app and this marketing site.
  env: {
    BANDSTAND_API: process.env.BANDSTAND_API || 'https://live-jazz-chicago.emergent.host',
  },
};
export default nextConfig;
