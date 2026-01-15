'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  poolMetrics,
  borrowerMetrics,
  defaultRateHistory,
  collectionRateHistory,
  creatorConcentration,
  poolSettings,
} from '@/lib/dummy-data';

export default function AdminDashboard() {
  const [depositsEnabled, setDepositsEnabled] = useState(poolSettings.depositsEnabled);
  const [withdrawalsEnabled, setWithdrawalsEnabled] = useState(poolSettings.withdrawalsEnabled);
  const [showPauseModal, setShowPauseModal] = useState<'deposits' | 'withdrawals' | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [newCreditLimit, setNewCreditLimit] = useState(borrowerMetrics.creditLimit.toString());
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustSuccess, setAdjustSuccess] = useState(false);

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  const handleTogglePause = (type: 'deposits' | 'withdrawals') => {
    if (type === 'deposits' && depositsEnabled) {
      setShowPauseModal('deposits');
    } else if (type === 'withdrawals' && withdrawalsEnabled) {
      setShowPauseModal('withdrawals');
    } else {
      if (type === 'deposits') setDepositsEnabled(true);
      if (type === 'withdrawals') setWithdrawalsEnabled(true);
    }
  };

  const confirmPause = () => {
    if (showPauseModal === 'deposits') {
      setDepositsEnabled(false);
    } else if (showPauseModal === 'withdrawals') {
      setWithdrawalsEnabled(false);
    }
    setShowPauseModal(null);
  };

  const handleAdjustLimit = async () => {
    setIsAdjusting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsAdjusting(false);
    setAdjustSuccess(true);
  };

  const COLORS = ['#ff5900', '#15191e', '#3b82f6', '#10b981', '#8b5cf6', '#6b7280'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar type="admin" />

      <main className="lg:pl-64 pt-16">
        <div className="p-6 lg:p-8 max-w-7xl">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-[#15191e]">Admin Dashboard</h1>
              <p className="text-gray-500 mt-1">Monitor and manage protocol operations</p>
            </div>
            <Button asChild variant="outline" className="border-gray-300 text-[#15191e] hover:bg-gray-100">
              <Link href="/admin/settings">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Link>
            </Button>
          </div>

          {/* Pool Overview */}
          <section className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Pool Overview
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard label="Total Value Locked" value={formatCurrency(poolMetrics.tvl)} trend="+5.2%" trendUp />
              <MetricCard label="Pool Utilization" value={`${poolMetrics.utilization}%`} />
              <MetricCard label="Current APY" value={`${poolMetrics.apy}%`} highlight />
              <MetricCard label="Available Liquidity" value={formatCurrency(poolMetrics.liquidity)} />
            </div>
          </section>

          {/* Borrower Management */}
          <section className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Borrower Management
            </h2>
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#ff5900]/20 to-orange-200 flex items-center justify-center">
                      <span className="text-lg font-semibold text-[#ff5900]">E</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-[#15191e]">Everbloom</h3>
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                          Active
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Creator financing platform</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowAdjustModal(true)}
                    variant="outline"
                    className="border-gray-300 text-[#15191e] hover:bg-gray-100"
                  >
                    Adjust Limit
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-100">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Credit Limit</div>
                    <div className="text-xl font-semibold text-[#15191e] tabular-nums">
                      {formatCurrency(borrowerMetrics.creditLimit)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Amount Drawn</div>
                    <div className="text-xl font-semibold text-[#15191e] tabular-nums">
                      {formatCurrency(borrowerMetrics.drawn)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Utilization</div>
                    <div className="text-xl font-semibold text-[#15191e] tabular-nums">
                      {((borrowerMetrics.drawn / borrowerMetrics.creditLimit) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Risk Monitoring */}
          <section className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Risk Monitoring
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Default Rate Chart */}
              <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-500">Default Rate</div>
                  <div className="text-lg font-semibold text-green-600 tabular-nums">
                    {poolMetrics.defaultRate}%
                  </div>
                </div>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={defaultRateHistory}>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(v) => `${v}%`} width={40} />
                      <Tooltip content={<CustomTooltip suffix="%" />} />
                      <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Collection Rate Chart */}
              <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-500">Collection Rate</div>
                  <div className="text-lg font-semibold text-blue-600 tabular-nums">98.2%</div>
                </div>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={collectionRateHistory}>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(v) => `${v}%`} domain={[95, 100]} width={40} />
                      <Tooltip content={<CustomTooltip suffix="%" />} />
                      <Line type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Concentration Chart */}
              <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-500">Creator Concentration</div>
                  <div className="text-lg font-semibold text-[#15191e]">Top 10: 28%</div>
                </div>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={creatorConcentration}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {creatorConcentration.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>

          {/* Emergency Controls */}
          <section>
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Emergency Controls
            </h2>
            <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pause Deposits */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div>
                    <div className="font-medium text-[#15191e]">Deposits</div>
                    <div className="text-sm text-gray-500">
                      {depositsEnabled ? 'Deposits are enabled' : 'Deposits are paused'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${depositsEnabled ? 'text-green-600' : 'text-red-500'}`}>
                      {depositsEnabled ? 'Enabled' : 'Paused'}
                    </span>
                    <Switch
                      checked={depositsEnabled}
                      onCheckedChange={() => handleTogglePause('deposits')}
                    />
                  </div>
                </div>

                {/* Pause Withdrawals */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                  <div>
                    <div className="font-medium text-[#15191e]">Withdrawals</div>
                    <div className="text-sm text-gray-500">
                      {withdrawalsEnabled ? 'Withdrawals are enabled' : 'Withdrawals are paused'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${withdrawalsEnabled ? 'text-green-600' : 'text-red-500'}`}>
                      {withdrawalsEnabled ? 'Enabled' : 'Paused'}
                    </span>
                    <Switch
                      checked={withdrawalsEnabled}
                      onCheckedChange={() => handleTogglePause('withdrawals')}
                    />
                  </div>
                </div>
              </div>

              {/* Warning */}
              {(!depositsEnabled || !withdrawalsEnabled) && (
                <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-100">
                  <div className="flex gap-3">
                    <svg className="h-5 w-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-sm text-red-600 font-medium">Emergency controls active</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {!depositsEnabled && !withdrawalsEnabled
                          ? 'Both deposits and withdrawals are currently paused.'
                          : !depositsEnabled
                          ? 'Deposits are currently paused.'
                          : 'Withdrawals are currently paused.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Pause Confirmation Modal */}
      <Dialog open={showPauseModal !== null} onOpenChange={() => setShowPauseModal(null)}>
        <DialogContent className="sm:max-w-md bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-red-500">
              Pause {showPauseModal === 'deposits' ? 'Deposits' : 'Withdrawals'}?
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              This will immediately prevent all users from making {showPauseModal}.
              Are you sure you want to continue?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowPauseModal(null)}
              className="flex-1 border-gray-300 text-[#15191e] hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmPause}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              Confirm Pause
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Adjust Credit Limit Modal */}
      <Dialog open={showAdjustModal} onOpenChange={(open) => {
        setShowAdjustModal(open);
        if (!open) {
          setAdjustSuccess(false);
          setNewCreditLimit(borrowerMetrics.creditLimit.toString());
        }
      }}>
        <DialogContent className="sm:max-w-md bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#15191e]">
              {adjustSuccess ? 'Limit Updated!' : 'Adjust Credit Limit'}
            </DialogTitle>
          </DialogHeader>

          {adjustSuccess ? (
            <div className="py-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-500 mb-4">
                Credit limit for Everbloom has been updated to {formatCurrency(parseFloat(newCreditLimit))}.
              </p>
              <Button
                onClick={() => {
                  setShowAdjustModal(false);
                  setAdjustSuccess(false);
                }}
                className="bg-[#ff5900] hover:bg-[#e65000] text-white"
              >
                Done
              </Button>
            </div>
          ) : (
            <div className="py-4">
              <div className="mb-4">
                <label className="text-sm text-gray-500 block mb-2">Current Limit</label>
                <div className="text-2xl font-semibold text-[#15191e] tabular-nums">
                  {formatCurrency(borrowerMetrics.creditLimit)}
                </div>
              </div>
              <div className="mb-6">
                <label className="text-sm text-gray-500 block mb-2">New Credit Limit</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <Input
                    type="number"
                    value={newCreditLimit}
                    onChange={(e) => setNewCreditLimit(e.target.value)}
                    className="pl-8 h-12 text-lg bg-gray-50 border-gray-200 text-[#15191e]"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAdjustModal(false)}
                  className="flex-1 border-gray-300 text-[#15191e] hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAdjustLimit}
                  disabled={isAdjusting}
                  className="flex-1 bg-[#ff5900] hover:bg-[#e65000] text-white"
                >
                  {isAdjusting ? 'Updating...' : 'Update Limit'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MetricCard({
  label,
  value,
  trend,
  trendUp,
  highlight = false,
}: {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={`p-5 rounded-xl border shadow-sm ${highlight ? 'bg-orange-50 border-orange-100' : 'bg-white border-gray-100'}`}>
      <div className="text-sm text-gray-500 mb-2">{label}</div>
      <div className={`text-2xl font-semibold tabular-nums ${highlight ? 'text-[#ff5900]' : 'text-[#15191e]'}`}>
        {value}
      </div>
      {trend && (
        <div className={`text-sm mt-1 ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
          {trend}
        </div>
      )}
    </div>
  );
}

function CustomTooltip({ active, payload, label, suffix = '' }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-medium text-[#15191e]">{payload[0].value}{suffix}</p>
      </div>
    );
  }
  return null;
}

function PieTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-medium text-[#15191e]">{payload[0].name}: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
}
