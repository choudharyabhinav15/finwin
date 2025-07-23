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
import { useTranslation } from 'react-i18next';

const AddGoals = () => {
  const [goal, setGoal] = useState('');
  const [amount, setAmount] = useState('');
  const [timeline, setTimeline] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async () => {
    if (!goal || !amount || !timeline) {
      return alert(t('Please fill in all fields'));
    }

    const { data: user } = await supabase.auth.getUser();
    const userId = user?.user?.id;

    if (!userId) {
      return alert(t('You must be logged in to save goals.'));
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
      return alert(t('Error saving goal. Please try again.'));
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
        <Text style={styles.title}>{t('Add Financial Goal')}</Text>

        <View style={styles.inputGroup}>
          <Ionicons name="trophy-outline" size={20} color="#1e2a78" style={styles.icon} />
          <Text style={styles.label}>{t('Goal')}</Text>
          <TextInput
            placeholder={t('Enter your goal')}
            placeholderTextColor="#888"
            style={styles.input}
            value={goal}
            onChangeText={setGoal}
          />
        </View>

        <View style={styles.inputGroup}>
          <Ionicons name="cash-outline" size={20} color="#1e2a78" style={styles.icon} />
          <Text style={styles.label}>{t('Amount')}</Text>
          <TextInput
            placeholder={t('Enter amount')}
            placeholderTextColor="#888"
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <View style={styles.inputGroup}>
          <Ionicons name="calendar-outline" size={20} color="#1e2a78" style={styles.icon} />
          <Text style={styles.label}>{t('Timeline')}</Text>
          <TextInput
            placeholder={t('Enter timeline (e.g., 12 months)')}
            placeholderTextColor="#888"
            style={styles.input}
            value={timeline}
            onChangeText={setTimeline}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{t('Save Goal')}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle" size={60} color="#1e2a78" style={{ marginBottom: 10 }} />
            <Text style={styles.successText}>{t('Goal saved successfully!')}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowSuccessModal(false)}>
              <Text style={styles.closeButtonText}>{t('Close')}</Text>
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
    color: '#1e2a78',
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
  label: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#1e2a78',
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
  modalContainer: {
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
  successText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    marginTop: 12,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#1e2a78',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AddGoals;