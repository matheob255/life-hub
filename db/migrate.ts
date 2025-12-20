import { sql } from 'drizzle-orm';
import { db } from './client';

export async function initDatabase() {
  try {
    // Create categories table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        "order" INTEGER NOT NULL,
        createdAt TEXT NOT NULL
      )
    `);

    // Create subcategories table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS subcategories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categoryId INTEGER NOT NULL,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        type TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (categoryId) REFERENCES categories(id)
      )
    `);

    // Create items table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subcategoryId INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        value TEXT,
        date TEXT,
        completed INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (subcategoryId) REFERENCES subcategories(id)
      )
    `);

    console.log('✓ Database tables initialized');
    return true;
  } catch (error) {
    console.error('Migration error:', error);
    return false;
  }
}
