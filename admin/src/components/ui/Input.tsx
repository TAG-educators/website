import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full h-9 px-3 rounded-[6px] bg-white border border-border-strong text-sm text-ink",
        "placeholder:text-ink-faint transition-colors",
        "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full px-3 py-2 rounded-[6px] bg-white border border-border-strong text-sm text-ink",
        "placeholder:text-ink-faint transition-colors resize-y min-h-[80px]",
        "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full h-9 px-3 pr-8 rounded-[6px] bg-white border border-border-strong text-sm text-ink",
        "transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <label className={cn("block text-[12px] font-medium text-ink-soft mb-1.5", className)}>
      {children}
    </label>
  );
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {hint && <p className="mt-1 text-[12px] text-ink-faint">{hint}</p>}
    </div>
  );
}
