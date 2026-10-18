'use client';

import { useEffect, useState } from 'react';
import { Clock, Calendar, Check, GraduationCap, BookOpen, Award } from 'lucide-react';
import type { Course } from '@/lib/courses';
import { useCurrency } from '@/components/providers/currency-provider';

type BatchSchedule = {
  days: string;
  timeUTC: string;
  durationMins: number;
};

const batchSchedules: BatchSchedule[] = [
  { days: 'Mon & Wed', timeUTC: '14:00', durationMins: 90 },
  { days: 'Tue & Thu', timeUTC: '16:00', durationMins: 90 },
  { days: 'Sat', timeUTC: '09:00', durationMins: 120 },
];

const levelIcons: Record<string, typeof GraduationCap> = {
  'O Level/IGCSE': GraduationCap,
  'AS Level': BookOpen,
  'A2 Level': Award,
  'A Level': Award,
};

function convertToLocal(timeUTC: string): { time: string; tz: string } {
  const [hours, minutes] = timeUTC.split(':').map(Number);
  const now = new Date();
  const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hours, minutes));
  const localTime = utcDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
  const tzShort = tz.split('/').pop()?.replace('_', ' ') || 'Local';
  return { time: localTime, tz: tzShort };
}

export function CourseOptions({
  course,
  selectedLevels,
  onToggleLevel,
  selectedSubLevels,
  onToggleSubLevel,
}: {
  course: Course;
  selectedLevels: string[];
  onToggleLevel: (level: string) => void;
  selectedSubLevels: string[];
  onToggleSubLevel: (subLevel: string) => void;
}) {
  const [schedules, setSchedules] = useState<{ days: string; time: string; tz: string; duration: number }[] | null>(null);
  const { format, convert, currency } = useCurrency();

  useEffect(() => {
    const converted = batchSchedules.map((b) => {
      const { time, tz } = convertToLocal(b.timeUTC);
      return { days: b.days, time, tz, duration: b.durationMins };
    });
    setSchedules(converted);
  }, []);

  const activeSubLevels = selectedLevels
    .flatMap((lvl) => course.subLevels?.[lvl] ?? [])
    .filter((sub, i, arr) => arr.indexOf(sub) === i);

  return (
    <div className="mb-16">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#b472cc] text-xs font-bold text-white">
          1
        </span>
        <h2 className="font-display text-2xl font-bold text-white">Choose your level</h2>
      </div>
        <div className={`grid gap-4 sm:grid-cols-2 ${course.levels.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
        {course.levels.map((level, idx) => {
          const selected = selectedLevels.includes(level);
          const batch = schedules?.[idx] ?? null;
          const Icon = levelIcons[level] ?? GraduationCap;
          return (
            <button
              key={level}
              type="button"
              onClick={() => onToggleLevel(level)}
              className={`relative rounded-2xl border p-5 text-left transition-all duration-300 ${
                selected
                  ? 'border-transparent bg-gradient-to-br from-[#6b2f78] to-[#a855c4] text-white shadow-premium-lg'
                  : 'border-border bg-white text-foreground hover:border-[#b472cc]/60 hover:shadow-premium'
              }`}
            >
              <span
                className={`absolute left-0 top-5 bottom-5 w-1 rounded-r-full transition-all ${
                  selected ? 'bg-white/40' : 'bg-[#b472cc]/30'
                }`}
              />

              <div className="flex items-center justify-between gap-3 pl-2">
                <div className="flex items-center gap-2.5">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    selected ? 'bg-white/20' : 'bg-[#b472cc]/10'
                  }`}>
                    <Icon className={`h-4.5 w-4.5 ${selected ? 'text-white' : 'text-[#b472cc]'}`} />
                  </span>
                  <span className="text-lg font-bold">{level}</span>
                </div>
                {selected && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </span>
                )}
              </div>

              <span className={`mt-2 block pl-2 text-sm ${selected ? 'text-white/80' : 'text-muted-foreground'}`}>
                Live {course.name} classes and exam preparation.
              </span>

              {batch && (
                <div className={`mt-4 border-t pt-3 pl-2 ${selected ? 'border-white/20' : 'border-border'}`}>
                  <div className="flex items-center gap-2">
                    <Clock className={`h-3.5 w-3.5 ${selected ? 'text-white/70' : 'text-[#b472cc]'}`} />
                    <span className={`text-[0.72rem] font-semibold uppercase tracking-wider ${selected ? 'opacity-60' : 'text-muted-foreground'}`}>Batch Timing</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Calendar className={`h-3.5 w-3.5 ${selected ? 'text-white/60' : 'text-muted-foreground'}`} />
                      <span className={`text-[0.82rem] font-medium ${selected ? '' : 'text-foreground'}`}>{batch.days}</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-[0.82rem] font-semibold ${selected ? '' : 'text-[#b472cc]'}`}>{batch.time}</div>
                      <div className={`text-[0.68rem] ${selected ? 'opacity-60' : 'text-muted-foreground'}`}>{batch.duration} mins</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Price */}
              <div className={`mt-4 border-t pt-3 pl-2 ${selected ? 'border-white/20' : 'border-border'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[0.72rem] font-semibold uppercase tracking-wider ${selected ? 'opacity-60' : 'text-muted-foreground'}`}>Price</span>
                  <span className="rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider" style={selected ? { background: 'rgba(255,255,255,0.2)', color: '#fff' } : { background: 'rgba(107,47,120,0.1)', color: '#b472cc' }}>
                    Save {format(course.originalPrice - course.price)}
                  </span>
                </div>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className={`text-[0.82rem] line-through ${selected ? 'text-white/40' : 'text-muted-foreground'}`}>{format(course.originalPrice)}</span>
                  <span className={`text-[1.1rem] font-bold ${selected ? 'text-white' : 'text-foreground'}`}>{format(course.price)}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sub-levels */}
      {activeSubLevels.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#b472cc] text-xs font-bold text-white">
              1b
            </span>
            <h3 className="font-display text-xl font-bold text-white">Choose your subjects</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeSubLevels.map((subLevel, idx) => {
              const selected = selectedSubLevels.includes(subLevel);
              const batch = schedules?.[idx % batchSchedules.length] ?? null;
              return (
                <button
                  key={subLevel}
                  type="button"
                  onClick={() => onToggleSubLevel(subLevel)}
                  className={`relative rounded-2xl border p-5 text-left transition-all duration-300 ${
                    selected
                      ? 'border-transparent bg-gradient-to-br from-[#6b2f78] to-[#a855c4] text-white shadow-premium-lg'
                      : 'border-border bg-white text-foreground hover:border-[#b472cc]/60 hover:shadow-premium'
                  }`}
                >
                  <span
                    className={`absolute left-0 top-5 bottom-5 w-1 rounded-r-full transition-all ${
                      selected ? 'bg-white/40' : 'bg-[#b472cc]/30'
                    }`}
                  />

                  <div className="flex items-center justify-between gap-3 pl-2">
                    <span className="text-base font-bold">{subLevel}</span>
                    {selected && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/25">
                        <Check className="h-3.5 w-3.5 text-white" />
                      </span>
                    )}
                  </div>

                  <span className={`mt-2 block pl-2 text-sm ${selected ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {course.name} — {subLevel}
                  </span>

                  {batch && (
                    <div className={`mt-4 border-t pt-3 pl-2 ${selected ? 'border-white/20' : 'border-border'}`}>
                      <div className="flex items-center gap-2">
                        <Clock className={`h-3.5 w-3.5 ${selected ? 'text-white/70' : 'text-[#b472cc]'}`} />
                        <span className={`text-[0.72rem] font-semibold uppercase tracking-wider ${selected ? 'opacity-60' : 'text-muted-foreground'}`}>Batch Timing</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Calendar className={`h-3.5 w-3.5 ${selected ? 'text-white/60' : 'text-muted-foreground'}`} />
                          <span className={`text-[0.82rem] font-medium ${selected ? '' : 'text-foreground'}`}>{batch.days}</span>
                        </div>
                        <div className="text-right">
                          <div className={`text-[0.82rem] font-semibold ${selected ? '' : 'text-[#b472cc]'}`}>{batch.time}</div>
                          <div className={`text-[0.68rem] ${selected ? 'opacity-60' : 'text-muted-foreground'}`}>{batch.duration} mins</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  <div className={`mt-4 border-t pt-3 pl-2 ${selected ? 'border-white/20' : 'border-border'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-[0.72rem] font-semibold uppercase tracking-wider ${selected ? 'opacity-60' : 'text-muted-foreground'}`}>Price</span>
                      <span className="rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider" style={selected ? { background: 'rgba(255,255,255,0.2)', color: '#fff' } : { background: 'rgba(107,47,120,0.1)', color: '#b472cc' }}>
                        Save {format(Math.round(course.originalPrice * 0.4) - Math.round(course.price * 0.4))}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-baseline gap-2">
                      <span className={`text-[0.82rem] line-through ${selected ? 'text-white/40' : 'text-muted-foreground'}`}>{format(Math.round(course.originalPrice * 0.4))}</span>
                      <span className={`text-[1.1rem] font-bold ${selected ? 'text-white' : 'text-foreground'}`}>{format(Math.round(course.price * 0.4))}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {schedules?.[0] && (
        <p className="mt-4 text-[0.78rem] text-white/50">
          Times shown in your local timezone ({schedules[0].tz}). Contact us on WhatsApp for other slots.
        </p>
      )}
    </div>
  );
}
