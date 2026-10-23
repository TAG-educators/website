import Link from "next/link";
import { fetchTeachers } from "@/lib/teachers";

interface TeacherGridData {
  title?: string;
  eyebrow?: string;
  description?: string;
  teacherIds?: string[];
  columns?: "2" | "3" | "4";
  showAll?: boolean;
}

export async function TeacherGridBlock({ data }: { data: Record<string, unknown> }) {
  const d = data as unknown as TeacherGridData;
  const { data: allTeachers } = await fetchTeachers();

  let teachers = allTeachers;
  if (!d.showAll && d.teacherIds?.length) {
    teachers = allTeachers.filter((t) => d.teacherIds!.includes(t.id));
  }

  if (teachers.length === 0) return null;
  const cols = d.columns ?? "3";

  return (
    <section className="public-section grid-block teacher-section">
      <div className="wrap">
        {(d.eyebrow || d.title) && (
          <div className="section-head">
            {d.eyebrow && <p className="section-eyebrow">{d.eyebrow}</p>}
            {d.title && <h2>{d.title}</h2>}
            {d.description && <p className="section-desc">{d.description}</p>}
          </div>
        )}
        <div className={`grid cols-${cols}`}>
          {teachers.map((t) => (
            <Link key={t.id} href={`/teachers/${t.slug}`} className="card teacher-card">
              <div className="teacher-photo-wrap">
                {t.photo ? (
                  <img src={t.photo} alt={t.name} className="teacher-photo" />
                ) : (
                  <div className="teacher-photo-placeholder">
                    {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                )}
              </div>
              <h3>{t.name}</h3>
              {t.subjects.length > 0 && (
                <p className="teacher-subjects-line">{t.subjects.slice(0, 3).join(" · ")}</p>
              )}
              <p className="card-desc">{t.description}</p>
              {t.yearsExperience > 0 && (
                <div className="teacher-exp">{t.yearsExperience}+ years teaching</div>
              )}
              <span className="teacher-link">Meet {t.name.split(" ")[0]} →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
