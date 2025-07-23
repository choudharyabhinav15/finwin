import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput as RNTextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import AuthLayout from '../components/AuthLayout';
import { RegisterScreenNavigationProp } from '../types/navigation';
import { useTranslation } from 'react-i18next';

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const RegisterScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    form?: string;
  }>({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const validateInputs = (): boolean => {
    const newErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) newErrors.name = t('Name is required.');
    if (!email.trim()) newErrors.email = t('Email is required.');
    else if (!emailRegex.test(email.trim())) newErrors.email = t('Invalid email format.');
    if (!password) newErrors.password = t('Password is required.');
    else if (password.length < 6) newErrors.password = t('Min 6 characters required.');
    if (!confirmPassword) newErrors.confirmPassword = t('Please confirm password.');
    else if (password !== confirmPassword) newErrors.confirmPassword = t('Passwords do not match.');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const signUpWithEmail = async () => {
    setErrors({});
    if (!validateInputs()) return;

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { name: name.trim() },
      },
    });

    if (error) {
      setErrors({ form: error.message });
    } else if (!data.session) {
      Alert.alert('Success!', 'Please check your email for a verification link.');
      navigation.navigate('Login');
    }

    setLoading(false);
  };

  return (
    <AuthLayout title={t('Register a New Account')}>
      <View style={styles.inputWrapper}>
        <MaterialIcons name="person" size={20} color="#5b00ff" style={styles.icon} />
        <RNTextInput
          placeholder={t('Name')}
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      </View>
      <View style={styles.inputWrapper}>
        <MaterialIcons name="email" size={20} color="#5b00ff" style={styles.icon} />
        <RNTextInput
          placeholder={t('Email')}
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="#5b00ff" style={styles.icon} />
        <RNTextInput
          placeholder={t('Password')}
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={20} color="#5b00ff" />
        </TouchableOpacity>
      </View>
      <View style={styles.inputWrapper}>
        <Ionicons name={isConfirmPasswordVisible ? "eye-off" : "eye"} size={20} color="#5b00ff" style={styles.icon} />
        <RNTextInput
          placeholder={t('Confirm Password')}
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!isConfirmPasswordVisible}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
          <Ionicons name={isConfirmPasswordVisible ? "eye" : "eye-off"} size={20} color="#5b00ff" />
        </TouchableOpacity>
      </View>
      {Object.values(errors).map((err, idx) => (
        <Text key={idx} style={styles.error}>{err}</Text>
      ))}
      <TouchableOpacity style={styles.button} onPress={signUpWithEmail} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{t('Register')}</Text>}
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>{t('Already have an account? Login')}</Text>
      </TouchableOpacity>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#333',
  },
  icon: {
    marginRight: 8,
  },
  iconRight: {
    padding: 4,
  },
  errorText: {
    color: '#d9534f',
    marginBottom: 6,
    marginLeft: 8,
    fontSize: 13,
  },
  button: {
    backgroundColor: '#5b00ff',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  link: {
    color: '#5b00ff',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;