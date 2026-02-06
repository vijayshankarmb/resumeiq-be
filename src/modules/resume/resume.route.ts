import { Router } from "express";
import { upload } from "../../infra/upload/multer.config";
import { analyzeResume } from "./resume.analyze.controller";

const router = Router();

router.post('/analyze', upload.single('resume'), analyzeResume);

export default router;