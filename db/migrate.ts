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
        createdAt TEXT NOT NULL
      )
    `);

    // Create trackables table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS trackables (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categoryId INTEGER NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        unit TEXT,
        target TEXT,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (categoryId) REFERENCES categories(id)
      )
    `);

    // Create entries table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trackableId INTEGER NOT NULL,
        date TEXT NOT NULL,
        value TEXT NOT NULL,
        notes TEXT,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (trackableId) REFERENCES trackables(id)
      )
    `);

    console.log('✓ Database tables initialized');
    return true;
  } catch (error) {
    console.error('Migration error:', error);
    return false;
  }
}
