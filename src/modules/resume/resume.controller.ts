import { Request, Response, NextFunction } from "express";

export const uploadResume = (
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

        return res.status(200).json({
            message: 'Resume uploaded successfully',
            file: {
                originalname: req.file.originalname,
                filename: req.file.filename,
                size: req.file.size,
            },
        });
    } catch (error) {
        next(error);
    }
};

