import { Request, Response, NextFunction } from "express";
import path from "path";
import { generateSessionId } from "../../shared/session";

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

        const sessionId =
            req.header("x-session-id") ||
            req.header("session-id") ||
            req.body.sessionId ||
            generateSessionId();

        console.log(`Uploaded file: ${fileId} with Session: ${sessionId}`);

        res.status(201).json({
            fileId,
            sessionId,
            originalName: req.file.originalname,
            size: req.file.size,
        });
    } catch (error) {
        next(error);
    }
};
