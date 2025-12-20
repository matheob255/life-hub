import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../../db/client';
import { items } from '../../db/schema';
import type { Item } from '../../db/schema';
import { eq, asc } from 'drizzle-orm';

interface CalendarDetailProps {
  subcategoryId: number;
  name: string;
  icon: string;
  color: string;
}

export default function CalendarDetail({ subcategoryId, name, icon, color }: CalendarDetailProps) {
  const [itemList, setItemList] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const loadItems = async () => {
    try {
      const result = await db
        .select()
        .from(items)
        .where(eq(items.subcategoryId, subcategoryId))
        .orderBy(asc(items.date));
      setItemList(result);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  useEffect(() => {
    loadItems();
  }, [subcategoryId]);

  const addDate = async () => {
    if (!newTitle.trim() || !newDate.trim()) return;

    try {
      const now = new Date().toISOString();
      
      await db.insert(items).values({
        subcategoryId,
        title: newTitle.trim(),
        description: newDescription.trim() || null,
        date: newDate,
        createdAt: now,
        updatedAt: now,
      });
      
      setNewTitle('');
      setNewDate('');
      setNewDescription('');
      setModalVisible(false);
      await loadItems();
    } catch (error) {
      console.error('Error adding date:', error);
    }
  };

  const deleteDate = async (item: Item) => {
    Alert.alert(
      'Delete Date',
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
              console.error('Error deleting date:', error);
            }
          },
        },
      ]
    );
  };

  const isUpcoming = (dateString: string) => {
    const itemDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return itemDate >= today;
  };

  const renderItem = ({ item }: { item: Item }) => {
    const upcoming = isUpcoming(item.date || item.createdAt);
    
    return (
      <TouchableOpacity
        style={[styles.dateCard, !upcoming && styles.pastDateCard]}
        onLongPress={() => deleteDate(item)}
      >
        <View style={[styles.dateBox, { backgroundColor: upcoming ? color : '#666' }]}>
          <Text style={styles.dateDay}>
            {new Date(item.date || item.createdAt).getDate()}
          </Text>
          <Text style={styles.dateMonth}>
            {new Date(item.date || item.createdAt).toLocaleDateString('en-US', { month: 'short' })}
          </Text>
        </View>
        <View style={styles.dateInfo}>
          <Text style={[styles.dateTitle, !upcoming && styles.pastDateText]}>
            {item.title}
          </Text>
          {item.description && (
            <Text style={[styles.dateDescription, !upcoming && styles.pastDateText]}>
              {item.description}
            </Text>
          )}
          <Text style={styles.dateYear}>
            {new Date(item.date || item.createdAt).getFullYear()}
          </Text>
        </View>
        {upcoming && <Ionicons name="calendar" size={24} color={color} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[color, color + 'DD']}
        style={styles.header}
      >
        <Text style={styles.headerIcon}>{icon}</Text>
        <Text style={styles.headerTitle}>{name}</Text>
        <Text style={styles.headerStats}>{itemList.length} dates tracked</Text>
      </LinearGradient>

      <FlatList
        data={itemList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No dates yet</Text>
            <Text style={styles.emptySubtext}>Add birthdays, deadlines, events</Text>
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
              <Text style={styles.modalTitle}>Add Important Date</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#495057" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Title (e.g., Mom's Birthday)"
              placeholderTextColor="#666"
              value={newTitle}
              onChangeText={setNewTitle}
              autoFocus
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Date (YYYY-MM-DD, e.g., 2025-12-25)"
              placeholderTextColor="#666"
              value={newDate}
              onChangeText={setNewDate}
            />

            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Notes (optional)"
              placeholderTextColor="#666"
              value={newDescription}
              onChangeText={setNewDescription}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: color }]}
              onPress={addDate}
            >
              <Text style={styles.modalButtonText}>Save Date</Text>
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
    backgroundColor: '#0f0f1e',
  },
  header: {
    padding: 24,
    paddingTop: 70,
    paddingBottom: 32,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  headerStats: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  list: {
    padding: 16,
  },
  dateCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  pastDateCard: {
    opacity: 0.5,
  },
  dateBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  dateDay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  dateMonth: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dateInfo: {
    flex: 1,
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  dateDescription: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  dateYear: {
    fontSize: 12,
    color: '#666',
  },
  pastDateText: {
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#888',
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
    backgroundColor: '#1a1a2e',
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
    color: '#fff',
  },
  modalInput: {
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    color: '#fff',
  },
  modalTextArea: {
    height: 80,
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
