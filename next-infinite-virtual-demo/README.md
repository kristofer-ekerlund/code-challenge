# Next.js Infinite Scroll Frontend

Modern e-commerce product listing with infinite scroll and virtual rendering, built with Next.js 15, React 19, and TanStack Virtual.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript 5.6+
- **Styling**: Tailwind CSS 3.4+
- **Virtual Scrolling**: @tanstack/react-virtual 3.0
- **Infinite Scroll**: react-infinite-scroll-hook 6.0
- **Dev Tools**: ESLint, Prettier, PostCSS

## Features

- **Infinite Scrolling**: Seamless loading of product pages as you scroll
- **Virtual Rendering**: Renders only visible items for optimal performance
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Sorting**: Client-side sorting by name or price
- **Skeleton Loading**: Elegant loading states with animated skeletons
- **Error Boundaries**: Graceful error handling
- **Optimized Images**: Lazy loading with Next.js Image optimization
- **Performance**: Production-ready with caching, compression, and code splitting

## Project Structure

```
next-infinite-virtual-demo/
├── app/
│   ├── api/                      # API proxy routes
│   │   └── products/
│   │       └── route.ts          # Server-side product API proxy
│   ├── components/               # React components
│   │   ├── ProductCard.tsx       # Product display card
│   │   ├── PageHeader.tsx        # Header component
│   │   ├── PageFooter.tsx        # Footer component
│   │   ├── SortControl.tsx       # Sort controls
│   │   ├── StatusMessages.tsx    # Loading/error messages
│   │   └── ErrorBoundary.tsx     # Error boundary wrapper
│   ├── hooks/                    # Custom React hooks
│   │   └── useInfiniteProducts.ts # Infinite scroll logic
│   ├── types/                    # TypeScript types
│   │   ├── product.ts            # Product types
│   │   └── index.ts              # Type exports
│   ├── utils/                    # Utility functions
│   │   └── virtualStyles.ts      # Virtual scrolling styles
│   ├── constants/                # App constants
│   │   └── pagination.ts         # Pagination config
│   ├── products/                 # Products page route
│   │   └── page.tsx              # Main products listing
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── public/                       # Static assets
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json
```

## Quick Start

### With Docker (Recommended)

From the project root:

```bash
# Start all services (MySQL + Backend + Frontend)
docker-compose up --build

# Frontend will be available at:
# http://localhost:3001
```

### Local Development (Without Docker)

**Prerequisites:**
- Node.js 18+
- Backend API running (see express-infinite-scroll-api)
- npm or yarn

**Steps:**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment (optional):**

   The frontend works out of the box with Docker. For custom configuration, create `.env.local`:

   ```env
   # Backend API URL (optional, defaults to API route proxy)
   BACKEND_API_URL=http://localhost:3000

   # Node environment
   NODE_ENV=development
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   Server will start at `http://localhost:3000` (or `3001` if 3000 is taken) with hot reload enabled.

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Available Scripts

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build production bundle
npm start            # Start production server
npm run lint         # Lint code with ESLint
```

## Components

### ProductCard

Modern product card with vertical layout, optimized for grid display.

**Props:**
- `product` (Product | undefined): Product data to display, undefined shows skeleton loader
- `innerRef` (React.Ref): Ref for infinite scroll intersection observer

**Features:**
- Skeleton loading state
- Responsive image with lazy loading
- Category badge
- Stock indicators (in stock, low stock, out of stock)
- Price display
- Add to cart button
- Hover animations

**Usage:**
```tsx
import { ProductCard } from './components/ProductCard';

<ProductCard
  product={product}
  innerRef={lastItemRef}
/>
```

### PageHeader

Header component with title and description.

**Features:**
- Responsive typography
- Gradient text effect
- Product count display

### SortControl

Dropdown controls for sorting products.

**Props:**
- `sortBy` ('name' | 'price'): Current sort field
- `sortOrder` ('asc' | 'desc'): Current sort direction
- `onSortChange` (function): Callback when sort changes

**Usage:**
```tsx
<SortControl
  sortBy={sortBy}
  sortOrder={sortOrder}
  onSortChange={(field, order) => {
    setSortBy(field);
    setSortOrder(order);
  }}
/>
```

### StatusMessages

Displays loading and error states.

**Props:**
- `loading` (boolean): Whether data is loading
- `error` (Error | null): Error object if error occurred
- `hasProducts` (boolean): Whether products are loaded

### ErrorBoundary

React error boundary for catching component errors.

**Usage:**
```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## Custom Hooks

### useInfiniteProducts

Custom hook for infinite scrolling product list with pagination.

