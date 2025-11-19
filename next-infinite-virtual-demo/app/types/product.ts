/**
 * Shared Product type
 * This matches the backend schema from Drizzle ORM
 */
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  category: string | null;
  stockQuantity: number | null;
}

/**
 * API Response type for paginated products
 */
export interface ProductResponse {
  items: Product[];
  hasNextPage: boolean;
  nextPage: number | null;
  page: number;
  pageSize: number;
  total: number;
}
