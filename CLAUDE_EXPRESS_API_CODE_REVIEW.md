# Express Infinite Scroll API - Code Review

**Reviewer**: Senior Backend Engineer
**Date**: 2025-11-19
**Scope**: express-infinite-scroll-api
**Severity Levels**: 🔴 Critical | 🟠 High | 🟡 Medium | 🔵 Low

---

## Executive Summary

This API demonstrates competent use of modern TypeScript/Express patterns with good security defaults (Helmet, rate limiting, CORS). However, it contains several architectural issues, performance concerns, and violations of established patterns that would be problematic in production. The codebase shows inconsistency between configuration and implementation, minimal testing, and several anti-patterns that need addressing.

**Overall Assessment**: Needs significant refactoring before production readiness.

---

## 1. Architecture & Design Issues

### 🟠 1.1 Path Aliases Configured But Not Used
**Location**: `tsconfig.json:22-27` vs all import statements

The `tsconfig.json` defines path aliases (`@/*`, `@config/*`, `@modules/*`, `@middleware/*`) but **none are used** in the actual code. All imports use relative paths like `'../../db/client'`.

**Problem**:
- Configuration that doesn't match implementation is a maintenance trap
- Developers will be confused about which pattern to follow
- Wastes mental overhead when reading code

**Fix**:
```typescript
// Bad (current)
import { getDb } from '../../db/client';
import { logger } from '../config/logger';

// Good
import { getDb } from '@/db/client';
import { logger } from '@config/logger';
```

Either use the aliases consistently or remove them from tsconfig.

---

### 🟡 1.2 Module Structure Inconsistency
**Location**: `src/modules/products/*` vs `src/routes/products.routes.ts`

The products module is organized with controller/service/schema separation (good), but the route is outside the module in a separate `routes/` directory. This breaks cohesion.

**Problem**:
- Related code is scattered across directories
- Harder to find all product-related code
- Scaling will create multiple directories for each feature

**Recommendation**:
```
src/modules/products/
  ├── products.controller.ts
  ├── products.service.ts
  ├── products.schemas.ts
  ├── products.routes.ts      // ← Move here
  └── index.ts                 // ← Barrel export
```

---

### 🟡 1.3 Global Middleware in App File
**Location**: `src/app.ts:13-55`

All middleware configuration is in `app.ts`, making it a 98-line God Object that mixes concerns.

**Recommendation**: Extract to `src/middleware/index.ts`:
```typescript
// src/middleware/index.ts
export function applySecurityMiddleware(app: Express) {
  app.use(helmet());
  app.use(compression());
  app.use(createRateLimiter());
}

export function applyParsingMiddleware(app: Express) {
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
}
```

---

## 2. Database & ORM Issues

### 🔴 2.1 Misuse of Database Transactions
**Location**: `src/modules/products/products.service.ts:22-39`

A transaction is used to wrap **read-only queries**. Transactions are for ensuring **atomicity of writes**, not for bundling reads.

```typescript
// Current code - WRONG
const result = await db.transaction(async (tx) => {
  const [countResult, items] = await Promise.all([
    tx.select({ count: sql<number>`count(*)` }).from(products),
    tx.query.products.findMany({...}),
  ]);
  // ... just reading data
});
```

**Problems**:
- Unnecessary locking overhead
- Holds database connections longer than needed
- Reduces concurrency for a read-heavy API
- Shows misunderstanding of transaction purpose

**Fix**: Remove the transaction wrapper entirely:
```typescript
const [countResult, items] = await Promise.all([
  db.select({ count: sql<number>`count(*)` }).from(products),
  db.query.products.findMany({
    orderBy: [sortDirection(sortColumn)],
    limit,
    offset,
  }),
]);
```

---

### 🟠 2.2 Missing Database Indexes
**Location**: `src/db/schema.ts`

The schema defines no indexes on `name` or `price`, which are used for **sorting** in queries.

```typescript
// Current
export const products = mysqlTable('products', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  // ... no indexes!
});
```

**Impact**: O(n) table scans for every sorted query. With 100k+ products, this will be **extremely slow**.

**Fix**:
```typescript
export const products = mysqlTable('products', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  category: varchar('category', { length: 100 }),
  stockQuantity: int('stock_quantity').default(0),
}, (table) => ({
  nameIdx: index('name_idx').on(table.name),
  priceIdx: index('price_idx').on(table.price),
  categoryIdx: index('category_idx').on(table.category),
}));
```

