import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

const AddGoals = () => {
  const [goal, setGoal] = useState('');
  const [amount, setAmount] = useState('');
  const [timeline, setTimeline] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async () => {
    if (!goal || !amount || !timeline) {
      return alert('Please fill in all fields');
    }

    const { data: user } = await supabase.auth.getUser();
    const userId = user?.user?.id;

    if (!userId) {
      return alert('You must be logged in to save goals.');
    }

    const { error } = await supabase.from('financial_goals').insert([
      {
        user_id: userId,
        title: goal,
        amount: parseFloat(amount),
        timeline,
      },
    ]);

    if (error) {
      console.error('Insert error:', error.message);
      return alert('Error saving goal. Please try again.');
    }

    setShowSuccessModal(true);
    setGoal('');
    setAmount('');
    setTimeline('');
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Text style={styles.title}>Add Financial Goal</Text>

        <View style={styles.inputGroup}>
          <Ionicons name="trophy-outline" size={20} color="#5b00ff" style={styles.icon} />
          <TextInput
            placeholder="Goal Title"
            placeholderTextColor="#888"
            style={styles.input}
            value={goal}
            onChangeText={setGoal}
          />
        </View>

        <View style={styles.inputGroup}>
          <Ionicons name="cash-outline" size={20} color="#5b00ff" style={styles.icon} />
          <TextInput
            placeholder="Target Amount (e.g., 100000)"
            placeholderTextColor="#888"
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <View style={styles.inputGroup}>
          <Ionicons name="calendar-outline" size={20} color="#5b00ff" style={styles.icon} />
          <TextInput
            placeholder="Timeline (e.g., Dec 2025)"
            placeholderTextColor="#888"
            style={styles.input}
            value={timeline}
            onChangeText={setTimeline}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Ionicons name="add-circle-outline" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Save Goal</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={48} color="#5b00ff" />
            <Text style={styles.modalTitle}>Goal Added!</Text>
            <Text style={styles.modalText}>🎯 {goal} - ₹{amount} by {timeline}</Text>
            <TouchableOpacity
              onPress={() => setShowSuccessModal(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5b00ff',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#5b00ff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 10,
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5b00ff',
    marginTop: 12,
  },
  modalText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#444',
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#5b00ff',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AddGoals;