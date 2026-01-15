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
        return { bg: 'bg-green-100', text: 'text-green-700', label: 'Deposit' };
      case 'withdrawal':
        return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Withdrawal' };
      case 'yield':
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Yield' };
      case 'repayment':
        return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Repayment' };
      case 'drawdown':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Drawdown' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', label: type };
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'distributed':
        return 'text-blue-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-100 hover:bg-transparent bg-gray-50">
            <TableHead className="text-gray-500 font-medium">Type</TableHead>
            <TableHead className="text-gray-500 font-medium">Amount</TableHead>
            <TableHead className="text-gray-500 font-medium hidden sm:table-cell">Date</TableHead>
            <TableHead className="text-gray-500 font-medium hidden md:table-cell">Status</TableHead>
            <TableHead className="text-gray-500 font-medium text-right hidden lg:table-cell">Tx Hash</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentTransactions.map((tx) => {
            const typeStyle = getTypeStyles(tx.type);
            return (
              <TableRow key={tx.id} className="border-gray-100 hover:bg-gray-50">
                <TableCell>
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${typeStyle.bg} ${typeStyle.text}`}
                  >
                    {typeStyle.label}
                  </span>
                </TableCell>
                <TableCell className="font-medium text-[#15191e] tabular-nums">
                  {tx.type === 'withdrawal' ? '-' : '+'}{formatCurrency(tx.amount)}
                </TableCell>
                <TableCell className="text-gray-500 hidden sm:table-cell">
                  {formatDate(tx.date)}
                </TableCell>
                <TableCell className={`capitalize hidden md:table-cell ${getStatusStyles(tx.status)}`}>
                  {tx.status}
                </TableCell>
                <TableCell className="text-right hidden lg:table-cell">
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-[#ff5900] font-mono transition-colors"
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
