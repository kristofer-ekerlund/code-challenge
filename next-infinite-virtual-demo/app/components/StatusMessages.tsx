/**
 * Props for the StatusMessages component
 */
interface StatusMessagesProps {
  /** Whether data is currently being loaded */
  loading: boolean;
  /** Error object if an error occurred, null otherwise */
  error: Error | null;
  /** Whether there are more pages to load */
  hasNextPage: boolean;
  /** Current number of products loaded */
  productsCount: number;
  /** Callback function to retry loading on error */
  onRetry: () => void;
}

/**
 * Displays loading, error, and completion status messages for the product list
 */
export function StatusMessages({
  loading,
  error,
  hasNextPage,
  productsCount,
  onRetry,
}: StatusMessagesProps) {
  return (
    <div className="mt-8 mb-4 space-y-4 text-center">
      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-lg bg-blue-50 px-6 py-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-blue-900">
            Loading more products...
          </p>
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 px-6 py-4">
          <p className="text-sm font-medium text-red-900">
            Something went wrong while loading products.{" "}
            <button
              onClick={onRetry}
              className="font-semibold underline transition-colors hover:text-red-700"
            >
              Try again
            </button>
          </p>
        </div>
      )}
      {!hasNextPage && !loading && productsCount > 0 && (
        <div className="rounded-lg bg-emerald-50 px-6 py-4">
          <p className="text-sm font-medium text-emerald-900">
            You have reached the end of our catalog. All {productsCount} products loaded!
          </p>
        </div>
      )}
    </div>
  );
}
