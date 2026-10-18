'use client';

import { useEffect, useState } from 'react';
import { Clock, Calendar } from 'lucide-react';

type BatchSchedule = {
  days: string;
  timeUTC: string; // e.g. "14:00" in 24h UTC
  durationMins: number;
};

const batchSchedules: BatchSchedule[] = [
  { days: 'Mon & Wed', timeUTC: '14:00', durationMins: 90 },
  { days: 'Tue & Thu', timeUTC: '16:00', durationMins: 90 },
  { days: 'Sat', timeUTC: '09:00', durationMins: 120 },
];

function convertToLocal(timeUTC: string): { time: string; tz: string } {
  const [hours, minutes] = timeUTC.split(':').map(Number);
  const now = new Date();
  const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hours, minutes));

  const localTime = utcDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
  const tzShort = tz.split('/').pop()?.replace('_', ' ') || 'Local';

  return { time: localTime, tz: tzShort };
}

export function CourseSchedule() {
  const [schedules, setSchedules] = useState<{ days: string; time: string; tz: string; duration: number }[] | null>(null);

  useEffect(() => {
    const converted = batchSchedules.map((b) => {
      const { time, tz } = convertToLocal(b.timeUTC);
      return { days: b.days, time, tz, duration: b.durationMins };
    });
    setSchedules(converted);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-premium">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5" style={{ color: '#b472cc' }} />
        <h3 className="font-display text-lg font-bold text-foreground">Batch Timings</h3>
      </div>
      <p className="mt-1.5 text-[0.82rem] text-muted-foreground">
        Shown in your local timezone{ schedules?.[0] ? ` (${schedules[0].tz})` : '' }
      </p>

      {schedules ? (
        <div className="mt-5 space-y-3">
          {schedules.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-4 py-3"
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-[0.88rem] font-medium text-foreground">{s.days}</span>
              </div>
              <div className="text-right">
                <div className="text-[0.88rem] font-semibold" style={{ color: '#b472cc' }}>
                  {s.time}
                </div>
                <div className="text-[0.72rem] text-muted-foreground">
                  {s.duration} mins
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 h-32 animate-pulse rounded-xl bg-muted/20" />
      )}

      <p className="mt-4 text-[0.78rem] text-muted-foreground">
        Times auto-adjust to your device timezone. Contact us on WhatsApp for other slots.
      </p>
    </div>
  );
}
