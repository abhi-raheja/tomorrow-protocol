'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { YieldChart } from '@/components/dashboard/YieldChart';
import { UtilizationGauge, PoolMetricsGrid } from '@/components/dashboard/PoolMetrics';
import { TransactionHistory } from '@/components/dashboard/TransactionHistory';
import { currentUserPosition, poolMetrics } from '@/lib/dummy-data';

export default function LPDashboard() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar type="lp" />

      {/* Main Content */}
      <main className="lg:pl-64 pt-16">
        <div className="p-6 lg:p-8 max-w-7xl">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-[#15191e]">Dashboard</h1>
              <p className="text-gray-500 mt-1">Monitor your LP position and pool metrics</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild className="border-gray-300 text-[#15191e] hover:bg-gray-100">
                <Link href="/lp/withdraw">Withdraw</Link>
              </Button>
              <Button asChild className="bg-[#ff5900] hover:bg-[#e65000] text-white">
                <Link href="/lp/deposit">Deposit</Link>
              </Button>
            </div>
          </div>

          {/* Portfolio Overview */}
          <section className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Portfolio Overview
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <OverviewCard
                label="Total Deposited"
                value={formatCurrency(currentUserPosition.deposited)}
              />
              <OverviewCard
                label="Current Value"
                value={formatCurrency(currentUserPosition.currentValue)}
                highlight
              />
              <OverviewCard
                label="Accrued Yield"
                value={`+${formatCurrency(currentUserPosition.accruedYield)}`}
                trend="up"
              />
              <OverviewCard
                label="Current APY"
                value={`${currentUserPosition.apy}%`}
                subValue="Earning"
              />
            </div>
          </section>

          {/* Pool Health */}
          <section className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Pool Health
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Utilization */}
              <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="text-sm text-gray-500 mb-4">Pool Utilization</div>
                <UtilizationGauge />
                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-gray-500">Available</span>
                  <span className="text-[#15191e] font-medium">{formatCurrency(poolMetrics.liquidity)}</span>
                </div>
              </div>

              {/* TVL Chart */}
              <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-500">TVL (6 months)</div>
                  <div className="text-lg font-semibold text-[#15191e] tabular-nums">
                    {formatCurrency(poolMetrics.tvl)}
                  </div>
                </div>
                <YieldChart type="tvl" />
              </div>

              {/* APY Chart */}
              <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-500">APY (6 months)</div>
                  <div className="text-lg font-semibold text-[#ff5900] tabular-nums">
                    {poolMetrics.apy}%
                  </div>
                </div>
                <YieldChart type="apy" />
              </div>
            </div>
          </section>

          {/* Pool Metrics */}
          <section className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Pool Metrics
            </h2>
            <PoolMetricsGrid />
          </section>

          {/* Recent Activity */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Recent Activity
              </h2>
              <button className="text-sm text-gray-500 hover:text-[#15191e] transition-colors">
                View All
              </button>
            </div>
            <TransactionHistory />
          </section>
        </div>
      </main>
    </div>
  );
}

function OverviewCard({
  label,
  value,
  subValue,
  trend,
  highlight = false,
}: {
  label: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down';
  highlight?: boolean;
}) {
  return (
    <div className={`p-5 rounded-xl border shadow-sm ${highlight ? 'bg-orange-50 border-orange-100' : 'bg-white border-gray-100'}`}>
      <div className="text-sm text-gray-500 mb-2">{label}</div>
      <div
        className={`text-2xl font-semibold tabular-nums ${
          trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-500' : 'text-[#15191e]'
        }`}
      >
        {value}
      </div>
      {subValue && (
        <div className="text-sm text-gray-500 mt-1">{subValue}</div>
      )}
    </div>
  );
}
