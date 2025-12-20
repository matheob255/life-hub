import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../db/client';
import { items } from '../../db/schema';
import type { Item } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';

interface TrackerDetailProps {
  subcategoryId: number;
  name: string;
  icon: string;
  color: string;
}

export default function TrackerDetail({ subcategoryId, name, icon, color }: TrackerDetailProps) {
  const [itemList, setItemList] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const loadItems = async () => {
    try {
      const result = await db
        .select()
        .from(items)
        .where(eq(items.subcategoryId, subcategoryId))
        .orderBy(desc(items.date));
      setItemList(result);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  useEffect(() => {
    loadItems();
  }, [subcategoryId]);

  const addEntry = async () => {
    if (!newValue.trim()) return;

    try {
      const now = new Date().toISOString();
      const today = new Date().toISOString().split('T')[0];
      
      await db.insert(items).values({
        subcategoryId,
        title: `Entry for ${today}`,
        value: newValue.trim(),
        description: newNotes.trim() || null,
        date: today,
        createdAt: now,
        updatedAt: now,
      });
      
      setNewValue('');
      setNewNotes('');
      setModalVisible(false);
      await loadItems();
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  const deleteEntry = async (item: Item) => {
    Alert.alert(
      'Delete Entry',
      `Remove entry from ${item.date}?`,
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
              console.error('Error deleting entry:', error);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity
      style={styles.entryCard}
      onLongPress={() => deleteEntry(item)}
    >
      <View style={styles.entryHeader}>
        <Text style={styles.entryDate}>
          {new Date(item.date || item.createdAt).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </Text>
        <Text style={[styles.entryValue, { color }]}>{item.value}</Text>
      </View>
      {item.description && (
        <Text style={styles.entryNotes}>{item.description}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: color }]}>
        <Text style={styles.headerIcon}>{icon}</Text>
        <Text style={styles.headerTitle}>{name}</Text>
        <Text style={styles.headerStats}>{itemList.length} entries logged</Text>
      </View>

      <FlatList
        data={itemList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>No entries yet</Text>
            <Text style={styles.emptySubtext}>Track your first entry below</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: color }]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Entry</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#495057" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Value (e.g., 5.2 km, 45 min, 2000 cal)"
              value={newValue}
              onChangeText={setNewValue}
              autoFocus
            />

            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Notes (optional)"
              value={newNotes}
              onChangeText={setNewNotes}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: color }]}
              onPress={addEntry}
            >
              <Text style={styles.modalButtonText}>Save Entry</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  list: {
    padding: 16,
  },
  entryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '600',
  },
  entryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  entryNotes: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  modalInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
  },
  modalTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
