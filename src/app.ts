import express from "express";
import cors from "cors";
import resumeRoutes from "./modules/resume/resume.route";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use('/api/resume', resumeRoutes);
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
})

app.use(errorHandler);

export default app;

