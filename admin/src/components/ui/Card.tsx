import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("bg-bg border border-border rounded-[8px]", className)}>{children}</div>
  );
}

export function CardHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
      <h3 className="text-[13px] font-semibold text-ink tracking-tight">{title}</h3>
      {action}
    </div>
  );
}
