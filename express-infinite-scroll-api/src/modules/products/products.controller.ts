import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { listProductsPagedQuerySchema } from './products.schemas';
import { listProductsPaged } from './products.service';



/**
 * Handler for page-based pagination endpoint
 * GET /api/products/paged?page=1&limit=50&sortBy=name&sortOrder=asc
 */
export async function getProductsPagedHandler(req: Request, res: Response): Promise<void> {
  const parseResult = listProductsPagedQuerySchema.safeParse(req.query);

  if (!parseResult.success) {
    throw new ZodError(parseResult.error.issues);
  }

  const { page, limit, sortBy, sortOrder } = parseResult.data;
  const result = await listProductsPaged({ page, limit, sortBy, sortOrder });

  res.json(result);
}
