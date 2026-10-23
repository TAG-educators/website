import { fetchFaqs } from "@/lib/faqs";

interface InlineFaq {
  question: string;
  answer: string;
}

interface FaqBlockData {
  title?: string;
  eyebrow?: string;
  faqIds?: string[];
  items?: InlineFaq[];
}

export async function FaqBlock({ data }: { data: Record<string, unknown> }) {
  const d = data as unknown as FaqBlockData;

  // Build the list: inline items + library FAQs
  const faqs: { question: string; answer: string }[] = [];

  if (d.items?.length) {
    faqs.push(...d.items);
  }

  if (d.faqIds?.length) {
    const { data: allFaqs } = await fetchFaqs();
    const selected = allFaqs.filter((f) => d.faqIds!.includes(f.id));
    faqs.push(...selected.map((f) => ({ question: f.question, answer: f.answer })));
  }

  if (faqs.length === 0) return null;

  return (
    <section className="public-section faq-block">
      <div className="wrap">
        {(d.eyebrow || d.title) && (
          <div className="section-head center">
            {d.eyebrow && <p className="section-eyebrow center">{d.eyebrow}</p>}
            {d.title && <h2>{d.title}</h2>}
          </div>
        )}
        <div className="faq-list">
          {faqs.map((f, i) => (
            <details key={i} className="faq-item">
              <summary>{f.question}</summary>
              <div className="faq-answer">{f.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
