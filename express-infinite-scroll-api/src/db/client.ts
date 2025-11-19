import { createPool, Pool } from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import { env } from '../config/env';
import { logger } from '../config/logger';
import * as schema from './schema';

let dbInstance: MySql2Database<typeof schema> | null = null;
let poolInstance: Pool | null = null;

/**
 * Get database instance (singleton pattern)
 * Creates connection pool on first call
 *
 * @returns Drizzle database instance
 */
export function getDb(): MySql2Database<typeof schema> {
  if (!dbInstance) {
    poolInstance = createPool({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    dbInstance = drizzle(poolInstance, { schema, mode: 'default' });

    logger.info(
      {
        host: env.DB_HOST,
        port: env.DB_PORT,
        database: env.DB_NAME,
      },
      'Database connection pool created'
    );
  }

  return dbInstance;
}

/**
 * Health check function to verify database connectivity
 *
 * @returns Promise<true> if connection is healthy
 * @throws Error if connection fails
 */
export async function checkDbHealth(): Promise<boolean> {
  try {
    if (!poolInstance) {
      getDb(); // Initialize pool if not already done
    }

    // Execute a simple query to verify connection
    await poolInstance!.query('SELECT 1');
    return true;
  } catch (error) {
    logger.error({ err: error }, 'Database health check failed');
    throw error;
  }
}

/**
 * Gracefully close database connection pool
 * Should be called on application shutdown
 */
export async function closeDb(): Promise<void> {
  if (poolInstance) {
    try {
      await poolInstance.end();
      logger.info('Database connection pool closed');
      dbInstance = null;
      poolInstance = null;
    } catch (error) {
      logger.error({ err: error }, 'Error closing database connection pool');
      throw error;
    }
  }
}
