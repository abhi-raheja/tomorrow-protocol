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
import { borrowerMetrics } from '@/lib/dummy-data';

type DrawdownState = 'input' | 'pending' | 'approved';

export default function DrawdownPage() {
  const [amount, setAmount] = useState('');
  const [state, setState] = useState<DrawdownState>('input');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const numericAmount = parseFloat(amount) || 0;
  const availableCredit = borrowerMetrics.available;
  const minDrawdown = 10000;
  const spvAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

  const isValidAmount = numericAmount >= minDrawdown && numericAmount <= availableCredit;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSubmit = async () => {
    if (!isValidAmount) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsSubmitting(false);
    setState('pending');

    // Simulate approval after 3 seconds
    setTimeout(() => {
      setState('approved');
      setShowSuccess(true);
    }, 3000);
  };

  const handleMaxClick = () => {
    setAmount(availableCredit.toString());
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <Sidebar type="borrower" />

      <main className="lg:pl-64 pt-16">
        <div className="p-6 lg:p-8 max-w-2xl">
          {/* Back Link */}
          <Link
            href="/borrower"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors mb-6"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-white">Request Drawdown</h1>
            <p className="text-white/50 mt-1">Draw funds from your credit facility</p>
          </div>

          {/* Available Credit Card */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] mb-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-white/40">Available Credit</div>
                <div className="text-2xl font-semibold text-emerald-400 tabular-nums">
                  {formatCurrency(availableCredit)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/40">Total Facility</div>
                <div className="text-lg font-medium text-white tabular-nums">
                  {formatCurrency(borrowerMetrics.creditLimit)}
                </div>
              </div>
            </div>
          </div>

          {/* Drawdown Form */}
          <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.08]">
            {state === 'pending' ? (
              // Pending State
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <svg className="animate-spin h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Pending Approval</h3>
                <p className="text-white/50 mb-6">
                  Your drawdown request for {formatCurrency(numericAmount)} is being processed.
                </p>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] text-left">
                  <div className="flex justify-between mb-2">
                    <span className="text-white/50">Amount</span>
                    <span className="text-white font-medium tabular-nums">
                      {formatCurrency(numericAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Status</span>
                    <span className="text-yellow-400 font-medium">Awaiting Approval</span>
                  </div>
                </div>
              </div>
            ) : (
              // Input State
              <>
                {/* Amount Input */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-white/60">Drawdown Amount</label>
                    <span className="text-sm text-white/40">
                      Min: {formatCurrency(minDrawdown)}
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-14 text-2xl font-semibold bg-white/[0.02] border-white/[0.08] text-white placeholder:text-white/20 pr-24"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button
                        onClick={handleMaxClick}
                        className="text-xs text-white/40 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        MAX
                      </button>
                      <span className="text-white/40 font-medium">USDC</span>
                    </div>
                  </div>

                  {/* Validation Messages */}
                  {amount && numericAmount < minDrawdown && (
                    <p className="text-sm text-red-400 mt-2">
                      Minimum drawdown is {formatCurrency(minDrawdown)}
                    </p>
                  )}
                  {amount && numericAmount > availableCredit && (
                    <p className="text-sm text-red-400 mt-2">Exceeds available credit</p>
                  )}
                </div>

                {/* Destination Wallet */}
                <div className="mb-6">
                  <label className="text-sm text-white/60 block mb-2">Destination Wallet (SPV)</label>
                  <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.08]">
                    <div className="flex items-center justify-between">
                      <code className="text-sm text-white/70 font-mono">{spvAddress}</code>
                      <button
                        onClick={() => navigator.clipboard.writeText(spvAddress)}
                        className="text-white/40 hover:text-white/60 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-3 py-6 border-t border-white/[0.08]">
                  <div className="flex justify-between">
                    <span className="text-white/50">Interest Rate</span>
                    <span className="text-white font-medium">{borrowerMetrics.interestRate}% APR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Monthly Interest</span>
                    <span className="text-white font-medium tabular-nums">
                      {numericAmount > 0
                        ? formatCurrency((numericAmount * borrowerMetrics.interestRate) / 100 / 12)
                        : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">After Drawdown Available</span>
                    <span className="text-white font-medium tabular-nums">
                      {numericAmount > 0
                        ? formatCurrency(availableCredit - numericAmount)
                        : formatCurrency(availableCredit)}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={!isValidAmount || isSubmitting}
                  className="w-full h-12 bg-white text-black hover:bg-white/90 disabled:bg-white/10 disabled:text-white/40"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-black/50" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Request Drawdown'
                  )}
                </Button>
              </>
            )}
          </div>

          {/* Info Card */}
          <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex gap-3">
              <svg className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-white/70">
                  Drawdown requests are typically processed within 24 hours. Funds will be sent
                  to your designated SPV wallet address.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md bg-[#141414] border-white/10 text-center">
          <div className="py-6">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-center">Drawdown Approved!</DialogTitle>
            </DialogHeader>
            <p className="text-white/50 mt-2 mb-6">
              Your drawdown request has been approved and funds are being transferred.
            </p>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] mb-6 text-left">
              <div className="flex justify-between mb-3">
                <span className="text-white/50">Amount</span>
                <span className="text-white font-medium tabular-nums">
                  {formatCurrency(numericAmount)}
                </span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-white/50">Destination</span>
                <span className="text-white/70 font-mono text-sm">
                  {spvAddress.slice(0, 6)}...{spvAddress.slice(-4)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-white/[0.08]">
                <span className="text-white/50">New Available Credit</span>
                <span className="text-emerald-400 font-medium tabular-nums">
                  {formatCurrency(availableCredit - numericAmount)}
                </span>
              </div>
            </div>
            <Button asChild className="w-full bg-white text-black hover:bg-white/90">
              <Link href="/borrower">View Dashboard</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