---

### 🟠 2.3 Inefficient Count Query
**Location**: `src/modules/products/products.service.ts:25`

Every paginated request runs `COUNT(*)` on the entire table, even when the count rarely changes.

**Problem**: For large tables, `COUNT(*)` is expensive and causes unnecessary load.

**Solutions**:
1. Cache the count with TTL (e.g., Redis with 5-minute expiry)
2. Use approximate counts for non-critical UIs
3. Remove total count from pagination (use cursor-based pagination instead)

---

### 🔴 2.4 Non-Null Assertion Operator
**Location**: `src/db/client.ts:58`

```typescript
await poolInstance!.query('SELECT 1');
```

Using `!` operator is a code smell. If `poolInstance` is null, this **crashes the process**.

**Fix**:
```typescript
if (!poolInstance) {
  throw new Error('Database pool not initialized');
}
await poolInstance.query('SELECT 1');
```

---

### 🟡 2.5 Singleton Pattern for DB Connection
**Location**: `src/db/client.ts:8-42`

The singleton pattern with module-level state makes **testing difficult** and prevents connection pooling per-tenant scenarios.

**Better approach**: Dependency injection
```typescript
// Create factory
export function createDbClient(config: DbConfig): MySql2Database {
  const pool = createPool(config);
  return drizzle(pool, { schema, mode: 'default' });
}

// Inject into services
export class ProductsService {
  constructor(private db: MySql2Database) {}

  async listProducts() {
    return this.db.query.products.findMany();
  }
}
```

---

## 3. Error Handling Issues

### 🟠 3.1 Health Check Error Handling
**Location**: `src/app.ts:58-74`

```typescript
app.get('/health', async (_req, res, next) => {
  try {
    await checkDbHealth();
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected' });
    next(error); // ← BUG: Called after response sent!
  }
});
```

**Problem**: `next(error)` is called **after** `res.status(503).json()`, which will trigger "Cannot set headers after they are sent" error.

**Fix**: Remove `next(error)` or only log the error:
```typescript
} catch (error) {
  logger.error({ err: error }, 'Health check failed');
  res.status(503).json({ status: 'error', database: 'disconnected' });
}
```

---

### 🟡 3.2 Throwing ZodError Instead of Handling
**Location**: `src/modules/products/products.controller.ts:13-17`

```typescript
if (!parseResult.success) {
  throw new ZodError(parseResult.error.issues);
}
```

This manually throws `ZodError`, which then gets caught by error handler. Why not just let Zod validation happen in middleware?

**Better pattern**:
```typescript
// src/middleware/validate.ts
export function validate(schema: z.ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      throw new ZodError(result.error.issues);
    }
    req.validatedQuery = result.data;
    next();
  };
}

// Route
router.get('/products/paged',
  validate(listProductsPagedQuerySchema),
  asyncHandler(getProductsPagedHandler)
);
```

This is **DRY** and follows Single Responsibility Principle.

---

### 🔵 3.3 Inconsistent Function Return Types
**Location**: `src/modules/products/products.controller.ts:12`

```typescript
export async function getProductsPagedHandler(req: Request, res: Response): Promise<void>
```

Returns `Promise<void>`, but Express handlers can return `Response` for chaining. Inconsistent with Express conventions.

---

## 4. Configuration Issues

### 🟠 4.1 Hard-Coded Magic Numbers
**Location**: Multiple files

- `app.ts:23`: Rate limit `15 * 60 * 1000` and `max: 100`
- `app.ts:51-52`: Body size `'10mb'`
- `server.ts:45`: Graceful shutdown timeout `10000`
- `db/client.ts:26`: Connection pool limit `10`

**Problem**: Cannot be changed without code modification. Not environment-specific.

**Fix**: Move to `config/env.ts`:
```typescript
const envSchema = z.object({
  // ... existing fields
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  BODY_SIZE_LIMIT: z.string().default('10mb'),
  SHUTDOWN_TIMEOUT_MS: z.coerce.number().default(10000),
  DB_POOL_SIZE: z.coerce.number().default(10),
});
```

---

### 🟡 4.2 CORS Configuration Anti-Pattern
**Location**: `src/app.ts:34-48`

