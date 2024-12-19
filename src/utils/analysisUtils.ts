import { Transaction, SpendingAnalysis } from '../types';

export const analyzeTransactions = (transactions: Transaction[]): SpendingAnalysis => {
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const categoryTotals = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'expense') {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  return {
    totalExpenses,
    totalIncome,
    balance: totalIncome - totalExpenses,
    categoryTotals,
  };
};

export const generateInsights = (analysis: SpendingAnalysis): string[] => {
  const insights: string[] = [];
  
  if (analysis.balance < 0) {
    insights.push('⚠️ Your expenses exceed your income. Consider reducing non-essential spending.');
  }

  const highestCategory = Object.entries(analysis.categoryTotals)
    .sort(([, a], [, b]) => b - a)[0];

  if (highestCategory) {
    insights.push(`📊 Your highest spending category is ${highestCategory[0]} at $${highestCategory[1].toFixed(2)}`);
  }

  if (analysis.totalExpenses > analysis.totalIncome * 0.9) {
    insights.push('💡 You\'re spending more than 90% of your income. Try to save more!');
  }

  return insights;
};