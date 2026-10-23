import { fetchTestimonials } from "@/lib/testimonials";

interface TestimonialGridData {
  title?: string;
  eyebrow?: string;
  description?: string;
  testimonialIds?: string[];
  columns?: "2" | "3";
}

export async function TestimonialGridBlock({ data }: { data: Record<string, unknown> }) {
  const d = data as unknown as TestimonialGridData;
  const { data: all } = await fetchTestimonials();

  let testimonials = all;
  if (d.testimonialIds?.length) {
    testimonials = all.filter((t) => d.testimonialIds!.includes(t.id));
  }

  if (testimonials.length === 0) return null;
  const cols = d.columns ?? "2";

  return (
    <section className="public-section grid-block testimonial-section">
      <div className="wrap">
        {(d.eyebrow || d.title) && (
          <div className="section-head">
            {d.eyebrow && <p className="section-eyebrow">{d.eyebrow}</p>}
            {d.title && <h2>{d.title}</h2>}
            {d.description && <p className="section-desc">{d.description}</p>}
          </div>
        )}
        <div className={`grid cols-${cols}`}>
          {testimonials.map((t) => (
            <div key={t.id} className="card testimonial-card">
              <div className="testimonial-quote-mark" aria-hidden="true">"</div>
              <p className="quote">{t.quote}</p>
              <div className="testimonial-footer">
                <div className="testimonial-meta">
                  <span className="testimonial-name">{t.studentName}</span>
                  {t.result && <span className="testimonial-result">{t.result}</span>}
                </div>
                {t.course && <p className="testimonial-course">{t.course}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
