import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Categories for organizing your life areas
export const categories = sqliteTable("categories", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(), // e.g., "Nutrition", "Running", "Reading", "Work"
  icon: text().notNull(), // emoji or icon name
  color: text().notNull(), // hex color for visual organization
  createdAt: text().notNull(),
});

// Individual trackable items within categories
export const trackables = sqliteTable("trackables", {
  id: int().primaryKey({ autoIncrement: true }),
  categoryId: int().notNull().references(() => categories.id),
  name: text().notNull(), // e.g., "Morning run", "Protein intake", "Piano practice"
  type: text().notNull(), // "boolean", "number", "text", "duration"
  unit: text(), // "km", "minutes", "grams", etc.
  target: text(), // optional daily/weekly target
  createdAt: text().notNull(),
});

// Daily entries for tracking
export const entries = sqliteTable("entries", {
  id: int().primaryKey({ autoIncrement: true }),
  trackableId: int().notNull().references(() => trackables.id),
  date: text().notNull(), // YYYY-MM-DD format
  value: text().notNull(), // flexible: can store "true", "5.2", "great session"
  notes: text(), // optional personal notes
  createdAt: text().notNull(),
});

// Type inference for TypeScript
export type Category = typeof categories.$inferSelect;
export type Trackable = typeof trackables.$inferSelect;
export type Entry = typeof entries.$inferSelect;
