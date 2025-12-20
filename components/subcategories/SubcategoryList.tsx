import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { db } from '../../db/client';
import { subcategories } from '../../db/schema';
import type { Subcategory } from '../../db/schema';
import { eq } from 'drizzle-orm';

interface SubcategoryListProps {
  categoryId: number;
  categoryName: string;
  categoryColor: string;
}

export default function SubcategoryList({ categoryId, categoryName, categoryColor }: SubcategoryListProps) {
  const [subcategoryList, setSubcategoryList] = useState<Subcategory[]>([]);
  const router = useRouter();

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

  const handleSubcategoryPress = (item: Subcategory) => {
    // Navigate to detail screen based on type
    router.push({
      pathname: `/subcategory/${item.type}`,
      params: { 
        id: item.id,
        name: item.name,
        icon: item.icon,
        color: categoryColor,
        type: item.type,
      }
    });
  };

  const renderSubcategory = ({ item }: { item: Subcategory }) => (
    <TouchableOpacity 
      style={[styles.card, { borderLeftColor: categoryColor }]}
      onPress={() => handleSubcategoryPress(item)}
    >
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
