import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import healthRoutes from './routes/health';
import profileRoutes from './routes/profile';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
  methods: '*',
  allowedHeaders: '*',
}));

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = (req.headers['x-request-id'] as string) || randomUUID();
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-ID', requestId);

  const startTime = Date.now();

  const originalWriteHead = res.writeHead;
  res.writeHead = function(statusCode: any, ...args: any[]) {
    const processTime = (Date.now() - startTime) / 1000;
    res.setHeader('X-Process-Time', String(processTime));
    return originalWriteHead.apply(this, [statusCode, ...args] as any);
  };

  res.on('finish', () => {
    const processTime = (Date.now() - startTime) / 1000;
    console.log(
      `Request: ${req.method} ${req.originalUrl} completed in ${processTime.toFixed(4)}s Status: ${res.statusCode} RequestID: ${requestId}`
    );
  });

  next();
});

app.use('/health', healthRoutes);
app.use('/api/v1/profiles', profileRoutes);

app.use(errorHandler);

export default app;
