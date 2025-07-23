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

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const RegisterScreen = ({ navigation }: Props) => {
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

    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!email.trim()) newErrors.email = 'Email is required.';
    else if (!emailRegex.test(email.trim())) newErrors.email = 'Invalid email format.';
    if (!password) newErrors.password = 'Password is required.';
    else if (password.length < 6) newErrors.password = 'Min 6 characters required.';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm password.';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';

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
    <AuthLayout title="Create Account">
      <View style={styles.inputWrapper}>
        <MaterialIcons name="person-outline" size={20} color="#5b00ff" style={styles.icon} />
        <RNTextInput
          placeholder="Name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setErrors((prev) => ({ ...prev, name: undefined, form: undefined }));
          }}
          autoCapitalize="words"
          style={styles.input}
        />
      </View>
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <View style={styles.inputWrapper}>
        <MaterialIcons name="email" size={20} color="#5b00ff" style={styles.icon} />
        <RNTextInput
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors((prev) => ({ ...prev, email: undefined, form: undefined }));
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      {/* Password */}
      <View style={styles.inputWrapper}>
        <MaterialIcons name="lock-outline" size={20} color="#5b00ff" style={styles.icon} />
        <RNTextInput
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors((prev) => ({ ...prev, password: undefined, form: undefined }));
          }}
          secureTextEntry={!isPasswordVisible}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Ionicons
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={20}
            color="#5b00ff"
            style={styles.iconRight}
          />
        </TouchableOpacity>
      </View>
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      {/* Confirm Password */}
      <View style={styles.inputWrapper}>
        <MaterialIcons name="lock" size={20} color="#5b00ff" style={styles.icon} />
        <RNTextInput
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setErrors((prev) => ({ ...prev, confirmPassword: undefined, form: undefined }));
          }}
          secureTextEntry={!isConfirmPasswordVisible}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
          <Ionicons
            name={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
            size={20}
            color="#5b00ff"
            style={styles.iconRight}
          />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

      {/* Form-level Error */}
      {errors.form && <Text style={styles.errorText}>{errors.form}</Text>}

      {/* Submit */}
      {loading ? (
        <ActivityIndicator color="#5b00ff" style={styles.button} />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={signUpWithEmail}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
          <Text style={styles.link}>Sign In</Text>
        </TouchableOpacity>
      </View>
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