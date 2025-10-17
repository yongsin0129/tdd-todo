import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import todoRoutes from './routes/todoRoutes.js';
import swaggerSpec from './config/swagger.js';

const app = express();

// Middleware Configuration
app.use(cors());
app.use(express.json());

// JSON parsing error handler
app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      error: 'Invalid JSON',
    });
    return;
  }
  next(err);
});

// Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', todoRoutes);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 Error Handler (must be last)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: `Not Found - ${req.path}`,
  });
});

export { app };
