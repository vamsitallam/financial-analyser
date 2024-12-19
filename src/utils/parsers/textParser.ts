export class TextParser {
  static async parse(file: File): Promise<string> {
    try {
      const text = await file.text();
      if (!text.trim()) {
        throw new Error('Empty text file');
      }
      return text;
    } catch (error) {
      console.error('Text file parsing error:', error);
      throw new Error(
        error instanceof Error 
          ? `Failed to parse text file: ${error.message}`
          : 'Failed to parse text file'
      );
    }
  }
}