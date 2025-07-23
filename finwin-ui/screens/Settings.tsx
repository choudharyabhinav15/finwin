import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const Section = ({ title, expanded, onToggle, children }: any) => (
  <View style={styles.card}>
    <TouchableOpacity style={styles.cardHeader} onPress={onToggle}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Ionicons
        name={expanded ? 'chevron-up' : 'chevron-down'}
        size={20}
        color="#5b00ff"
      />
    </TouchableOpacity>
    {expanded && <View style={styles.cardContent}>{children}</View>}
  </View>
);

const Settings = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [salary, setSalary] = useState('');
  const [expenses, setExpenses] = useState('');

  const [expanded, setExpanded] = useState({
    profile: false,
    password: false,
    salary: false,
    language: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email || '');
        const { data } = await supabase
          .from('profiles')
          .select('name, phone, salary, expenses')
          .eq('id', user.id)
          .single();

        if (data) {
          setName(data.name || '');
          setPhone(data.phone || '');
          setSalary(data.salary || '');
          setExpenses(data.expenses || '');
        }
      }
    };

    fetchUserData();
  }, []);

  const toggleSection = (section: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSaveProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      name,
      phone,
    });

    if (!error) Alert.alert('Success', 'Profile updated');
  };

  const handleChangePassword = async () => {
    if (!newPassword) return;

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (!error) {
      setCurrentPassword('');
      setNewPassword('');
      Alert.alert('Success', 'Password updated');
    }
  };

  const handleSaveSalary = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      salary,
      expenses,
    });

    if (!error) Alert.alert('Success', 'Salary details updated');
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'ta', label: 'Tamil' },
    { code: 'kn', label: 'Kannada' },
    // Add more languages as needed
  ];

  return (
    <ScrollView style={styles.container}>
      <Section
        title={t('Profile Details')}
        expanded={expanded.profile}
        onToggle={() => toggleSection('profile')}
      >
        <Text style={styles.label}>{t('Email (read-only)')}</Text>
        <TextInput style={styles.input} value={email} editable={false} />

        <Text style={styles.label}>{t('Name')}</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>{t('Phone')}</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
          <Text style={styles.buttonText}>{t('Save')}</Text>
        </TouchableOpacity>
      </Section>

      <Section
        title={t('Change Password')}
        expanded={expanded.password}
        onToggle={() => toggleSection('password')}
      >
        <Text style={styles.label}>{t('New Password')}</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>{t('Update Password')}</Text>
        </TouchableOpacity>
      </Section>

      <Section
        title={t('Salary Info')}
        expanded={expanded.salary}
        onToggle={() => toggleSection('salary')}
      >
        <Text style={styles.label}>{t('Monthly Salary')}</Text>
        <TextInput
          style={styles.input}
          value={salary}
          onChangeText={setSalary}
          keyboardType="numeric"
        />

        <Text style={styles.label}>{t('Monthly Expenses')}</Text>
        <TextInput
          style={styles.input}
          value={expenses}
          onChangeText={setExpenses}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleSaveSalary}>
          <Text style={styles.buttonText}>{t('Save')}</Text>
        </TouchableOpacity>
      </Section>

      <Section
        title={t('Language')}
        expanded={expanded.language}
        onToggle={() => toggleSection('language')}
      >
        {languages.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.button, i18n.language === lang.code && { backgroundColor: '#36A2EB' }]}
            onPress={() => i18n.changeLanguage(lang.code)}
          >
            <Text style={styles.buttonText}>{lang.label}</Text>
          </TouchableOpacity>
        ))}
      </Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    marginBottom: 16,
    elevation: 2,
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5b00ff',
  },
  cardContent: {
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#5b00ff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Settings;