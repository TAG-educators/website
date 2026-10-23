"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Hero subject search bar.
 * A bright card against the dark hero — the one "light" object in the scene.
 * Filters against the provided subject list and navigates to the matching
 * subject page on submit. Mirrors the static site's hero search behavior.
 */

export interface SearchSubject {
  slug: string;
  name: string;
  level?: string;
}

export function HeroSearch({ subjects }: { subjects: SearchSubject[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<{ msg: string; kind: "success" | "error" | "" }>({ msg: "", kind: "" });
  const [pulse, setPulse] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  // Live matches as the user types.
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return subjects.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.level ?? "").toLowerCase().includes(q)
    );
  }, [query, subjects]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      setStatus({ msg: "Type a subject to search.", kind: "error" });
      return;
    }

    if (matches.length === 0) {
      setStatus({ msg: `No subject found for "${q}". Try another, or browse courses.`, kind: "error" });
      return;
    }

    // Navigate to the first match.
    const first = matches[0];
    setStatus({ msg: `Taking you to ${first.name}…`, kind: "success" });
    setPulse(true);
    setTimeout(() => setPulse(false), 600);
    router.push(`/subjects/${first.slug}`);
  }

  // Clear status when the query changes.
  useEffect(() => {
    if (status.msg) setStatus({ msg: "", kind: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div>
      <form className={`hero-search${pulse ? " pulse" : ""}`} onSubmit={handleSubmit} role="search">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search a subject - e.g. Physics, Maths, Chemistry"
          aria-label="Search subjects"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" aria-label="Search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </form>
      <div className={`hero-search-status${status.kind ? ` ${status.kind}` : ""}`}>
        {status.msg || (matches.length > 0 ? `${matches.length} match${matches.length > 1 ? "es" : ""}` : "")}
      </div>
    </div>
  );
}
