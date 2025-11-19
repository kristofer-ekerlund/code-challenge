import pino from 'pino';
import { Request, Response } from 'express';
import { env } from './env';

/**
 * Pino logger instance with environment-based configuration
 */
const baseConfig = {
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  formatters: {
    level: (label: string) => {
      return { level: label };
    },
  },
  serializers: {
    req: (req: Request) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      query: req.query,
      params: req.params,
      // Don't log headers in production for security
      ...(env.NODE_ENV !== 'production' && { headers: req.headers }),
    }),
    res: (res: Response) => ({
      statusCode: res.statusCode,
    }),
    err: pino.stdSerializers.err,
  },
};

export const logger =
  env.NODE_ENV !== 'production'
    ? pino({
        ...baseConfig,
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
      })
    : pino(baseConfig);
