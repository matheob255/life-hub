import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { db } from '../../db/client';
import { items } from '../../db/schema';
import type { Item } from '../../db/schema';
import { eq } from 'drizzle-orm';

interface ImportantDatesDetailProps {
  subcategoryId: number;
  name: string;
  icon: string;
  color: string;
}

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
] as const;
type MonthName = (typeof MONTHS)[number];

export default function ImportantDatesDetail({ subcategoryId, name, icon, color }: ImportantDatesDetailProps) {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [inputs, setInputs] = useState<Record<MonthName, { day: string; label: string }>>(
    MONTHS.reduce((acc, m) => {
      acc[m as MonthName] = { day: '', label: '' };
      return acc;
    }, {} as any),
  );

  const loadItems = async () => {
    try {
      const result = await db
        .select()
        .from(items)
        .where(eq(items.subcategoryId, subcategoryId));
      setAllItems(result);
    } catch (error) {
      console.error('Error loading important dates:', error);
    }
  };

  useEffect(() => {
    loadItems();
  }, [subcategoryId]);

  const parseValue = (item: Item): { day?: number; label?: string } => {
    if (!item.value) return {};
    try {
      return JSON.parse(item.value);
    } catch {
      return {};
    }
  };

  const getItemsForMonth = (month: MonthName) =>
    allItems.filter((i) => i.title === month);

  const changeInput = (month: MonthName, field: 'day' | 'label', value: string) => {
    setInputs((prev) => ({
      ...prev,
      [month]: { ...prev[month], [field]: value },
    }));
  };

  const addDate = async (month: MonthName) => {
    const entry = inputs[month];
    const day = parseInt(entry.day, 10);
    if (!entry.label.trim() || Number.isNaN(day) || day <= 0 || day > 31) return;

    const now = new Date().toISOString();
    const value = JSON.stringify({ day, label: entry.label.trim() });

    try {
      await db.insert(items).values({
        subcategoryId,
        title: month, // month name
        value,
        createdAt: now,
        updatedAt: now,
      });
      setInputs((prev) => ({
        ...prev,
        [month]: { day: '', label: '' },
      }));
      await loadItems();
    } catch (error) {
      console.error('Error adding important date:', error);
    }
  };

  const deleteDate = async (item: Item) => {
    try {
      await db.delete(items).where(eq(items.id, item.id));
      await loadItems();
    } catch (error) {
      console.error('Error deleting date:', error);
    }
  };

  const renderMonth = (month: MonthName) => {
    const data = getItemsForMonth(month);
    return (
      <View key={month} style={styles.monthCard}>
        <Text style={styles.monthTitle}>{month}</Text>

        {data
          .map((item) => ({ item, meta: parseValue(item) }))
          .sort((a, b) => (a.meta.day || 0) - (b.meta.day || 0))
          .map(({ item, meta }) => (
            <TouchableOpacity
              key={item.id}
              style={styles.dateRow}
              onLongPress={() => deleteDate(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.dateDay}>
                {meta.day ? String(meta.day).padStart(2, '0') : '--'}
              </Text>
              <Text style={styles.dateLabel}>{meta.label || ''}</Text>
            </TouchableOpacity>
          ))}

        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { width: 52 }]}
            placeholder="DD"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
            maxLength={2}
            value={inputs[month].day}
            onChangeText={(txt) => changeInput(month, 'day', txt)}
          />
          <TextInput
            style={[styles.input, { flex: 1, marginLeft: 8 }]}
            placeholder="Label (e.g. Mum's birthday)"
            placeholderTextColor="#9ca3af"
            value={inputs[month].label}
            onChangeText={(txt) => changeInput(month, 'label', txt)}
            onSubmitEditing={() => addDate(month)}
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: color }]}
            onPress={() => addDate(month)}
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
        data={MONTHS}
        renderItem={({ item }) => renderMonth(item)}
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
  monthCard: {
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
  monthTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },
  dateDay: {
    width: 32,
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  dateLabel: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  input: {
    height: 36,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#111827',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
});