```typescript
cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`)); // ← Wrong!
    }
  },
})
```

**Problem**: Throwing errors in CORS callback is not the recommended pattern. Should call `callback(null, false)`.

**Fix**:
```typescript
cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false); // Reject without error
    }
  },
  credentials: true,
})
```

---

### 🔵 4.3 Environment Validation Timing
**Location**: `src/config/env.ts:32`

```typescript
export const env = envSchema.parse(process.env);
```

This happens **on import**, which means:
- Cannot customize error messages
- Cannot handle missing env vars gracefully
- Hard to test

**Better**: Explicit initialization function called from `server.ts`.

---

## 5. Type Safety Issues

### 🟠 5.1 Decimal Type Not Properly Typed
**Location**: `src/db/schema.ts:7`

```typescript
price: decimal('price', { precision: 10, scale: 2 }).notNull(),
```

MySQL `decimal` returns as **string** from the driver, not number. The type inference doesn't catch this.

**Problem**: Code that does `product.price * 0.9` will silently fail (string concatenation).

**Fix**: Add runtime transformation:
```typescript
export type Product = typeof products.$inferSelect;

export type ProductWithParsedPrice = Omit<Product, 'price'> & {
  price: number;
};

export function parseProduct(raw: Product): ProductWithParsedPrice {
  return {
    ...raw,
    price: parseFloat(raw.price),
  };
}
```

---

### 🟡 5.2 Request Extension in Wrong File
**Location**: `src/middleware/requestLogger.ts:45-52`

```typescript
declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}
```

Type extensions should be in a dedicated `types/` directory, not in middleware files.

**Fix**: Create `src/types/express.d.ts`:
```typescript
declare namespace Express {
  interface Request {
    id?: string;
    validatedQuery?: unknown;
    validatedBody?: unknown;
  }
}
```

---

## 6. Performance Issues

### 🟠 6.1 No Caching Strategy
**Location**: All read endpoints

Products data is fetched from DB on every request with no caching layer.

**Impact**:
- Unnecessary database load
- Slower response times
- Poor scalability

**Solutions**:
1. Add Redis for frequently accessed data
2. HTTP Cache-Control headers
3. Application-level memoization with TTL

---

### 🟡 6.2 No Response Compression Configuration
**Location**: `src/app.ts:19`

```typescript
app.use(compression());
```

Uses default compression settings. Should configure threshold and level.

**Fix**:
```typescript
app.use(compression({
  threshold: 1024, // Only compress responses > 1KB
  level: 6, // Balanced compression level
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
}));
```

---

### 🔴 6.3 Offset-Based Pagination at Scale
**Location**: `src/modules/products/products.service.ts:15`

```typescript
const offset = (page - 1) * limit;
```

Offset-based pagination becomes **exponentially slower** as page number increases. For page 1000 with limit 50, database must scan 50,000 rows to skip them.

**Fix**: Implement cursor-based pagination:
```typescript
// Instead of page/offset
interface CursorPaginationParams {
  cursor?: string; // Last item's ID or sort field value
  limit: number;
}

// Query
where(gt(products.id, cursor))
  .orderBy(asc(products.id))
  .limit(limit)
