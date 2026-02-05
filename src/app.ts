import express from "express";
import resumeRoutes from "./modules/resume/resume.route";

const app = express();

app.use(express.json());
app.use('/api/resume', resumeRoutes);
app.get('/health', (_req, res)=> {
    res.json({status: 'ok'});
})

export default app;