import { db } from "./client";
import { categories } from "./schema";

export async function seedInitialData() {
  await db.insert(categories).values([
    {
      name: "Running",
      icon: "🏃",
      color: "#FF6B6B",
      createdAt: new Date().toISOString(),
    },
    {
      name: "Nutrition",
      icon: "🥗",
      color: "#4ECDC4",
      createdAt: new Date().toISOString(),
    },
    {
      name: "Piano",
      icon: "🎹",
      color: "#95E1D3",
      createdAt: new Date().toISOString(),
    },
    {
      name: "Reading",
      icon: "📚",
      color: "#F3A683",
      createdAt: new Date().toISOString(),
    },
    {
      name: "Research",
      icon: "🔬",
      color: "#786FA6",
      createdAt: new Date().toISOString(),
    },
  ]);
}
