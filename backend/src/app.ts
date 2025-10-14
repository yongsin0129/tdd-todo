import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

// Middleware Configuration
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// 404 Error Handler (must be last)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: `Not Found - ${req.path}`,
  });
});

export { app };
