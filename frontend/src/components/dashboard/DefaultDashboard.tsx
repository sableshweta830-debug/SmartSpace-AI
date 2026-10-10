import React from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  FolderKanban,
  CheckSquare,
  Users,
  Activity,
  Calendar,
  Clock,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { DefaultDashboardData } from '../../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface DefaultDashboardProps {
  data: DefaultDashboardData;
  onSelectPrompt: (prompt: string) => void;
}

export const DefaultDashboard: React.FC<DefaultDashboardProps> = ({
  data,
  onSelectPrompt,
}) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    FolderKanban,
    CheckSquare,
    Users,
    Activity,
    Calendar,
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-brand-600 via-indigo-600 to-blue-600 text-white shadow-xl shadow-brand-500/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Driven Dynamic Workspace Engine
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {data.welcome.greeting}
          </h2>
          <p className="text-sm sm:text-base text-brand-100 leading-relaxed mb-6">
            {data.welcome.subheading}
          </p>
          <div className="flex items-center gap-3 text-xs text-brand-200">
            <span className="px-2.5 py-1 rounded-lg bg-black/20 backdrop-blur-xs font-mono">
              Status: Live Intelligent Adaptive Engine
            </span>
            <span>•</span>
            <span className="text-white/80">Demo User: Alex Mercer (Engineering Lead)</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.quick_stats.map((stat) => {
          const IconComponent = iconMap[stat.icon] || Activity;
          return (
            <div
              key={stat.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col gap-2"
            >
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="text-xs font-medium">{stat.label}</span>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400">
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {stat.value}
              </div>
              <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                {stat.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Quick Action Cards + Analytics Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Actions (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Quick Intent Scenarios
            </h3>
            <span className="text-xs text-slate-400">Click to transform workspace</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.quick_actions.map((act) => (
              <button
                key={act.id}
                onClick={() => onSelectPrompt(act.prompt)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
                      {act.badge}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {act.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    &quot;{act.prompt}&quot;
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Recent Activity Feed */}
          <div className="mt-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>Recent Team Activity</span>
              <span className="text-[10px] font-normal text-slate-400 font-mono">Demo Telemetry Log</span>
            </h4>
            <div className="space-y-3">
              {data.recent_activity.map((act) => (
                <div key={act.id} className="flex items-start justify-between text-xs gap-3">
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{act.user}</span>{' '}
                      <span className="text-slate-500 dark:text-slate-400">{act.action}</span>{' '}
                      <span className="font-medium text-slate-700 dark:text-slate-300">({act.project})</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Snapshot Preview (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Analytics Baseline
            </h3>
            <span className="text-[11px] text-slate-400">30-Day Trend</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Weekly Active Users</span>
                <span className="text-xl font-bold text-slate-900 dark:text-slate-100">14,280</span>
              </div>
              <span className="text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-lg">
                -18.4% Recent Drop
              </span>
            </div>

            <div className="w-full h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.sample_analytics_preview} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.3" />
                      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.0" />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" tickLine={false} />
                  <YAxis fontSize={10} stroke="#94a3b8" tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderRadius: '8px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Area type="monotone" dataKey="activeUsers" stroke="#8b5cf6" strokeWidth={2} fill="url(#areaGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              💡 Tip: Click &quot;Investigate why product usage dropped this month&quot; to inspect full cohort and feature telemetry.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
