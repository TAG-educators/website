import { fetchCourses } from "@/lib/courses";
import { HeroSearch, type SearchSubject } from "@/components/public/HeroSearch";

interface CtaData {
  label?: string;
  href?: string;
}

interface HeroData {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryCta?: CtaData | null;
  secondaryCta?: CtaData | null;
  image?: string;
}

/**
 * Split-layout hero per the master plan §6:
 * LEFT  — eyebrow, large headline, supporting text, CTAs, subject search
 * RIGHT — animated educational visual with floating cards
 *         (course card, live-class card, result card, progress card)
 *
 * The title supports a "|" separator to create a split-headline look
 * (e.g. "Less Sinking.|More Sailing." → two stacked lines, second gradient).
 */
export async function HeroBlock({ data }: { data: Record<string, unknown> }) {
  const d = data as unknown as HeroData;

  // Fetch courses to power the subject search.
  const { data: courses } = await fetchCourses();
  const subjects: SearchSubject[] = courses
    .filter((c) => c.status === "published")
    .map((c) => ({ slug: c.slug, name: c.subject || c.title, level: c.level }));

  // Split the title on "|" into stacked lines (second line gets gradient).
  const titleParts = (d.title ?? "").split("|").map((p) => p.trim()).filter(Boolean);
  const hasSplit = titleParts.length >= 2;

  return (
    <section className="hero-block hero-split-layout">
      {/* Subtle ambient glow */}
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-split-grid wrap">
        {/* LEFT: copy + CTAs + search */}
        <div className="hero-left">
          {d.eyebrow && <p className="hero-eyebrow load-in">{d.eyebrow}</p>}

          {hasSplit ? (
            <h1 className="hero-split load-in d1">
              {titleParts.map((part, i) => (
                <span key={i} className={`split-line ${i % 2 === 1 ? "line-grad" : "line-white"}`}>
                  {part}
                </span>
              ))}
            </h1>
          ) : (
            d.title && <h1 className="hero-title load-in d1">{d.title}</h1>
          )}

          {d.description && <p className="hero-desc load-in d2">{d.description}</p>}

          {(d.primaryCta || d.secondaryCta) && (
            <div className="hero-ctas load-in d2">
              {d.primaryCta?.label && d.primaryCta?.href && (
                <a href={d.primaryCta.href} className="btn-primary">{d.primaryCta.label}</a>
              )}
              {d.secondaryCta?.label && d.secondaryCta?.href && (
                <a href={d.secondaryCta.href} className="btn-secondary">{d.secondaryCta.label}</a>
              )}
            </div>
          )}

          {/* Subject search bar */}
          <div className="load-in d3">
            <HeroSearch subjects={subjects} />
          </div>
        </div>

        {/* RIGHT: animated floating cards visual */}
        <div className="hero-right" aria-hidden="true">
          <div className="hero-visual">
            {/* Floating course card */}
            <div className="float-card fc-course">
              <div className="fc-icon">
                <svg viewBox="0 0 24 24" fill="none"><path d="M4 5h16v14H4z M4 9h16" stroke="currentColor" strokeWidth="1.5"/><path d="M8 13h8 M8 16h5" stroke="currentColor" strokeWidth="1.2"/></svg>
              </div>
              <div className="fc-body">
                <div className="fc-label">Physics · O Level</div>
                <div className="fc-title">Mechanics & Waves</div>
                <div className="fc-meta">Small batch · 8 students</div>
              </div>
            </div>

            {/* Floating live-class card */}
            <div className="float-card fc-live">
              <div className="fc-live-dot" />
              <div className="fc-body">
                <div className="fc-label">Live Now</div>
                <div className="fc-title">Chemistry A2</div>
                <div className="fc-meta">Past Paper Session</div>
              </div>
            </div>

            {/* Floating result card */}
            <div className="float-card fc-result">
              <div className="fc-grade">A*</div>
              <div className="fc-body">
                <div className="fc-label">Student Result</div>
                <div className="fc-title">Mathematics A Level</div>
                <div className="fc-meta">Oct/Nov 2025</div>
              </div>
            </div>

            {/* Floating progress card */}
            <div className="float-card fc-progress">
              <div className="fc-body">
                <div className="fc-label">Your Progress</div>
                <div className="fc-progress-bar">
                  <div className="fc-progress-fill" />
                </div>
                <div className="fc-meta">78% Complete</div>
              </div>
            </div>

            {/* Central glow orb */}
            <div className="hero-orb" />
          </div>
        </div>
      </div>

      {/* Wave scene at the bottom with the ark sailing — matches original */}
      <div className="hero-waves" aria-hidden="true">
        <div className="wave-layer wave-back">
          <svg viewBox="0 0 1200 200" preserveAspectRatio="none"><path d="M0,100 C150,150 350,50 600,100 C850,150 1050,50 1200,100 L1200,200 L0,200 Z"/></svg>
          <svg viewBox="0 0 1200 200" preserveAspectRatio="none"><path d="M0,100 C150,150 350,50 600,100 C850,150 1050,50 1200,100 L1200,200 L0,200 Z"/></svg>
        </div>
        <div className="wave-layer wave-front">
          <svg viewBox="0 0 1200 200" preserveAspectRatio="none"><path d="M0,120 C200,60 400,160 600,120 C800,60 1000,160 1200,120 L1200,200 L0,200 Z"/></svg>
          <svg viewBox="0 0 1200 200" preserveAspectRatio="none"><path d="M0,120 C200,60 400,160 600,120 C800,60 1000,160 1200,120 L1200,200 L0,200 Z"/></svg>
        </div>
        {/* Ark sailing on the waves — matches the original static site */}
        <div className="hero-sail-ark">
          <svg viewBox="0 0 120 90">
            <line x1="60" y1="8" x2="60" y2="52" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            <path d="M60 13 L60 46 Q32 40 60 13 Z" fill="currentColor"/>
            <path d="M10 54 Q60 92 110 54 L98 72 Q60 98 22 72 Z" fill="currentColor"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
