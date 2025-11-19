import { Server } from 'http';
import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { closeDb } from './db/client';

const port = env.PORT;

const server: Server = app.listen(port, () => {
  logger.info(
    {
      port,
      environment: env.NODE_ENV,
    },
    `Server listening on http://localhost:${port}`
  );
});

/**
 * Graceful shutdown handler
 */
async function gracefulShutdown(signal: string): Promise<void> {
  logger.info({ signal }, 'Received shutdown signal, starting graceful shutdown');

  // Stop accepting new connections
  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      // Close database connections
      await closeDb();

      logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error({ err: error }, 'Error during graceful shutdown');
      process.exit(1);
    }
  });

  // Force shutdown after timeout
  setTimeout(() => {
    logger.error('Graceful shutdown timeout, forcing exit');
    process.exit(1);
  }, 10000); // 10 second timeout
}

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.fatal({ err: error }, 'Uncaught exception');
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  logger.fatal({ reason }, 'Unhandled promise rejection');
  gracefulShutdown('unhandledRejection');
});
