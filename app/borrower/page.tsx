'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { borrowerMetrics, loanPortfolio, paymentHistory } from '@/lib/dummy-data';

export default function BorrowerDashboard() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const utilizationPercent = (borrowerMetrics.drawn / borrowerMetrics.creditLimit) * 100;

  const handleUpload = async () => {
    setIsUploading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsUploading(false);
    setUploadSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar type="borrower" />

      <main className="lg:pl-64 pt-16">
        <div className="p-6 lg:p-8 max-w-7xl">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-semibold text-[#15191e]">Borrower Dashboard</h1>
                <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  Everbloom
                </span>
              </div>
              <p className="text-gray-500">Manage your credit facility and loan portfolio</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowUploadModal(true)}
                className="border-gray-300 text-[#15191e] hover:bg-gray-100"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Report
              </Button>
              <Button asChild className="bg-[#ff5900] hover:bg-[#e65000] text-white">
                <Link href="/borrower/drawdown">Request Drawdown</Link>
              </Button>
            </div>
          </div>

          {/* Credit Facility */}
          <section className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Credit Facility
            </h2>
            <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Total Credit Limit</div>
                  <div className="text-3xl font-semibold text-[#15191e] tabular-nums">
                    {formatCurrency(borrowerMetrics.creditLimit)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Amount Drawn</div>
                  <div className="text-3xl font-semibold text-[#15191e] tabular-nums">
                    {formatCurrency(borrowerMetrics.drawn)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Available</div>
                  <div className="text-3xl font-semibold text-green-600 tabular-nums">
                    {formatCurrency(borrowerMetrics.available)}
                  </div>
                </div>
              </div>

              {/* Utilization Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Facility Utilization</span>
                  <span className="text-[#15191e] font-medium">{utilizationPercent.toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#ff5900] to-[#ff7a33] rounded-full transition-all duration-1000"
                    style={{ width: `${utilizationPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>$0</span>
                  <span>{formatCurrency(borrowerMetrics.creditLimit)}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Schedule & Portfolio Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Payment Schedule */}
            <section>
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                Payment Schedule
              </h2>
              <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
                {/* Next Payment */}
                <div className="p-4 rounded-lg bg-orange-50 border border-orange-100 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="h-4 w-4 text-[#ff5900]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-[#ff5900] font-medium">Next Payment Due</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-2xl font-semibold text-[#15191e] tabular-nums">
                        {formatCurrency(borrowerMetrics.nextPaymentAmount)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Interest at {borrowerMetrics.interestRate}% APR
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-medium text-[#15191e]">
                        {formatDate(borrowerMetrics.nextPayment)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment History */}
                <div className="text-sm text-gray-500 mb-3">Payment History</div>
                <div className="space-y-3">
                  {paymentHistory.slice(0, 4).map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm text-[#15191e] font-medium tabular-nums">
                            {formatCurrency(payment.amount)}
                          </div>
                          <div className="text-xs text-gray-400">
                            Due {formatDate(payment.dueDate)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                          Paid
                        </span>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatDate(payment.paidDate || payment.dueDate)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Portfolio Summary */}
            <section>
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                Portfolio Summary
              </h2>
              <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <MetricBox label="Total Active Loans" value={loanPortfolio.totalLoans.toString()} />
                  <MetricBox label="Active Creators" value={loanPortfolio.activeCreators.toString()} />
                  <MetricBox label="Avg Loan Size" value={formatCurrency(loanPortfolio.avgLoanSize)} />
                  <MetricBox label="Avg Duration" value={`${loanPortfolio.avgDuration} mo`} />
                  <MetricBox
                    label="Collection Rate"
                    value={`${loanPortfolio.collectionRate}%`}
                    highlight
                  />
                  <MetricBox
                    label="Top 10 Concentration"
                    value={`${loanPortfolio.top10Concentration}%`}
                  />
                </div>

                {/* Risk Indicator */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <span className="text-sm text-gray-600">Portfolio Health</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">Excellent</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Low concentration risk with strong collection performance
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Quick Stats */}
          <section>
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Facility Terms
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="text-sm text-gray-500 mb-1">Interest Rate</div>
                <div className="text-xl font-semibold text-[#15191e]">{borrowerMetrics.interestRate}% APR</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="text-sm text-gray-500 mb-1">Payment Frequency</div>
                <div className="text-xl font-semibold text-[#15191e]">Monthly</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="text-sm text-gray-500 mb-1">Facility Type</div>
                <div className="text-xl font-semibold text-[#15191e]">Revolving</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="text-sm text-gray-500 mb-1">Status</div>
                <div className="text-xl font-semibold text-green-600">Active</div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Upload Report Modal */}
      <Dialog open={showUploadModal} onOpenChange={(open) => {
        setShowUploadModal(open);
        if (!open) setUploadSuccess(false);
      }}>
        <DialogContent className="sm:max-w-md bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#15191e]">
              {uploadSuccess ? 'Report Uploaded!' : 'Upload Report'}
            </DialogTitle>
          </DialogHeader>

          {uploadSuccess ? (
            <div className="py-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-500 mb-6">Your portfolio report has been uploaded successfully.</p>
              <Button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadSuccess(false);
                }}
                className="bg-[#ff5900] hover:bg-[#e65000] text-white"
              >
                Done
              </Button>
            </div>
          ) : (
            <div className="py-4">
              <div
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-colors"
                onClick={handleUpload}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <svg className="animate-spin h-8 w-8 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-gray-500">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <svg className="h-10 w-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-600 mb-1">Click to upload your portfolio report</p>
                    <p className="text-xs text-gray-400">PDF, CSV, or XLSX up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MetricBox({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="p-4 rounded-lg bg-gray-50">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-xl font-semibold tabular-nums ${highlight ? 'text-green-600' : 'text-[#15191e]'}`}>
        {value}
      </div>
    </div>
  );
}
