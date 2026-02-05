import fs from "fs";
const pdfParse = require("pdf-parse");

export class PdfParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PdfParseError";
  }
}

export const parsePdf = async (filePath: string): Promise<string> => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const result = await pdfParse(fileBuffer);

    if (!result.text || result.text.trim().length === 0) {
      throw new PdfParseError("PDF contains no extractable text");
    }

    return result.text;
  } catch (error) {
    throw new PdfParseError("Failed to parse PDF");
  }
};
