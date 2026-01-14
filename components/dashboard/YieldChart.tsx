'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { apyHistory, tvlHistory } from '@/lib/dummy-data';

interface ChartProps {
  type: 'apy' | 'tvl';
}

export function YieldChart({ type }: ChartProps) {
  const data = type === 'apy' ? apyHistory : tvlHistory;
  const dataKey = type === 'apy' ? 'apy' : 'tvl';
  const color = type === 'apy' ? '#10b981' : '#3b82f6';

  const formatValue = (value: number) => {
    if (type === 'tvl') {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    return `${value}%`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1f1f1f] border border-white/10 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-xs text-white/50 mb-1">{label}</p>
          <p className="text-sm font-medium text-white">
            {formatValue(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#a1a1a1', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#a1a1a1', fontSize: 12 }}
            tickFormatter={formatValue}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
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
