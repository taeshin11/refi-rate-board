import { MetadataRoute } from 'next';
import states from '@/data/states.json';
import lenders from '@/data/lenders-fallback.json';
import loanTypes from '@/data/loan-types.json';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://refi-rate-board.vercel.app';
const locales = ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'pt'];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    routes.push({ url: `${BASE_URL}/${locale}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 });
    routes.push({ url: `${BASE_URL}/${locale}/lenders`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 });
    routes.push({ url: `${BASE_URL}/${locale}/states`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 });
    routes.push({ url: `${BASE_URL}/${locale}/loan-types`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 });
    routes.push({ url: `${BASE_URL}/${locale}/calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 });
    routes.push({ url: `${BASE_URL}/${locale}/when-to-refi`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 });
    for (const s of states) routes.push({ url: `${BASE_URL}/${locale}/states/${s.slug}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 });
    for (const l of lenders) routes.push({ url: `${BASE_URL}/${locale}/lenders/${l.slug}`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 });
    for (const lt of loanTypes) routes.push({ url: `${BASE_URL}/${locale}/loan-types/${lt.slug}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.65 });
  }

  return routes;
}
