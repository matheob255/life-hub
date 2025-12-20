import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { db } from '../db/client';
import { categories } from '../db/schema';

export default function SeedDataScreen() {
  const [seeded, setSeeded] = useState(false);

  const seedCategories = async () => {
    try {
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
      setSeeded(true);
      alert('Categories seeded successfully!');
    } catch (error) {
      console.error('Seed error:', error);
      alert('Error seeding data. Check console.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Database Setup</Text>
      <Button title="Seed Initial Categories" onPress={seedCategories} />
      {seeded && <Text style={styles.success}>✓ Data seeded!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  success: {
    marginTop: 20,
    fontSize: 18,
    color: 'green',
  },
});
