import React from 'react';
import { AlertCircle, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface OpenIssuesWidgetProps {
  data?: any;
}

export const OpenIssuesWidget: React.FC<OpenIssuesWidgetProps> = ({ data }) => {
  const issues = data?.open_issues || data?.blockers_and_risks || [];

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="space-y-3">
        {issues.map((issue: any) => {
          const isHigh = issue.priority === 'High' || issue.severity === 'High';
          return (
            <div
              key={issue.id}
              className={`p-3 rounded-xl border text-xs flex flex-col gap-2 transition-all ${
                isHigh
                  ? 'border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert
                    className={`w-4 h-4 shrink-0 ${
                      isHigh ? 'text-rose-500' : 'text-amber-500'
                    }`}
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    {issue.title}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                    isHigh
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                  }`}
                >
                  {issue.priority || issue.severity || 'Medium'}
                </span>
              </div>

              {(issue.suggested_action || issue.impact) && (
                <div className="flex items-start gap-1.5 pl-6 text-slate-600 dark:text-slate-300 text-[11px]">
                  <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                  <span>
                    <strong className="text-slate-700 dark:text-slate-200">
                      {issue.suggested_action ? 'Action:' : 'Impact:'}
                    </strong>{' '}
                    {issue.suggested_action || issue.impact}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pl-6 pt-1 text-[10px] text-slate-400">
                <span>Status: <strong className="text-slate-600 dark:text-slate-300">{issue.status}</strong></span>
                {issue.owner && <span>Owner: {issue.owner}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
