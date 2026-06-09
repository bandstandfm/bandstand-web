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
  // break if the env var is ever absent. Currently set to the preview
  // URL because the deployed (emergent.host) instance has a separate
  // MongoDB/filesystem that's out of sync with the real admin data —
  // see chat log 2026-06-09 for the migration plan.
  env: {
    BANDSTAND_API: process.env.BANDSTAND_API || 'https://live-jazz-chicago.preview.emergentagent.com',
  },
};
export default nextConfig;
