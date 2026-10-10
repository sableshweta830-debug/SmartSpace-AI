import React from 'react';
import { ArrowDownRight, ArrowUpRight, Minus, TrendingDown, Users, Activity, Clock } from 'lucide-react';

interface MetricItem {
  id: string;
  label: string;
  value: string;
  comparison?: string;
  previous?: string;
  trend?: 'up' | 'down' | 'neutral';
  change?: string;
  positive?: boolean;
}

interface MetricCardProps {
  data?: {
    metrics?: MetricItem[];
    measured_period?: string;
    data_status?: string;
  } | MetricItem[];
}

export const MetricCard: React.FC<MetricCardProps> = ({ data }) => {
  // Support both array or object structure
  const metrics: MetricItem[] = Array.isArray(data)
    ? data
    : data?.metrics || [];

  const period = (!Array.isArray(data) && data?.measured_period) || 'Past 30 Days Telemetry';
  const dataStatus = (!Array.isArray(data) && data?.data_status) || 'Measured Demo Telemetry';

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{period}</span>
        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
          {dataStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const isNegative =
            metric.trend === 'down' ||
            (metric.change && metric.change.startsWith('-')) ||
            (metric.comparison && metric.comparison.startsWith('-'));

          return (
            <div
              key={metric.id}
              className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 truncate">
                {metric.label}
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                  {metric.value}
                </span>
                <span
                  className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-lg ${
                    isNegative
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                      : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                  }`}
                >
                  {isNegative ? (
                    <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  )}
                  {metric.comparison || metric.change}
                </span>
              </div>
              {metric.previous && (
                <div className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
                  Previous: <span className="font-medium text-slate-600 dark:text-slate-300">{metric.previous}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
