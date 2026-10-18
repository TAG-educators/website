"use client";

import { useEffect, useState } from "react";

/**
 * Renders a time-relative string ("5h ago") that's safe for SSR.
 * Server renders a stable fallback; the client computes the real
 * value after mount. This avoids Date.now() hydration mismatches.
 */
export function RelativeTime({ iso, fallback = "recently" }: { iso: string; fallback?: string }) {
  const [label, setLabel] = useState(fallback);

  useEffect(() => {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3.6e6);
    if (h < 1) setLabel("just now");
    else if (h < 24) setLabel(`${h}h ago`);
    else setLabel(`${Math.floor(h / 24)}d ago`);
  }, [iso]);

  return <span>{label}</span>;
}

/**
 * Renders "N days" until an exam date. SSR-safe via the same pattern.
 */
export function DaysUntil({ iso }: { iso: string }) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const d = Math.ceil((new Date(iso).getTime() - Date.now()) / 8.64e7);
    setDays(d);
  }, [iso]);

  return (
    <>
      <span className="text-[14px] font-bold text-accent leading-none">
        {days ?? "—"}
      </span>
      <span className="text-[9px] text-accent-ink uppercase">days</span>
    </>
  );
}
