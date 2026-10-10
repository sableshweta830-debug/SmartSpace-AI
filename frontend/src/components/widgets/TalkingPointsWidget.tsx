import React from 'react';
import { MessageSquareCode, Sparkles, HelpCircle, AlertOctagon } from 'lucide-react';

interface TalkingPointsWidgetProps {
  data?: any;
}

export const TalkingPointsWidget: React.FC<TalkingPointsWidgetProps> = ({ data }) => {
  // Support suggested_talking_points, repeated_issues, or presentation_outline
  if (data?.repeated_issues) {
    return (
      <div className="w-full flex flex-col gap-3">
        {data.repeated_issues.map((issue: any, idx: number) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {issue.issue}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold text-[10px]">
                {issue.occurrences} Reports
              </span>
            </div>
            <div className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              <strong className="text-slate-700 dark:text-slate-200">Root Cause:</strong> {issue.root_cause}
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>Category: {issue.category}</span>
              <span>Customer Sentiment: <strong className="text-rose-500">{issue.sentiment}</strong></span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (data?.presentation_outline) {
    return (
      <div className="w-full flex flex-col gap-2.5">
        {data.presentation_outline.map((slide: any, idx: number) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs"
          >
            <span className="font-bold text-brand-600 dark:text-brand-400 w-24 shrink-0 font-mono">
              {slide.slide}
            </span>
            <span className="text-slate-800 dark:text-slate-200 font-medium flex-1">
              {slide.section}
            </span>
          </div>
        ))}
      </div>
    );
  }

  const points = data?.suggested_talking_points || [];

  return (
    <div className="w-full flex flex-col gap-3">
      {points.map((point: any, idx: number) => {
        const isQuestion = point.category === 'Questions to Ask';
        const isRisk = point.category === 'Risk Mitigation';
        return (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-brand-300 dark:hover:border-brand-800 transition-colors text-xs flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                {isQuestion ? (
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                ) : isRisk ? (
                  <AlertOctagon className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                )}
                {point.topic}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {point.category}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-5 text-[11px]">
              {point.detail}
            </p>
          </div>
        );
      })}
    </div>
  );
};
