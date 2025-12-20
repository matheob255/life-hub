import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../db/client';
import { items } from '../../db/schema';
import type { Item } from '../../db/schema';
import { eq, and } from 'drizzle-orm';

interface BudgetDetailProps {
  subcategoryId: number;
  name: string;
  icon: string;
  color: string;
}

const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const formatMonthLabel = (monthKey: string) => {
  const [year, month] = monthKey.split('-').map((v) => parseInt(v, 10));
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export default function BudgetDetail({ subcategoryId, name, icon, color }: BudgetDetailProps) {
  const [transactions, setTransactions] = useState<Item[]>([]);
  const [monthKey, setMonthKey] = useState(getMonthKey(new Date()));
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const loadTransactions = async () => {
    try {
      const result = await db
        .select()
        .from(items)
        .where(
          and(
            eq(items.subcategoryId, subcategoryId),
            eq(items.value, monthKey), // monthKey stored in value
          ),
        );
      setTransactions(result);
    } catch (error) {
      console.error('Error loading budget:', error);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [subcategoryId, monthKey]);

  const addTransaction = async () => {
    if (!title.trim() || !amount.trim()) return;

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const key = getMonthKey(now);

    try {
      await db.insert(items).values({
        subcategoryId,
        title: title.trim(),
        amount: amount.trim(),
        transactionType: type,
        date: today,
        value: key,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });
      setTitle('');
      setAmount('');
      await loadTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const changeMonth = (direction: -1 | 1) => {
    const [year, month] = monthKey.split('-').map((v) => parseInt(v, 10));
    const d = new Date(year, month - 1, 1);
    d.setMonth(d.getMonth() + direction);
    setMonthKey(getMonthKey(d));
  };

  const calculateSummary = () => {
    let income = 0;
    let expense = 0;
    transactions.forEach((t) => {
      const val = parseFloat(t.amount || '0');
      if (t.transactionType === 'income') income += val;
      else expense += val;
    });
    return { income, expense, balance: income - expense };
  };

  const { income, expense, balance } = calculateSummary();

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.rowTitle}>{item.title}</Text>
        <Text style={styles.rowDate}>
          {item.date
            ? new Date(item.date).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
              })
            : ''}
        </Text>
      </View>
      <Text
        style={[
          styles.rowAmount,
          item.transactionType === 'income' ? styles.incomeText : styles.expenseText,
        ]}
      >
        {item.transactionType === 'income' ? '+' : '-'}
        {item.amount} kr
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.headerIcon}>{icon}</Text>
        <Text style={styles.headerTitle}>{name}</Text>
      </View>

      <View style={styles.monthBar}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.monthArrow}>
          <Ionicons name="chevron-back" size={18} color="#4b5563" />
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{formatMonthLabel(monthKey)}</Text>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.monthArrow}>
          <Ionicons name="chevron-forward" size={18} color="#4b5563" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryColumn}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={[styles.summaryValue, styles.incomeText]}>
            +{income.toFixed(0)} kr
          </Text>
        </View>
        <View style={styles.summaryColumn}>
          <Text style={styles.summaryLabel}>Expenses</Text>
          <Text style={[styles.summaryValue, styles.expenseText]}>
            -{expense.toFixed(0)} kr
          </Text>
        </View>
        <View style={styles.summaryColumn}>
          <Text style={styles.summaryLabel}>Balance</Text>
          <Text
            style={[
              styles.summaryValue,
              balance >= 0 ? styles.incomeText : styles.expenseText,
            ]}
          >
            {balance >= 0 ? '+' : ''}
            {balance.toFixed(0)} kr
          </Text>
        </View>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />

      <View style={styles.inputSection}>
        <Text style={styles.inputTitle}>Add transaction</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'expense' && { backgroundColor: '#fee2e2' },
            ]}
            onPress={() => setType('expense')}
          >
            <Text
              style={[
                styles.typeText,
                type === 'expense' && { color: '#b91c1c' },
              ]}
            >
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              type === 'income' && { backgroundColor: '#dcfce7' },
            ]}
            onPress={() => setType('income')}
          >
            <Text
              style={[
                styles.typeText,
                type === 'income' && { color: '#15803d' },
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 2 }]}
            placeholder="Label (e.g. Rent, Salary)"
            placeholderTextColor="#9ca3af"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, { flex: 1, marginLeft: 8 }]}
            placeholder="Amount"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: color }]}
          onPress={addTransaction}
        >
          <Text style={styles.addButtonText}>Add</Text>
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
  monthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  monthArrow: {
    padding: 4,
  },
  monthLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  summaryCard: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  summaryColumn: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  incomeText: { color: '#16a34a' },
  expenseText: { color: '#dc2626' },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  rowLeft: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    color: '#111827',
  },
  rowDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  rowAmount: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  inputSection: {
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
  typeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    marginRight: 6,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
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
  addButton: {
    marginTop: 2,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
