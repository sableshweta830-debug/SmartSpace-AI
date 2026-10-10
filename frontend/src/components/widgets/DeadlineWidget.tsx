import React from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DeadlineWidgetProps {
  data?: any;
}

export const DeadlineWidget: React.FC<DeadlineWidgetProps> = ({ data }) => {
  const deadlines = data?.upcoming_deadlines || [];

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="space-y-2.5">
        {deadlines.map((item: any) => {
          const isUrgent = item.severity === 'urgent' || item.days_left <= 5;
          return (
            <div
              key={item.id}
              className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 transition-colors ${
                isUrgent
                  ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20'
                  : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`p-1.5 rounded-lg ${
                    isUrgent
                      ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="font-semibold text-slate-800 dark:text-slate-100 block truncate">
                    {item.milestone}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Target Date: {item.due}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-lg text-[11px] ${
                    isUrgent
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  {item.days_left}d remaining
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
