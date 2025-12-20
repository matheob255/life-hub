import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Main categories (these become your tabs)
export const categories = sqliteTable("categories", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  icon: text().notNull(),
  color: text().notNull(),
  order: int().notNull(),
  createdAt: text().notNull(),
});

// Subcategories within each main category
export const subcategories = sqliteTable("subcategories", {
  id: int().primaryKey({ autoIncrement: true }),
  categoryId: int().notNull().references(() => categories.id),
  name: text().notNull(),
  icon: text().notNull(),
  type: text().notNull(), // "list", "tracker", "journal", "budget", "calendar"
  createdAt: text().notNull(),
});

// Items within subcategories (flexible for different types)
export const items = sqliteTable("items", {
  id: int().primaryKey({ autoIncrement: true }),
  subcategoryId: int().notNull().references(() => subcategories.id),
  title: text().notNull(),
  description: text(),
  value: text(), // flexible: can store numbers, booleans, text
  date: text(), // for date-specific tracking
  completed: int().default(0), // 0 or 1 for boolean
  urgency: text(), // "low", "medium", "high" for to-do items
  transactionType: text(), // "income" or "expense" for budget
  amount: text(), // for budget transactions
  createdAt: text().notNull(),
  updatedAt: text().notNull(),
});

// Type inference
export type Category = typeof categories.$inferSelect;
export type Subcategory = typeof subcategories.$inferSelect;
export type Item = typeof items.$inferSelect;
