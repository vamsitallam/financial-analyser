import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.js';

export class PDFParser {
  static async extractText(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .trim();
        fullText += pageText + '\n';
      }

      if (!fullText.trim()) {
        throw new Error('No text content found in PDF');
      }

      return fullText;
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error(
        error instanceof Error 
          ? `Failed to parse PDF: ${error.message}`
          : 'Failed to parse PDF file'
      );
    }
  }
}