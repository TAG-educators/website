'use client';

import { useState, useEffect } from 'react';
import { FloatingSymbols } from '@/components/sections/floating-symbols';
import { usePageSections, findSection } from '@/hooks/use-page-sections';

const courseGroups = [
  [
    { icon: 'atom', label: 'Physics', title: 'Mechanics & Waves', meta: 'O Level · A Level · IGCSE' },
    { icon: 'flask', label: 'Chemistry', title: 'Organic Reactions', meta: 'O Level · A Level · IGCSE' },
    { icon: 'math', label: 'Mathematics', title: 'Calculus & Algebra', meta: 'O Level · A Level · IGCSE' },
    { icon: 'bio', label: 'Biology', title: 'Genetics & Cells', meta: 'O Level · A Level · IGCSE' },
  ],
  [
    { icon: 'cs', label: 'Computer Science', title: 'Programming & Algorithms', meta: 'O Level · A Level · IGCSE' },
    { icon: 'business', label: 'Business Studies', title: 'Marketing & Strategy', meta: 'O Level · A Level · IGCSE' },
    { icon: 'economics', label: 'Economics', title: 'Supply & Demand', meta: 'O Level · A Level · IGCSE' },
    { icon: 'accounts', label: 'Accounts', title: 'Financial Statements', meta: 'O Level · A Level' },
  ],
];

const iconPaths: Record<string, string> = {
  atom: '<circle cx="12" cy="12" r="2.4" fill="currentColor"/><ellipse cx="12" cy="12" rx="9" ry="3.6" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="9" ry="3.6" stroke="currentColor" stroke-width="1.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.6" stroke="currentColor" stroke-width="1.5" transform="rotate(120 12 12)"/>',
  flask: '<path d="M9 3h6M10 3v5l-5.5 9c-.8 1.4.2 3 1.8 3h11.4c1.6 0 2.6-1.6 1.8-3L14 8V3" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 15h8" stroke="currentColor" stroke-width="1.6"/>',
  math: '<path d="M5 6h14M9 6c0 6-2 11-4 12M13 6c1.5 3 1 8 3 12M8 12h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  bio: '<path d="M12 2a4 4 0 014 4c0 2-1 3-2 4s-2 2-2 4v2M12 18v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>',
  cs: '<rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M8 9h8M8 13h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  business: '<path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
  economics: '<path d="M3 17l6-6 4 4 8-8M14 7h7v7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
  accounts: '<path d="M4 4h16v16H4zM4 9h16M9 9v11" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
};

const cardPositions = [
  { top: '20px', left: '0', bottom: undefined, right: undefined },
  { top: '120px', left: undefined, bottom: undefined, right: '0' },
  { top: undefined, left: '20px', bottom: '120px', right: undefined },
  { top: undefined, left: undefined, bottom: '20px', right: '10px' },
];

