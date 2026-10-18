'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const STAGES = [
  { label: 'Home', path: '/' },
  { label: 'Courses', path: '/courses' },
  { label: 'Your Course', path: '/courses/' },
  { label: 'Registering', path: '/cart' },
  { label: 'Enrolled', path: '/cart' },
];

const STORAGE_KEY = 'tagVoyageStage';

function getStoredStage(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const v = parseInt(sessionStorage.getItem(STORAGE_KEY) || '0', 10);
    return isNaN(v) ? 0 : Math.max(0, Math.min(STAGES.length - 1, v));
  } catch {
    return 0;
  }
}

function setStoredStage(n: number) {
  try {
    const next = Math.max(getStoredStage(), Math.min(STAGES.length - 1, n));
    sessionStorage.setItem(STORAGE_KEY, String(next));
  } catch {}
}

export function VoyageTracker() {
  const pathname = usePathname();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    let pageStage = 0;

    if (pathname === '/') {
      pageStage = 0;
    } else if (pathname === '/courses') {
      pageStage = 1;
    } else if (pathname.startsWith('/courses/') && pathname !== '/courses') {
      pageStage = 2;
    } else if (pathname === '/cart') {
      pageStage = Math.max(getStoredStage(), 3);
    } else {
      pageStage = getStoredStage();
    }

    // Set the exact stage for this page (allow moving backward)
    try {
      sessionStorage.setItem(STORAGE_KEY, String(pageStage));
    } catch {}
    setStage(pageStage);
  }, [pathname]);

  // Listen for stage updates from other components (e.g. Add to cart, form submit)
  useEffect(() => {
    const handler = () => setStage(getStoredStage());
    window.addEventListener('tag-voyage-update', handler);
    return () => window.removeEventListener('tag-voyage-update', handler);
  }, []);

  const fillPct = (stage / (STAGES.length - 1)) * 100;
  const arkPct = fillPct;

  return (
    <div
      className="voyage-bar"
      style={{
        background: '#1e1328',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '16px 28px 12px',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      <div
        className="voyage-track"
        style={{
          position: 'relative',
          maxWidth: '1120px',
          margin: '0 auto',
          height: '4px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '2px',
        }}
      >
        <div
          className="voyage-fill"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${fillPct}%`,
            background: 'linear-gradient(90deg, #6b2f78, #b472cc)',
            borderRadius: '2px',
            transition: 'width .6s ease',
          }}
        />
        <div
          className="voyage-ark"
          style={{
            position: 'absolute',
            top: '50%',
            left: `${arkPct}%`,
            width: '26px',
            height: '20px',
            color: '#d4a0e8',
            transform: 'translate(-50%, -70%)',
            transition: 'left .6s ease',
            animation: 'voyageBob 2.4s ease-in-out infinite',
          }}
        >
          <svg viewBox="0 0 120 90" aria-hidden="true">
            <line x1="60" y1="8" x2="60" y2="52" stroke="currentColor" strokeWidth="5" />
            <path d="M60 13 L60 46 Q32 40 60 13 Z" fill="currentColor" />
            <path d="M10 54 Q60 92 110 54 L98 72 Q60 98 22 72 Z" fill="currentColor" />
          </svg>
        </div>
      </div>
      <div
        className="voyage-stops"
        style={{
          maxWidth: '1120px',
          margin: '7px auto 0',
          position: 'relative',
          height: '40px',
        }}
      >
        {/* Desktop: show all stops with labels */}
        <div className="voyage-stops-desktop" style={{ position: 'absolute', inset: 0 }}>
        {STAGES.map((s, i) => {
          const state = i < stage ? 'done' : i === stage ? 'current' : '';
          const stopPct = (i / (STAGES.length - 1)) * 100;
          return (
            <div
              key={s.label}
              className="voyage-stop"
              style={{
                position: 'absolute',
                left: `${stopPct}%`,
                transform: i === 0 ? 'translateX(0)' : i === STAGES.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  transition: 'background .3s ease, box-shadow .3s ease',
                  background:
                    state === 'done' ? '#b472cc' :
                    state === 'current' ? '#d4a0e8' :
                    'rgba(255,255,255,0.15)',
                  boxShadow: state === 'current' ? '0 0 0 4px rgba(212, 160, 232, 0.3)' : 'none',
                }}
              />
              <span
                className="voyage-label"
                style={{
                  fontSize: '0.68rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  transition: 'color .3s ease',
                  color:
                    state === 'done' ? '#b472cc' :
                    state === 'current' ? '#f5f2f8' :
                    'rgba(255,255,255,0.4)',
                  fontWeight: state === 'current' ? 700 : 400,
                }}
              >
                {s.label}
              </span>
            </div>
          );
        })}
        </div>

        {/* Mobile: show all dots but only current label at ship position */}
        <div className="voyage-stops-mobile" style={{ position: 'absolute', inset: 0 }}>
        {STAGES.map((s, i) => {
          const state = i < stage ? 'done' : i === stage ? 'current' : '';
          const stopPct = (i / (STAGES.length - 1)) * 100;
          return (
            <div
              key={s.label}
              style={{
                position: 'absolute',
                left: `${stopPct}%`,
                transform: i === 0 ? 'translateX(0)' : i === STAGES.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background:
                    state === 'done' ? '#b472cc' :
                    state === 'current' ? '#d4a0e8' :
                    'rgba(255,255,255,0.15)',
                  boxShadow: state === 'current' ? '0 0 0 4px rgba(212, 160, 232, 0.3)' : 'none',
                }}
              />
              {state === 'current' && (
                <span
                  style={{
                    fontSize: '0.68rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    color: '#f5f2f8',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s.label}
                </span>
              )}
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

// Helper to advance the stage from other components
export function advanceVoyageStage(n: number) {
  setStoredStage(n);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tag-voyage-update'));
  }
}
