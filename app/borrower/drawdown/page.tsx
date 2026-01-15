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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar type="borrower" />

      <main className="lg:pl-64 pt-16">
        <div className="p-6 lg:p-8 max-w-2xl">
          {/* Back Link */}
          <Link
            href="/borrower"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#15191e] transition-colors mb-6"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#15191e]">Request Drawdown</h1>
            <p className="text-gray-500 mt-1">Draw funds from your credit facility</p>
          </div>

          {/* Available Credit Card */}
          <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm mb-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-500">Available Credit</div>
                <div className="text-2xl font-semibold text-green-600 tabular-nums">
                  {formatCurrency(availableCredit)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Facility</div>
                <div className="text-lg font-medium text-[#15191e] tabular-nums">
                  {formatCurrency(borrowerMetrics.creditLimit)}
                </div>
              </div>
            </div>
          </div>

          {/* Drawdown Form */}
          <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
            {state === 'pending' ? (
              // Pending State
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-100 flex items-center justify-center">
                  <svg className="animate-spin h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#15191e] mb-2">Pending Approval</h3>
                <p className="text-gray-500 mb-6">
                  Your drawdown request for {formatCurrency(numericAmount)} is being processed.
                </p>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-left">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Amount</span>
                    <span className="text-[#15191e] font-medium tabular-nums">
                      {formatCurrency(numericAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="text-yellow-600 font-medium">Awaiting Approval</span>
                  </div>
                </div>
              </div>
            ) : (
              // Input State
              <>
                {/* Amount Input */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-gray-600">Drawdown Amount</label>
                    <span className="text-sm text-gray-500">
                      Min: {formatCurrency(minDrawdown)}
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
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
                  {amount && numericAmount < minDrawdown && (
                    <p className="text-sm text-red-500 mt-2">
                      Minimum drawdown is {formatCurrency(minDrawdown)}
                    </p>
                  )}
                  {amount && numericAmount > availableCredit && (
                    <p className="text-sm text-red-500 mt-2">Exceeds available credit</p>
                  )}
                </div>

                {/* Destination Wallet */}
                <div className="mb-6">
                  <label className="text-sm text-gray-600 block mb-2">Destination Wallet (SPV)</label>
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <code className="text-sm text-gray-600 font-mono">{spvAddress}</code>
                      <button
                        onClick={() => navigator.clipboard.writeText(spvAddress)}
                        className="text-gray-400 hover:text-[#15191e] transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-3 py-6 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Interest Rate</span>
                    <span className="text-[#15191e] font-medium">{borrowerMetrics.interestRate}% APR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Monthly Interest</span>
                    <span className="text-[#15191e] font-medium tabular-nums">
                      {numericAmount > 0
                        ? formatCurrency((numericAmount * borrowerMetrics.interestRate) / 100 / 12)
                        : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">After Drawdown Available</span>
                    <span className="text-[#15191e] font-medium tabular-nums">
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
                  className="w-full h-12 bg-[#ff5900] hover:bg-[#e65000] text-white disabled:bg-gray-100 disabled:text-gray-400"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white/70" fill="none" viewBox="0 0 24 24">
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
          <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="flex gap-3">
              <svg className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-gray-700">
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
        <DialogContent className="sm:max-w-md bg-white border-gray-200 text-center">
          <div className="py-6">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-center text-[#15191e]">Drawdown Approved!</DialogTitle>
            </DialogHeader>
            <p className="text-gray-500 mt-2 mb-6">
              Your drawdown request has been approved and funds are being transferred.
            </p>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 mb-6 text-left">
              <div className="flex justify-between mb-3">
                <span className="text-gray-500">Amount</span>
                <span className="text-[#15191e] font-medium tabular-nums">
                  {formatCurrency(numericAmount)}
                </span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-500">Destination</span>
                <span className="text-gray-600 font-mono text-sm">
                  {spvAddress.slice(0, 6)}...{spvAddress.slice(-4)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <span className="text-gray-500">New Available Credit</span>
                <span className="text-green-600 font-medium tabular-nums">
                  {formatCurrency(availableCredit - numericAmount)}
                </span>
              </div>
            </div>
            <Button asChild className="w-full bg-[#ff5900] hover:bg-[#e65000] text-white">
              <Link href="/borrower">View Dashboard</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
