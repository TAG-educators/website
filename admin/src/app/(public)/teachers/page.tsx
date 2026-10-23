import Link from "next/link";
import { fetchTeachers } from "@/lib/teachers";
import "../public.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Our Tutors — TAG Educators",
  description: "Meet the specialist tutors behind TAG Educators. Cambridge O Level, A Level and IGCSE experts.",
};

export default async function TeachersPage() {
  const { data: teachers } = await fetchTeachers();

  return (
    <div className="catalog-page">
      <div className="wrap">
        <div className="section-head" style={{ textAlign: "left", marginBottom: 48 }}>
          <span className="eyebrow">The Team</span>
          <h1 style={{ fontSize: "var(--fs-h2)" }}>Meet our tutors</h1>
          <p>Specialist educators who have sat these exact exams and know how to get you through them.</p>
        </div>

        {teachers.length === 0 ? (
          <div className="public-empty">
            <p>No tutors published yet.</p>
          </div>
        ) : (
          <div className="teachers-grid">
            {teachers.map((t) => (
              <Link key={t.id} href={`/teachers/${t.slug}`} className="teacher-card">
                <div className="teacher-portrait">
                  {t.photo ? (
                    <img src={t.photo} alt={t.name} />
                  ) : (
                    <span className="portrait-placeholder">{t.name.charAt(0)}</span>
                  )}
                </div>
                <div className="teacher-body">
                  <h3>{t.name}</h3>
                  <p className="teacher-subjects">{t.subjects.join(" · ")}</p>
                  <div className="teacher-meta">
                    <span>{t.yearsExperience}+ yrs</span>
                    <span className="dot">·</span>
                    <span>{t.levels.join(", ")}</span>
                  </div>
                  <span className="teacher-link">Meet {t.name.split(" ")[0]} →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
