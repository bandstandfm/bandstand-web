/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  // Bandstand backend lives at the *deployed* URL (always-on, 24/7). The
  // *.preview.emergentagent.com URL is the dev sandbox that sleeps on
  // idle — never point production traffic at it. The Vercel env var
  // takes precedence; this default exists so the build doesn't break
  // if the env var is ever absent.
  env: {
    BANDSTAND_API: process.env.BANDSTAND_API || 'https://live-jazz-chicago.emergent.host',
  },
};
export default nextConfig;