```

---

## 7. Security Issues

### 🔵 7.1 No Rate Limiting Per User
**Location**: `src/app.ts:22-30`

Rate limiting is only per IP. In production, need per-user/API-key limits for authenticated requests.

---

### 🔵 7.2 No Request ID Propagation
**Location**: `src/middleware/requestLogger.ts:11`

Correlation IDs are generated but not propagated to:
- Response headers (for client-side debugging)
- Downstream service calls
- Database query comments

**Fix**:
```typescript
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const correlationId = req.headers['x-correlation-id'] as string || randomUUID();
  req.id = correlationId;
  res.setHeader('X-Correlation-ID', correlationId); // ← Add this
  // ...
}
```

---

## 8. Testing Issues

### 🔴 8.1 Minimal Test Coverage
**Location**: `tests/products.test.ts`

Only **one test** exists, and it's incomplete:
```typescript
describe('GET /api/products', () => {
  it('should return 400 when query params are invalid', async () => {
    const res = await request(app).get('/api/products?limit=-1');
    expect(res.status).toBe(400);
  });
});
```

**Problems**:
- Wrong endpoint (`/api/products` should be `/api/v1/products/paged`)
- No database mocking despite comment saying "you'd mock the DB"
- No happy path tests
- No integration tests
- No service layer tests

**Required tests**:
1. Unit tests for service layer with mocked DB
2. Integration tests for routes with test database
3. Validation schema tests
4. Error handling tests
5. Edge cases (empty results, invalid cursors, etc.)

---

### 🟡 8.2 No Test Database Configuration
**Location**: Missing

No separate test database configuration. Tests would run against dev/prod database.

**Fix**: Add `env.test` and test database setup/teardown.

---

## 9. Code Quality Issues

### 🟡 9.1 Inconsistent Async/Await
**Location**: `src/app.ts:60`

```typescript
const { checkDbHealth } = await import('./db/client');
```

Dynamic import with `await` for a local module is unnecessary. Just use static import.

---

### 🟡 9.2 DRY Violation in Logger Config
**Location**: `src/config/logger.ts:8-45`

`baseConfig` is defined but then properties are spread in both branches of ternary. Should be more DRY:

```typescript
const transport = env.NODE_ENV !== 'production' ? {
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'HH:MM:ss Z',
    ignore: 'pid,hostname',
  },
} : undefined;

export const logger = pino({
  ...baseConfig,
  ...(transport && { transport }),
});
```

---

### 🔵 9.3 Missing JSDoc for Public Functions
**Location**: Multiple files

Some functions have JSDoc (good), but inconsistent. Service layer has none.

---

### 🔵 9.4 No Input Sanitization
**Location**: All input handlers

While Zod validates **types**, there's no sanitization for:
- SQL injection (mitigated by ORM but not impossible)
- XSS in responses
- Path traversal in future file uploads

---

## 10. DevOps & Deployment Issues

### 🟡 10.1 No Health Check for Dependencies
**Location**: `src/app.ts:58`

Health check only verifies database, but should check:
- Redis (if added)
- External APIs
- Disk space
- Memory usage

---

### 🔵 10.2 No Graceful Shutdown for In-Flight Requests
**Location**: `src/server.ts:22-46`

Graceful shutdown closes server and DB, but doesn't wait for in-flight requests to complete.

**Fix**:
```typescript
const connections = new Set<Socket>();

server.on('connection', (conn) => {
  connections.add(conn);
  conn.on('close', () => connections.delete(conn));
});

function gracefulShutdown(signal: string) {
  server.close(() => {
    // Wait for existing connections to close
    connections.forEach(conn => {
      if (!conn.destroyed) {
        conn.destroy();
      }
    });
    // Then close DB...
  });
}
```

---

### 🔵 10.3 No Metrics or Monitoring
**Location**: Missing

No integration with:
- Prometheus for metrics
- APM (Application Performance Monitoring)
- Error tracking (Sentry, etc.)
- Request tracing

---

## 11. Documentation Issues

### 🔵 11.1 OpenAPI Spec Not Validated
**Location**: `openapi.json`

OpenAPI spec exists but there's no validation that it matches the actual implementation. Schema could drift.

**Solution**: Use tools like `express-openapi-validator` or generate spec from code.

---

## Summary of Recommendations

### Critical (Fix Immediately)
1. Remove transaction wrapper from read-only queries
2. Fix health check error handling
3. Add database indexes for sortable fields
4. Implement cursor-based pagination
5. Fix non-null assertion operator

### High Priority
1. Use configured path aliases or remove them
2. Extract middleware configuration
3. Add proper test coverage with mocked database
4. Move magic numbers to environment config
5. Fix CORS error handling pattern

### Medium Priority
1. Reorganize module structure
2. Implement caching strategy
3. Add validation middleware
4. Fix decimal type handling
5. Create proper type definitions file

### Low Priority
1. Add compression configuration
2. Add request ID to response headers
3. Improve graceful shutdown
4. Add metrics/monitoring
5. Consistent JSDoc coverage

---

## Conclusion

This API shows understanding of modern TypeScript and Express patterns, but lacks production-readiness due to performance issues (transactions on reads, missing indexes, offset pagination), architectural inconsistencies (unused path aliases, scattered modules), and minimal testing. The code needs significant refactoring before handling real traffic.

**Estimated effort to production-ready**: 2-3 weeks for senior developer.
