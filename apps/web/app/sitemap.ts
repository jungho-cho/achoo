import type { MetadataRoute } from 'next';

const BASE = 'https://achoo.day';
const LOCALES = ['ko', 'de', 'en', 'fr'];

const PAGES = [
  { path: '', changeFrequency: 'daily' as const, priority: 1 },
  { path: '/tips', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/pollen-info', changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/allergy-types', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/seasonal-calendar', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/prevention-guide', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/dust-guide', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/faq', changeFrequency: 'monthly' as const, priority: 0.5 },
  { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of PAGES) {
    for (const locale of LOCALES) {
      const alternates: Record<string, string> = {};
      for (const alt of LOCALES) {
        alternates[alt] = `${BASE}/${alt}${page.path}`;
      }
      alternates['x-default'] = `${BASE}/en${page.path}`;

      entries.push({
        url: `${BASE}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages: alternates },
      });
    }
  }

  return entries;
}
