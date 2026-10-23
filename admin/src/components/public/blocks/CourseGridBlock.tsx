import Link from "next/link";
import { fetchCourses } from "@/lib/courses";
import type { Course } from "@/lib/types";

interface CourseGridData {
  title?: string;
  eyebrow?: string;
  description?: string;
  courseIds?: string[];
  columns?: "2" | "3" | "4";
  showAll?: boolean;
}

export async function CourseGridBlock({ data }: { data: Record<string, unknown> }) {
  const d = data as unknown as CourseGridData;
  const { data: allCourses } = await fetchCourses();

  let courses: Course[] = [];
  if (d.showAll) {
    courses = allCourses;
  } else if (d.courseIds?.length) {
    courses = allCourses.filter((c) => d.courseIds!.includes(c.id));
  }

  if (courses.length === 0) return null;
  const cols = d.columns ?? "3";

  return (
    <section className="public-section grid-block course-section">
      <div className="wrap">
        {(d.eyebrow || d.title) && (
          <div className="section-head">
            {d.eyebrow && <p className="section-eyebrow">{d.eyebrow}</p>}
            {d.title && <h2>{d.title}</h2>}
            {d.description && <p className="section-desc">{d.description}</p>}
          </div>
        )}
        <div className={`grid cols-${cols}`}>
          {courses.map((c) => (
            <Link key={c.id} href={`/courses/${c.slug}`} className="card course-card">
              <div className="course-card-top">
                <span className="course-level-badge">{c.level}</span>
                <span className="course-status-dot" data-status={c.status} />
              </div>
              <h3>{c.title}</h3>
              <p className="card-subject">{c.subject}</p>
              <div className="course-card-bottom">
                {c.batchSize > 0 && (
                  <span className="course-batch">Batch of {c.batchSize}</span>
                )}
                {c.price > 0 ? (
                  <span className="card-price">{c.currency} {c.price.toLocaleString()}</span>
                ) : (
                  <span className="card-price free">Free</span>
                )}
              </div>
              <span className="course-arrow" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M5 10h10m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
