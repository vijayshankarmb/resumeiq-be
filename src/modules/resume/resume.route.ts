import { Router } from "express";
import { upload } from "../../infra/upload/multer.config";
import { uploadResume } from "./resume.controller";

const router = Router();

router.post('/upload', upload.single('resume'), uploadResume);

export default router;