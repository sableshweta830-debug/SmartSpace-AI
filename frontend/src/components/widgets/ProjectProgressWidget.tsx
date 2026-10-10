import React from 'react';
import { Target, Flag, Calendar, Activity, CheckCircle2 } from 'lucide-react';

interface ProjectProgressWidgetProps {
  data?: any;
}

export const ProjectProgressWidget: React.FC<ProjectProgressWidgetProps> = ({ data }) => {
  const project = data?.project_overview || {};
  const progress = project.overall_progress || 68;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            {project.project_name || 'Project Platform'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {project.description || 'Core engineering sprint and deliverables'}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 self-start sm:self-auto">
          <Activity className="w-3.5 h-3.5" />
          {project.health || 'On Track'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Sprint Burndown & Milestone Completion
          </span>
          <span className="text-base font-extrabold text-brand-600 dark:text-brand-400">
            {progress}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-600 via-indigo-500 to-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Started: {project.start_date || 'August 1, 2026'}</span>
          <span>Target Release: {project.target_launch || 'November 15, 2026'}</span>
        </div>
      </div>

      {/* Team & Lead Metadata */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <span className="text-slate-400 text-[11px] block">Engineering Lead</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {project.lead || 'Alex Mercer'}
          </span>
        </div>
        <div className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <span className="text-slate-400 text-[11px] block">Sprint Milestone</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Sprint 14 (Release Candidate)
          </span>
        </div>
      </div>
    </div>
  );
};
