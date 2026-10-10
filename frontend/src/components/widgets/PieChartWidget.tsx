import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

interface PieChartWidgetProps {
  data?: any;
}

export const PieChartWidget: React.FC<PieChartWidgetProps> = ({ data }) => {
  let chartData: Array<{ name: string; value: number; color?: string; change?: string }> = [];

  if (data?.task_distribution) {
    chartData = data.task_distribution;
  } else if (data?.segment_analysis) {
    chartData = data.segment_analysis.map((s: any) => ({
      name: s.segment,
      value: parseInt(s.activeUsers.replace(/,/g, ''), 10) || 10,
      color: s.color,
      change: s.change,
    }));
  } else if (data?.priority_distribution) {
    chartData = data.priority_distribution.map((p: any) => ({
      name: p.priority,
      value: p.count,
      color: p.color,
      change: `${p.percentage}%`,
    }));
  } else if (Array.isArray(data)) {
    chartData = data;
  }

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b'];

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full h-60 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderRadius: '12px',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(val: any, _name: any, item: any) => [
                `${val} ${item.payload.change ? `(${item.payload.change})` : ''}`,
                item.payload.name,
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {data?.segment_analysis && (
        <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
          {data.segment_analysis.map((seg: any) => (
            <div key={seg.segment} className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{seg.segment}</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{seg.change}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
