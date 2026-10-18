"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";
import { PageLayout } from "@/components/sections/page-layout";
import { FloatingSymbols } from "@/components/sections/floating-symbols";
import { courseResources as localResources } from "@/lib/resources-data";
import type { CourseResources } from "@/lib/resources-data";

type Step = "course" | "level" | "topic" | "view";

export default function ResourcesPage() {
  const prefersReducedMotion = useReducedMotion();
  const [step, setStep] = useState<Step>("course");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [selectedPdfTitle, setSelectedPdfTitle] = useState<string | null>(null);
  const [courseResources, setCourseResources] = useState<CourseResources[]>(localResources);

  useEffect(() => {
    fetch('/api/resources').then(r => r.json()).then(data => {
      if (data) setCourseResources(data);
    }).catch(() => {});
  }, []);

  const course = courseResources.find((c) => c.slug === selectedCourse);
  const levelData = course?.levels.find((l) => l.level === selectedLevel);
  const topicData = levelData?.topics.find((t) => t.topic === selectedTopic);

  const handleSelectCourse = (slug: string) => {
    setSelectedCourse(slug);
    setSelectedLevel(null);
    setSelectedTopic(null);
    setSelectedPdf(null);
    setStep("level");
  };

  const handleSelectLevel = (level: string) => {
    setSelectedLevel(level);
    setSelectedTopic(null);
    setSelectedPdf(null);
    setStep("topic");
  };

  const handleSelectTopic = (topic: string) => {
    setSelectedTopic(topic);
    setSelectedPdf(null);
    setStep("view");
  };

  const handleSelectPdf = (title: string, url: string) => {
    setSelectedPdf(url);
    setSelectedPdfTitle(title);
  };

  const resetToCourse = () => {
    setSelectedCourse(null);
    setSelectedLevel(null);
    setSelectedTopic(null);
    setSelectedPdf(null);
    setStep("course");
  };

  const resetToLevel = () => {
    setSelectedLevel(null);
    setSelectedTopic(null);
    setSelectedPdf(null);
    setStep("level");
  };

  const resetToTopic = () => {
    setSelectedTopic(null);
    setSelectedPdf(null);
    setStep("topic");
  };

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ocean-deeper pt-32 pb-20 md:pt-40 md:pb-28" data-header-theme="dark">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.04]" />
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-ocean/20 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-ocean-light/10 blur-[100px]" />
        <FloatingSymbols />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.p
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 15 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[0.78rem] font-semibold uppercase tracking-[0.16em]" style={{ color: "#b472cc" }}
          >
            Resources
          </motion.p>
          <motion.h1
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance"
          >
            Study Resources Library
          </motion.h1>
          <motion.p
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70 text-pretty"
          >
            Browse topic-wise notes, past papers and study guides. Pick a course, choose your level,
            select a topic and view or download PDFs   all in one place.
          </motion.p>
        </div>
        <div className="relative mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-2 text-[0.82rem]">
            <button onClick={resetToCourse} className="text-white/70 transition-colors hover:text-white">
              Courses
            </button>
            {selectedCourse && (
              <>
                <span className="text-white/50">/</span>
                <button
                  onClick={resetToLevel}
                  className={step === "level" ? "font-medium text-white" : "text-white/70 transition-colors hover:text-white"}
                >
                  {course?.name}
                </button>
              </>
            )}
            {selectedLevel && (
              <>
                <span className="text-white/50">/</span>
                <button
                  onClick={resetToTopic}
                  className={step === "topic" ? "font-medium text-white" : "text-white/70 transition-colors hover:text-white"}
                >
                  {selectedLevel}
                </button>
              </>
            )}
            {selectedTopic && (
              <>
                <span className="text-white/50">/</span>
                <span className="font-medium text-white">{selectedTopic}</span>
              </>
            )}
          </nav>
        </div>
        <div className="relative z-10 pb-20 pt-8 md:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Step 1: Course selection */}
          {step === "course" && (
            <div>
              <h2 className="mb-2 font-display text-2xl font-bold text-white">Choose a Course</h2>
              <p className="mb-8 text-white/70">Select a subject to browse its resources.</p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {courseResources.map((c, i) => {
                  const IconComp = Icons[c.icon as keyof typeof Icons] as Icons.LucideIcon | undefined;
                  const Fallback = Icons.BookOpen;
                  return (
                    <motion.button
                      key={c.slug}
                      onClick={() => handleSelectCourse(c.slug)}
                      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
                      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
                      transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-white p-8 shadow-premium transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:border-[#b472cc]/30 hover:shadow-premium-lg"
                    >
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-110"
                        style={{
                          background: "linear-gradient(135deg, rgba(107, 47, 120, 0.15), rgba(168, 85, 196, 0.08))",
                          color: "#b472cc",
                        }}
                      >
                        {IconComp ? <IconComp className="h-7 w-7" strokeWidth={1.5} /> : <Fallback className="h-7 w-7" strokeWidth={1.5} />}
                      </div>
                      <h3 className="text-[1.1rem] font-bold tracking-tight text-foreground">{c.name}</h3>
                      <p className="text-[0.82rem] text-muted-foreground">{c.levels.length} levels available</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Level selection */}
          {step === "level" && course && (
            <div>
              <h2 className="mb-2 font-display text-2xl font-bold text-white">
                {course.name}   Choose a Level
              </h2>
              <p className="mb-8 text-white/70">Select your class level to see available topics.</p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {course.levels.map((l, i) => (
                  <motion.button
                    key={l.level}
                    onClick={() => handleSelectLevel(l.level)}
                    initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
                    whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-6 shadow-premium transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:border-[#b472cc]/30 hover:shadow-premium-lg"
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{
                        background: "linear-gradient(135deg, rgba(107, 47, 120, 0.15), rgba(168, 85, 196, 0.08))",
                        color: "#b472cc",
                      }}
                    >
                      <Icons.GraduationCap className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-[1.05rem] font-bold tracking-tight text-foreground">{l.level}</h3>
                      <p className="text-[0.82rem] text-muted-foreground">{l.topics.length} topics</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 & 4: Topic list + PDF viewer */}
          {(step === "topic" || step === "view") && levelData && (
            <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
              {/* Left: Topics + PDFs */}
              <div>
                <h2 className="mb-2 font-display text-xl font-bold text-white">
                  {course?.name}   {selectedLevel}
                </h2>
                <p className="mb-6 text-[0.88rem] text-white/70">Select a topic to view its PDFs.</p>
                <div className="space-y-3">
                  {levelData.topics.map((t, i) => (
                    <motion.div
                      key={t.topic}
                      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
                      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1, margin: '0px 0px -40px 0px' }}
                      transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <button
                        onClick={() => handleSelectTopic(t.topic)}
                        className={`w-full rounded-xl border p-4 text-left transition-all duration-300 ${
                          selectedTopic === t.topic
                            ? "border-[#b472cc]/40 bg-[rgba(107,47,120,0.05)]"
                            : "border-border bg-white hover:border-[#b472cc]/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className={`text-[0.95rem] font-semibold ${selectedTopic === t.topic ? "text-[#b472cc]" : "text-foreground"}`}>
                            {t.topic}
                          </h3>
                          <span className="text-[0.75rem] text-muted-foreground">{t.pdfs.length} PDFs</span>
                        </div>
                      </button>

                      {/* PDF list under selected topic */}
                      {selectedTopic === t.topic && step === "view" && (
                        <div className="mt-2 ml-2 space-y-1.5 border-l-2 pl-3" style={{ borderColor: "rgba(180, 114, 204, 0.2)" }}>
                          {t.pdfs.map((pdf) => (
                            <button
                              key={pdf.title}
                              onClick={() => handleSelectPdf(pdf.title, pdf.url)}
                              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[0.85rem] transition-all ${
                                selectedPdfTitle === pdf.title
                                  ? "bg-[rgba(107,47,120,0.1)] font-medium text-[#b472cc]"
                                  : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                              }`}
                            >
                              <Icons.FileText className="h-4 w-4 shrink-0" />
                              {pdf.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right: PDF Viewer */}
              <div>
                {selectedPdf ? (
                  <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-premium">
                    {/* PDF header bar */}
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <Icons.FileText className="h-5 w-5" style={{ color: "#b472cc" }} />
                        <h3 className="text-[0.95rem] font-semibold text-foreground">{selectedPdfTitle}</h3>
                      </div>
                      <a
                        href={selectedPdf}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center gap-2 rounded-lg px-4 text-[0.82rem] font-semibold text-white transition-all hover:brightness-110 active:scale-95"
                        style={{ background: "linear-gradient(135deg, #6b2f78, #a855c4)" }}
                      >
                        <Icons.Download className="h-4 w-4" />
                        Download
                      </a>
                    </div>
                    {/* PDF viewer iframe */}
                    <div className="bg-muted/20 p-4">
                      <iframe
                        src={selectedPdf}
                        title={selectedPdfTitle || "PDF Viewer"}
                        className="h-[600px] w-full rounded-lg border border-border bg-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-border bg-white p-12 text-center">
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl"
                      style={{
                        background: "linear-gradient(135deg, rgba(107, 47, 120, 0.1), rgba(168, 85, 196, 0.05))",
                        color: "#b472cc",
                      }}
                    >
                      <Icons.FileText className="h-8 w-8" strokeWidth={1.5} />
                    </div>
                    <h3 className="mt-5 text-[1.05rem] font-semibold text-foreground">Select a PDF to view</h3>
                    <p className="mt-2 max-w-xs text-[0.88rem] text-muted-foreground">
                      Choose a topic from the left, then click on a PDF to preview it here. You can also download it.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          </div>
        </div>
      </section>

    </PageLayout>
  );
}