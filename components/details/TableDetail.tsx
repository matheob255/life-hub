import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { db } from '../../db/client';
import { items } from '../../db/schema';
import type { Item } from '../../db/schema';
import { eq } from 'drizzle-orm';

interface Column {
  key: string;
  label: string;
  width?: number; // flex weight
  align?: 'left' | 'center' | 'right';
}

interface TableDetailProps {
  subcategoryId: number;
  name: string;
  icon: string;
  color: string;
  columns: Column[];
}

export default function TableDetail({ subcategoryId, name, icon, color, columns }: TableDetailProps) {
  const [rows, setRows] = useState<Item[]>([]);
  const [title, setTitle] = useState('');
  const [meta1, setMeta1] = useState('');
  const [meta2, setMeta2] = useState('');
  const [meta3, setMeta3] = useState('');

  const loadRows = async () => {
    try {
      const result = await db
        .select()
        .from(items)
        .where(eq(items.subcategoryId, subcategoryId));
      setRows(result);
    } catch (error) {
      console.error('Error loading table items:', error);
    }
  };

  useEffect(() => {
    loadRows();
  }, [subcategoryId]);

  const addRow = async () => {
    if (!title.trim()) return;

    const now = new Date().toISOString();
    const value = JSON.stringify({
      c1: meta1.trim(),
      c2: meta2.trim(),
      c3: meta3.trim(),
    });

    try {
      await db.insert(items).values({
        subcategoryId,
        title: title.trim(),
        value,
        createdAt: now,
        updatedAt: now,
      });
      setTitle('');
      setMeta1('');
      setMeta2('');
      setMeta3('');
      await loadRows();
    } catch (error) {
      console.error('Error adding row:', error);
    }
  };

  const parseValue = (item: Item) => {
    if (!item.value) return {};
    try {
      return JSON.parse(item.value);
    } catch {
      return {};
    }
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      {columns.map((col) => (
        <Text
          key={col.key}
          style={[
            styles.headerCell,
            { flex: col.width ?? 1 },
            col.align === 'center' && { textAlign: 'center' },
            col.align === 'right' && { textAlign: 'right' },
          ]}
          numberOfLines={1}
        >
          {col.label}
        </Text>
      ))}
    </View>
  );

  const renderItem = ({ item }: { item: Item }) => {
    const meta = parseValue(item);
    const values = [item.title, meta.c1, meta.c2, meta.c3];

    return (
      <View style={styles.row}>
        {columns.map((col, index) => (
          <Text
            key={col.key}
            style={[
              styles.cell,
              { flex: col.width ?? 1 },
              col.align === 'center' && { textAlign: 'center' },
              col.align === 'right' && { textAlign: 'right' },
            ]}
            numberOfLines={1}
          >
            {values[index] || ''}
          </Text>
        ))}
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

      {renderHeader()}

      <FlatList
        data={rows}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />

      <View style={styles.inputSection}>
        <Text style={styles.inputTitle}>Add new entry</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: columns[0]?.width ?? 1 }]}
            placeholder={columns[0]?.label || 'Title'}
            placeholderTextColor="#9ca3af"
            value={title}
            onChangeText={setTitle}
          />
        </View>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: columns[1]?.width ?? 1 }]}
            placeholder={columns[1]?.label || 'Field 1'}
            placeholderTextColor="#9ca3af"
            value={meta1}
            onChangeText={setMeta1}
          />
          <TextInput
            style={[styles.input, { flex: columns[2]?.width ?? 1, marginLeft: 8 }]}
            placeholder={columns[2]?.label || 'Field 2'}
            placeholderTextColor="#9ca3af"
            value={meta2}
            onChangeText={setMeta2}
          />
          <TextInput
            style={[styles.input, { flex: columns[3]?.width ?? 1, marginLeft: 8 }]}
            placeholder={columns[3]?.label || 'Field 3'}
            placeholderTextColor="#9ca3af"
            value={meta3}
            onChangeText={setMeta3}
          />
        </View>
        <TouchableOpacity
          style={[styles.addRowButton, { backgroundColor: color }]}
          onPress={addRow}
        >
          <Text style={styles.addRowText}>Add</Text>
        </TouchableOpacity>
      </View>
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
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  headerCell: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  cell: {
    fontSize: 14,
    color: '#111827',
    paddingRight: 6,
  },
  inputSection: {
    marginTop: 10,
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  inputTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  input: {
    height: 38,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#111827',
  },
  addRowButton: {
    marginTop: 4,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  addRowText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
