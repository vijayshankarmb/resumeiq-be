import { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import path from "path";
import { parsePdf } from "../../infra/pdf/pdf.parser";
import { extractSections } from "./section.extractor";
import { scoreResume } from "./analysis/scoring.engine";

export const analyzeResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Resume PDF is required" });
    }

    const filePath = path.resolve(req.file.path);
    await fs.access(filePath);

    const text = await parsePdf(filePath);
    const sections = extractSections(text);
    const scores = scoreResume(sections);

    res.status(200).json({
        file: {
            fileName: req.file.originalname,
            size: req.file.size
        },
        sections,
        scores
    });
  } catch (err) {
    next(err);
  }
};
