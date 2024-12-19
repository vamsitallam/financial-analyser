import React, { useState } from 'react';
import { FileText, AlertCircle, ArrowRight } from 'lucide-react';
import { Transaction } from '../types';
import { analyzeWithGPT } from '../utils/gptService';

interface ExtractedDataPreviewProps {
  transactions: Transaction[];
  rawText: string | null;
  onAnalyze: (analysis: string) => void;
}

export default function ExtractedDataPreview({ 
  transactions, 
  rawText, 
  onAnalyze 
}: ExtractedDataPreviewProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!rawText) return;

    try {
      setIsAnalyzing(true);
      setError(null);
      const analysis = await analyzeWithGPT(rawText);
      onAnalyze(analysis);
    } catch (err: any) {
      setError('Failed to analyze statement. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FileText className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold">Extracted Transactions</h2>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>Analyzing...</>
          ) : (
            <>
              Analyze with AI
              <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 rounded-md flex items-start">
          <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    ${transaction.amount.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {transaction.type}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No transactions could be extracted from the statement.
          Please check if the file format is correct.
        </div>
      )}
    </div>
  );
}