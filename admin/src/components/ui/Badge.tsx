import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "accent";

const tones: Record<Tone, string> = {
  neutral: "bg-bg-muted text-ink-soft border-border",
  success: "bg-success-soft text-success border-success-border",
  warning: "bg-warning-soft text-warning border-warning-border",
  danger: "bg-danger-soft text-danger border-danger-border",
  info: "bg-info-soft text-info border-info-border",
  accent: "bg-accent-soft text-accent-ink border-accent-border",
};

export function Badge({ tone = "neutral", className, children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border", tones[tone], className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: "draft" | "published" | "archived" }) {
  const map = {
    draft: { tone: "warning" as Tone, label: "Draft" },
    published: { tone: "success" as Tone, label: "Published" },
    archived: { tone: "neutral" as Tone, label: "Archived" },
  };
  const { tone, label } = map[status];
  return <Badge tone={tone}>{label}</Badge>;
}
