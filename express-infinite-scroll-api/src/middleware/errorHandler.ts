import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger';
import { env } from '../config/env';

/**
 * Custom application error class with status code
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Error response structure
 */
interface ErrorResponse {
  error: string;
  details?: unknown;
  stack?: string | undefined;
}

/**
 * Global error handling middleware
 * Catches all errors and sends appropriate responses
 *
 * @param err - Error object
 * @param req - Express request
 * @param res - Express response
 * @param next - Next function (required for Express error middleware signature)
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Default to 500 server error
  let statusCode = 500;
  let message = 'Internal server error';
  let details: unknown;

  // Handle custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Handle Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation error';
    details = err.flatten();
  }
  // Handle other known errors
  else if (err.message) {
    message = err.message;
  }

  // Build error response
  const errorResponse: ErrorResponse = {
    error: message,
  };

  if (details) {
    errorResponse.details = details;
  }

  // Include stack trace in development
  if (env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Log error with structured logging
  logger.error(
    {
      err,
      req,
      statusCode,
      correlationId: req.id,
    },
    'Error occurred while processing request'
  );

  res.status(statusCode).json(errorResponse);
}

/**
 * Handles 404 Not Found errors
 */
export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const error = new AppError(404, `Route not found: ${req.originalUrl}`);
  next(error);
}
