import Link from "next/link";
import { fetchCourses } from "@/lib/courses";
import type { Level } from "@/lib/types";
import "../public.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Courses — TAG Educators",
  description: "Browse Cambridge O Level, A Level, AS Level, A2 Level and IGCSE courses at TAG Educators.",
};

export default async function CoursesPage() {
  const { data: courses } = await fetchCourses();
  const published = courses.filter((c) => c.status === "published");

  // Group by level
  const levels = [...new Set(published.map((c) => c.level))] as Level[];
  const grouped: Record<string, typeof published> = {};
  for (const level of levels) {
    grouped[level] = published.filter((c) => c.level === level);
  }

  return (
    <div className="catalog-page">
      <div className="wrap">
        <div className="section-head" style={{ textAlign: "left", marginBottom: 48 }}>
          <span className="eyebrow">Academic Programs</span>
          <h1 style={{ fontSize: "var(--fs-h2)" }}>Courses</h1>
          <p>Small-batch Cambridge tutoring — O Level, A Level, and IGCSE. Browse by level below.</p>
        </div>

        {published.length === 0 ? (
          <div className="public-empty">
            <p>No courses published yet.</p>
          </div>
        ) : (
          <>
            {/* Level filter chips */}
            <div className="resource-filters">
              <span className="filter-label">Filter by level:</span>
              {levels.map((level) => (
                <a key={level} href={`#level-${level.replace(/\s+/g, "-").toLowerCase()}`} className="filter-chip">
                  {level}
                  <span className="filter-count">{grouped[level].length}</span>
                </a>
              ))}
            </div>

            {/* Course groups by level */}
            {levels.map((level) => (
              <section key={level} className="resource-group" id={`level-${level.replace(/\s+/g, "-").toLowerCase()}`}>
                <div className="section-head" style={{ textAlign: "left", marginBottom: 24 }}>
                  <span className="eyebrow">{level}</span>
                  <h2 style={{ fontSize: "1.4rem" }}>{level} Courses</h2>
                </div>
                <div className="course-grid-block">
                  {grouped[level].map((c) => (
                    <Link key={c.id} href={`/courses/${c.slug}`} className="card course-card">
                      <div className="card-top">
                        <span className="course-level-badge">{c.level}</span>
                        {c.featured && <span className="featured-star">★</span>}
                      </div>
                      <h3>{c.title}</h3>
                      <p className="card-subject">{c.subject}</p>
                      <div className="card-meta-row">
                        {c.startDate && (
                          <span className="meta-chip">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                              <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                              <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                            {new Date(c.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          </span>
                        )}
                        <span className="meta-chip">Batch of {c.batchSize}</span>
                      </div>
                      {c.price > 0 && (
                        <div className="card-price">{c.currency} {c.price.toLocaleString()}</div>
                      )}
                      <span className="card-arrow">→</span>
                    </Link>
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
