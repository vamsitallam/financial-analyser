import { Transaction } from '../types';
import { analyzeWithGPT } from './gptService';
import { processFile } from './fileProcessor';
import { extractTransactions } from './transactionExtractor';

export async function processStatement(file: File) {
  try {
    // Extract text from the file based on its type
    const text = await processFile(file);

    // Extract transactions from the text
    const transactions = extractTransactions(text);

    // Get AI analysis of the statement
    const analysis = await analyzeWithGPT(text);

    return {
      transactions,
      analysis
    };
  } catch (error) {
    console.error('Statement processing error:', error);
    throw error;
  }
}