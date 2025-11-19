import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { getProductsPagedHandler } from '../modules/products/products.controller';

const router = Router();

/**
 * GET /api/v1/products/paged
 * Query params:
 * - page?: number (page number, default 1)
 * - limit?: number (1-200, default 50)
 * - sortBy?: 'name' | 'price' (field to sort by, default 'name')
 * - sortOrder?: 'asc' | 'desc' (sort direction, default 'asc')
 *
 * Example:
 *   /api/v1/products/paged?page=1&limit=50&sortBy=name&sortOrder=asc
 *   /api/v1/products/paged?page=2&limit=50&sortBy=price&sortOrder=desc
 */
router.get('/products/paged', asyncHandler(getProductsPagedHandler));

export default router;
