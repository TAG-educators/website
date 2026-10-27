﻿"use client";

import { useState, useEffect } from "react";
import { PageLayout } from "@/components/sections/page-layout";
import { SubjectCard } from "@/components/sections/subject-card";
import { FloatingSymbols } from "@/components/sections/floating-symbols";
import { usePageSections, findSection, sectionVisibilityClass } from "@/hooks/use-page-sections";
import type { Course } from "@/lib/courses";
import { useSiteData } from "@/components/providers/site-data-provider";

type HeroData = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export default function CoursesPage() {
  const { sections, rawSections } = usePageSections("courses");
  const heroSection = findSection(sections, "hero");
  const rawHero = rawSections.find((s) => s.type === "hero");
  const rawCourseGrid = rawSections.find((s) => s.type === "courseGrid");
  const heroData = heroSection?.data as HeroData | undefined;

  const [courses, setCourses] = useState<Course[]>(useSiteData()?.courses ?? []);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => {
        if (data) setCourses(data);
      })
      .catch(() => {});
  }, []);

  const eyebrow = heroData?.eyebrow || "Our Courses";
  const title = heroData?.title || "Every subject has its own tutor   and its own page";
  const description = heroData?.description || "Pick a subject below to meet the tutor, see current batches, and register. All courses cover Cambridge O Level, A Level and IGCSE.";

  return (
    <PageLayout>
      <section className="relative overflow-hidden bg-ocean-deeper pt-32 pb-20 md:pt-40 md:pb-28" data-header-theme="dark">
        <FloatingSymbols />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {!rawHero?.hidden && (
            <div className={`max-w-3xl ${sectionVisibilityClass(rawHero)}`.trim()}>
              <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em]" style={{ color: "#b472cc" }}>{eyebrow}</p>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
                {title}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-white/70 text-pretty">
                {description}
              </p>
            </div>
          )}

          {!rawCourseGrid?.hidden && (
            <div className={`mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${sectionVisibilityClass(rawCourseGrid)}`.trim()}>
              {courses.map((course) => (
                <SubjectCard key={course.slug} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
