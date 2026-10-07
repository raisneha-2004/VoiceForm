import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { requestIdMiddleware } from './middleware/requestId.middleware.js';
import { sanitizeMiddleware } from './middleware/sanitize.middleware.js';
import { globalLimiter } from './middleware/rateLimiter.middleware.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { setupSwagger } from './config/swagger.js';
import apiRoutes from './routes/index.js';
import { NotFoundError } from './utils/apiError.js';

export function createApp() {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false // Allow Swagger UI inline resources
    })
  );

  // CORS
  app.use(
    cors({
      origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id']
    })
  );

  // Request parsing
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));

  // Tracing & Sanitization
  app.use(requestIdMiddleware);
  app.use(sanitizeMiddleware);

  // Global Rate Limiting
  app.use('/api', globalLimiter);

  // Swagger Documentation
  setupSwagger(app);

  // Mount API Endpoints
  app.use('/api', apiRoutes);

  // Root redirect to Swagger docs
  app.get('/', (_req, res) => {
    res.redirect('/api/docs');
  });

  // 404 Catch-all
  app.use((req, _res, next) => {
    next(new NotFoundError(`The requested endpoint ${req.method} ${req.originalUrl} does not exist.`));
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
}
