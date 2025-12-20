import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../db/client';
import { items } from '../../db/schema';
import type { Item } from '../../db/schema';
import { eq } from 'drizzle-orm';

interface ListDetailProps {
  subcategoryId: number;
  name: string;
  icon: string;
  color: string;
}

export default function ListDetail({ subcategoryId, name, icon, color }: ListDetailProps) {
  const [itemList, setItemList] = useState<Item[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');

  const isTodoList = name.toLowerCase().includes('to-do');
  const isShoppingList = name.toLowerCase().includes('shopping');

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
        urgency: isTodoList ? urgency : null,
        createdAt: now,
        updatedAt: now,
      });
      setNewItemText('');
      setUrgency('medium');
      setModalVisible(false);
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
    Alert.alert('Delete', `Remove "${item.title}"?`, [
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
    ]);
  };

  const getUrgencyColor = (urgencyLevel?: string | null) => {
    if (!urgencyLevel) return '#e5e7eb';
    switch (urgencyLevel) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#e5e7eb';
    }
  };

  const handleAddPress = () => {
    if (isTodoList) {
      setModalVisible(true);
    } else {
      if (newItemText.trim()) addItem();
    }
  };

  const renderItem = ({ item }: { item: Item }) => {
    const urgencyColor = getUrgencyColor(item.urgency);
    return (
      <TouchableOpacity
        style={[
          styles.itemCard,
          isTodoList && { borderLeftWidth: 3, borderLeftColor: urgencyColor },
        ]}
        onPress={() => toggleItem(item)}
        onLongPress={() => deleteItem(item)}
        activeOpacity={0.7}
      >
        <TouchableOpacity
          style={[
            styles.checkbox,
            item.completed === 1 && { backgroundColor: color, borderColor: color },
          ]}
          onPress={() => toggleItem(item)}
        >
          {item.completed === 1 && <Ionicons name="checkmark" size={14} color="#fff" />}
        </TouchableOpacity>
        <Text
          style={[styles.itemTitle, item.completed === 1 && styles.completedText]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={isShoppingList ? 'Add item…' : 'Add task…'}
          placeholderTextColor="#9ca3af"
          value={newItemText}
          onChangeText={setNewItemText}
          onSubmitEditing={handleAddPress}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: color }]}
          onPress={handleAddPress}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={itemList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />

      {/* Priority modal for To-Do lists */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Priority</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.urgencyButtons}>
              <TouchableOpacity
                style={[
                  styles.urgencyButton,
                  urgency === 'low' && { backgroundColor: '#10b981' },
                ]}
                onPress={() => setUrgency('low')}
              >
                <Text
                  style={[
                    styles.urgencyText,
                    urgency === 'low' && styles.urgencyTextActive,
                  ]}
                >
                  Low
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.urgencyButton,
                  urgency === 'medium' && { backgroundColor: '#f59e0b' },
                ]}
                onPress={() => setUrgency('medium')}
              >
                <Text
                  style={[
                    styles.urgencyText,
                    urgency === 'medium' && styles.urgencyTextActive,
                  ]}
                >
                  Medium
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.urgencyButton,
                  urgency === 'high' && { backgroundColor: '#ef4444' },
                ]}
                onPress={() => setUrgency('high')}
              >
                <Text
                  style={[
                    styles.urgencyText,
                    urgency === 'high' && styles.urgencyTextActive,
                  ]}
                >
                  High
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: color }]}
              onPress={addItem}
            >
              <Text style={styles.modalButtonText}>Add task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    marginRight: 8,
    color: '#111827',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 15,
    color: '#111827',
    flex: 1,
  },
  completedText: {
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  urgencyButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  urgencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  urgencyTextActive: {
    color: '#ffffff',
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
