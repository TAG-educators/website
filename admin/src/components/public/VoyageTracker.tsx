"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Voyage tracker — the "ark on top" progress bar.
 * A real, persisted (sessionStorage) record of how far a visitor has sailed
 * toward enrolling: Home → Courses → Your Course → Registering → Enrolled.
 * The ark marks the furthest point reached; it never moves backward.
 */

const STAGES = [
  { label: "Home" },
  { label: "Courses" },
  { label: "Your Course" },
  { label: "Registering" },
  { label: "Enrolled" },
];

const STORAGE_KEY = "tagVoyageStage";

/** Map a pathname to a voyage stage index. */
function stageForPath(pathname: string): number {
  if (pathname === "/" || pathname === "") return 0;
  if (pathname === "/courses") return 1;
  // Subject detail pages: /subjects/[slug]
  if (pathname.startsWith("/subjects/")) return 2;
  if (pathname.startsWith("/register") || pathname.includes("/register")) return 3;
  return 0;
}

function getStage(): number {
  if (typeof window === "undefined") return 0;
  try {
    const v = parseInt(sessionStorage.getItem(STORAGE_KEY) ?? "", 10);
    if (isNaN(v)) return 0;
    return Math.max(0, Math.min(STAGES.length - 1, v));
  } catch {
    return 0;
  }
}

function setStage(n: number): number {
  const current = getStage();
  const next = Math.max(current, Math.min(STAGES.length - 1, n));
  try {
    sessionStorage.setItem(STORAGE_KEY, String(next));
  } catch {
    /* ignore */
  }
  return next;
}

export function VoyageTracker() {
  const pathname = usePathname();
  const [stage, setStageState] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const pathStage = stageForPath(pathname ?? "/");
    const next = setStage(pathStage);
    setStageState(next);
    setMounted(true);
  }, [pathname]);

  // Expose a global setter so other client components (registration form)
  // can advance the stage in response to a real visitor action.
  useEffect(() => {
    (window as unknown as { TAGVoyage?: { setStage: (n: number) => void } }).TAGVoyage = {
      setStage: (n: number) => {
        const next = setStage(n);
        setStageState(next);
      },
    };
    return () => {
      delete (window as unknown as { TAGVoyage?: { setStage: (n: number) => void } }).TAGVoyage;
    };
  }, []);

  const pct = (stage / (STAGES.length - 1)) * 100;

  return (
    <div className="voyage-bar" suppressHydrationWarning>
      <div className="voyage-track">
        <div className="voyage-fill" style={{ width: `${pct}%` }} />
        <div className="voyage-ark" style={{ left: `${pct}%` }} aria-hidden="true">
          <svg viewBox="0 0 120 90" aria-hidden="true">
            <line x1="60" y1="8" x2="60" y2="52" stroke="currentColor" strokeWidth="5"/>
            <path d="M60 13 L60 46 Q32 40 60 13 Z" fill="currentColor"/>
            <path d="M10 54 Q60 92 110 54 L98 72 Q60 98 22 72 Z" fill="currentColor"/>
          </svg>
        </div>
      </div>
      <div className="voyage-stops">
        {STAGES.map((s, i) => {
          const state = i < stage ? "done" : i === stage ? "current" : "";
          return (
            <div key={s.label} className={`voyage-stop ${state}`}>
              <span className="voyage-dot" />
              <span className="voyage-label">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
