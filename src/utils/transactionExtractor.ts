import { Transaction } from '../types';

interface ExtractedData {
  date?: string;
  description?: string;
  amount?: number;
  type?: 'income' | 'expense';
}

const DATE_PATTERNS = [
  /\d{2}[-/]\d{2}[-/]\d{4}/,  // DD-MM-YYYY or DD/MM/YYYY
  /\d{4}[-/]\d{2}[-/]\d{2}/,  // YYYY-MM-DD or YYYY/MM/DD
  /\d{2}[-/]\w{3}[-/]\d{4}/   // DD-MMM-YYYY or DD/MMM/YYYY
];

const AMOUNT_PATTERN = /[-]?\$?\s*\d+,?\d*\.?\d*/;

export function extractTransactions(text: string): Transaction[] {
  const lines = text.split('\n');
  const transactions: Transaction[] = [];

  for (const line of lines) {
    if (!line.trim() || line.toLowerCase().includes('balance')) continue;

    const extracted = extractLineData(line);
    if (isValidTransaction(extracted)) {
      transactions.push({
        id: generateId(),
        date: extracted.date!,
        description: extracted.description!,
        amount: extracted.amount!,
        category: 'Other', // Will be enhanced by GPT analysis
        type: extracted.type!
      });
    }
  }

  return transactions;
}

function extractLineData(line: string): ExtractedData {
  const extracted: ExtractedData = {};

  // Extract date
  for (const pattern of DATE_PATTERNS) {
    const match = line.match(pattern);
    if (match) {
      extracted.date = standardizeDate(match[0]);
      break;
    }
  }

  // Extract amount
  const amountMatch = line.match(AMOUNT_PATTERN);
  if (amountMatch) {
    const amount = parseFloat(amountMatch[0].replace(/[$,\s]/g, ''));
    extracted.amount = Math.abs(amount);
    extracted.type = amount < 0 ? 'expense' : 'income';
  }

  // Extract description (everything else after removing date and amount)
  let description = line
    .replace(DATE_PATTERNS[0], '')
    .replace(DATE_PATTERNS[1], '')
    .replace(DATE_PATTERNS[2], '')
    .replace(AMOUNT_PATTERN, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (description) {
    extracted.description = description;
  }

  return extracted;
}

function isValidTransaction(data: ExtractedData): boolean {
  return !!(data.date && data.description && data.amount !== undefined && data.type);
}

function standardizeDate(date: string): string {
  // Convert various date formats to YYYY-MM-DD
  const parts = date.split(/[-/]/);
  if (parts.length !== 3) return new Date().toISOString().split('T')[0];

  // Handle different date formats
  if (parts[0].length === 4) {
    // YYYY-MM-DD
    return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
  } else {
    // DD-MM-YYYY
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
}

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}