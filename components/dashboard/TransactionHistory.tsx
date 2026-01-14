'use client';

import { recentTransactions } from '@/lib/dummy-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function TransactionHistory() {
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

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'deposit':
        return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Deposit' };
      case 'withdrawal':
        return { bg: 'bg-orange-500/10', text: 'text-orange-400', label: 'Withdrawal' };
      case 'yield':
        return { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Yield' };
      case 'repayment':
        return { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'Repayment' };
      case 'drawdown':
        return { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Drawdown' };
      default:
        return { bg: 'bg-white/10', text: 'text-white/60', label: type };
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-400';
      case 'pending':
        return 'text-yellow-400';
      case 'distributed':
        return 'text-blue-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-white/40';
    }
  };

  return (
    <div className="rounded-xl border border-white/[0.08] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/[0.08] hover:bg-transparent">
            <TableHead className="text-white/40 font-medium">Type</TableHead>
            <TableHead className="text-white/40 font-medium">Amount</TableHead>
            <TableHead className="text-white/40 font-medium hidden sm:table-cell">Date</TableHead>
            <TableHead className="text-white/40 font-medium hidden md:table-cell">Status</TableHead>
            <TableHead className="text-white/40 font-medium text-right hidden lg:table-cell">Tx Hash</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentTransactions.map((tx) => {
            const typeStyle = getTypeStyles(tx.type);
            return (
              <TableRow key={tx.id} className="border-white/[0.08] hover:bg-white/[0.02]">
                <TableCell>
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${typeStyle.bg} ${typeStyle.text}`}
                  >
                    {typeStyle.label}
                  </span>
                </TableCell>
                <TableCell className="font-medium text-white tabular-nums">
                  {tx.type === 'withdrawal' ? '-' : '+'}{formatCurrency(tx.amount)}
                </TableCell>
                <TableCell className="text-white/50 hidden sm:table-cell">
                  {formatDate(tx.date)}
                </TableCell>
                <TableCell className={`capitalize hidden md:table-cell ${getStatusStyles(tx.status)}`}>
                  {tx.status}
                </TableCell>
                <TableCell className="text-right hidden lg:table-cell">
                  <a
                    href="#"
                    className="text-sm text-white/40 hover:text-white/60 font-mono transition-colors"
                  >
                    {tx.txHash}
                  </a>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
