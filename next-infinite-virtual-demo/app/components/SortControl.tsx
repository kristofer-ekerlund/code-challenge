import React from "react";

/**
 * Sort option configuration
 */
export interface SortOption {
  label: string;
  sortBy: 'name' | 'price';
  sortOrder: 'asc' | 'desc';
}

/**
 * Props for the SortControl component
 */
interface SortControlProps {
  /** Currently active sort option */
  currentSortBy: 'name' | 'price';
  currentSortOrder: 'asc' | 'desc';
  /** Callback when sort option is selected */
  onSortChange: (sortBy: 'name' | 'price', sortOrder: 'asc' | 'desc') => void;
  /** Whether the component is disabled */
  disabled?: boolean;
}

/**
 * Available sort options
 */
const SORT_OPTIONS: SortOption[] = [
  { label: 'Name A-Z', sortBy: 'name', sortOrder: 'asc' },
  { label: 'Name Z-A', sortBy: 'name', sortOrder: 'desc' },
  { label: 'Price Low-High', sortBy: 'price', sortOrder: 'asc' },
  { label: 'Price High-Low', sortBy: 'price', sortOrder: 'desc' },
];

/**
 * Button group component for sorting products
 * Displays options for sorting by name or price in ascending or descending order
 */
export function SortControl({
  currentSortBy,
  currentSortOrder,
  onSortChange,
  disabled = false,
}: SortControlProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <label className="text-sm font-medium text-slate-700">Sort by:</label>
      <div className="inline-flex rounded-lg border border-slate-200 bg-white shadow-sm">
        {SORT_OPTIONS.map((option, index) => {
          const isActive =
            option.sortBy === currentSortBy && option.sortOrder === currentSortOrder;
          const isFirst = index === 0;
          const isLast = index === SORT_OPTIONS.length - 1;

          return (
            <button
              key={`${option.sortBy}-${option.sortOrder}`}
              onClick={() => onSortChange(option.sortBy, option.sortOrder)}
              disabled={disabled}
              className={`
                px-4 py-2 text-sm font-medium transition-all
                ${isFirst ? 'rounded-l-lg' : ''}
                ${isLast ? 'rounded-r-lg' : ''}
                ${!isFirst && !isLast ? 'border-x border-slate-200' : ''}
                ${isFirst && !isLast ? 'border-r border-slate-200' : ''}
                ${!isFirst && isLast ? 'border-l border-slate-200' : ''}
                ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-inner'
                    : 'bg-white text-slate-700 hover:bg-slate-50'
                }
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                active:scale-95
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
