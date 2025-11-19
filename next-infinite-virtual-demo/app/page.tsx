import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4">
      <div className="max-w-2xl text-center">
        <h1 className="mb-4 text-5xl font-bold text-slate-900">
          Product Catalog
        </h1>
        <p className="mb-8 text-lg text-slate-600">
          Browse through our collection of 500+ products with infinite scroll
          and virtual rendering for optimal performance.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/products"
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
          >
            Browse Products
          </Link>
          <a
            href="http://localhost:3000/api-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border-2 border-slate-300 bg-white px-8 py-3 font-semibold text-slate-700 shadow-md transition-all hover:border-slate-400 hover:shadow-lg"
          >
            API Documentation
          </a>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-2 text-3xl font-bold text-blue-600">500+</div>
            <div className="text-sm text-slate-600">Products Available</div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-2 text-3xl font-bold text-green-600">∞</div>
            <div className="text-sm text-slate-600">Infinite Scroll</div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-2 text-3xl font-bold text-purple-600">⚡</div>
            <div className="text-sm text-slate-600">Virtual Rendering</div>
          </div>
        </div>

        <div className="mt-12 text-xs text-slate-400">
          <p>Built with Next.js 15, React 19, and TanStack Virtual</p>
        </div>
      </div>
    </main>
  );
}
