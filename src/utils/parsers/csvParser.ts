export class CSVParser {
  static async parse(file: File): Promise<string> {
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('Invalid CSV format: File appears to be empty');
      }

      const headerColumns = lines[0].split(',').length;
      const isValidCSV = lines.every(line => 
        line.split(',').length === headerColumns
      );

      if (!isValidCSV) {
        throw new Error('Invalid CSV format: Inconsistent column count');
      }

      return text;
    } catch (error) {
      console.error('CSV parsing error:', error);
      throw new Error(
        error instanceof Error 
          ? `Failed to parse CSV: ${error.message}`
          : 'Failed to parse CSV file'
      );
    }
  }
}