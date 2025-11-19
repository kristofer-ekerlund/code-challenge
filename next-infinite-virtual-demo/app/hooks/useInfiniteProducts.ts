import { useState, useCallback } from "react";
import type { Product, ProductResponse } from "../types/product";

/**
 * Configuration options for useInfiniteProducts hook
 */
interface UseInfiniteProductsOptions {
  /** Number of products to fetch per page */
  pageSize: number;
  /** API endpoint to fetch products from (defaults to /api/products) */
  apiEndpoint?: string;
  /** Field to sort by */
  sortBy?: 'name' | 'price';
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Return value from useInfiniteProducts hook
 */
interface UseInfiniteProductsReturn {
  /** Array of loaded products */
  products: Product[];
  /** Whether data is currently being loaded */
  loading: boolean;
  /** Error object if an error occurred */
  error: Error | null;
  /** Whether there are more pages to load */
  hasNextPage: boolean;
  /** Function to load the next page of products */
  loadMore: () => Promise<void>;
  /** Function to reset state and start over */
  reset: () => void;
}

/**
 * Fetches a page of products from the API
 * @param page - The page number to fetch
 * @param pageSize - Number of products per page
 * @param endpoint - API endpoint URL
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort direction
 * @returns Promise resolving to product response data
 */
async function fetchProducts(
  page: number,
  pageSize: number,
  endpoint: string,
  sortBy?: string,
  sortOrder?: string
): Promise<ProductResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (sortBy) {
    params.append('sortBy', sortBy);
  }
  if (sortOrder) {
    params.append('sortOrder', sortOrder);
  }

  const res = await fetch(`${endpoint}?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
}

/**
 * Custom hook for infinite scrolling product list with pagination
 * Manages loading state, error handling, and data accumulation
 *
 * @param options - Configuration options for the hook
 * @returns Object containing products data, loading state, and control functions
 *
 * @example
 * ```tsx
 * const { products, loading, error, hasNextPage, loadMore } = useInfiniteProducts({
 *   pageSize: 50
 * });
 * ```
 */
export function useInfiniteProducts({
  pageSize,
  apiEndpoint = "/api/products",
  sortBy,
  sortOrder,
}: UseInfiniteProductsOptions): UseInfiniteProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasNextPage) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchProducts(page, pageSize, apiEndpoint, sortBy, sortOrder);
      setProducts((prev) => [...prev, ...data.items]);
      setHasNextPage(data.hasNextPage);
      if (data.nextPage) {
        setPage(data.nextPage);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasNextPage, page, pageSize, apiEndpoint, sortBy, sortOrder]);

  const reset = useCallback(() => {
    setProducts([]);
    setPage(1);
    setHasNextPage(true);
    setLoading(false);
    setError(null);
  }, []);

  return {
    products,
    loading,
    error,
    hasNextPage,
    loadMore,
    reset,
  };
}
