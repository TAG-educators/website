"use client";

import { useState, useEffect } from "react";
import { PageLayout } from "@/components/sections/page-layout";
import { PageHeader } from "@/components/sections/page-header";
import { FacultyCard } from "@/components/sections/faculty-card";
import { AnimatedSection } from "@/components/sections/animated-section";
import { FloatingSymbols } from "@/components/sections/floating-symbols";
import { usePageSections, findSection, sectionVisibilityClass } from "@/hooks/use-page-sections";
import { faculty as localFaculty, type FacultyMember } from "@/lib/faculty";

type HeroData = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export default function FacultyPage() {
  const { sections, rawSections } = usePageSections("faculty");
  const heroSection = findSection(sections, "hero");
  const rawHero = rawSections.find((s) => s.type === "hero");
  const rawTeacherGrid = rawSections.find((s) => s.type === "teacherGrid");
  const heroData = heroSection?.data as HeroData | undefined;

  const [faculty, setFaculty] = useState<FacultyMember[]>(localFaculty);

  useEffect(() => {
    fetch("/api/faculty")
      .then((r) => r.json())
      .then((data) => {
        if (data) setFaculty(data);
      })
      .catch(() => {});
  }, []);

  const eyebrow = heroData?.eyebrow || "Our Faculty";
  const title = heroData?.title || "Meet Your Educators";
  const description = heroData?.description || "Every TAG tutor has sat these exact Cambridge papers and currently teaches at an O Level school or A Level college. Not a generalist matched to a subject list   a subject specialist with real exam experience.";

  return (
    <PageLayout>
      <div className="bg-ocean-deeper" data-header-theme="dark">
        {!rawHero?.hidden && (
          <div className={sectionVisibilityClass(rawHero)}>
            <PageHeader
              eyebrow={eyebrow}
              title={title}
              description={description}
              backgroundContent={<FloatingSymbols />}
            />
          </div>
        )}

        {!rawTeacherGrid?.hidden && (
          <div className={sectionVisibilityClass(rawTeacherGrid)}>
            <div className="relative z-10 mx-auto mt-12 max-w-7xl px-4 pb-20 sm:px-6 md:pb-24 lg:px-8">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {faculty.map((member) => (
                  <FacultyCard key={member.slug} member={member} />
                ))}
              </div>

              <AnimatedSection
                animation="fade-up"
                delay={0.2}
                className="mt-16 rounded-2xl border border-white/14 bg-white/5 p-8 md:p-12 backdrop-blur-sm"
              >
                <h2 className="font-display text-2xl font-bold text-white">
                  Real Classroom Experience, Real Exam Experience
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/70">
                  Every TAG tutor has sat these exact Cambridge papers and currently teaches at an
                  O Level school or A Level college. Two of our faculty are also formally Cambridge
                  certified   bringing insider knowledge of exact exam traps and mark-scheme expertise
                  to every micro-cohort session.
                </p>
              </AnimatedSection>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
