'use client';

import { courses } from '@/lib/courses';
import { SubjectCard } from './subject-card';

export function CoursesExplorer() {
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
      <div className="mb-12">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#b472cc] text-xs font-bold text-white">
            1
          </span>
          <h2 className="font-display text-2xl font-bold text-white">Choose your subjects</h2>
        </div>
        <p className="text-sm text-white/60">
          Select multiple subjects and multiple levels at once, then add them all to your registration.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <SubjectCard key={course.slug} course={course} />
        ))}
      </div>
    </div>
  );
}
