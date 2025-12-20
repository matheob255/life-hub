import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { db } from '../../db/client';
import { items } from '../../db/schema';
import type { Item } from '../../db/schema';
import { eq, and } from 'drizzle-orm';

interface TravelsDetailProps {
  subcategoryId: number;
  name: string;
  icon: string;
  color: string;
}

type SectionKey = 'Europe' | 'Asia' | 'Africa' | 'North America' | 'South America' | 'Oceania' | 'Next travels';

const CONTINENTS: SectionKey[] = [
  'Europe',
  'Asia',
  'Africa',
  'North America',
  'South America',
  'Oceania',
  'Next travels',
];

export default function TravelsDetail({ subcategoryId, name, icon, color }: TravelsDetailProps) {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [inputs, setInputs] = useState<Record<SectionKey, string>>({
    'Europe': '',
    'Asia': '',
    'Africa': '',
    'North America': '',
    'South America': '',
    'Oceania': '',
    'Next travels': '',
  });

  const loadItems = async () => {
    try {
      const result = await db
        .select()
        .from(items)
        .where(eq(items.subcategoryId, subcategoryId));
      setAllItems(result);
    } catch (error) {
      console.error('Error loading travels:', error);
    }
  };

  useEffect(() => {
    loadItems();
  }, [subcategoryId]);

  const handleChangeText = (key: SectionKey, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const addItem = async (section: SectionKey) => {
    const text = inputs[section].trim();
    if (!text) return;

    try {
      const now = new Date().toISOString();
      await db.insert(items).values({
        subcategoryId,
        title: text,
        description: section, // store continent / "Next travels"
        createdAt: now,
        updatedAt: now,
      });
      setInputs((prev) => ({ ...prev, [section]: '' }));
      await loadItems();
    } catch (error) {
      console.error('Error adding travel item:', error);
    }
  };

  const removeItem = async (item: Item) => {
    try {
      await db.delete(items).where(and(eq(items.id, item.id), eq(items.subcategoryId, subcategoryId)));
      await loadItems();
    } catch (error) {
      console.error('Error deleting travel item:', error);
    }
  };

  const getItemsForSection = (section: SectionKey) =>
    allItems.filter((i) => i.description === section);

  const renderSection = (section: SectionKey) => {
    const data = getItemsForSection(section);
    return (
      <View key={section} style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section}</Text>
        </View>

        {data.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.row}
            onLongPress={() => removeItem(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.rowBullet}>•</Text>
            <Text style={styles.rowText}>{item.title}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder={section === 'Next travels' ? 'Add idea…' : 'Add country or city…'}
            placeholderTextColor="#9ca3af"
            value={inputs[section]}
            onChangeText={(txt) => handleChangeText(section, txt)}
            onSubmitEditing={() => addItem(section)}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: color }]}
            onPress={() => addItem(section)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.headerIcon}>{icon}</Text>
        <Text style={styles.headerTitle}>{name}</Text>
      </View>

      <FlatList
        data={CONTINENTS}
        renderItem={({ item }) => renderSection(item)}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.list}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 12,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerIcon: { fontSize: 24, marginRight: 8 },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: -0.3,
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: 24,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },
  rowBullet: {
    fontSize: 10,
    color: '#6b7280',
    marginRight: 6,
  },
  rowText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  input: {
    flex: 1,
    height: 36,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    marginRight: 8,
    color: '#111827',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
});
