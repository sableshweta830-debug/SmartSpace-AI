import React from 'react';
import { Calendar, TrendingDown, ListTodo, CheckCircle2, Database, Sparkles, Layers } from 'lucide-react';

interface DemoTaskBarProps {
  onSelectScenario: (prompt: string) => void;
  currentIntent?: string;
  hasLoadedWorkspace?: boolean;
  widgetCount?: number;
}

export const DemoTaskBar: React.FC<DemoTaskBarProps> = ({
  onSelectScenario,
  currentIntent,
  hasLoadedWorkspace = false,
  widgetCount = 0,
}) => {
  const scenarios = [
    {
      id: 'meeting',
      title: 'Prepare for a Client Meeting',
      prompt: "Prepare for tomorrow's client meeting.",
      icon: Calendar,
      focus: 'Client profile, meeting notes & talking points',
      color: 'hover:border-purple-500 hover:shadow-purple-500/10',
      activeColor: 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300',
    },
    {
      id: 'usage',
      title: 'Investigate Product Usage',
      prompt: "Investigate why product usage dropped this month.",
      icon: TrendingDown,
      focus: 'Usage telemetry, 30d trend charts & potential causes',
      color: 'hover:border-blue-500 hover:shadow-blue-500/10',
      activeColor: 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300',
    },
    {
      id: 'project',
      title: 'Review Project Progress',
      prompt: "Review the progress of our ongoing project.",
      icon: ListTodo,
      focus: 'Milestone burnup, deadlines & interactive task sync',
      color: 'hover:border-emerald-500 hover:shadow-emerald-500/10',
      activeColor: 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400">
            <Sparkles className="w-4 h-4" />
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Judges & Demo Quick-Switch Scenarios
          </h3>
        </div>

        {/* Processing Status Indicators */}
        {hasLoadedWorkspace && (
          <div className="flex items-center flex-wrap gap-2 text-[10px] font-semibold text-slate-600 dark:text-slate-300 animate-in fade-in duration-300">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Intent Detected
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <Layers className="w-3 h-3 text-blue-500" /> {widgetCount} Widgets Configured
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <Database className="w-3 h-3 text-slate-400" /> Source: Demo Data
            </span>
          </div>
        )}
      </div>

      {/* 3 Primary Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          const isActive =
            (sc.id === 'meeting' && currentIntent === 'meeting_preparation') ||
            (sc.id === 'usage' && currentIntent === 'product_usage_analysis') ||
            (sc.id === 'project' && currentIntent === 'project_review');

          return (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc.prompt)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col gap-1.5 shadow-2xs ${sc.color} ${
                isActive
                  ? sc.activeColor
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Icon className="w-4 h-4 text-brand-500" />
                  {sc.title}
                </span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                )}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                {sc.focus}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