**Parameters:**
```typescript
interface UseInfiniteProductsOptions {
  pageSize: number;           // Number of products per page
  apiEndpoint?: string;       // API endpoint (default: /api/products)
  sortBy?: 'name' | 'price';  // Sort field
  sortOrder?: 'asc' | 'desc'; // Sort direction
}
```

**Returns:**
```typescript
interface UseInfiniteProductsReturn {
  products: Product[];        // Array of loaded products
  loading: boolean;           // Loading state
  error: Error | null;        // Error if occurred
  hasNextPage: boolean;       // More pages available
  loadMore: () => Promise<void>;  // Load next page
  reset: () => void;          // Reset state
}
```

**Usage:**
```tsx
const {
  products,
  loading,
  error,
  hasNextPage,
  loadMore,
  reset
} = useInfiniteProducts({
  pageSize: 50,
  sortBy: 'name',
  sortOrder: 'asc'
});
```

## TypeScript Types

### Product

```typescript
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  category: string | null;
  stockQuantity: number | null;
}
```

### ProductResponse

```typescript
interface ProductResponse {
  items: Product[];
  hasNextPage: boolean;
  nextPage: number | null;
  page: number;
  pageSize: number;
  total: number;
}
```

## Styling with Tailwind CSS

### Configuration

Tailwind is configured in `tailwind.config.ts`:

```typescript
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      // Add custom theme extensions here
    }
  },
  plugins: []
};
```

### Customizing Styles

**Global styles** are in `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom global styles */
@layer base {
  body {
    @apply bg-slate-50 text-slate-900;
  }
}
```

**Component styles** use Tailwind utility classes:

```tsx
<div className="rounded-xl border border-slate-200 bg-white shadow-sm">
  {/* Component content */}
</div>
```

**Custom animations** (add to tailwind.config.ts):

```typescript
theme: {
  extend: {
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0', transform: 'translateY(10px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' }
      }
    },
    animation: {
      fadeIn: 'fadeIn 0.3s ease-out'
    }
  }
}
```

### Color Palette

The app uses Tailwind's default color palette:
- **Primary**: Blue (blue-600, blue-700)
- **Text**: Slate (slate-900, slate-600)
- **Background**: Slate (slate-50, slate-100)
- **Borders**: Slate (slate-200)
- **Success**: Green (green-500)
- **Warning**: Yellow (yellow-500)
- **Error**: Red (red-500)

To customize colors, extend the theme in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        // ... more shades
        900: '#1e3a8a',
      }
    }
  }
}
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `BACKEND_API_URL` | Backend API base URL | `http://backend:3000` (Docker) | No |
| `NODE_ENV` | Environment mode | `development` | No |

**Note**: The frontend uses Next.js API routes as a proxy to the backend, so direct backend URL configuration is typically not needed.

## Performance Optimizations

### Virtual Scrolling

Uses @tanstack/react-virtual to render only visible items:

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: products.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 400,
  overscan: 5
});
```

### Image Optimization

- Lazy loading with `loading="lazy"` attribute
- Responsive images from picsum.photos
- Next.js automatic image optimization

### Code Splitting

- Automatic code splitting per route
- Dynamic imports for heavy components
- Optimized package imports via Next.js experimental features

### Caching Strategy

Configured in `next.config.mjs`:

- **Static assets**: 1 year cache (`immutable`)
- **Dynamic pages**: 10 minutes cache with stale-while-revalidate

### Build Optimizations

- SWC minification enabled
- Response compression enabled
- Console removal in production
- Powered-by header disabled for security

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Semantic HTML elements
- Alt text for images
- Keyboard navigation support
- ARIA labels where appropriate
- Focus indicators on interactive elements

## Troubleshooting

### Port already in use
```bash
# Find process using port 3000/3001
lsof -ti:3000

# Kill process
lsof -ti:3000 | xargs kill -9
```

### Module not found errors
```bash
# Clean install
rm -rf node_modules package-lock.json .next
npm install
```

### Build errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Type errors
```bash
# Check TypeScript errors
npx tsc --noEmit
```

## Development Tips

### Hot Reload

Next.js automatically reloads on file changes. If hot reload stops working:

```bash
# Restart dev server
# Press Ctrl+C then
npm run dev
```

### Debugging

```tsx
// Add console logs (removed in production automatically)
console.log('Products loaded:', products.length);

// Use React DevTools browser extension
// Use Next.js built-in debugging
```

### Testing Components

```tsx
// Example component test structure
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

test('renders product card', () => {
  const product = {
    id: '1',
    name: 'Test Product',
    price: '99.99',
    // ... other fields
  };

  render(<ProductCard product={product} />);
  expect(screen.getByText('Test Product')).toBeInTheDocument();
});
```

## License

MIT

---

**Last Updated**: 2025-11-19
