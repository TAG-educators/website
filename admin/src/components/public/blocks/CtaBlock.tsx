interface CtaData {
  label?: string;
  href?: string;
}

interface CtaBlockData {
  heading?: string;
  eyebrow?: string;
  description?: string;
  primaryCta?: CtaData | null;
  secondaryCta?: CtaData | null;
}

export function CtaBlock({ data }: { data: Record<string, unknown> }) {
  const d = data as unknown as CtaBlockData;
  if (!d.heading) return null;

  return (
    <section className="public-section">
      <div className="wrap">
        <div className="cta-block">
          {d.eyebrow && <p className="section-eyebrow center">{d.eyebrow}</p>}
          <h2>{d.heading}</h2>
          {d.description && <p className="cta-desc">{d.description}</p>}
          {(d.primaryCta || d.secondaryCta) && (
            <div className="hero-ctas" style={{ justifyContent: "center" }}>
              {d.primaryCta?.label && d.primaryCta?.href && (
                <a href={d.primaryCta.href} className="btn-primary">
                  {d.primaryCta.label}
                </a>
              )}
              {d.secondaryCta?.label && d.secondaryCta?.href && (
                <a href={d.secondaryCta.href} className="btn-secondary">
                  {d.secondaryCta.label}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
