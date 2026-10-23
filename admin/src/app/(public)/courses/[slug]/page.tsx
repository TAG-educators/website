import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchCourses, fetchCourseBySlug } from "@/lib/courses";
import { fetchTeachers } from "@/lib/teachers";
import { fetchTestimonials } from "@/lib/testimonials";
import { fetchResources } from "@/lib/resources";
import { fetchFaqs } from "@/lib/faqs";
import { AddToCartButton } from "@/components/public/AddToCartButton";
import "../../public.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: course } = await fetchCourseBySlug(slug);
  if (!course) return { title: "Course not found" };
  return {
    title: `${course.title} — TAG Educators`,
    description: `${course.level} ${course.subject}. ${course.title} at TAG Educators.`,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: course } = await fetchCourseBySlug(slug);

  if (!course) notFound();

  // Fetch related data in parallel
  const [teachersResult, testimonialsResult, resourcesResult, faqsResult, allCoursesResult] =
    await Promise.all([
      fetchTeachers(),
      fetchTestimonials(),
      fetchResources(),
      fetchFaqs(),
      fetchCourses(),
    ]);

  const teachers = teachersResult.data.filter((t) => course.teacherIds.includes(t.id));
  const testimonials = testimonialsResult.data.filter((t) =>
    t.course.toLowerCase().includes(course.subject.toLowerCase()) ||
    t.course.toLowerCase().includes(course.title.toLowerCase())
  ).slice(0, 3);
  const resources = resourcesResult.data.filter(
    (r) => r.subject === course.subject && r.level === course.level
  ).slice(0, 4);
  const faqs = faqsResult.data.filter(
    (f) => f.category.toLowerCase().includes("course") || f.category.toLowerCase().includes("enrollment")
  ).slice(0, 5);
  const relatedCourses = allCoursesResult.data
    .filter((c) => c.id !== course.id && c.level === course.level && c.status === "published")
    .slice(0, 3);

  return (
    <div className="course-detail-page">
      {/* Hero */}
      <section className="course-hero">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/courses">Courses</Link>
            <span className="sep">/</span>
            <span className="current">{course.title}</span>
          </div>
          <div className="course-hero-grid">
            <div className="course-hero-left">
              <span className="course-level-badge">{course.level}</span>
              <h1>{course.title}</h1>
              <p className="course-subject">{course.subject}</p>
              <div className="course-meta-row">
                {course.startDate && (
                  <span className="meta-chip">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    Starts {new Date(course.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                )}
                <span className="meta-chip">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  Batch of {course.batchSize}
                </span>
                {course.featured && (
                  <span className="meta-chip featured">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6z" fill="currentColor" />
                    </svg>
                    Featured
                  </span>
                )}
              </div>
            </div>
            <div className="course-hero-right">
              <div className="course-price-card">
                {course.price > 0 ? (
                  <>
                    <span className="price-label">Course Fee</span>
                    <span className="price-amount">{course.currency} {course.price.toLocaleString()}</span>
                  </>
                ) : (
                  <span className="price-label">Enquire for pricing</span>
                )}
                <AddToCartButton course={course} />
                <Link href={`/register?course=${course.slug}`} className="btn-ghost course-secondary">
                  Enroll Now
                </Link>
                <Link href="/contact" className="btn-ghost course-secondary">Ask a Question</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers */}
      {teachers.length > 0 && (
        <section className="course-section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Your Tutor{teachers.length > 1 ? "s" : ""}</span>
              <h2>Taught by specialist{teachers.length > 1 ? "s" : ""}</h2>
            </div>
            <div className="course-teachers">
              {teachers.map((t) => (
                <Link key={t.id} href={`/teachers/${t.slug}`} className="course-teacher-card">
                  <div className="teacher-avatar">
                    {t.photo ? (
                      <img src={t.photo} alt={t.name} />
                    ) : (
                      <span className="avatar-placeholder">{t.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="teacher-info">
                    <h3>{t.name}</h3>
                    <p>{t.subjects.join(", ")}</p>
                    <span className="teacher-exp">{t.yearsExperience}+ years teaching</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Resources */}
      {resources.length > 0 && (
        <section className="course-section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Materials</span>
              <h2>Resources for this course</h2>
            </div>
            <div className="course-resources">
              {resources.map((r) => (
                <a
                  key={r.id}
                  href={r.url || "#"}
                  className="resource-chip"
                  target={r.url ? "_blank" : undefined}
                  rel={r.url ? "noopener" : undefined}
                >
                  <span className="resource-type">{r.type}</span>
                  <span className="resource-title">{r.title}</span>
                  <svg className="go-arc" viewBox="0 0 20 14" fill="none">
                    <path className="horizon" d="M0 7h18" />
                    <path className="sun" d="M14 1l4 6-4 6" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="course-section">
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

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="course-section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Questions</span>
              <h2>Common questions about this course</h2>
            </div>
            <div className="course-faqs">
              {faqs.map((f) => (
                <details key={f.id} className="faq-item">
                  <summary>
                    {f.question}
                    <span className="faq-toggle">+</span>
                  </summary>
                  <p>{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related courses */}
      {relatedCourses.length > 0 && (
        <section className="course-section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Explore More</span>
              <h2>Other {course.level} courses</h2>
            </div>
            <div className="course-related">
              {relatedCourses.map((c) => (
                <Link key={c.id} href={`/courses/${c.slug}`} className="related-course-card">
                  <span className="course-level-badge">{c.level}</span>
                  <h3>{c.title}</h3>
                  <p>{c.subject}</p>
                  <span className="related-arrow">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
