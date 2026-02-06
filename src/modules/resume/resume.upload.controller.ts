import { Request, Response, NextFunction } from "express";
import path from "path";

export const uploadResume = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Resume file is required",
      });
    }

    const fileId = path.basename(req.file.path);

    res.status(201).json({
      fileId,
      originalName: req.file.originalname,
      size: req.file.size,
    });
  } catch (error) {
    next(error);
  }
};
