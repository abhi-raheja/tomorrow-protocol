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
import { currentUserPosition, poolMetrics, withdrawalQueue } from '@/lib/dummy-data';

type WithdrawOption = 'instant' | 'queued' | 'premium';

export default function WithdrawPage() {
  const [amount, setAmount] = useState('');
  const [selectedOption, setSelectedOption] = useState<WithdrawOption | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{
    type: WithdrawOption;
    amount: number;
    fee?: number;
    estimatedDate?: string;
    queuePosition?: number;
  } | null>(null);

  const numericAmount = parseFloat(amount) || 0;
  const maxWithdraw = currentUserPosition.currentValue;
  const availableLiquidity = poolMetrics.liquidity;
  const queueLength = withdrawalQueue.length;
  const premiumFee = 0.02; // 2%

  // Can do instant withdrawal if amount <= available liquidity
  const canInstant = numericAmount > 0 && numericAmount <= availableLiquidity;
  const isValidAmount = numericAmount > 0 && numericAmount <= maxWithdraw;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getEstimatedDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 45); // ~45 days for queue
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleMaxClick = () => {
    setAmount(maxWithdraw.toString());
    setSelectedOption(null);
  };

  const handleWithdraw = async () => {
    if (!selectedOption || !isValidAmount) return;

    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 2500));

    if (selectedOption === 'instant') {
      setSuccessData({
        type: 'instant',
        amount: numericAmount,
      });
    } else if (selectedOption === 'queued') {
      setSuccessData({
        type: 'queued',
        amount: numericAmount,
        estimatedDate: getEstimatedDate(),
        queuePosition: queueLength + 1,
      });
    } else if (selectedOption === 'premium') {
      setSuccessData({
        type: 'premium',
        amount: numericAmount,
        fee: numericAmount * premiumFee,
      });
    }

    setIsProcessing(false);
    setShowSuccess(true);
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
            <h1 className="text-2xl font-semibold text-[#15191e]">Withdraw</h1>
            <p className="text-gray-500 mt-1">Withdraw your USDC from the pool</p>
          </div>

          {/* Current Position */}
          <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm mb-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-500">Your Position</div>
                <div className="text-xl font-semibold text-[#15191e] tabular-nums">
                  {formatCurrency(currentUserPosition.currentValue)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Available Liquidity</div>
                <div className="text-xl font-semibold text-[#15191e] tabular-nums">
                  {formatCurrency(availableLiquidity)}
                </div>
              </div>
            </div>
          </div>

          {/* Withdraw Form */}
          <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
            {/* Amount Input */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-gray-600">Amount</label>
                <span className="text-sm text-gray-500">
                  Max: {formatCurrency(maxWithdraw)}
                </span>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setSelectedOption(null);
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
              {amount && numericAmount > maxWithdraw && (
                <p className="text-sm text-red-500 mt-2">Exceeds your position</p>
              )}
            </div>

            {/* Withdrawal Options */}
            {isValidAmount && (
              <div className="space-y-3 mb-6">
                <div className="text-sm text-gray-500 mb-3">Withdrawal Options</div>

                {/* Instant Option */}
                {canInstant && (
                  <WithdrawOptionCard
                    title="Instant Withdrawal"
                    description="Withdraw immediately from available liquidity"
                    selected={selectedOption === 'instant'}
                    onClick={() => setSelectedOption('instant')}
                    badge="Recommended"
                    badgeColor="green"
                  >
                    <div className="flex justify-between text-sm mt-3">
                      <span className="text-gray-500">You receive</span>
                      <span className="text-[#15191e] font-medium tabular-nums">
                        {formatCurrency(numericAmount)}
                      </span>
                    </div>
                  </WithdrawOptionCard>
                )}

                {/* Queued Option */}
                <WithdrawOptionCard
                  title="Queue Withdrawal"
                  description={`Join the withdrawal queue (${queueLength} ahead of you)`}
                  selected={selectedOption === 'queued'}
                  onClick={() => setSelectedOption('queued')}
                >
                  <div className="space-y-2 mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Estimated date</span>
                      <span className="text-[#15191e] font-medium">{getEstimatedDate()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">You receive</span>
                      <span className="text-[#15191e] font-medium tabular-nums">
                        {formatCurrency(numericAmount)}
                      </span>
                    </div>
                  </div>
                </WithdrawOptionCard>

                {/* Premium Exit Option */}
                {!canInstant && (
                  <WithdrawOptionCard
                    title="Premium Exit"
                    description="Skip the queue with a 2% fee"
                    selected={selectedOption === 'premium'}
                    onClick={() => setSelectedOption('premium')}
                    badge="Fast"
                    badgeColor="orange"
                  >
                    <div className="space-y-2 mt-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Fee (2%)</span>
                        <span className="text-[#ff5900] font-medium tabular-nums">
                          -{formatCurrency(numericAmount * premiumFee)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">You receive</span>
                        <span className="text-[#15191e] font-medium tabular-nums">
                          {formatCurrency(numericAmount * (1 - premiumFee))}
                        </span>
                      </div>
                    </div>
                  </WithdrawOptionCard>
                )}
              </div>
            )}

            {/* Action Button */}
            <Button
              onClick={handleWithdraw}
              disabled={!selectedOption || !isValidAmount || isProcessing}
              className="w-full h-12 bg-[#ff5900] hover:bg-[#e65000] text-white disabled:bg-gray-100 disabled:text-gray-400"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner />
                  Processing...
                </span>
              ) : (
                'Withdraw'
              )}
            </Button>
          </div>

          {/* Queue Info */}
          {withdrawalQueue.length > 0 && (
            <div className="mt-6 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="text-sm text-gray-500 mb-3">Your Pending Withdrawals</div>
              <div className="space-y-3">
                {withdrawalQueue.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <div className="text-[#15191e] font-medium tabular-nums">
                        {formatCurrency(item.amount)}
                      </div>
                      <div className="text-xs text-gray-500">Position #{item.position} in queue</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Est. {item.estimatedDate}</div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
              <DialogTitle className="text-2xl font-semibold text-center text-[#15191e]">
                {successData?.type === 'queued' ? 'Withdrawal Queued!' : 'Withdrawal Successful!'}
              </DialogTitle>
            </DialogHeader>
            {successData && (
              <>
                <p className="text-gray-500 mt-2 mb-6">
                  {successData.type === 'queued'
                    ? `Your withdrawal of ${formatCurrency(successData.amount)} has been queued`
                    : `You have withdrawn ${formatCurrency(successData.amount - (successData.fee || 0))}`}
                </p>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 mb-6 text-left">
                  {successData.type === 'queued' ? (
                    <>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Queue Position</span>
                        <span className="text-[#15191e] font-medium">#{successData.queuePosition}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Estimated Date</span>
                        <span className="text-[#15191e] font-medium">{successData.estimatedDate}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Amount</span>
                        <span className="text-[#15191e] font-medium tabular-nums">
                          {formatCurrency(successData.amount)}
                        </span>
                      </div>
                      {successData.fee && (
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-500">Premium Fee</span>
                          <span className="text-[#ff5900] font-medium tabular-nums">
                            -{formatCurrency(successData.fee)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-gray-100">
                        <span className="text-gray-500">Received</span>
                        <span className="text-green-600 font-medium tabular-nums">
                          {formatCurrency(successData.amount - (successData.fee || 0))}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
            <Button asChild className="w-full bg-[#ff5900] hover:bg-[#e65000] text-white">
              <Link href="/lp">View Dashboard</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WithdrawOptionCard({
  title,
  description,
  selected,
  onClick,
  badge,
  badgeColor = 'gray',
  children,
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  badge?: string;
  badgeColor?: 'green' | 'orange' | 'gray';
  children?: React.ReactNode;
}) {
  const badgeStyles = {
    green: 'bg-green-100 text-green-700',
    orange: 'bg-orange-100 text-orange-700',
    gray: 'bg-gray-100 text-gray-600',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl text-left transition-all ${
        selected
          ? 'bg-orange-50 border-2 border-[#ff5900]'
          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#15191e]">{title}</span>
            {badge && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${badgeStyles[badgeColor]}`}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            selected ? 'border-[#ff5900] bg-[#ff5900]' : 'border-gray-300'
          }`}
        >
          {selected && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          )}
        </div>
      </div>
      {children}
    </button>
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