export function Hero() {
  const [groupIndex, setGroupIndex] = useState(0);
  const { sections, rawSections } = usePageSections('home');
  const heroSection = findSection(sections, 'hero');
  const rawHero = rawSections.find((s) => s.type === 'hero');
  const heroData = heroSection?.data as { eyebrow?: string; title?: string; description?: string; primaryCta?: { label?: string; href?: string }; secondaryCta?: { label?: string; href?: string } } | undefined;

  useEffect(() => {
    const interval = setInterval(() => {
      setGroupIndex((prev) => (prev + 1) % courseGroups.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const eyebrow = heroData?.eyebrow || 'The Ark Global Educators';
  const title = heroData?.title || 'Learn From Experts.\nBuild Your Future.';
  const description = heroData?.description || 'TAG Educators matches O Level, A Level and IGCSE students with specialist tutors in small, focused batches   live online, wherever in the world you are.';
  const primaryCta = heroData?.primaryCta;
  const secondaryCta = heroData?.secondaryCta;

  // Respect the CMS visibility flags set in the admin Page Builder.
  const isHidden = rawHero?.hidden;
  const desktopVisible = rawHero?.desktopVisible !== false;
  const mobileVisible = rawHero?.mobileVisible !== false;
  if (isHidden) return null;

  const visibilityClass = [
    desktopVisible ? '' : 'cms-hidden-desktop',
    mobileVisible ? '' : 'cms-hidden-mobile',
  ].filter(Boolean).join(' ');

  return (
    <section className={`hero ${visibilityClass}`.trim()} data-header-theme="dark">
      <div className="hero-bg" aria-hidden="true" />
      <FloatingSymbols />
      <div className="hero-waves" aria-hidden="true">
        <div className="wave-layer wave-back">
          <svg viewBox="0 0 1200 200" preserveAspectRatio="none"><path d="M0,100 C150,150 350,50 600,100 C850,150 1050,50 1200,100 L1200,200 L0,200 Z" /></svg>
          <svg viewBox="0 0 1200 200" preserveAspectRatio="none"><path d="M0,100 C150,150 350,50 600,100 C850,150 1050,50 1200,100 L1200,200 L0,200 Z" /></svg>
        </div>
        <div className="wave-layer wave-front">
          <svg viewBox="0 0 1200 200" preserveAspectRatio="none"><path d="M0,120 C200,60 400,160 600,120 C800,60 1000,160 1200,120 L1200,200 L0,200 Z" /></svg>
          <svg viewBox="0 0 1200 200" preserveAspectRatio="none"><path d="M0,120 C200,60 400,160 600,120 C800,60 1000,160 1200,120 L1200,200 L0,200 Z" /></svg>
        </div>
        <div className="hero-sail-ark">
          <svg viewBox="0 0 120 90">
            <line x1="60" y1="8" x2="60" y2="52" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M60 13 L60 46 Q32 40 60 13 Z" fill="currentColor" />
            <path d="M10 54 Q60 92 110 54 L98 72 Q60 98 22 72 Z" fill="currentColor" />
          </svg>
        </div>
      </div>
      <div className="hero-grid">
        <div className="hero-content">
          <p className="eyebrow">{eyebrow}</p>
          <h1>
            {title.split('\n').map((line, i) => (
              <span key={i}>
                {i === 1 ? <span className="grad">{line}</span> : line}
                {i < title.split('\n').length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className="hero-desc">
            {description}
          </p>
          {(primaryCta || secondaryCta) && (
            <div className="hero-ctas" style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              {primaryCta?.label && primaryCta?.href && (
                <a
                  href={primaryCta.href}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-base font-semibold text-white shadow-[0_4px_16px_-4px_rgba(107,47,120,0.5)] transition-all hover:brightness-110 hover:-translate-y-0.5 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #6b2f78, #a855c4)' }}
                >
                  {primaryCta.label}
                </a>
              )}
              {secondaryCta?.label && secondaryCta?.href && (
                <a
                  href={secondaryCta.href}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/14 bg-white/4 px-7 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/8 hover:border-[#b472cc] active:scale-95"
                >
                  {secondaryCta.label}
                </a>
              )}
            </div>
          )}
          <form
            className="hero-search"
            role="search"
            aria-label="Search a subject"
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.currentTarget as HTMLFormElement).querySelector('input');
              const query = input?.value.trim().toLowerCase();
              if (query) {
                const match = courseGroups.flat().find(
                  (c) => c.label.toLowerCase().includes(query) || query.includes(c.label.toLowerCase())
                );
                if (match) {
                  const slug = match.label.toLowerCase().replace(/\s+/g, '-');
                  window.location.href = `/courses/${slug}`;
                } else {
                  window.location.href = `/courses?q=${encodeURIComponent(query)}`;
                }
              } else {
                window.location.href = '/courses';
              }
            }}
          >
            <input
              type="text"
              placeholder="Search your subject... e.g. Physics, Accounts"
              autoComplete="off"
            />
            <button type="submit" aria-label="Search">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </form>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-orb" />
          {courseGroups.map((group, gi) => (
            <div
              key={gi}
              className="hero-card-group"
              style={{
                opacity: gi === groupIndex ? 1 : 0,
                transition: 'opacity 1.5s ease-in-out',
                position: 'absolute',
                inset: 0,
                pointerEvents: gi === groupIndex ? 'auto' : 'none',
              }}
            >
              {group.map((course, ci) => {
                const pos = cardPositions[ci];
                return (
                  <div
                    className={`hero-card hc-${ci + 1}`}
                    key={course.label}
                    style={{
                      top: pos.top,
                      left: pos.left,
                      bottom: pos.bottom,
                      right: pos.right,
                    }}
                  >
                    <div className="hc-icon">
                      <svg viewBox="0 0 24 24" fill="none" dangerouslySetInnerHTML={{ __html: iconPaths[course.icon] }} />
                    </div>
                    <div className="hc-body">
                      <div className="hc-label">{course.label}</div>
                      <div className="hc-title">{course.title}</div>
                      <div className="hc-meta">{course.meta}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
