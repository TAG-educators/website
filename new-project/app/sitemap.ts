import type { MetadataRoute } from 'next';
import { courses } from '@/lib/courses';
import { faculty } from '@/lib/faculty';
import { resources } from '@/lib/resources';
import { siteConfig } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/courses`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/faculty`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/resources`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/cart`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const coursePages: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${base}/courses/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const facultyPages: MetadataRoute.Sitemap = faculty.map((f) => ({
    url: `${base}/faculty/${f.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const resourcePages: MetadataRoute.Sitemap = resources.map((r) => ({
    url: `${base}/resources/${r.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticPages, ...coursePages, ...facultyPages, ...resourcePages];
}
