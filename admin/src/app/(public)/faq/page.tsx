import Link from "next/link";
import { fetchFaqs } from "@/lib/faqs";
import "../public.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "FAQ — TAG Educators",
  description: "Frequently asked questions about courses, enrollment, batches, and more at TAG Educators.",
};

export default async function FaqPage() {
  const { data: faqs } = await fetchFaqs();

  // Group by category
  const categories = [...new Set(faqs.map((f) => f.category))];
  const grouped: Record<string, typeof faqs> = {};
  for (const cat of categories) {
    grouped[cat] = faqs.filter((f) => f.category === cat);
  }

  return (
    <div className="catalog-page">
      <div className="wrap">
        <div className="section-head" style={{ textAlign: "left", marginBottom: 48 }}>
          <span className="eyebrow">Help Center</span>
          <h1 style={{ fontSize: "var(--fs-h2)" }}>Frequently Asked Questions</h1>
          <p>Everything you need to know about courses, enrollment, and studying with TAG Educators.</p>
        </div>

        {faqs.length === 0 ? (
          <div className="public-empty">
            <p>No FAQs published yet.</p>
          </div>
        ) : (
          <>
            {/* Category navigation */}
            <div className="faq-categories">
              {categories.map((cat) => (
                <a key={cat} href={`#cat-${cat.replace(/\s+/g, "-").toLowerCase()}`} className="faq-cat-chip">
                  {cat}
                </a>
              ))}
            </div>

            {/* FAQ groups */}
            {categories.map((cat) => (
              <section key={cat} className="faq-group" id={`cat-${cat.replace(/\s+/g, "-").toLowerCase()}`}>
                <h2 className="faq-group-title">{cat}</h2>
                <div className="faq-list">
                  {grouped[cat].map((f) => (
                    <details key={f.id} className="faq-item">
                      <summary>
                        {f.question}
                        <span className="faq-toggle">+</span>
                      </summary>
                      <p>{f.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}

            {/* CTA */}
            <div className="faq-cta">
              <h3>Still have questions?</h3>
              <p>Reach out and we'll get back to you within 24 hours.</p>
              <div className="faq-cta-buttons">
                <Link href="/contact" className="btn-primary">
                  Contact Us
                  <svg className="go-arc" viewBox="0 0 20 14" fill="none">
                    <path className="horizon" d="M0 7h18" />
                    <path className="sun" d="M14 1l4 6-4 6" />
                  </svg>
                </Link>
                <Link href="/courses" className="btn-ghost">Browse Courses</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
