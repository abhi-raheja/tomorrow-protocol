'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { poolMetrics, mockWalletBalance } from '@/lib/dummy-data';

export default function DepositPage() {
  const [amount, setAmount] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const numericAmount = parseFloat(amount) || 0;
  const estimatedShares = numericAmount * 0.98; // Mock calculation
  const walletBalance = mockWalletBalance;

  // Validation
  const isValidAmount = numericAmount >= 1000 && numericAmount <= 1000000;
  const hasBalance = numericAmount <= walletBalance;
  const canDeposit = isValidAmount && hasBalance && isApproved;

  const handleApprove = async () => {
    setIsApproving(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsApproved(true);
    setIsApproving(false);
  };

  const handleDeposit = async () => {
    if (!canDeposit) return;
    setIsDepositing(true);
    await new Promise((r) => setTimeout(r, 2500));
    setIsDepositing(false);
    setShowSuccess(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleMaxClick = () => {
    setAmount(Math.min(walletBalance, 1000000).toString());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar type="lp" />

      <main className="lg:pl-64 pt-16">
        <div className="p-6 lg:p-8 max-w-2xl">
          {/* Back Link */}
          <Link
            href="/lp"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#15191e] transition-colors mb-6"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#15191e]">Deposit</h1>
            <p className="text-gray-500 mt-1">Add USDC to the pool and start earning yield</p>
          </div>

          {/* Deposit Form */}
          <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
            {/* Amount Input */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-gray-600">Amount</label>
                <span className="text-sm text-gray-500">
                  Balance: {formatCurrency(walletBalance)} USDC
                </span>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setIsApproved(false);
                  }}
                  className="h-14 text-2xl font-semibold bg-gray-50 border-gray-200 text-[#15191e] placeholder:text-gray-300 pr-24"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    onClick={handleMaxClick}
                    className="text-xs text-gray-500 hover:text-[#15191e] px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    MAX
                  </button>
                  <span className="text-gray-500 font-medium">USDC</span>
                </div>
              </div>

              {/* Validation Messages */}
              {amount && !isValidAmount && numericAmount < 1000 && (
                <p className="text-sm text-red-500 mt-2">Minimum deposit is $1,000</p>
              )}
              {amount && numericAmount > 1000000 && (
                <p className="text-sm text-red-500 mt-2">Maximum deposit is $1,000,000</p>
              )}
              {amount && isValidAmount && !hasBalance && (
                <p className="text-sm text-red-500 mt-2">Insufficient balance</p>
              )}
            </div>

            {/* Deposit Summary */}
            <div className="space-y-4 py-6 border-t border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Shares</span>
                <span className="text-[#15191e] font-medium tabular-nums">
                  {numericAmount > 0 ? estimatedShares.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Current APY</span>
                <span className="text-[#ff5900] font-medium">{poolMetrics.apy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Pool Utilization</span>
                <span className="text-[#15191e] font-medium">{poolMetrics.utilization}%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-100">
              {!isApproved ? (
                <Button
                  onClick={handleApprove}
                  disabled={!isValidAmount || !hasBalance || isApproving}
                  className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-[#15191e] border border-gray-200"
                >
                  {isApproving ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner />
                      Approving...
                    </span>
                  ) : (
                    'Approve USDC'
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleDeposit}
                  disabled={!canDeposit || isDepositing}
                  className="flex-1 h-12 bg-[#ff5900] hover:bg-[#e65000] text-white"
                >
                  {isDepositing ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner />
                      Depositing...
                    </span>
                  ) : (
                    'Deposit'
                  )}
                </Button>
              )}
            </div>

            {/* Approval Status */}
            {isApproved && (
              <div className="flex items-center gap-2 mt-4 text-sm text-green-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                USDC approved
              </div>
            )}
          </div>

          {/* Info Card */}
          <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="flex gap-3">
              <svg className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-gray-700">
                  Deposits are used to fund creator advances through Everbloom. Yield is generated
                  from repayments and distributed proportionally to your share of the pool.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md bg-white border-gray-200 text-center">
          <div className="py-6">
            {/* Success Icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-center text-[#15191e]">Deposit Successful!</DialogTitle>
            </DialogHeader>
            <p className="text-gray-500 mt-2 mb-6">
              You have deposited {formatCurrency(numericAmount)} USDC
            </p>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Shares Received</span>
                <span className="text-[#15191e] font-medium tabular-nums">
                  {estimatedShares.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Current APY</span>
                <span className="text-[#ff5900] font-medium">{poolMetrics.apy}%</span>
              </div>
            </div>
            <Button asChild className="w-full bg-[#ff5900] hover:bg-[#e65000] text-white">
              <Link href="/lp">View Dashboard</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LoadingSpinner({ dark = false }: { dark?: boolean }) {
  return (
    <svg
      className={`animate-spin h-4 w-4 ${dark ? 'text-gray-400' : 'text-white/70'}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
