import React from 'react';
import {
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface ExplanationPanelProps {
  intent?: string;
  confidence?: number;
  explanation?: string;
  explanationsPerWidget?: Record<string, string>;
  availableInfo?: string[];
  missingInfo?: string[];
  recommendedNextStep?: string;
  isFallback?: boolean;
  data?: any;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  intent,
  confidence,
  explanation,
  explanationsPerWidget,
  availableInfo,
  missingInfo,
  recommendedNextStep,
  isFallback = true,
  data,
}) => {
  // If rendered as Potential Causes widget for Product Usage:
  if (data?.potential_causes) {
    return (
      <div className="w-full flex flex-col gap-3 text-xs">
        <div className="flex items-center justify-between text-slate-500">
          <span>Ranked Diagnostic Findings</span>
          <span className="text-[11px] font-medium text-slate-400">Telemetry Correlation</span>
        </div>

        <div className="space-y-2.5">
          {data.potential_causes.map((cause: any) => {
            const isHigh = cause.confidence.includes('High');
            return (
              <div
                key={cause.id}
                className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isHigh ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                    />
                    {cause.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      isHigh
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {cause.type}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-3.5 text-[11px]">
                  {cause.description}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pl-3.5 pt-1">
                  <span>Confidence: <strong className="text-slate-600 dark:text-slate-300">{cause.confidence}</strong></span>
                  <span>Data: {cause.supporting_data}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 text-xs">
      {/* Intent & Confidence Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-brand-950/40 dark:to-indigo-950/30 border border-brand-200/70 dark:border-brand-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-600 text-white shadow-sm shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Detected Intent: <span className="text-brand-600 dark:text-brand-400 font-mono">{intent || 'general_task'}</span>
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
              Confidence Score: <strong className="text-brand-700 dark:text-brand-300">{confidence ? `${Math.round(confidence * 100)}%` : '85%'}</strong>
              {' '}• Classification Engine: {isFallback ? 'Deterministic Rule-Based' : 'AI LLM Service'}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs self-start sm:self-auto">
          <Cpu className="w-3.5 h-3.5 text-brand-500" />
          Adaptive Engine Active
        </span>
      </div>

      {/* Task Interpretation */}
      {explanation && (
        <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 leading-relaxed text-slate-700 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-slate-100 block mb-1">
            Why this layout was arranged:
          </span>
          {explanation}
        </div>
      )}

      {/* Available vs Missing Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Available Info */}
        <div className="p-3 rounded-xl border border-emerald-200/70 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20">
          <h5 className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Information Available In Workspace
          </h5>
          <ul className="space-y-1 text-slate-600 dark:text-slate-300 pl-1">
            {(availableInfo || [
              'Target task telemetry and historical baselines',
              'Relevant contact points and open action items',
            ]).map((info, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{info}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Info */}
        <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <h5 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            Context Not Yet Available (Limitations)
          </h5>
          <ul className="space-y-1 text-slate-500 dark:text-slate-400 pl-1">
            {(missingInfo || [
              'Live external calendar sync (requires OAuth grant)',
              'User exit survey qualitative sentiment feedback',
            ]).map((info, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span>{info}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Next Step */}
      {recommendedNextStep && (
        <div className="p-3 rounded-xl border border-brand-200 dark:border-brand-900/60 bg-brand-50/50 dark:bg-brand-950/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
            <span className="font-medium text-brand-950 dark:text-brand-100">
              <strong className="text-brand-800 dark:text-brand-300">Recommended Next Step:</strong> {recommendedNextStep}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
