import { asc, desc, sql } from 'drizzle-orm';
import { getDb } from '../../db/client';
import { products } from '../../db/schema';

interface ListProductsPagedParams {
  page: number;
  limit: number;
  sortBy: 'name' | 'price';
  sortOrder: 'asc' | 'desc';
}

export async function listProductsPaged({ page, limit, sortBy, sortOrder }: ListProductsPagedParams) {
  const db = getDb();

  const offset = (page - 1) * limit;

  // Determine sort column and direction
  const sortColumn = sortBy === 'name' ? products.name : products.price;
  const sortDirection = sortOrder === 'asc' ? asc : desc;

  // Use a transaction to fetch count and items atomically
  const result = await db.transaction(async (tx) => {
    // Get total count and paginated items in parallel within the transaction
    const [countResult, items] = await Promise.all([
      tx.select({ count: sql<number>`count(*)` }).from(products),
      tx.query.products.findMany({
        orderBy: [sortDirection(sortColumn)],
        limit: limit,
        offset: offset,
      }),
    ]);

    const totalItems = countResult[0] ? Number(countResult[0].count) : 0;

    return {
      items,
      totalItems,
    };
  });

  const hasNextPage = offset + limit < result.totalItems;
  const nextPage = hasNextPage ? page + 1 : null;

  return {
    items: result.items,
    hasNextPage,
    nextPage,
    page,
    pageSize: limit,
    total: result.totalItems,
  };
}
