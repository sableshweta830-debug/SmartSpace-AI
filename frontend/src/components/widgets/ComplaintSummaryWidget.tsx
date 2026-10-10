import React from 'react';
import { MessageSquareWarning, CheckCircle, Clock, Star, Lightbulb } from 'lucide-react';

interface ComplaintSummaryWidgetProps {
  data?: any;
}

export const ComplaintSummaryWidget: React.FC<ComplaintSummaryWidgetProps> = ({ data }) => {
  const overview = data?.complaint_overview || {};
  const feedback = data?.customer_feedback_summary || {};
  const resolutions = data?.suggested_resolutions || [];

  return (
    <div className="w-full flex flex-col gap-4 text-xs">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <span className="text-slate-400 block text-[11px]">Total Complaints</span>
          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {overview.total_tickets || 142}
          </span>
        </div>
        <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <span className="text-slate-400 block text-[11px]">Resolution Rate</span>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {overview.resolution_rate || '76.4%'}
          </span>
        </div>
        <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <span className="text-slate-400 block text-[11px]">Avg Resolution</span>
          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {overview.avg_resolution_time || '4.2 hrs'}
          </span>
        </div>
        <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <span className="text-slate-400 block text-[11px]">Customer Rating</span>
          <span className="text-lg font-bold text-amber-500">
            {overview.customer_satisfaction || '3.8 / 5.0'}
          </span>
        </div>
      </div>

      {/* Synthesis */}
      {feedback.synthesis && (
        <div className="p-3.5 rounded-xl border border-brand-200/70 dark:border-brand-900/50 bg-brand-50/40 dark:bg-brand-950/20 flex flex-col gap-1.5">
          <span className="font-semibold text-brand-900 dark:text-brand-200 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <MessageSquareWarning className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            Rule-Based Issue Synthesis
          </span>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
            {feedback.synthesis}
          </p>
        </div>
      )}

      {/* Suggested Resolutions */}
      {resolutions.length > 0 && (
        <div className="space-y-2">
          <h5 className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Recommended Engineering & Product Resolutions
          </h5>
          <div className="space-y-2">
            {resolutions.map((res: any, idx: number) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-start justify-between gap-3"
              >
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {res.title}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md shrink-0">
                  {res.impact}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
