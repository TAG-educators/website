interface CtaData {
  label?: string;
  href?: string;
}

interface ImageTextData {
  image?: string;
  heading?: string;
  eyebrow?: string;
  body?: string;
  layout?: "left" | "right";
  cta?: CtaData | null;
}

export function ImageTextBlock({ data }: { data: Record<string, unknown> }) {
  const d = data as unknown as ImageTextData;
  if (!d.image) return null;

  return (
    <section className={`public-section imagetext-block ${d.layout === "left" ? "layout-left" : ""}`}>
      <div className="wrap">
        <div className="it-image">
          <img src={d.image} alt={d.heading ?? ""} />
        </div>
        <div className="it-content">
          {d.eyebrow && <p className="section-eyebrow">{d.eyebrow}</p>}
          {d.heading && <h3>{d.heading}</h3>}
          {d.body && (
            <div
              className="it-body"
              dangerouslySetInnerHTML={{ __html: d.body }}
            />
          )}
          {d.cta?.label && d.cta?.href && (
            <a href={d.cta.href} className="btn-primary">
              {d.cta.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
