/**
 * Pagination and infinite scroll configuration constants
 */

export const PAGINATION = {
  /** Number of items to load per page */
  PAGE_SIZE: 50,

  /** Root margin for intersection observer (triggers load earlier) */
  INFINITE_SCROLL_ROOT_MARGIN: "0px 0px 1200px 0px",
} as const;

export const VIRTUALIZATION = {
  /** Estimated height of each virtual item in pixels */
  ITEM_HEIGHT: 150,

  /** Number of items to render outside the visible area */
  OVERSCAN: 8,
} as const;

export const UI = {
  /** Fixed height of the scrollable container */
  SCROLL_CONTAINER_HEIGHT: "600px",

  /** Total number of products in the database */
  TOTAL_PRODUCTS: 500,
} as const;
