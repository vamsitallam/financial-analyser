import { PDFParser } from './parsers/pdfParser';
import { CSVParser } from './parsers/csvParser';
import { TextParser } from './parsers/textParser';

export class FileProcessor {
  static async processFile(file: File): Promise<string> {
    const fileType = file.name.split('.').pop()?.toLowerCase();

    try {
      switch (fileType) {
        case 'pdf':
          return await PDFParser.extractText(file);
        case 'csv':
          return await CSVParser.parse(file);
        case 'txt':
          return await TextParser.parse(file);
        default:
          throw new Error(`Unsupported file format: ${fileType}`);
      }
    } catch (error) {
      // Rethrow with more context if needed
      if (error instanceof Error) {
        throw new Error(`File processing error: ${error.message}`);
      }
      throw error;
    }
  }
}