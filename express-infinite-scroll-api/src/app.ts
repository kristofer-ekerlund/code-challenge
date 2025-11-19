import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import productsRouter from './routes/products.routes';
import { env } from './config/env';
import openApiSpec from '../openapi.json';

const app = express();

// Security headers
app.use(helmet());

// Response compression
app.use(compression());

// Rate limiting - 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.NODE_ENV === 'production' ? 100 : 1000, // Stricter in production
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

app.use(limiter);

// CORS configuration - environment-based allowed origins
const allowedOrigins = env.CORS_ORIGINS.split(',').map((origin) => origin.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  })
);

// Body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging with correlation IDs
app.use(requestLogger);

// Health check endpoint - verifies database connectivity
app.get('/health', async (_req, res, next) => {
  try {
    const { checkDbHealth } = await import('./db/client');
    await checkDbHealth();
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
    next(error);
  }
});

// API routes - v1
app.use('/api/v1', productsRouter);

// API Documentation - Swagger UI
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Products API Documentation',
    customfavIcon: '/favicon.ico',
  })
);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

export default app;
