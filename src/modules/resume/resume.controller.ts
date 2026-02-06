import { Request, Response, NextFunction } from "express";
import { parsePdf } from "../../infra/pdf/pdf.parser";
import { extractSections } from "./section.extractor";
import { scoreResume } from "./analysis/scoring.engine";

export const uploadResume = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'Resume file is required',
            });
        }

        const filePath = req.file.path;

        const rawText = await parsePdf(filePath);

        const sections = extractSections(rawText);

        const scores = scoreResume(sections);

        res.json({
            file: {
                originalName: req.file.originalname,
                size: req.file.size,
            },
            sections,
            scores,
        })

    } catch (error) {
        next(error);
    }
};

