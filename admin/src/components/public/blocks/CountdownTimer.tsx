"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  examDate: string; // ISO
}

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function computeRemaining(target: string): Remaining {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
    done: false,
  };
}

const pad = (n: number) => n.toString().padStart(2, "0");

/**
 * Live ticking countdown for a single exam timer. Renders days/hours/minutes/
 * seconds as labeled boxes and updates every second. Shows "Started" once the
 * exam date has passed.
 */
export function CountdownTimer({ examDate }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState<Remaining>(() =>
    computeRemaining(examDate)
  );
  // Don't render live values until after mount — the server and the first
  // client render would otherwise differ (time passes between them), which
  // triggers a React hydration mismatch warning.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Tick every second.
    const id = setInterval(() => {
      setRemaining(computeRemaining(examDate));
    }, 1000);
    return () => clearInterval(id);
  }, [examDate]);

  if (!mounted) {
    return (
      <div className="cd-time cd-time--live" aria-label="Time remaining">
        <span className="cd-unit">
          <span className="cd-num">--</span>
          <span className="cd-label">days</span>
        </span>
        <span className="cd-sep">:</span>
        <span className="cd-unit">
          <span className="cd-num">--</span>
          <span className="cd-label">hours</span>
        </span>
        <span className="cd-sep">:</span>
        <span className="cd-unit">
          <span className="cd-num">--</span>
          <span className="cd-label">mins</span>
        </span>
        <span className="cd-sep">:</span>
        <span className="cd-unit">
          <span className="cd-num">--</span>
          <span className="cd-label">secs</span>
        </span>
      </div>
    );
  }

  if (remaining.done) {
    return <div className="cd-time cd-time--live">Started</div>;
  }

  return (
    <div className="cd-time cd-time--live" aria-label="Time remaining">
      <span className="cd-unit">
        <span className="cd-num">{pad(remaining.days)}</span>
        <span className="cd-label">days</span>
      </span>
      <span className="cd-sep">:</span>
      <span className="cd-unit">
        <span className="cd-num">{pad(remaining.hours)}</span>
        <span className="cd-label">hours</span>
      </span>
      <span className="cd-sep">:</span>
      <span className="cd-unit">
        <span className="cd-num">{pad(remaining.minutes)}</span>
        <span className="cd-label">mins</span>
      </span>
      <span className="cd-sep">:</span>
      <span className="cd-unit">
        <span className="cd-num">{pad(remaining.seconds)}</span>
        <span className="cd-label">secs</span>
      </span>
    </div>
  );
}
