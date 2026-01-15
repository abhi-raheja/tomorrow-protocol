'use client';

import { poolMetrics } from '@/lib/dummy-data';

export function UtilizationGauge() {
  const percentage = poolMetrics.utilization;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#ff5900"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-[#15191e] tabular-nums">
            {percentage}%
          </span>
          <span className="text-xs text-gray-500">Utilized</span>
        </div>
      </div>
    </div>
  );
}

export function MetricCard({
  label,
  value,
  subValue,
  trend,
}: {
  label: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <div className="p-5 rounded-xl bg-white border border-gray-100 shadow-sm">
      <div className="text-sm text-gray-500 mb-2">{label}</div>
      <div className="text-2xl font-semibold text-[#15191e] tabular-nums">{value}</div>
      {subValue && (
        <div
          className={`text-sm mt-1 tabular-nums ${
            trend === 'up'
              ? 'text-green-600'
              : trend === 'down'
              ? 'text-green-600'
              : 'text-gray-500'
          }`}
        >
          {subValue}
        </div>
      )}
    </div>
  );
}

export function PoolMetricsGrid() {
  const formatCurrency = (value: number) => {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <MetricCard
        label="Total Loans"
        value={poolMetrics.totalLoans.toString()}
        subValue="Active"
      />
      <MetricCard
        label="Active Creators"
        value={poolMetrics.activeCreators.toString()}
      />
      <MetricCard
        label="Default Rate"
        value={`${poolMetrics.defaultRate}%`}
        trend="down"
        subValue="Low risk"
      />
      <MetricCard
        label="Available Liquidity"
        value={formatCurrency(poolMetrics.liquidity)}
      />
      <MetricCard
        label="Collection Rate"
        value="98.2%"
        trend="up"
        subValue="90-day"
      />
      <MetricCard
        label="Avg Loan Size"
        value="$38.3K"
      />
    </div>
  );
}
