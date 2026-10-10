import React from 'react';
import { Calendar, CheckCircle2, BookmarkCheck, ListChecks } from 'lucide-react';

interface MeetingNotesWidgetProps {
  data?: any;
}

export const MeetingNotesWidget: React.FC<MeetingNotesWidgetProps> = ({ data }) => {
  const notes = data?.previous_meeting_summary || {};

  return (
    <div className="w-full flex flex-col gap-4 text-xs">
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-500" />
          <span className="font-semibold">Last Session: {notes.meeting_date || 'Sept 28, 2026'}</span>
        </div>
        <span className="text-[11px] text-slate-400">
          {(notes.attendees || []).length} Attendees
        </span>
      </div>

      {/* Key Decisions */}
      <div>
        <h5 className="font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
          <BookmarkCheck className="w-3.5 h-3.5 text-emerald-500" />
          Key Decisions Agreed
        </h5>
        <ul className="space-y-1.5 pl-1">
          {(notes.key_decisions || []).map((dec: string, idx: number) => (
            <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <span>{dec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Previous Commitments */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <h5 className="font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
          Previous Commitments
        </h5>
        <ul className="space-y-1.5 pl-1">
          {(notes.commitments || []).map((com: string, idx: number) => (
            <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
              <span>{com}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Outstanding Follow-ups */}
      {notes.outstanding_followups && notes.outstanding_followups.length > 0 && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <h5 className="font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
            <ListChecks className="w-3.5 h-3.5 text-amber-500" />
            Outstanding Follow-ups
          </h5>
          <ul className="space-y-1.5 pl-1">
            {notes.outstanding_followups.map((fol: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{fol}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
