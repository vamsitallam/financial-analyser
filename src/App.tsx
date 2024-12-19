import React, { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Dashboard from './components/Dashboard';
import StatementUpload from './components/StatementUpload';
import AIAnalysis from './components/AIAnalysis';
import { Transaction } from './types';
import { analyzeTransactions, generateInsights } from './utils/analysisUtils';
import { Wallet } from 'lucide-react';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleStatementProcessed = (newTransactions: Transaction[]) => {
    setTransactions([...newTransactions, ...transactions]);
  };

  const handleAnalysisReceived = (analysis: string) => {
    setAiAnalysis(analysis);
  };

  const analysis = analyzeTransactions(transactions);
  const insights = generateInsights(analysis);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Wallet className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Finance Tracker</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <StatementUpload 
              onTransactionsProcessed={handleStatementProcessed}
              onAnalysisReceived={handleAnalysisReceived}
            />
            <Dashboard analysis={analysis} insights={insights} />
            {aiAnalysis && <AIAnalysis analysis={aiAnalysis} />}
          </div>
          
          <div className="space-y-8">
            <TransactionForm onAddTransaction={handleAddTransaction} />
            <TransactionList 
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;