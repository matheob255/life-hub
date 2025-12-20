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
    router.push(
      `/subcategory/${item.type}?id=${item.id}&name=${encodeURIComponent(
        item.name,
      )}&icon=${encodeURIComponent(item.icon)}&color=${encodeURIComponent(
        categoryColor,
      )}`,
    );
  };

  const renderSubcategory = ({ item }: { item: Subcategory }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => handleSubcategoryPress(item)}
      activeOpacity={0.85}
    >
      <View style={[styles.card, { borderLeftColor: categoryColor }]}>
        <View style={styles.cardLeft}>
          <Text style={styles.icon}>{item.icon}</Text>
          <Text style={styles.name}>{item.name}</Text>
        </View>
        <Text style={[styles.typePill, { color: categoryColor, borderColor: categoryColor }]}>
          {item.type}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.pageHeader, { backgroundColor: '#f9fafb' }]}>
        <Text style={styles.pageTitle}>{categoryName}</Text>
        <Text style={[styles.pageSubtitle, { color: categoryColor }]}>
          {subcategoryList.length} {subcategoryList.length === 1 ? 'area' : 'areas'}
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
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  pageHeader: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardContainer: {
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  typePill: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
});
