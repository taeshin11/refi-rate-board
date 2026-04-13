import { MetadataRoute } from 'next';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://refi-rate-board.vercel.app';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
