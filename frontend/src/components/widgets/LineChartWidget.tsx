import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface LineChartWidgetProps {
  data?: any;
}

export const LineChartWidget: React.FC<LineChartWidgetProps> = ({ data }) => {
  const chartData = Array.isArray(data) ? data : data?.usage_trend_chart || [];

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Daily Active Users: Current Period vs Historical Baseline</span>
        <span className="text-rose-500 font-medium">⚠️ Drop correlated with v2.4 Release</span>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
            <XAxis
              dataKey="day"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1', opacity: 0.5 }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1', opacity: 0.5 }}
              tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderRadius: '12px',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              }}
              formatter={(val: any) => [`${Number(val).toLocaleString()} Users`, '']}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="currentPeriod"
              name="Current 30-Day Period"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ r: 3, fill: '#8b5cf6' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="previousPeriod"
              name="Historical Baseline"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[11px] text-slate-400 dark:text-slate-500 italic text-center">
        Telemetry reveals baseline stability at ~22,000 DAU until Day 14, followed by a steep drop to 14,280.
      </p>
    </div>
  );
};
