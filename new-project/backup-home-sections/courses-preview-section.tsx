'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { courses } from '@/lib/courses';
import { CourseCard } from './course-card';

export function CoursesPreviewSection() {
  const prefersReducedMotion = useReducedMotion();
  const previewCourses = courses.slice(0, 3);

  return (
    <section className="relative bg-[#faf8fb] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p
            className="text-[0.78rem] font-semibold uppercase tracking-[0.16em]"
            style={{ color: '#b472cc' }}
          >
            Explore
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-balance">
            Explore Our Courses
          </h2>
          <p className="mt-3 text-[1.05rem] leading-relaxed text-muted-foreground text-pretty">
            Small-batch, specialist-led courses across O Level, A Level and IGCSE   every subject taught by tutors who&apos;ve sat these exact exams.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previewCourses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-[#b472cc] hover:text-[#b472cc] active:scale-95"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </section>
  );
}
