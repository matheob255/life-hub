import { db } from '@/db/client';
import type { Subcategory } from '@/db/schema';
import { subcategories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SubcategoryListProps {
  categoryId: number;
  categoryName: string;
  categoryColor: string;
}

export default function SubcategoryList({ categoryId, categoryName, categoryColor }: SubcategoryListProps) {
  const [subcategoryList, setSubcategoryList] = useState<Subcategory[]>([]);

  const loadSubcategories = async () => {
    try {
      const result = await db
        .select()
        .from(subcategories)
        .where(eq(subcategories.categoryId, categoryId));
      setSubcategoryList(result);
    } catch (error) {
      console.error('Error loading subcategories:', error);
    }
  };

  useEffect(() => {
    loadSubcategories();
  }, [categoryId]);

  const renderSubcategory = ({ item }: { item: Subcategory }) => (
    <TouchableOpacity style={[styles.card, { borderLeftColor: categoryColor }]}>
      <Text style={styles.icon}>{item.icon}</Text>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.type}>{item.type}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{categoryName}</Text>
        <Text style={styles.subtitle}>
          {subcategoryList.length} {subcategoryList.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      <FlatList
        data={subcategoryList}
        renderItem={renderSubcategory}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
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
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    fontSize: 32,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  type: {
    fontSize: 13,
    color: '#6C757D',
    textTransform: 'capitalize',
  },
  chevron: {
    fontSize: 24,
    color: '#ADB5BD',
  },
});
