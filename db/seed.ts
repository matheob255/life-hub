import { db } from './client';
import { categories, subcategories } from './schema';

export async function seedData() {
  try {
    // Check if already seeded
    const existing = await db.select().from(categories);
    if (existing.length > 0) {
      console.log('Data already seeded');
      return;
    }

    // Insert main categories (tabs)
    const categoryData = [
      { id: 1, name: "Daily", icon: "📅", color: "#FF6B6B", order: 1 },
      { id: 2, name: "Nutrition", icon: "🥗", color: "#4ECDC4", order: 2 },
      { id: 3, name: "Sport", icon: "⚽", color: "#95E1D3", order: 3 },
      { id: 4, name: "Culture", icon: "🎭", color: "#F3A683", order: 4 },
      { id: 5, name: "Others", icon: "✨", color: "#786FA6", order: 5 },
    ];

    for (const cat of categoryData) {
      await db.insert(categories).values({
        ...cat,
        createdAt: new Date().toISOString(),
      });
    }

    // Insert subcategories
    const subcategoryData = [
      // Daily subcategories
      { categoryId: 1, name: "Shopping List", icon: "🛒", type: "list" },
      { categoryId: 1, name: "To-Do List", icon: "✓", type: "list" },
      
      // Nutrition subcategories
      { categoryId: 2, name: "Meal Suggestions", icon: "🍽️", type: "journal" },
      { categoryId: 2, name: "Nutritional Intake", icon: "📊", type: "tracker" },
      
      // Sport subcategories
      { categoryId: 3, name: "Running", icon: "🏃", type: "tracker" },
      { categoryId: 3, name: "Tennis", icon: "🎾", type: "tracker" },
      { categoryId: 3, name: "Daily Routine", icon: "💪", type: "list" },
      
      // Culture subcategories
      { categoryId: 4, name: "Movies", icon: "🎬", type: "journal" },
      { categoryId: 4, name: "Books", icon: "📚", type: "journal" },
      
      // Others subcategories
      { categoryId: 5, name: "Sneakers", icon: "👟", type: "journal" },
      { categoryId: 5, name: "Concerts", icon: "🎵", type: "journal" },
      { categoryId: 5, name: "Travels", icon: "✈️", type: "journal" },
    ];

    for (const subcat of subcategoryData) {
      await db.insert(subcategories).values({
        ...subcat,
        createdAt: new Date().toISOString(),
      });
    }

    console.log('✓ Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}
