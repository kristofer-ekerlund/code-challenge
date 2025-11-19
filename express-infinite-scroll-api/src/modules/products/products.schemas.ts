import { z } from 'zod';

export const listProductsPagedQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  sortBy: z.enum(['name', 'price']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type ListProductsPagedQuery = z.infer<typeof listProductsPagedQuerySchema>;
