import { mysqlTable, int, varchar, decimal, text } from 'drizzle-orm/mysql-core';

export const products = mysqlTable('products', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  category: varchar('category', { length: 100 }),
  stockQuantity: int('stock_quantity').default(0),
});

export type Product = typeof products.$inferSelect;
