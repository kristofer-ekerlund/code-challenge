import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { logger } from '../config/logger';

/**
 * Request logging middleware
 * Adds correlation ID to each request and logs request/response
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  // Generate correlation ID for request tracking
  const correlationId = randomUUID();
  req.id = correlationId;

  // Start timer
  const startTime = Date.now();

  // Log incoming request
  logger.info(
    {
      req,
      correlationId,
    },
    'Incoming request'
  );

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;

    const logLevel = res.statusCode >= 400 ? 'error' : 'info';

    logger[logLevel](
      {
        res,
        correlationId,
        duration,
      },
      'Request completed'
    );
  });

  next();
}

// Extend Express Request type to include id
declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}
