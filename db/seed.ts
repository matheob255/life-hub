import { db } from './client';
import { categories, subcategories, items } from './schema';

export async function seedData() {
  try {
    // Insert main categories
    const categoryData = [
      { id: 1, name: "Daily", icon: "📅", color: "#6366f1", order: 1 },
      { id: 2, name: "Nutrition", icon: "🥗", color: "#10b981", order: 2 },
      { id: 3, name: "Sport", icon: "⚽", color: "#f59e0b", order: 3 },
      { id: 4, name: "Culture", icon: "🎭", color: "#ec4899", order: 4 },
      { id: 5, name: "Others", icon: "✨", color: "#8b5cf6", order: 5 },
    ];

    for (const cat of categoryData) {
      await db.insert(categories).values({
        ...cat,
        createdAt: new Date().toISOString(),
      });
    }

    // Insert subcategories
    const subcategoryData = [
      { categoryId: 1, name: "Shopping List", icon: "🛒", type: "list" },
      { categoryId: 1, name: "To-Do Pro", icon: "💼", type: "list" },
      { categoryId: 1, name: "To-Do Perso", icon: "🏠", type: "list" },
      { categoryId: 2, name: "Meal Suggestions", icon: "🍽️", type: "journal" },
      { categoryId: 2, name: "Nutritional Intake", icon: "📊", type: "tracker" },
      { categoryId: 3, name: "Running", icon: "🏃", type: "tracker" },
      { categoryId: 3, name: "Tennis", icon: "🎾", type: "tracker" },
      { categoryId: 3, name: "Strength Training", icon: "💪", type: "list" },
      { categoryId: 3, name: "Daily Routine", icon: "🧘", type: "list" },
      { categoryId: 4, name: "Movies", icon: "🎬", type: "journal" },
      { categoryId: 4, name: "Books", icon: "📚", type: "journal" },
      { categoryId: 4, name: "Recommendations", icon: "⭐", type: "journal" },
      { categoryId: 5, name: "Monthly Budget", icon: "💰", type: "budget" },
      { categoryId: 5, name: "Important Dates", icon: "📆", type: "calendar" },
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

    // Shopping List with proper categories
    const shoppingItems = [
      // 🍽️ Food Staples
      { title: "Pasta/rice + sauce", category: "🍽️ Food Staples" },
      { title: "White cheese", category: "🍽️ Food Staples" },
      { title: "Cookies", category: "🍽️ Food Staples" },
      { title: "Chips", category: "🍽️ Food Staples" },
      { title: "Coffee capsules", category: "🍽️ Food Staples" },
      { title: "Tea", category: "🍽️ Food Staples" },
      // 🥬 Fresh Produce
      { title: "Salads / Vegetables", category: "🥬 Fresh Produce" },
      { title: "Bananas", category: "🥬 Fresh Produce" },
      // 🧴 Personal Care
      { title: "Shampoo", category: "🧴 Personal Care" },
      { title: "Face wash", category: "🧴 Personal Care" },
      { title: "Shower gel", category: "🧴 Personal Care" },
      { title: "Cotton swabs", category: "🧴 Personal Care" },
      { title: "Handkerchiefs", category: "🧴 Personal Care" },
      { title: "Nail clippers", category: "🧴 Personal Care" },
      // 🏠 Household
      { title: "Trash bags", category: "🏠 Household" },
      { title: "Ink", category: "🏠 Household" },
      // 👕 Clothing & Accessories
      { title: "Underwear", category: "👕 Clothing" },
      { title: "Reflective sweatshirts", category: "👕 Clothing" },
      { title: "Depilatory running vest", category: "👕 Clothing" },
      // 🎁 Gifts & Special
      { title: "Mom's gift", category: "🎁 Gifts" },
    ];

    for (const item of shoppingItems) {
      await db.insert(items).values({
        subcategoryId: 1,
        title: item.title,
        description: item.category,
        completed: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Meal Suggestions
    const mealSuggestions = [
      { title: "Quick Pasta Carbonara", description: "Cook 200g pasta. Mix 2 eggs + cheese + pepper. Fry bacon. Combine off heat. 15 min!" },
      { title: "Overnight Oats", description: "1/2 cup oats + 1/2 cup milk + chia seeds + honey. Refrigerate overnight. Top with fruit." },
      { title: "One-Pan Chicken & Veggies", description: "Season chicken + potatoes + peppers on sheet. Roast 40min at 200°C. 3-4 meals!" },
      { title: "Swedish Meatballs", description: "500g meat + egg + breadcrumbs. Form balls, fry. Cream sauce + lingonberry jam!" },
      { title: "Rice Bowl Template", description: "Rice + protein (egg/chicken/tofu) + veggies + soy sauce + sesame oil. Infinite variations!" },
      { title: "Lentil Soup", description: "Onion + carrots + 1 cup lentils + 4 cups broth + cumin. Simmer 20min. Freezes well!" },
      { title: "Shakshuka", description: "Tomato sauce + peppers. Crack eggs in wells. Cover until set. Serve with bread!" },
      { title: "Tuna Pasta Salad", description: "Pasta + canned tuna + tomatoes + cucumber + olive oil + lemon. Lasts 3 days!" },
    ];

    for (const meal of mealSuggestions) {
      await db.insert(items).values({
        subcategoryId: 4,
        title: meal.title,
        description: meal.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Nutritional Intake
    const nutritionalNeeds = [
      { title: "Calories: 2,800-3,200 kcal/day", description: "Active 24yo runner. Higher on long run days, lower on rest days." },
      { title: "Protein: 120-150g/day", description: "1.6-2.0g per kg. Spread throughout day for muscle recovery." },
      { title: "Carbohydrates: 350-450g/day", description: "5-7g per kg. Your running fuel! Oats, rice, pasta, sweet potatoes." },
      { title: "Fats: 70-90g/day", description: "Avocado, nuts, olive oil, fatty fish. Essential for hormones." },
      { title: "Water: 3-4 liters/day", description: "Minimum 3L daily, 4L+ on training days. Check urine color." },
      { title: "Vitamin D: 2000-4000 IU/day", description: "CRUCIAL in Sweden! Take supplement daily, especially winter." },
      { title: "Iron: 18mg/day", description: "Red meat, spinach, lentils. Important for runners. With vitamin C." },
      { title: "Pre-Run: 30-60g carbs", description: "1-2h before: banana + toast, or oatmeal. Light and digestible." },
      { title: "Post-Run: Protein + Carbs <30min", description: "Chocolate milk, protein shake, or chicken + rice. 3:1 ratio." },
      { title: "Electrolytes on long runs", description: "Runs >90min: sports drink or tabs. Prevents cramping." },
    ];

    for (const nutrient of nutritionalNeeds) {
      await db.insert(items).values({
        subcategoryId: 5,
        title: nutrient.title,
        description: nutrient.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Strength Training
    const strengthExercises = [
      { title: "Single-Leg Deadlifts", description: "3x10 each leg. Posterior chain & balance for trail stability." },
      { title: "Bulgarian Split Squats", description: "3x12 each leg. Strengthens quads & glutes. Prevents knee injuries." },
      { title: "Calf Raises", description: "3x15-20. Better push-off & injury prevention." },
      { title: "Plank Hold", description: "3x45-60sec. Core strength for uphills." },
      { title: "Side Plank", description: "3x30sec each side. Lateral stability for uneven terrain." },
      { title: "Glute Bridges", description: "3x15. Activates glutes, prevents IT band issues." },
      { title: "Box Step-Ups", description: "3x12 each leg. Mimics running motion, builds power." },
      { title: "Russian Twists", description: "3x20. Rotational core for trail turns." },
    ];

    for (const exercise of strengthExercises) {
      await db.insert(items).values({
        subcategoryId: 8,
        title: exercise.title,
        description: exercise.description,
        completed: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Daily Routine
    const mobilityExercises = [
      { title: "Cat-Cow Stretch", description: "10 reps. Wakes up spine." },
      { title: "World's Greatest Stretch", description: "5 each side. Opens hips, shoulders, thoracic." },
      { title: "Leg Swings (Front/Back)", description: "10 each leg. Loosens hip flexors." },
      { title: "Leg Swings (Side-to-Side)", description: "10 each leg. Hip abductor mobility." },
      { title: "Ankle Circles", description: "10 each direction. Crucial for trail running." },
      { title: "Walking Lunges with Twist", description: "10 total. Dynamic hip opening." },
      { title: "High Knees", description: "20 seconds. Activates hip flexors." },
      { title: "Butt Kicks", description: "20 seconds. Hamstring activation." },
    ];

    for (const exercise of mobilityExercises) {
      await db.insert(items).values({
        subcategoryId: 9,
        title: exercise.title,
        description: exercise.description,
        completed: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Recommendations
    const recommendations = [
      { title: "Movies to Watch", description: "The Grand Budapest Hotel • Parasite • Portrait de la jeune fille en feu • Amélie • Blade Runner 2049 • Drive My Car" },
      { title: "Books to Read", description: "L'Étranger (Camus) • Born to Run (McDougall) • Sapiens (Harari) • La Peste (Camus) • Educated (Westover) • Norwegian Wood (Murakami)" },
      { title: "French Literature", description: "Le Petit Prince • Les Misérables • Madame Bovary • Le Rouge et le Noir • À la recherche du temps perdu" },
    ];

    for (const rec of recommendations) {
      await db.insert(items).values({
        subcategoryId: 12,
        title: rec.title,
        description: rec.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Sneakers
    const sneakers = [
      { brand: "Air Max", model: "AM1/97 SW", size: "9 US" },
      { brand: "Air Jordan 1", model: "UNC Patent", size: "9 US" },
      { brand: "Air Jordan 1", model: "Purple 1.0", size: "9.5 US" },
      { brand: "Air Jordan 1", model: "Smoke Grey", size: "9.5 US" },
      { brand: "Air Jordan 1", model: "Fearless", size: "9.5 US" },
      { brand: "Air Jordan 1", model: "Hyper Royal", size: "9 US" },
      { brand: "Air Jordan 1", model: "Rookie of the Year", size: "9.5 US" },
      { brand: "Air Jordan 1", model: "Aleali 1.0", size: "9 US" },
      { brand: "Air Jordan 1", model: "Japan", size: "9 US" },
      { brand: "Air Jordan 1", model: "Obsidian", size: "9.5 US" },
      { brand: "Air Jordan 1", model: "Reverse SBB", size: "9 US" },
      { brand: "Air Jordan 1", model: "Pine Green", size: "9 US" },
      { brand: "Air Jordan 1", model: "Low Travis Velvet", size: "9 US" },
      { brand: "Air Max 90", model: "OW OG", size: "9 US" },
      { brand: "Vapormax", model: "OW OG", size: "9 US" },
      { brand: "Blazer", model: "OW OG", size: "9 US" },
      { brand: "Air Force 1", model: "OW Volt", size: "8.5 US" },
      { brand: "Sacai", model: "Vaporwaffle Fuschia", size: "9 US" },
      { brand: "Air Max 1", model: "Tokyo Maze", size: "9 US" },
      { brand: "Air Force 1", model: "Clot Rose Gold", size: "8.5 US" },
      { brand: "Air Force 1", model: "Ambush", size: "9 US" },
      { brand: "Dior", model: "B23 Black", size: "42 IT" },
      { brand: "New Balance", model: "2002R Purple", size: "9.5 US" },
      { brand: "New Balance", model: "1990 White", size: "9 US" },
      { brand: "Yeezy", model: "350 v2 Green", size: "9.5 US" },
      { brand: "Yeezy", model: "700 OG", size: "9.5 US" },
      { brand: "Yeezy", model: "700 v2 Tephra", size: "9 US" },
      { brand: "Yeezy", model: "451", size: "" },
      { brand: "Yeezy", model: "QNTM", size: "" },
      { brand: "Yeezy", model: "Onyx", size: "" },
      { brand: "Air Force 1", model: "By You", size: "8.5 US" },
    ];

    for (const sneaker of sneakers) {
      await db.insert(items).values({
        subcategoryId: 15,
        title: `${sneaker.brand} ${sneaker.model}`,
        description: `Size: ${sneaker.size || 'N/A'}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Concerts
    const concerts = [
      { artist: "Gazo", times: "6", venues: "The Beat Genève #5 • The Beat Neuchatel • Ardentes • Balelec • Estivale" },
      { artist: "Dinos", times: "7", venues: "Grenoble • Estivale • Soho House • Ardentes • Paleo • Annecy • Caribana" },
      { artist: "Koba la D", times: "4", venues: "Montreux • The Beat Genève #4 • The Beat Neuchatel • Estivale" },
      { artist: "Damso", times: "4", venues: "Genève • Colmar • Paris • Paleo" },
      { artist: "Niska", times: "3", venues: "Estivale • Holocène • The Beat #5" },
      { artist: "PLK", times: "3", venues: "The Beat Genève #3 • Montreux • Colmar" },
      { artist: "Maes", times: "3", venues: "Montreux • The Beat Neuchatel • Ardentes" },
      { artist: "DJ Snake", times: "3", venues: "Amnesia • Paleo • SDF" },
      { artist: "SCH", times: "3", venues: "Montreux • Paleo • Ardentes" },
      { artist: "Booba", times: "2", venues: "Modnyy • Paris" },
      { artist: "Vald", times: "2", venues: "The Beat Genève #3 • Balelec" },
      { artist: "Ninho", times: "2", venues: "The Beat #4 • Genève" },
      { artist: "Kendrick Lamar", times: "2", venues: "Los Angeles • Ardentes" },
      { artist: "Lous and the Yakuza", times: "2", venues: "Ardentes • Paleo" },
      { artist: "SDM", times: "2", venues: "The Beat Neuchâtel • Caribana" },
      { artist: "Travis Scott", times: "1", venues: "Ardentes" },
      { artist: "Playboi Carti", times: "1", venues: "Ardentes" },
      { artist: "Rema", times: "1", venues: "Ardentes" },
      { artist: "PNL", times: "1", venues: "Paleo" },
      { artist: "Leto", times: "1", venues: "Estivale" },
      { artist: "Orelsan", times: "1", venues: "Montjoux" },
    ];

    for (const concert of concerts) {
      await db.insert(items).values({
        subcategoryId: 16,
        title: concert.artist,
        description: `Seen ${concert.times}× • ${concert.venues}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    console.log('✓ All data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}
