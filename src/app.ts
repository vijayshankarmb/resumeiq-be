import express from "express";
import resumeRoutes from "./modules/resume/resume.route";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use('/api/resume', resumeRoutes);
app.get('/health', (_req, res)=> {
    res.json({status: 'ok'});
})

app.use(errorHandler);

export default app;

