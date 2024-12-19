import React, { useState } from 'react';
import { Upload, FileText, Loader, AlertCircle } from 'lucide-react';
import { FileProcessor } from '../utils/fileProcessor';
import { extractTransactions } from '../utils/transactionExtractor';
import { Transaction } from '../types';
import ExtractedDataPreview from './ExtractedDataPreview';

interface StatementUploadProps {
  onTransactionsProcessed: (transactions: Transaction[]) => void;
  onAnalysisReceived: (analysis: string) => void;
}

export default function StatementUpload({ onTransactionsProcessed, onAnalysisReceived }: StatementUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedTransactions, setExtractedTransactions] = useState<Transaction[] | null>(null);
  const [rawText, setRawText] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setError(null);
      setExtractedTransactions(null);
      setRawText(null);

      // Process the file and extract text
      const text = await FileProcessor.processFile(file);
      if (!text) {
        throw new Error('No content could be extracted from the file');
      }

      // Extract transactions from the text
      const transactions = extractTransactions(text);
      if (transactions.length === 0) {
        throw new Error('No transactions could be extracted from the file');
      }

      setRawText(text);
      setExtractedTransactions(transactions);
      onTransactionsProcessed(transactions);
    } catch (err: any) {
      setError(err.message || 'Error processing statement. Please check the file format.');
      console.error('Statement processing error:', err);
    } finally {
      setIsProcessing(false);
      // Clear the input value to allow uploading the same file again
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <FileText className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold">Upload Bank Statement</h2>
        </div>
        
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isProcessing ? (
                <>
                  <Loader className="w-10 h-10 mb-3 text-gray-400 animate-spin" />
                  <p className="text-sm text-gray-500">Processing your statement...</p>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">CSV or bank statement text file</p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept=".csv,.txt,.pdf"
              onChange={handleFileUpload}
              disabled={isProcessing}
            />
          </label>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-md flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {extractedTransactions && (
        <ExtractedDataPreview 
          transactions={extractedTransactions}
          rawText={rawText}
          onAnalyze={onAnalysisReceived}
        />
      )}
    </div>
  );
}