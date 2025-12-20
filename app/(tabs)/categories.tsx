import { eq } from 'drizzle-orm';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../db/client';
import { initDatabase } from '../../db/migrate';
import type { Category } from '../../db/schema';
import { categories } from '../../db/schema';
import { seedCategories } from '../../db/seed';

export default function CategoriesScreen() {
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Load categories from database
  const loadCategories = async () => {
    try {
      await initDatabase();
      await seedCategories(); // Add this line
      
      const result = await db.select().from(categories);
      setCategoryList(result);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadCategories();
    setRefreshing(false);
  };

  // Delete category
  const handleDelete = async (id: number, name: string) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.delete(categories).where(eq(categories.id, id));
              await loadCategories();
            } catch (error) {
              console.error('Error deleting category:', error);
            }
          },
        },
      ]
    );
  };

  // Render each category item
  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      style={[styles.categoryCard, { borderLeftColor: item.color }]}
      onLongPress={() => handleDelete(item.id, item.name)}
    >
      <View style={styles.categoryContent}>
        <Text style={styles.categoryIcon}>{item.icon}</Text>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{item.name}</Text>
          <Text style={styles.categoryDate}>
            Created {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Life Areas</Text>
        <Text style={styles.subtitle}>
          {categoryList.length} {categoryList.length === 1 ? 'category' : 'categories'}
        </Text>
      </View>

      <FlatList
        data={categoryList}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No categories yet</Text>
            <Text style={styles.emptySubtext}>Tap + to create your first life area</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Category</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
  },
  listContent: {
    padding: 16,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  categoryDate: {
    fontSize: 13,
    color: '#6C757D',
  },
  chevron: {
    fontSize: 24,
    color: '#ADB5BD',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#6C757D',
  },
  addButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
