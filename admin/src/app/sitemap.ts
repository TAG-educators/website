import type { MetadataRoute } from "next";
import { fetchCourses } from "@/lib/courses";
import { fetchTeachers } from "@/lib/teachers";
import { fetchPublishedBlogPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://tageducators.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/courses`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/teachers`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];

  // Dynamic course pages
  const { data: courses } = await fetchCourses();
  const coursePages: MetadataRoute.Sitemap = courses
    .filter((c) => c.status === "published")
    .map((c) => ({
      url: `${baseUrl}/courses/${c.slug}`,
      lastModified: new Date(c.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  // Dynamic teacher pages
  const { data: teachers } = await fetchTeachers();
  const teacherPages: MetadataRoute.Sitemap = teachers.map((t) => ({
    url: `${baseUrl}/teachers/${t.slug}`,
    lastModified: new Date(t.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic blog pages
  const { data: posts } = await fetchPublishedBlogPosts();
  const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...coursePages, ...teacherPages, ...blogPages];
}
