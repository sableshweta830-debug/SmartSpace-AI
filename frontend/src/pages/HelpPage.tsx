import React from 'react';
import {
  HelpCircle,
  Sparkles,
  Layers,
  Cpu,
  Database,
  ArrowRight,
  Code,
  CheckCircle2,
  Calendar,
  TrendingDown,
  ListTodo,
  MessageSquareWarning,
} from 'lucide-react';

export const HelpPage: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-6 max-w-4xl animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <HelpCircle className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          Documentation & Hackathon Demonstration Guide
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          &quot;An interface that adapts to your intent, not the other way around.&quot;
        </p>
      </div>

      {/* Innovation Overview */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col gap-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          How Intent-to-Interface Works
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Traditional web applications trap users behind rigid navigation trees, fixed dashboards, and dozens of nested menus. 
          <strong> SmartSpace AI</strong> inverts this model:
        </p>

        {/* Step by step pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex flex-col gap-1.5">
            <span className="font-bold text-brand-600 dark:text-brand-400 font-mono">1. User Goal</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Natural Language</span>
            <p className="text-[11px] text-slate-500">The user speaks or types what they want to achieve today.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex flex-col gap-1.5">
            <span className="font-bold text-brand-600 dark:text-brand-400 font-mono">2. Classification</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Modular Classifier</span>
            <p className="text-[11px] text-slate-500">Analyzes semantic keywords, entity constraints, and calculated confidence.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex flex-col gap-1.5">
            <span className="font-bold text-brand-600 dark:text-brand-400 font-mono">3. Layout Engine</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Dynamic Synthesis</span>
            <p className="text-[11px] text-slate-500">Selects, prioritizes, sizes, and explains necessary widgets.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex flex-col gap-1.5">
            <span className="font-bold text-brand-600 dark:text-brand-400 font-mono">4. Dynamic UI</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Widget Registry</span>
            <p className="text-[11px] text-slate-500">The interface fluidly reorganizes widgets and persists state in SQLite.</p>
          </div>
        </div>
      </div>

      {/* Hackathon Demonstration Walkthrough */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col gap-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          Judge Demonstration Scenarios
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span>Scenario 1: Client Meeting Preparation</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              <strong>Prompt:</strong> &quot;Prepare for tomorrow&apos;s client meeting.&quot;
              <br />
              <strong>Adaptive Result:</strong> Instantly arranges Client Overview, Recent Email Communications, Previous Meeting Summary, SLA Latency Open Issues, Suggested Talking Points, and a Meeting Brief Generator button.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
              <TrendingDown className="w-4 h-4 text-blue-500" />
              <span>Scenario 2: Investigate Product Usage Decline</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              <strong>Prompt:</strong> &quot;Investigate why product usage dropped this month.&quot;
              <br />
              <strong>Adaptive Result:</strong> Replaces client cards with 30-day time-series telemetry charts, MoM variance indicators, feature adoption breakdown (Recharts), and diagnostic hypotheses correlating release v2.4 deployment.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
              <ListTodo className="w-4 h-4 text-emerald-500" />
              <span>Scenario 3: Review Project Progress</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              <strong>Prompt:</strong> &quot;Review the progress of our ongoing project.&quot;
              <br />
              <strong>Adaptive Result:</strong> Renders project health at 68%, milestone burndown, upcoming sprint deadlines, active blockers, and an interactive task list that updates SQLite when you change task statuses!
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
              <MessageSquareWarning className="w-4 h-4 text-amber-500" />
              <span>Scenario 4: Summarize Customer Complaints</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              <strong>Prompt:</strong> &quot;Summarize recent customer complaints.&quot;
              <br />
              <strong>Adaptive Result:</strong> Synthesizes 142 tickets, category frequency, recurring payment webhooks, and recommended engineering remediations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
