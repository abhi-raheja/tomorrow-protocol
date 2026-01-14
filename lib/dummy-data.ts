// Pool Metrics
export const poolMetrics = {
  tvl: 2_500_000,                    // $2.5M
  utilization: 72,                   // 72%
  apy: 11.5,                         // 11.5% APY
  totalLoans: 47,
  activeCreators: 38,
  defaultRate: 0.8,                  // 0.8%
  liquidity: 700_000,                // $700K available
};

// Historical APY (last 6 months)
export const apyHistory = [
  { month: 'Aug', apy: 10.2 },
  { month: 'Sep', apy: 10.8 },
  { month: 'Oct', apy: 11.1 },
  { month: 'Nov', apy: 11.4 },
  { month: 'Dec', apy: 11.2 },
  { month: 'Jan', apy: 11.5 },
];

// Historical TVL (last 6 months)
export const tvlHistory = [
  { month: 'Aug', tvl: 1_800_000 },
  { month: 'Sep', tvl: 2_000_000 },
  { month: 'Oct', tvl: 2_150_000 },
  { month: 'Nov', tvl: 2_300_000 },
  { month: 'Dec', tvl: 2_400_000 },
  { month: 'Jan', tvl: 2_500_000 },
];

// Sample LP Positions
export const lpPositions = [
  { id: 1, address: '0x1234...abcd', deposited: 250_000, shares: 245_000, yield: 12_500, depositDate: '2024-09-15' },
  { id: 2, address: '0x5678...efgh', deposited: 500_000, shares: 490_000, yield: 26_800, depositDate: '2024-08-01' },
  { id: 3, address: '0x9abc...ijkl', deposited: 100_000, shares: 98_500, yield: 4_200, depositDate: '2024-11-20' },
];

// Current User LP Position (for demo)
export const currentUserPosition = {
  deposited: 150_000,
  currentValue: 158_250,
  shares: 147_500,
  accruedYield: 8_250,
  depositDate: '2024-10-01',
  apy: 11.5,
};

// Withdrawal Queue
export const withdrawalQueue = [
  { id: 1, amount: 50_000, requestDate: '2025-01-10', estimatedDate: '2025-02-15', status: 'queued' as const, position: 3 },
  { id: 2, amount: 25_000, requestDate: '2025-01-12', estimatedDate: '2025-02-20', status: 'queued' as const, position: 5 },
];

// Borrower (Everbloom) Data
export const borrowerMetrics = {
  creditLimit: 3_000_000,
  drawn: 1_800_000,
  available: 1_200_000,
  interestRate: 12,
  nextPayment: '2025-02-01',
  nextPaymentAmount: 18_000,
};

// Loan Portfolio Summary (for borrower view)
export const loanPortfolio = {
  totalLoans: 47,
  activeCreators: 38,
  avgLoanSize: 38_300,
  avgDuration: 8,                    // months
  collectionRate: 98.2,              // %
  top10Concentration: 28,            // %
};

// Recent Transactions
export const recentTransactions = [
  { id: 1, type: 'deposit' as const, amount: 50_000, date: '2025-01-13', status: 'completed' as const, txHash: '0xabc123...' },
  { id: 2, type: 'repayment' as const, amount: 15_000, date: '2025-01-12', status: 'completed' as const, txHash: '0xdef456...' },
  { id: 3, type: 'drawdown' as const, amount: 75_000, date: '2025-01-10', status: 'completed' as const, txHash: '0xghi789...' },
  { id: 4, type: 'yield' as const, amount: 8_500, date: '2025-01-01', status: 'distributed' as const, txHash: '0xjkl012...' },
  { id: 5, type: 'deposit' as const, amount: 100_000, date: '2024-12-28', status: 'completed' as const, txHash: '0xmno345...' },
  { id: 6, type: 'withdrawal' as const, amount: 25_000, date: '2024-12-20', status: 'completed' as const, txHash: '0xpqr678...' },
];

// Payment History (for borrower)
export const paymentHistory = [
  { id: 1, dueDate: '2025-01-01', amount: 18_000, status: 'paid' as const, paidDate: '2024-12-30' },
  { id: 2, dueDate: '2024-12-01', amount: 18_000, status: 'paid' as const, paidDate: '2024-11-28' },
  { id: 3, dueDate: '2024-11-01', amount: 18_000, status: 'paid' as const, paidDate: '2024-10-30' },
  { id: 4, dueDate: '2024-10-01', amount: 18_000, status: 'paid' as const, paidDate: '2024-09-29' },
];

// Admin Pool Settings
export const poolSettings = {
  targetApy: 11.5,
  maxFacilitySize: 5_000_000,
  liquidityBuffer: 20,
  withdrawalQueueEnabled: true,
  premiumExitFee: 2,
  depositsEnabled: true,
  withdrawalsEnabled: true,
};

// Mock user wallet balance
export const mockWalletBalance = 500_000;

// Creator concentration data for admin charts
export const creatorConcentration = [
  { name: 'Top Creator', value: 8 },
  { name: 'Creator 2', value: 6 },
  { name: 'Creator 3', value: 5 },
  { name: 'Creator 4', value: 5 },
  { name: 'Creator 5', value: 4 },
  { name: 'Others', value: 72 },
];

// Default rate history
export const defaultRateHistory = [
  { month: 'Aug', rate: 1.2 },
  { month: 'Sep', rate: 1.0 },
  { month: 'Oct', rate: 0.9 },
  { month: 'Nov', rate: 0.8 },
  { month: 'Dec', rate: 0.7 },
  { month: 'Jan', rate: 0.8 },
];

// Collection rate history
export const collectionRateHistory = [
  { month: 'Aug', rate: 97.5 },
  { month: 'Sep', rate: 97.8 },
  { month: 'Oct', rate: 98.0 },
  { month: 'Nov', rate: 98.1 },
  { month: 'Dec', rate: 98.3 },
  { month: 'Jan', rate: 98.2 },
];
