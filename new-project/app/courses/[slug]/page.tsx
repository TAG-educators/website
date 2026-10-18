import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageLayout } from '@/components/sections/page-layout';
import { AnimatedSection } from '@/components/sections/animated-section';
import { FloatingSymbols } from '@/components/sections/floating-symbols';
import { CourseRegistration } from '@/components/sections/course-registration';
import { getCourses, getCourseBySlug } from '@/lib/supabase-data';
import { getFaculty } from '@/lib/supabase-data';
import { courses as localCourses } from '@/lib/courses';

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const course = await getCourseBySlug(params.slug);
  if (!course) return { title: 'Course Not Found' };

  return {
    title: course.name,
    description: course.shortDescription,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      title: `${course.name}   TAG Educators`,
      description: course.shortDescription,
    },
  };
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug);
  if (!course) notFound();

  const allCourses = await getCourses();
  const relatedCourses = allCourses.filter((c) => c.slug !== course.slug).slice(0, 3);
  const faculty = await getFaculty();
  const tutor = faculty.find((f) => f.subjects.includes(course.name));

  return (
    <PageLayout>
      <section className="relative overflow-hidden bg-ocean-deeper pt-32 pb-20 md:pt-40 md:pb-28" data-header-theme="dark">
        <FloatingSymbols subject={course.slug} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="max-w-3xl">
            <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors hover:text-white">
              <span aria-hidden="true">←</span> All Courses
            </Link>
            <p className="mt-6 text-[0.78rem] font-semibold uppercase tracking-[0.16em]" style={{ color: '#b472cc' }}>Course Detail</p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">{course.name}</h1>
            <p className="mt-5 text-lg leading-relaxed text-white/70 text-pretty">{course.shortDescription}</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {course.levels.map((level) => (
                <span key={level} className="rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em]" style={{ color: '#b472cc', background: 'rgba(107, 47, 120, 0.15)', borderColor: 'rgba(180, 114, 204, 0.2)' }}>{level}</span>
              ))}
            </div>
            {tutor && (
              <Link href={`/faculty/${tutor.slug}`} className="mt-4 inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-foreground shadow-premium transition-all hover:border-[#b472cc]/50 hover:text-[#b472cc] active:scale-95">
                <svg viewBox="0 0 100 100" fill="none" style={{ width: '18px', height: '18px' }}><circle cx="50" cy="38" r="18" stroke="currentColor" strokeWidth="3" /><path d="M18 90c0-18 14-30 32-30s32 12 32 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                Taught by {tutor.name}
              </Link>
            )}
          </AnimatedSection>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 md:pt-16">
          <CourseRegistration course={course} />
        </div>

        {relatedCourses.length > 0 && (
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16">
            <AnimatedSection animation="fade-up">
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Related Courses</h2>
            </AnimatedSection>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCourses.map((rc, i) => (
                <AnimatedSection key={rc.slug} animation="fade-up" delay={i * 0.1} className="group">
                  <Link href={`/courses/${rc.slug}`} className="block h-full">
                    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white p-7 shadow-premium transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:shadow-premium-lg group-hover:border-[#b472cc]/30">
                      <div className="absolute top-0 left-0 right-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'linear-gradient(90deg, transparent, #b472cc, transparent)' }} />
                      <h3 className="text-[1.2rem] font-bold tracking-tight text-foreground">{rc.name}</h3>
                      <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">{rc.shortDescription}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[0.88rem] font-medium transition-all group-hover:gap-2.5" style={{ color: '#b472cc' }}>View course <span aria-hidden="true">→</span></span>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}
      </section>

    </PageLayout>
  );
}