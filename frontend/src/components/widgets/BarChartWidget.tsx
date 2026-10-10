import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

interface BarChartWidgetProps {
  data?: any;
}

export const BarChartWidget: React.FC<BarChartWidgetProps> = ({ data }) => {
  // Can accept feature_adoption or complaint categories
  let chartData: Array<{ name: string; value: number; sub?: string; color?: string }> = [];

  if (data?.feature_adoption) {
    const most = (data.feature_adoption.most_used || []).map((item: any) => ({
      name: item.feature.length > 20 ? item.feature.substring(0, 18) + '...' : item.feature,
      value: item.adoptionRate,
      sub: `${item.monthlyEvents} events`,
      color: '#8b5cf6',
    }));
    const least = (data.feature_adoption.least_used || []).map((item: any) => ({
      name: item.feature.length > 20 ? item.feature.substring(0, 18) + '...' : item.feature,
      value: item.adoptionRate,
      sub: `${item.monthlyEvents} events`,
      color: '#f43f5e',
    }));
    chartData = [...most, ...least];
  } else if (data?.categories) {
    chartData = data.categories.map((c: any) => ({
      name: c.name,
      value: c.count,
      sub: `${c.percentage}%`,
      color: c.color || '#6366f1',
    }));
  } else if (Array.isArray(data)) {
    chartData = data;
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Adoption Rate / Ticket Count Comparison</span>
        <span className="text-[11px] font-medium text-slate-400">Calculated from demo dataset</span>
      </div>

      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              angle={-20}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderRadius: '12px',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(val: any, _name: any, item: any) => [
                `${val}${item.payload.sub ? ` (${item.payload.sub})` : ''}`,
                'Metric',
              ]}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
