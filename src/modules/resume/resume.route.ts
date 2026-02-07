import { Router } from "express";
import { upload } from "../../infra/upload/multer.config";
import { analyzeResume } from "./resume.analyze.controller";
import { compareResume } from "./resume.compare.controller"; 

const router = Router();

router.post('/analyze', upload.single('resume'), analyzeResume);
router.post('/compare', compareResume);

export default router;