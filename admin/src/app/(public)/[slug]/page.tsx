import { notFound } from "next/navigation";
import { fetchPageBySlug } from "@/lib/pages";
import { SectionRenderer } from "@/components/public/SectionRenderer";
import "../public.css";

export const dynamic = "force-dynamic";

// Reserved slugs handled by dedicated routes
const RESERVED = new Set([
  "courses",
  "about",
  "admin",
  "teachers",
  "resources",
  "faq",
  "contact",
  "cart",
  "register",
  "blog",
]);

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  if (RESERVED.has(slug)) {
    notFound();
  }

  const { data: page } = await fetchPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return <SectionRenderer sections={page.sections} />;
}
