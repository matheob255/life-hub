import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../db/client';
import { items } from '../../db/schema';
import type { Item } from '../../db/schema';
import { eq, and } from 'drizzle-orm';

interface ListDetailProps {
  subcategoryId: number;
  name: string;
  icon: string;
  color: string;
}

export default function ListDetail({ subcategoryId, name, icon, color }: ListDetailProps) {
  const [itemList, setItemList] = useState<Item[]>([]);
  const [newItemText, setNewItemText] = useState('');

  const loadItems = async () => {
    try {
      const result = await db
        .select()
        .from(items)
        .where(eq(items.subcategoryId, subcategoryId));
      setItemList(result);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  useEffect(() => {
    loadItems();
  }, [subcategoryId]);

  const addItem = async () => {
    if (!newItemText.trim()) return;

    try {
      const now = new Date().toISOString();
      await db.insert(items).values({
        subcategoryId,
        title: newItemText.trim(),
        completed: 0,
        createdAt: now,
        updatedAt: now,
      });
      setNewItemText('');
      await loadItems();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const toggleItem = async (item: Item) => {
    try {
      await db
        .update(items)
        .set({ 
          completed: item.completed === 1 ? 0 : 1,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(items.id, item.id));
      await loadItems();
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const deleteItem = async (item: Item) => {
    Alert.alert(
      'Delete Item',
      `Remove "${item.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.delete(items).where(eq(items.id, item.id));
              await loadItems();
            } catch (error) {
              console.error('Error deleting item:', error);
            }
          },
        },
      ]
    );
  };

  const pendingItems = itemList.filter(item => item.completed === 0);
  const completedItems = itemList.filter(item => item.completed === 1);

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => toggleItem(item)}
      onLongPress={() => deleteItem(item)}
    >
      <TouchableOpacity
        style={[styles.checkbox, item.completed === 1 && { backgroundColor: color }]}
        onPress={() => toggleItem(item)}
      >
        {item.completed === 1 && (
          <Ionicons name="checkmark" size={18} color="#fff" />
        )}
      </TouchableOpacity>
      <Text style={[styles.itemTitle, item.completed === 1 && styles.completedText]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { backgroundColor: color }]}>
        <Text style={styles.headerIcon}>{icon}</Text>
        <Text style={styles.headerTitle}>{name}</Text>
        <Text style={styles.headerStats}>
          {pendingItems.length} pending • {completedItems.length} done
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new item..."
          value={newItemText}
          onChangeText={setNewItemText}
          onSubmitEditing={addItem}
          returnKeyType="done"
        />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: color }]} onPress={addItem}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={[...pendingItems, ...completedItems]}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>No items yet</Text>
            <Text style={styles.emptySubtext}>Add your first item above</Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
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
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerStats: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 12,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 16,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CED4DA',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    color: '#212529',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#6C757D',
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
});
