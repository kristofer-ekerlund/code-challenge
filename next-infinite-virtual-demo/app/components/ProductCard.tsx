import React from "react";
import Image from "next/image";
import type { Product } from "../types/product";
import { shimmer, toBase64 } from "../utils/imageHelpers";

/**
 * Props for the ProductCard component
 */
interface ProductCardProps {
  /** Product data to display, undefined shows skeleton loader */
  product: Product | undefined;
  /** Ref for infinite scroll intersection observer */
  innerRef?: React.Ref<HTMLDivElement>;
}

/**
 * Modern webshop product card with vertical layout
 * Optimized for grid display with responsive design
 */
export function ProductCard({ product, innerRef }: ProductCardProps) {
  if (!product) {
    return (
      <div ref={innerRef} className="group animate-fadeIn">
        <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Skeleton Image */}
          <div className="aspect-square w-full animate-pulse bg-slate-200" />

          {/* Skeleton Content */}
          <div className="flex flex-1 flex-col p-4">
            <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="mb-2 h-4 w-full animate-pulse rounded bg-slate-200" />
            <div className="mb-4 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="mt-auto space-y-2">
              <div className="h-6 w-1/3 animate-pulse rounded bg-slate-200" />
              <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity === 0;

  return (
    <div ref={innerRef} className="group animate-fadeIn">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(800, 800))}`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <span className="text-4xl text-slate-400">📦</span>
            </div>
          )}

          {/* Stock Badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white">
                Out of Stock
              </span>
            </div>
          )}

          {/* Category Badge */}
          {product.category && (
            <div className="absolute left-2 top-2">
              <span className="rounded-lg bg-white/95 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm">
                {product.category}
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-1 flex-col p-4">
          {/* Product Name */}
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
            {product.name}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="mb-3 line-clamp-2 text-sm text-slate-600">
              {product.description}
            </p>
          )}

          {/* Stock Info */}
          {product.stockQuantity !== null && product.stockQuantity !== undefined && product.stockQuantity > 0 && (
            <div className="mb-3 flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-full ${
                product.stockQuantity > 10 ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <span className="text-xs text-slate-600">
                {product.stockQuantity > 10
                  ? 'In Stock'
                  : `Only ${product.stockQuantity} left`}
              </span>
            </div>
          )}

          {/* Price and Add to Cart */}
          <div className="mt-auto space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">
                ${parseFloat(product.price).toFixed(2)}
              </span>
            </div>

            <button
              disabled={isOutOfStock}
              className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                isOutOfStock
                  ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm hover:shadow-md'
              }`}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
