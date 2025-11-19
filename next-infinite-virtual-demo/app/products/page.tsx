"use client";

import { useEffect, useRef, useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { PageFooter } from "../components/PageFooter";
import { PageHeader } from "../components/PageHeader";
import { ProductCard } from "../components/ProductCard";
import { SortControl } from "../components/SortControl";
import { StatusMessages } from "../components/StatusMessages";
import { PAGINATION, UI } from "../constants/pagination";
import { useInfiniteProducts } from "../hooks/useInfiniteProducts";

export default function Page() {
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const { products, loading, error, hasNextPage, loadMore, reset } = useInfiniteProducts({
    pageSize: PAGINATION.PAGE_SIZE,
    sortBy,
    sortOrder,
  });

  const hasLoadedInitial = useRef(false);

  // Load initial data on mount
  useEffect(() => {
    if (!hasLoadedInitial.current) {
      hasLoadedInitial.current = true;
      void loadMore();
    }
  }, [loadMore]);

  // Reset and reload when sort changes
  const handleSortChange = (newSortBy: 'name' | 'price', newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    reset();
    // Mark that we need to reload after reset
    hasLoadedInitial.current = false;
  };

  // Attach sentinel to trigger loading before reaching the end
  const sentinelIndex = Math.max(0, products.length - 10);

  const [infiniteRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: loadMore,
    disabled: !!error,
    rootMargin: PAGINATION.INFINITE_SCROLL_ROOT_MARGIN,
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader productsCount={products.length} totalProducts={UI.TOTAL_PRODUCTS} />

      {/* Sort Controls */}
      <div className="mb-6">
        <SortControl
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
          onSortChange={handleSortChange}
          disabled={loading}
        />
      </div>

      <section className="flex-1">
        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-h-screen">
          {products.map((product, index) => {
            const isSentinel = index === sentinelIndex;

            return (
              <ProductCard
                key={product?.id ?? index}
                product={product}
                innerRef={isSentinel && hasNextPage ? infiniteRef : undefined}
              />
            );
          })}

          {/* Loading skeleton cards */}
          {loading && hasNextPage && (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCard key={`skeleton-${i}`} product={undefined} />
              ))}
            </>
          )}
        </div>

        <StatusMessages
          loading={loading}
          error={error}
          hasNextPage={hasNextPage}
          productsCount={products.length}
          onRetry={loadMore}
        />
      </section>

      <PageFooter />
    </main>
  );
}
