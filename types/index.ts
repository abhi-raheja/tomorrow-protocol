// Pool Metrics
export interface PoolMetrics {
  tvl: number;
  utilization: number;
  apy: number;
  totalLoans: number;
  activeCreators: number;
  defaultRate: number;
  liquidity: number;
}

// APY/TVL History Point
export interface HistoryPoint {
  month: string;
  apy?: number;
  tvl?: number;
  rate?: number;
}

// LP Position
export interface LPPosition {
  id: number;
  address: string;
  deposited: number;
  shares: number;
  yield: number;
  depositDate: string;
}

// Current User Position
export interface UserPosition {
  deposited: number;
  currentValue: number;
  shares: number;
  accruedYield: number;
  depositDate: string;
  apy: number;
}

// Withdrawal Queue Item
export interface WithdrawalQueueItem {
  id: number;
  amount: number;
  requestDate: string;
  estimatedDate: string;
  status: 'queued' | 'processing' | 'completed' | 'cancelled';
  position: number;
}

// Borrower Metrics
export interface BorrowerMetrics {
  creditLimit: number;
  drawn: number;
  available: number;
  interestRate: number;
  nextPayment: string;
  nextPaymentAmount: number;
}

// Loan Portfolio
export interface LoanPortfolio {
  totalLoans: number;
  activeCreators: number;
  avgLoanSize: number;
  avgDuration: number;
  collectionRate: number;
  top10Concentration: number;
}

// Transaction
export interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal' | 'repayment' | 'drawdown' | 'yield';
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed' | 'distributed';
  txHash: string;
}

// Payment History Item
export interface PaymentHistoryItem {
  id: number;
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  paidDate?: string;
}

// Pool Settings
export interface PoolSettings {
  targetApy: number;
  maxFacilitySize: number;
  liquidityBuffer: number;
  withdrawalQueueEnabled: boolean;
  premiumExitFee: number;
  depositsEnabled: boolean;
  withdrawalsEnabled: boolean;
}

// Creator Concentration Data
export interface ConcentrationData {
  name: string;
  value: number;
}

// Wallet State
export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number;
}

// App Context State
export interface AppState {
  wallet: WalletState;
  userPosition: UserPosition;
  poolMetrics: PoolMetrics;
  withdrawalQueue: WithdrawalQueueItem[];
}
