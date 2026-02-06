import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs/promises";
import { parsePdf } from "../../infra/pdf/pdf.parser";
import { extractSections } from "./section.extractor";
import { scoreResume } from "./analysis/scoring.engine";

export const analyzeResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fileId } = req.body;

    if (!fileId) {
      return res.status(400).json({
        error: "fileId is required",
      });
    }

    const filePath = path.join("uploads", fileId);

    await fs.access(filePath);

    const rawText = await parsePdf(filePath);
    const sections = extractSections(rawText);
    const scores = scoreResume(sections);

    res.json({
      fileId,
      sections,
      scores,
    });
  } catch (error) {
    next(error);
  }
};
