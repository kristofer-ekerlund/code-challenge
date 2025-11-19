import Link from "next/link";

/**
 * Props for the PageHeader component
 */
interface PageHeaderProps {
  /** Current number of products loaded */
  productsCount: number;
  /** Total number of products available in the database */
  totalProducts: number;
}

/**
 * Page header component displaying title, description, and product count
 */
export function PageHeader({ productsCount, totalProducts }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
        >
          <span>←</span>
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Shop All Products
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Discover our complete collection of premium products. Scroll to explore our entire catalog.
        </p>
          <div className="flex flex-wrap items-center gap-4 rounded-lg bg-slate-50 px-4 py-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-slate-600">
                Showing <span className="font-semibold text-slate-900">{productsCount}</span> of{" "}
                <span className="font-semibold text-slate-900">{totalProducts}</span> products
              </span>
            </div>
          </div>
      </div>
    </header>
  );
}
