import { Router } from "express";
import { upload } from "../../infra/upload/multer.config";
import { uploadResume } from "./resume.upload.controller";
import { analyzeResume } from "./resume.analyze.controller";

const router = Router();

router.post('/upload', upload.single('resume'), uploadResume);
router.post('/analyze', analyzeResume);

export default router;