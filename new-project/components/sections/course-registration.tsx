'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ShoppingCart, MessageCircle, Check } from 'lucide-react';
import Link from 'next/link';
import { CourseOptions } from '@/components/sections/course-options';
import { useCart } from '@/components/providers/cart-provider';
import { advanceVoyageStage } from '@/components/sections/voyage-tracker';
import type { Course } from '@/lib/courses';
import { siteConfig } from '@/lib/site-config';

type BatchSchedule = {
  days: string;
  timeUTC: string;
  durationMins: number;
};

const batchSchedules: BatchSchedule[] = [
  { days: 'Mon & Wed', timeUTC: '14:00', durationMins: 90 },
  { days: 'Tue & Thu', timeUTC: '16:00', durationMins: 90 },
  { days: 'Sat', timeUTC: '09:00', durationMins: 120 },
];

function convertToLocal(timeUTC: string): { time: string; tz: string } {
  const [hours, minutes] = timeUTC.split(':').map(Number);
  const now = new Date();
  const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hours, minutes));
  const localTime = utcDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
  const tzShort = tz.split('/').pop()?.replace('_', ' ') || 'Local';
  return { time: localTime, tz: tzShort };
}

export function CourseRegistration({ course }: { course: Course }) {
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedSubLevels, setSelectedSubLevels] = useState<string[]>([]);
  const [flyAnimation, setFlyAnimation] = useState<{ id: number; from: DOMRect; to: DOMRect } | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string>(siteConfig.whatsappUrl);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const addButtonRefMobile = useRef<HTMLButtonElement>(null);
  const viewCartRef = useRef<HTMLAnchorElement>(null);
  const viewCartRefMobile = useRef<HTMLAnchorElement>(null);
  const levelCardsRef = useRef<HTMLDivElement>(null);
  const { addItem, hasItem, itemCount } = useCart();

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data?.phone) {
          setWhatsappUrl(`https://wa.me/${data.phone.replace(/[^0-9]/g, '')}`);
        }
      })
      .catch(() => {});
  }, []);

  const hasSubLevels = selectedLevels.some((lvl) => course.subLevels?.[lvl]);

  const toggleLevel = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const toggleSubLevel = (subLevel: string) => {
    setSelectedSubLevels((prev) =>
      prev.includes(subLevel) ? prev.filter((s) => s !== subLevel) : [...prev, subLevel]
    );
  };

  const handleAdd = (fromRef: React.RefObject<HTMLElement | null>) => {
    if (selectedLevels.length === 0) return;
    if (hasSubLevels && selectedSubLevels.length === 0) return;

    let addedCount = 0;
    selectedLevels.forEach((level) => {
      const subs = course.subLevels?.[level] ?? [];
      if (subs.length > 0) {
        selectedSubLevels.forEach((sub) => {
          const effectiveSelection = `${level} — ${sub}`;
          const key = `${course.slug}-${effectiveSelection}`;
          if (!hasItem(key)) {
            const idx = course.levels.indexOf(level);
            const batch = idx >= 0 ? batchSchedules[idx] : null;
            const local = batch ? convertToLocal(batch.timeUTC) : null;
            addItem({
              slug: course.slug,
              name: course.name,
              levels: course.levels,
              selectedLevel: effectiveSelection,
              batchDays: batch?.days,
              batchTime: local?.time,
              batchDuration: batch?.durationMins,
            });
            addedCount++;
          }
        });
      } else {
        const key = `${course.slug}-${level}`;
        if (!hasItem(key)) {
          const idx = course.levels.indexOf(level);
          const batch = idx >= 0 ? batchSchedules[idx] : null;
          const local = batch ? convertToLocal(batch.timeUTC) : null;
          addItem({
            slug: course.slug,
            name: course.name,
            levels: course.levels,
            selectedLevel: level,
            batchDays: batch?.days,
            batchTime: local?.time,
            batchDuration: batch?.durationMins,
          });
          addedCount++;
        }
      }
    });

    // Trigger fall animation from the level cards area to the View Cart link
    if (addedCount > 0 && levelCardsRef.current) {
      const fromRect = levelCardsRef.current.getBoundingClientRect();
      const targetEl = (fromRef === addButtonRefMobile ? viewCartRefMobile.current : viewCartRef.current) ?? viewCartRef.current;
      if (targetEl) {
        const toRect = targetEl.getBoundingClientRect();
        setFlyAnimation({ id: Date.now(), from: fromRect, to: toRect });
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
      }
    }

    setSelectedLevels([]);
    setSelectedSubLevels([]);
    advanceVoyageStage(3);
  };

  const canAdd = selectedLevels.length > 0 && (!hasSubLevels || selectedSubLevels.length > 0);
  const allAdded = selectedLevels.length === 0;

  return (
    <div className="cart-registration-layout grid items-start gap-8 lg:grid-cols-3">
      {/* Left: level cards + course content */}
      <div className="lg:col-span-2">
        <div ref={levelCardsRef}>
          <CourseOptions
            course={course}
            selectedLevels={selectedLevels}
            onToggleLevel={toggleLevel}
            selectedSubLevels={selectedSubLevels}
            onToggleSubLevel={toggleSubLevel}
          />
        </div>

        {/* Mobile registration — right after level cards, hidden on desktop */}
        <div className="lg:hidden mb-16">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-premium">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#b472cc] text-xs font-bold text-white">2</span>
              <h3 className="font-display text-lg font-bold text-foreground">Register</h3>
            </div>
            {selectedLevels.length > 0 ? (
              <div className="mt-4 rounded-xl border border-[#b472cc]/20 bg-[#b472cc]/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{course.name}</span>
                  <span className="rounded-full bg-[#b472cc]/15 px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-[#b472cc]">
                    {selectedLevels.length} {selectedLevels.length === 1 ? 'level' : 'levels'}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedLevels.map((lvl) => (
                    <span key={lvl} className="rounded-full bg-[#b472cc]/10 px-2 py-0.5 text-[0.72rem] font-medium text-[#b472cc]">
                      {lvl}
                    </span>
                  ))}
                  {selectedSubLevels.map((sub) => (
                    <span key={sub} className="rounded-full bg-[#b472cc]/10 px-2 py-0.5 text-[0.72rem] font-medium text-[#b472cc]">
                      {sub}
                    </span>
                  ))}
                </div>
                {hasSubLevels && selectedSubLevels.length === 0 && (
                  <p className="mt-2 text-[0.78rem] text-[#b472cc]">Now choose a subject above.</p>
                )}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border-2 border-dashed border-border p-4 text-center">
                <p className="text-sm text-muted-foreground">Select levels to register</p>
              </div>
            )}
            <div className="mt-4 flex flex-col gap-3">
              <button ref={addButtonRefMobile} onClick={() => handleAdd(addButtonRefMobile)} disabled={!canAdd}
                className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-7 text-base font-semibold transition-all active:scale-95 ${canAdd ? 'text-white shadow-[0_4px_16px_-4px_rgba(107,47,120,0.5)] hover:brightness-110' : 'border border-border bg-muted/20 text-muted-foreground cursor-not-allowed'}`}
                style={canAdd ? { background: 'linear-gradient(135deg, #6b2f78, #a855c4)' } : {}}>
                {justAdded ? (<><Check className="h-5 w-5" />Added!</>) : (<><Plus className="h-5 w-5" />Add to Registration</>)}
              </button>
              <Link ref={viewCartRefMobile} href="/cart" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-white px-7 text-base font-semibold text-foreground transition-all hover:border-[#b472cc] hover:text-[#b472cc] active:scale-95">
                <ShoppingCart className="h-5 w-5" />View Cart
                {itemCount > 0 && (
                  <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b472cc] px-1.5 text-[0.72rem] font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold text-white">What You&apos;ll Learn</h2>
          <div className="mt-6 flex flex-col gap-4">
            {course.topics.map((topic, i) => (
              <div key={topic} className="rounded-2xl border border-border bg-white p-6 shadow-premium transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:border-[#b472cc]/20 hover:shadow-premium-lg">
                <h3 className="text-[1.05rem] font-bold tracking-tight text-foreground">{i + 1}. {topic}</h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-muted-foreground">{course.whatYouWillLearn[i] || course.shortDescription}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold text-white">Course Structure</h2>
          <div className="mt-6 flex flex-col gap-4">
            {course.benefits.map((benefit, i) => (
              <div key={benefit} className="rounded-2xl border border-border bg-white p-6 shadow-premium transition-[border-color,box-shadow] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:border-[#b472cc]/20 hover:shadow-premium-lg">
                <h3 className="text-[1.05rem] font-bold tracking-tight text-foreground">{benefit}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: sticky registration sidebar — desktop only */}
      <div className="hidden lg:block lg:col-span-1 course-registration-sidebar">
        <div className="space-y-6">
          {/* Registration card */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-premium">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#b472cc] text-xs font-bold text-white">
                2
              </span>
              <h3 className="font-display text-lg font-bold text-foreground">Register</h3>
            </div>

            {/* Live summary or empty state */}
            {selectedLevels.length > 0 ? (
              <div className="mt-4 rounded-xl border border-[#b472cc]/20 bg-[#b472cc]/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{course.name}</span>
                  <span className="rounded-full bg-[#b472cc]/15 px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-[#b472cc]">
                    {selectedLevels.length} {selectedLevels.length === 1 ? 'level' : 'levels'}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedLevels.map((lvl) => (
                    <span key={lvl} className="rounded-full bg-[#b472cc]/10 px-2 py-0.5 text-[0.72rem] font-medium text-[#b472cc]">
                      {lvl}
                    </span>
                  ))}
                  {selectedSubLevels.map((sub) => (
                    <span key={sub} className="rounded-full bg-[#b472cc]/10 px-2 py-0.5 text-[0.72rem] font-medium text-[#b472cc]">
                      {sub}
                    </span>
                  ))}
                </div>
                {hasSubLevels && selectedSubLevels.length === 0 && (
                  <p className="mt-2 text-[0.78rem] text-[#b472cc]">Now choose a subject above.</p>
                )}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border-2 border-dashed border-border p-4 text-center">
                <p className="text-sm text-muted-foreground">Select levels to register</p>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-4 flex flex-col gap-3">
              <button
                ref={addButtonRef}
                onClick={() => handleAdd(addButtonRef)}
                disabled={!canAdd}
                className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-7 text-base font-semibold transition-all active:scale-95 ${
                  canAdd
                    ? 'text-white shadow-[0_4px_16px_-4px_rgba(107,47,120,0.5)] hover:brightness-110'
                    : 'border border-border bg-muted/20 text-muted-foreground cursor-not-allowed'
                }`}
                style={canAdd ? { background: 'linear-gradient(135deg, #6b2f78, #a855c4)' } : {}}
              >
                {justAdded ? (
                  <><Check className="h-5 w-5" />Added!</>
                ) : (
                  <><Plus className="h-5 w-5" />Add to Registration</>
                )}
              </button>
              <Link
                ref={viewCartRef}
                href="/cart"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-white px-7 text-base font-semibold text-foreground transition-all hover:border-[#b472cc] hover:text-[#b472cc] active:scale-95"
              >
                <ShoppingCart className="h-5 w-5" />
                View Cart
                {itemCount > 0 && (
                  <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b472cc] px-1.5 text-[0.72rem] font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Course Info */}
          <div className="rounded-2xl border border-border bg-white p-6 shadow-premium">
            <h3 className="font-display text-lg font-bold text-foreground">Course Info</h3>
            <dl className="mt-5 space-y-4">
              <div className="flex items-center justify-between"><dt className="text-sm text-muted-foreground">Levels</dt><dd className="text-sm font-medium text-foreground">{course.levels.join(', ')}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-sm text-muted-foreground">Format</dt><dd className="text-sm font-medium text-foreground">Live Online</dd></div>
              <div className="flex items-center justify-between"><dt className="text-sm text-muted-foreground">Batch Size</dt><dd className="text-sm font-medium text-foreground">Small-batch</dd></div>
              <div className="flex items-center justify-between"><dt className="text-sm text-muted-foreground">Category</dt><dd className="text-sm font-medium text-foreground">{course.category}</dd></div>
            </dl>
          </div>

          {/* Questions */}
          <div className="rounded-2xl border border-[#b472cc]/20 bg-white p-6 shadow-premium" style={{ background: 'linear-gradient(135deg, rgba(107, 47, 120, 0.04), rgba(168, 85, 196, 0.02))' }}>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-[#b472cc]" />
              <h3 className="text-base font-bold" style={{ color: '#b472cc' }}>Questions About This Course?</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Message us on WhatsApp to learn more about batch timings, pricing and availability.</p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 text-sm font-semibold text-foreground transition-all hover:border-[#b472cc] hover:text-[#b472cc] active:scale-95">
              <MessageCircle className="h-4 w-4" /> Message us on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Falling card animation — gently drops from level cards into View Cart */}
      <AnimatePresence>
        {flyAnimation && (
          <motion.div
            key={flyAnimation.id}
            initial={{
              position: 'fixed',
              left: flyAnimation.from.left + flyAnimation.from.width / 2 - 60,
              top: flyAnimation.from.top + flyAnimation.from.height / 2 - 30,
              width: 120,
              height: 60,
              scale: 1,
              opacity: 0.95,
              rotate: 0,
              zIndex: 9999,
            }}
            animate={{
              left: flyAnimation.to.left + flyAnimation.to.width / 2 - 60,
              top: flyAnimation.to.top + flyAnimation.to.height / 2 - 30,
              scale: 0.3,
              opacity: 0,
              rotate: -8,
            }}
            transition={{
              duration: 0.9,
              ease: [0.34, 1.56, 0.64, 1],
              opacity: { duration: 0.9, ease: 'easeIn' },
            }}
            onAnimationComplete={() => setFlyAnimation(null)}
            className="pointer-events-none flex items-center justify-center gap-2 rounded-2xl shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #6b2f78, #a855c4)',
              color: '#fff',
            }}
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="text-sm font-bold">Added!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
