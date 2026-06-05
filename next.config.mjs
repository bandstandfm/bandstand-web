/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  // Bandstand backend lives at this URL. Reads happen at request time via
  // ISR (revalidate: 60s) so the marketing site stays fresh without
  // hammering the API.
  env: {
    BANDSTAND_API: process.env.BANDSTAND_API || 'https://live-jazz-chicago.preview.emergentagent.com',
  },
};
export default nextConfig;
