import fs from "fs";
import { PDFParse } from "pdf-parse";

export class PdfParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PdfParseError";
  }
}

export const parsePdf = async (filePath: string): Promise<string> => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: fileBuffer });
    const result = await parser.getText();

    if (!result.text || result.text.trim().length === 0) {
      throw new PdfParseError("PDF contains no extractable text");
    }

    return result.text;
  } catch (error: any) {
    if (error instanceof PdfParseError) throw error;
    throw new PdfParseError(`Failed to parse PDF: ${error.message}`);
  }
};
