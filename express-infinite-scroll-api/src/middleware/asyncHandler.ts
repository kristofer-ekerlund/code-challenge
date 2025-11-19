import { Request, Response, NextFunction } from 'express';

/**
 * Type for async Express route handlers
 */
type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

/**
 * Wraps async route handlers to catch errors and pass them to error middleware
 * Prevents unhandled promise rejections that crash the server
 *
 * @param fn - Async route handler function
 * @returns Wrapped handler that catches errors
 *
 * @example
 * ```ts
 * router.get('/products', asyncHandler(async (req, res) => {
 *   const products = await getProducts();
 *   res.json(products);
 * }));
 * ```
 */
export function asyncHandler(fn: AsyncHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
