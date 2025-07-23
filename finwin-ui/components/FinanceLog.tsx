import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const categories = [
  'Salary', 'Interest', 'Rent', 'Groceries', 'Utilities', 'Transport', 'Shopping', 'Medical', 'Other'
];

const entryTypes = ['Income', 'Expense'];

const FinanceLog = () => {
  const [entryType, setEntryType] = useState('Income');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState(categories[0]);
  const [isRecurring, setIsRecurring] = useState(false);

  const clearForm = () => {
    setEntryType('Income');
    setAmount('');
    setDate(new Date());
    setCategory(categories[0]);
    setIsRecurring(false);
  };

  const saveEntry = () => {
    // Implement save logic here (e.g., API call or local storage)
    clearForm();
    alert('Entry saved!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Finance Log</Text>
      <View style={styles.row}>
        {entryTypes.map(type => (
          <TouchableOpacity
            key={type}
            style={[styles.typeButton, entryType === type && styles.typeButtonSelected]}
            onPress={() => setEntryType(type)}
          >
            <Text style={entryType === type ? styles.typeTextSelected : styles.typeText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.saveBtn} onPress={saveEntry}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearBtn} onPress={clearForm}>
          <Text style={styles.clearBtnText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center', color: '#1e2a78' },
  row: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  typeButton: { padding: 10, borderRadius: 8, backgroundColor: '#e1e1e1', marginHorizontal: 8 },
  typeButtonSelected: { backgroundColor: '#1e2a78' },
  typeText: { color: '#333', fontWeight: '500' },
  typeTextSelected: { color: '#fff', fontWeight: 'bold' },
  label: { fontWeight: 'bold', marginTop: 16, marginBottom: 4, color: '#1e2a78' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 8 },
  pickerRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  categoryButton: { padding: 8, borderRadius: 8, backgroundColor: '#e1e1e1', margin: 4 },
  categoryButtonSelected: { backgroundColor: '#1e2a78' },
  categoryText: { color: '#333' },
  categoryTextSelected: { color: '#fff', fontWeight: 'bold' },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  saveBtn: { backgroundColor: '#1e2a78', padding: 12, borderRadius: 8, minWidth: 100, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
  clearBtn: { backgroundColor: '#e1e1e1', padding: 12, borderRadius: 8, minWidth: 100, alignItems: 'center' },
  clearBtnText: { color: '#1e2a78', fontWeight: 'bold' },
});

export default FinanceLog;

