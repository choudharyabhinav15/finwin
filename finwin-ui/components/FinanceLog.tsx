import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Platform, ScrollView, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const categories = [
  'Salary', 'Interest', 'Rent', 'Groceries', 'Utilities', 'Transport', 'Shopping', 'Medical', 'Other'
];

const entryTypes = ['Income', 'Expense'];

interface FinanceLogEntry {
  entryType: string;
  amount: string;
  date: Date;
  category: string;
  isRecurring: boolean;
  occurrence: string;
  untilDate: Date;
}

const FinanceLog = () => {
  const [entryType, setEntryType] = useState('Income');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState(categories[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [occurrence, setOccurrence] = useState('daily');
  const [untilDate, setUntilDate] = useState(new Date());
  const [showUntilDatePicker, setShowUntilDatePicker] = useState(false);
  const [activeTab, setActiveTab] = useState('Income');
  const [entries, setEntries] = useState<FinanceLogEntry[]>([]);

  useEffect(() => {
    const storedEntries = localStorage.getItem('financeLogEntry');
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  }, []);

  const clearForm = () => {
    setEntryType('Income');
    setAmount('');
    setDate(new Date());
    setCategory(categories[0]);
    setIsRecurring(false);
    setOccurrence('daily');
    setUntilDate(new Date());
  };

  const saveEntry = () => {
    const entry: FinanceLogEntry = {
      entryType,
      amount,
      date,
      category,
      isRecurring,
      occurrence,
      untilDate,
    };

    localStorage.setItem('financeLogEntry', JSON.stringify([...entries, entry]));
    clearForm();
    alert('Entry saved!');
  };

  const deleteEntry = (index: number) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    localStorage.setItem('financeLogEntry', JSON.stringify(updatedEntries));
  };

  const renderAllTab = () => (
    <FlatList
      data={entries}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item, index }) => (
        <View style={styles.row}>
          <Text style={styles.cell}>{item.entryType}</Text>
          <Text style={styles.cell}>{item.amount}</Text>
          <Text style={styles.cell}>{new Date(item.date).toLocaleDateString()}</Text>
          <Text style={styles.cell}>{item.category}</Text>
          <TouchableOpacity onPress={() => deleteEntry(index)}>
            <Text style={{ color: 'red' }}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );

  const renderTabContent = () => {
    if (activeTab === 'All') {
      return renderAllTab();
    }
    return (
      <View>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
        />
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text>{date.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}
        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerRow}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryButton, category === cat && styles.categoryButtonSelected]}
              onPress={() => setCategory(cat)}
            >
              <Text style={category === cat ? styles.categoryTextSelected : styles.categoryText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.label}>Is Recurring?</Text>
          <Switch value={isRecurring} onValueChange={setIsRecurring} />
        </View>
        {isRecurring && (
          <>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Occurrence</Text>
              <Picker
                selectedValue={occurrence}
                onValueChange={(value) => setOccurrence(value)}
                style={styles.picker}
              >
                <Picker.Item label="Daily" value="daily" />
                <Picker.Item label="Weekly" value="weekly" />
                <Picker.Item label="Monthly" value="monthly" />
                <Picker.Item label="Quarterly" value="quarterly" />
                <Picker.Item label="Half-Yearly" value="halfyearly" />
                <Picker.Item label="Yearly" value="yearly" />
              </Picker>
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Until</Text>
              <TouchableOpacity onPress={() => setShowUntilDatePicker(true)} style={styles.input}>
                <Text>{untilDate.toDateString()}</Text>
              </TouchableOpacity>
              {showUntilDatePicker && (
                <DateTimePicker
                  value={untilDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(_, selectedDate) => {
                    setShowUntilDatePicker(false);
                    if (selectedDate) setUntilDate(selectedDate);
                  }}
                  style={{ backgroundColor: '#fff' }}
                />
              )}
            </View>
          </>
        )}
      </View>
    );
  };

  const toggleIsRecurring = (value: boolean) => {
    setIsRecurring(value);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Finance Log</Text>
      <View style={styles.tabRow}>
        {['Income', 'Expense', 'All'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {renderTabContent()}
      <View style={styles.buttonRowAdjusted}>
        <TouchableOpacity style={styles.saveBtn} onPress={saveEntry}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearBtn} onPress={clearForm}>
          <Text style={styles.clearBtnText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center', color: '#1e2a78' },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tabButton: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: '#1e2a78',
  },
  tabText: {
    color: '#333',
  },
  activeTabText: {
    color: '#1e2a78',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  typeButton: { padding: 10, borderRadius: 8, backgroundColor: '#e1e1e1', marginHorizontal: 8 },
  typeButtonSelected: { backgroundColor: '#1e2a78' },
  typeText: { color: '#333', fontWeight: '500' },
  typeTextSelected: { color: '#fff', fontWeight: 'bold' },
  label: { fontWeight: 'bold', marginTop: 16, marginBottom: 4, color: '#1e2a78' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  pickerRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  categoryButton: { padding: 8, borderRadius: 8, backgroundColor: '#e1e1e1', margin: 4 },
  categoryButtonSelected: { backgroundColor: '#1e2a78' },
  categoryText: { color: '#333' },
  categoryTextSelected: { color: '#fff', fontWeight: 'bold' },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  inputRow: { marginBottom: 16 },
  picker: { height: 50, width: '100%', borderColor: '#ccc', borderWidth: 1, borderRadius: 8 },
  datePicker: { width: '100%', borderRadius: 8 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  buttonRowAdjusted: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  saveBtn: { backgroundColor: '#1e2a78', padding: 12, borderRadius: 8, minWidth: 100, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
  clearBtn: { backgroundColor: '#e1e1e1', padding: 12, borderRadius: 8, minWidth: 100, alignItems: 'center' },
  clearBtnText: { color: '#1e2a78', fontWeight: 'bold' },
});

export default FinanceLog;
