import React from 'react';
import { SpendingAnalysis } from '../types';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface DashboardProps {
  analysis: SpendingAnalysis;
  insights: string[];
}

export default function Dashboard({ analysis, insights }: DashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-green-600">Total Income</p>
                <p className="text-2xl font-bold text-green-700">
                  ${analysis.totalIncome.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center">
              <TrendingDown className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-red-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-700">
                  ${analysis.totalExpenses.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-blue-600">Current Balance</p>
                <p className="text-2xl font-bold text-blue-700">
                  ${analysis.balance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Insights & Recommendations</h2>
        <ul className="space-y-4">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start">
              <span className="text-gray-700">{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(analysis.categoryTotals).map(([category, amount]) => (
            <div key={category} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{category}</p>
              <p className="text-lg font-semibold text-gray-900">${amount.toFixed(2)}</p>
              <p className="text-xs text-gray-500">
                {((amount / analysis.totalExpenses) * 100).toFixed(1)}% of total
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}