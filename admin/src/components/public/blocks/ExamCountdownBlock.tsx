import { fetchExamTimers } from "@/lib/examTimers";
import { CountdownTimer } from "./CountdownTimer";

interface ExamCountdownData {
  title?: string;
  eyebrow?: string;
  timerIds?: string[];
}

export async function ExamCountdownBlock({ data }: { data: Record<string, unknown> }) {
  const d = data as unknown as ExamCountdownData;
  const { data: allTimers } = await fetchExamTimers();

  let timers = allTimers;
  if (d.timerIds?.length) {
    timers = allTimers.filter((t) => d.timerIds!.includes(t.id));
  }

  if (timers.length === 0) return null;

  return (
    <section className="public-section countdown-block">
      <div className="wrap">
        {(d.eyebrow || d.title) && (
          <div className="section-head center">
            {d.eyebrow && <p className="section-eyebrow center">{d.eyebrow}</p>}
            {d.title && <h2>{d.title}</h2>}
          </div>
        )}
        <div className="countdown-grid">
          {timers.map((t) => (
            <div key={t.id} className="countdown-card">
              <div className="cd-title">{t.title}</div>
              <CountdownTimer examDate={t.examDate} />
              <div className="cd-date">
                {new Date(t.examDate).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
