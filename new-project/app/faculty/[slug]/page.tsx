import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { BadgeCheck, BookOpen, MessageCircle } from 'lucide-react';
import { PageLayout } from '@/components/sections/page-layout';
import { AnimatedSection } from '@/components/sections/animated-section';
import { FloatingSymbols } from '@/components/sections/floating-symbols';
import { getFacultyBySlug, getCourses } from '@/lib/supabase-data';
import { faculty as localFaculty } from '@/lib/faculty';
import { siteConfig } from '@/lib/site-config';

// Always fetch fresh teacher data so admin-panel edits (and new teachers) show up immediately.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const member = await getFacultyBySlug(params.slug);
  if (!member) return { title: 'Faculty Not Found' };

  return {
    title: member.name,
    description: member.bio,
    alternates: { canonical: `/faculty/${encodeURIComponent(member.slug)}` },
    openGraph: {
      title: `${member.name}   TAG Educators`,
      description: member.bio,
    },
  };
}

export default async function FacultyProfilePage({ params }: { params: { slug: string } }) {
  const member = await getFacultyBySlug(params.slug);
  if (!member) notFound();

  const allCourses = await getCourses();
  const taughtCourses = allCourses.filter((c) =>
    member.subjects.some((s) => s === c.name || s === 'Multiple Subjects')
  );

  return (
    <PageLayout>
      {/* Page Hero   dark purple */}
      <section className="relative overflow-hidden bg-ocean-deeper pt-32 pb-20 md:pt-40 md:pb-28" data-header-theme="dark">
        <FloatingSymbols subject={taughtCourses[0]?.slug} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[0.82rem] text-white/60">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/faculty" className="hover:text-white transition-colors">Faculty</Link>
            <span>/</span>
            <span className="text-white font-medium">{member.name}</span>
          </nav>

          <AnimatedSection animation="fade-up" delay={0.1}>
            <p
              className="mt-6 text-[0.78rem] font-semibold uppercase tracking-[0.16em]"
              style={{ color: '#b472cc' }}
            >
              {member.role}
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {member.name}
            </h1>
            <p className="mt-3 text-lg text-white/70">
              {member.subjects.join(' · ')}
            </p>
          </AnimatedSection>
        </div>
      </section>

      

      {/* Split layout — dark purple with symbols */}
      <section className="relative overflow-hidden bg-ocean-deeper pb-20 md:pb-28" data-header-theme="dark">
        <FloatingSymbols subject={taughtCourses[0]?.slug} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[380px_1fr] mt-8 md:mt-12">

            {/* Left: Photo card */}
            <AnimatedSection animation="fade-up">
              <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-premium">
                {/* Photo (placeholder icon when no photo is set) */}
                <div
                  className="relative flex aspect-[4/5] items-center justify-center overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, rgba(107, 47, 120, 0.15), rgba(168, 85, 196, 0.08))' }}
                >
                  {member.imageSrc ? (
                    <Image
                      src={member.imageSrc}
                      alt={`${member.name} profile photo`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 380px"
                      className="object-cover"
                    />
                  ) : (
                    <svg viewBox="0 0 100 100" fill="none" className="h-1/2 w-1/2" style={{ color: '#b472cc' }}>
                      <circle cx="50" cy="38" r="18" stroke="currentColor" strokeWidth="2" />
                      <path d="M18 90c0-18 14-30 32-30s32 12 32 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                {/* Card body */}
                <div className="p-6">
                  <h3 className="text-[1.15rem] font-bold tracking-tight text-foreground">{member.name}</h3>
                  <p className="mt-1 text-[0.88rem]" style={{ color: '#b472cc' }}>{member.role}</p>

                  {/* Badges */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {member.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full border px-3 py-1 text-[0.78rem] font-medium"
                        style={{
                          background: 'rgba(107, 47, 120, 0.08)',
                          borderColor: 'rgba(180, 114, 204, 0.2)',
                          color: '#b472cc',
                        }}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="mt-5 flex justify-around gap-6 border-t border-border pt-5 text-center">
                    {member.stats.map((stat) => (
                      <div key={stat.label}>
                        <div
                          className="text-[1.5rem] font-bold"
                          style={{ color: '#b472cc' }}
                        >
                          {stat.num}
                        </div>
                        <div className="text-[0.82rem] text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Right: Bio + details */}
            <AnimatedSection animation="fade-up" delay={0.15} className="pt-20 md:pt-24">
              <h2 className="font-display text-2xl font-bold text-white">
                About {member.name.split(' ')[0]}
              </h2>
              <div className="mt-4 rounded-xl border border-border bg-white p-5">
                <p className="whitespace-pre-line text-[0.95rem] leading-relaxed text-foreground">{member.bio}</p>
              </div>

              {/* Experience & Qualifications box */}
              <div className="mt-6 rounded-xl border border-border bg-white p-5">
                <p className="text-[0.82rem] text-muted-foreground">Experience</p>
                <p className="mt-1 font-medium text-foreground">{member.experience}</p>
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-[0.82rem] text-muted-foreground">Qualifications / Affiliations</p>
                  <div className="mt-2 space-y-2">
                    {member.qualifications.map((qual) => (
                      <div key={qual} className="flex items-start gap-2">
                        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: '#b472cc' }} />
                        <span className="text-[0.92rem] text-foreground">{qual}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {member.cambridgeCertified && (
                  <div className="mt-4 border-t border-border pt-4">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.82rem] font-medium"
                      style={{ background: 'rgba(107, 47, 120, 0.1)', color: '#b472cc' }}
                    >
                      <BadgeCheck className="h-4 w-4" />
                      Cambridge Certified
                    </span>
                  </div>
                )}
              </div>

              {/* What Students Learn */}
              <h3 className="mt-8 font-display text-xl font-bold text-white">What Students Learn</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {member.expertise.map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-[0.92rem] text-white/80">
                    <span style={{ color: '#b472cc' }}>✦</span>
                    {item}
                  </div>
                ))}
              </div>

              {/* Courses Taught */}
              {taughtCourses.length > 0 && (
                <>
                  <h3 className="mt-8 font-display text-xl font-bold text-white">Courses Taught</h3>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {taughtCourses.map((course) => (
                      <Link
                        key={course.slug}
                        href={`/courses/${course.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/5 px-4 py-2.5 text-[0.88rem] font-medium text-white backdrop-blur-sm transition-all hover:border-[#b472cc]/40 hover:text-[#b472cc]"
                      >
                        <BookOpen className="h-4 w-4" />
                        {course.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {/* Action buttons */}
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/courses"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-7 text-base font-semibold text-white shadow-[0_4px_16px_-4px_rgba(107,47,120,0.5)] transition-all hover:brightness-110 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #6b2f78, #a855c4)' }}
                >
                  View Courses
                </Link>
                <a
                  href={siteConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/5 px-7 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-[#b472cc] hover:text-[#b472cc] active:scale-95"
                >
                  <MessageCircle className="h-5 w-5" />
                  Ask on WhatsApp
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

    </PageLayout>
  );
}