import React from 'react';
import { MessageSquare } from 'lucide-react';

interface AIAnalysisProps {
  analysis: string | null;
}

export default function AIAnalysis({ analysis }: AIAnalysisProps) {
  if (!analysis) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <MessageSquare className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold">AI Analysis & Recommendations</h2>
      </div>
      
      <div className="prose prose-blue max-w-none">
        {analysis.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}