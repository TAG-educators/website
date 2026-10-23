import { StatCounter } from "@/components/public/StatCounter";

interface StatItem {
  value: string;
  label: string;
}

interface StatisticsData {
  title?: string;
  eyebrow?: string;
  stats?: StatItem[];
}

/**
 * Parse a stat value string into a numeric target + prefix/suffix.
 * e.g. "98%" → { target: 98, suffix: "%" }
 *      "$1.2k+" → { target: 1, prefix: "$", suffix: ".2k+" } (best-effort)
 *      "500+" → { target: 500, suffix: "+" }
 * Non-numeric values fall back to plain text (no count-up).
 */
function parseStat(raw: string): { target: number; prefix: string; suffix: string } | null {
  const match = raw.match(/^(\D*)(\d+)(\D*)$/);
  if (!match) return null;
  return {
    prefix: match[1],
    target: parseInt(match[2], 10),
    suffix: match[3],
  };
}

export function StatisticsBlock({ data }: { data: Record<string, unknown> }) {
  const d = data as unknown as StatisticsData;
  if (!d.stats?.length) return null;

  return (
    <section className="public-section stats-block">
      <div className="wrap">
        {d.eyebrow && <p className="section-eyebrow center">{d.eyebrow}</p>}
        {d.title && (
          <div className="section-head center">
            <h2>{d.title}</h2>
          </div>
        )}
        <div className="stats-grid">
          {d.stats.map((s, i) => {
            const parsed = parseStat(s.value);
            return (
              <div key={i} className="stat-item">
                {parsed ? (
                  <StatCounter target={parsed.target} prefix={parsed.prefix} suffix={parsed.suffix} />
                ) : (
                  <div className="stat-value">{s.value}</div>
                )}
                <div className="stat-label">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
