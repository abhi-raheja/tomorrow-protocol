'use client';

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  type TooltipContentProps,
} from 'recharts';
import { apyHistory, tvlHistory } from '@/lib/dummy-data';

interface ChartProps {
  type: 'apy' | 'tvl';
}

type YieldChartTooltipProps = Partial<TooltipContentProps<number, string>> & {
  formatValue: (value: number) => string;
};

function YieldChartTooltip({ active, payload, label, formatValue }: YieldChartTooltipProps) {
  const rawValue = payload?.[0]?.value;
  if (!active || typeof rawValue !== 'number') {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs text-gray-500 mb-1">{typeof label === 'string' ? label : ''}</p>
      <p className="text-sm font-medium text-[#15191e]">{formatValue(rawValue)}</p>
    </div>
  );
}

export function YieldChart({ type }: ChartProps) {
  const data = type === 'apy' ? apyHistory : tvlHistory;
  const dataKey = type === 'apy' ? 'apy' : 'tvl';
  const color = type === 'apy' ? '#ff5900' : '#15191e';

  const formatValue = (value: number) => {
    if (type === 'tvl') {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    return `${value}%`;
  };

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.15} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={formatValue}
            width={50}
          />
          <Tooltip content={<YieldChartTooltip formatValue={formatValue} />} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${type})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
