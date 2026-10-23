import { fetchResources } from "@/lib/resources";
import type { Resource } from "@/lib/types";
import "../public.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Resources — TAG Educators",
  description: "Past papers, notes, solved papers, video lessons and guides for Cambridge O Level, A Level and IGCSE.",
};

const TYPE_ICONS: Record<string, string> = {
  "Notes": "📄",
  "Past Paper": "📋",
  "Solved Paper": "✅",
  "Video": "▶",
  "Guide": "📖",
  "Link": "🔗",
};

export default async function ResourcesPage() {
  const { data: resources } = await fetchResources();

  // Group by type
  const types = [...new Set(resources.map((r) => r.type))];
  const grouped: Record<string, Resource[]> = {};
  for (const type of types) {
    grouped[type] = resources.filter((r) => r.type === type);
  }

  return (
    <div className="catalog-page">
      <div className="wrap">
        <div className="section-head" style={{ textAlign: "left", marginBottom: 48 }}>
          <span className="eyebrow">Study Materials</span>
          <h1 style={{ fontSize: "var(--fs-h2)" }}>Resources</h1>
          <p>Past papers, notes, solved papers, video lessons and guides — all curated by our tutors.</p>
        </div>

        {resources.length === 0 ? (
          <div className="public-empty">
            <p>No resources published yet.</p>
          </div>
        ) : (
          <>
            {/* Filter chips */}
            <div className="resource-filters">
              <span className="filter-label">Browse by type:</span>
              {types.map((type) => (
                <a key={type} href={`#type-${type.replace(/\s+/g, "-").toLowerCase()}`} className="filter-chip">
                  <span className="filter-icon">{TYPE_ICONS[type] || "📄"}</span>
                  {type}
                  <span className="filter-count">{grouped[type].length}</span>
                </a>
              ))}
            </div>

            {/* Resource groups */}
            {types.map((type) => (
              <section key={type} className="resource-group" id={`type-${type.replace(/\s+/g, "-").toLowerCase()}`}>
                <div className="section-head" style={{ textAlign: "left", marginBottom: 24 }}>
                  <span className="eyebrow">{TYPE_ICONS[type] || "📄"} {type}</span>
                  <h2 style={{ fontSize: "1.4rem" }}>{type}</h2>
                </div>
                <div className="resource-grid">
                  {grouped[type].map((r) => (
                    <a
                      key={r.id}
                      href={r.url || "#"}
                      className="resource-card"
                      target={r.url ? "_blank" : undefined}
                      rel={r.url ? "noopener" : undefined}
                    >
                      <div className="resource-card-top">
                        <span className="resource-type-badge">{r.type}</span>
                        {r.featured && <span className="featured-star">★</span>}
                      </div>
                      <h3>{r.title}</h3>
                      <div className="resource-meta">
                        <span>{r.subject}</span>
                        <span className="dot">·</span>
                        <span>{r.level}</span>
                      </div>
                      <span className="resource-open">Open →</span>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
