export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

export interface Category {
  id: string;
  name: string;
  color: string;
  budget?: number;
}

export interface SpendingAnalysis {
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  categoryTotals: Record<string, number>;
}