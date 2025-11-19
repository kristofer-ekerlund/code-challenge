import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

/**
 * Environment variables schema with validation and type inference
 */
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Server configuration
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  // CORS configuration
  CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:3001'),

  // Database configuration
  DB_HOST: z.string().min(1, 'DB_HOST is required'),
  DB_PORT: z.coerce.number().int().min(1).max(65535).default(3306),
  DB_USER: z.string().min(1, 'DB_USER is required'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),
  DB_NAME: z.string().min(1, 'DB_NAME is required'),
});

/**
 * Validated and typed environment variables
 * Throws an error if validation fails
 */
export const env = envSchema.parse(process.env);

/**
 * Type for environment variables
 */
export type Env = z.infer<typeof envSchema>;
