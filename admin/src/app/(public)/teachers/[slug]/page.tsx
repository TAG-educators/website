import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchTeacherBySlug, fetchTeachers } from "@/lib/teachers";
import { fetchCourses } from "@/lib/courses";
import { fetchTestimonials } from "@/lib/testimonials";
import "../../public.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: teacher } = await fetchTeacherBySlug(slug);
  if (!teacher) return { title: "Tutor not found" };
  return {
    title: `${teacher.name} — TAG Educators`,
    description: `${teacher.name}: ${teacher.subjects.join(", ")}. ${teacher.yearsExperience}+ years teaching Cambridge exams.`,
  };
}

export default async function TeacherDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: teacher } = await fetchTeacherBySlug(slug);

  if (!teacher) notFound();

  const [coursesResult, testimonialsResult, allTeachersResult] = await Promise.all([
    fetchCourses(),
    fetchTestimonials(),
    fetchTeachers(),
  ]);

  const courses = coursesResult.data.filter(
    (c) => c.teacherIds.includes(teacher.id) && c.status === "published"
  );
  const testimonials = testimonialsResult.data.filter((t) =>
    teacher.subjects.some((s) => t.course.toLowerCase().includes(s.toLowerCase()))
  ).slice(0, 3);
  const otherTeachers = allTeachersResult.data
    .filter((t) => t.id !== teacher.id)
    .slice(0, 3);

  return (
    <div className="teacher-detail-page">
      {/* Hero */}
      <section className="teacher-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/teachers">Tutors</Link>
            <span className="sep">/</span>
            <span className="current">{teacher.name}</span>
          </div>
          <div className="teacher-hero-grid">
            <div className="teacher-portrait-large">
              {teacher.photo ? (
                <img src={teacher.photo} alt={teacher.name} />
              ) : (
                <span className="portrait-placeholder-large">{teacher.name.charAt(0)}</span>
              )}
            </div>
            <div className="teacher-hero-info">
              <span className="eyebrow">Your Tutor</span>
              <h1>{teacher.name}</h1>
              <p className="teacher-subjects-line">{teacher.subjects.join(" · ")}</p>
              <div className="teacher-stats-row">
                <div className="teacher-stat">
                  <span className="stat-value">{teacher.yearsExperience}+</span>
                  <span className="stat-label">Years Teaching</span>
                </div>
                <div className="teacher-stat">
                  <span className="stat-value">{teacher.levels.length}</span>
                  <span className="stat-label">Levels</span>
                </div>
                <div className="teacher-stat">
                  <span className="stat-value">{courses.length}</span>
                  <span className="stat-label">Courses</span>
                </div>
              </div>
              <div className="teacher-levels">
                {teacher.levels.map((l) => (
                  <span key={l} className="level-chip">{l}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="teacher-bio-section">
        <div className="wrap">
          <div className="section-head" style={{ textAlign: "left" }}>
            <span className="eyebrow">About</span>
            <h2>Biography</h2>
          </div>
          <div className="teacher-bio">
            <p>{teacher.description}</p>
          </div>
        </div>
      </section>

      {/* Courses */}
      {courses.length > 0 && (
        <section className="teacher-section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Teaching</span>
              <h2>Courses by {teacher.name}</h2>
            </div>
            <div className="teacher-courses">
              {courses.map((c) => (
                <Link key={c.id} href={`/courses/${c.slug}`} className="related-course-card">
                  <span className="course-level-badge">{c.level}</span>
                  <h3>{c.title}</h3>
                  <p>{c.subject}</p>
                  {c.price > 0 && <span className="course-price-small">{c.currency} {c.price.toLocaleString()}</span>}
                  <span className="related-arrow">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="teacher-section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Student Results</span>
              <h2>What students say</h2>
            </div>
            <div className="course-testimonials">
              {testimonials.map((t) => (
                <div key={t.id} className="mini-testimonial">
                  <span className="quote-mark">&ldquo;</span>
                  <p>{t.quote}</p>
                  <div className="testimonial-footer">
                    <strong>{t.studentName}</strong>
                    <span className="result-badge">{t.result}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other tutors */}
      {otherTeachers.length > 0 && (
        <section className="teacher-section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Meet More</span>
              <h2>Other tutors</h2>
            </div>
            <div className="teachers-grid">
              {otherTeachers.map((t) => (
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
                    <span className="teacher-link">Meet {t.name.split(" ")[0]} →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
