import { fetchPageBySlug } from "@/lib/pages";
import { SectionRenderer } from "@/components/public/SectionRenderer";
import "../public.css";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const { data: page } = await fetchPageBySlug("about");

  if (!page || page.sections.length === 0) {
    return (
      <div className="public-empty">
        <div className="wrap">
          <h2>About TAG Educators</h2>
          <p>The about page hasn't been published yet. Add sections in the admin Page Builder to see them here.</p>
          <p style={{ marginTop: 16 }}>
            <a href="/admin/pages" className="btn-primary">
              Go to Page Builder
            </a>
          </p>
        </div>
      </div>
    );
  }

  return <SectionRenderer sections={page.sections} />;
}
