import { Request, Response, NextFunction } from "express";
import { generateComparison } from "../../infra/llm/resume.comparer";

export const compareResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        error: "resumeText and jobDescription are required",
      });
    }

    const comparison = await generateComparison(resumeText, jobDescription);

    res.json({
      comparison,
    });
  } catch (error) {
    next(error);
  }
};
