import { cn } from "../../lib/utils";

export function PageHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-3 mb-5", className)}>
      <div>
        <h1 className="text-[20px] font-semibold text-ink tracking-tight">{title}</h1>
        {description && <p className="mt-0.5 text-[13px] text-ink-muted">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}
