import React, { useState } from 'react';
import { View, StyleSheet, TextInput as RNTextInput, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import AuthLayout from '../components/AuthLayout';
import { LoginScreenNavigationProp } from '../types/navigation';

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
  setError(null);

  const trimmedEmail = email.trim();

  if (!trimmedEmail || !password) {
    setError("Please enter both email and password.");
    return;
  }

  setLoading(true);
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password,
  });

  if (signInError) {
    if (signInError.message.toLowerCase().includes("missing email or phone")) {
      setError("Email is required to login.");
    } else {
      setError(signInError.message);
    }
  }

  setLoading(false);
};


  return (
    <AuthLayout title="Login to Your Account">
      <View style={styles.inputWrapper}>
        <MaterialIcons name="email" size={20} color="#5b00ff" style={styles.icon} />
        <RNTextInput
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      <View style={styles.inputWrapper}>
        <MaterialIcons name="lock-outline" size={20} color="#5b00ff" style={styles.icon} />
        <RNTextInput
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
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

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading ? (
        <ActivityIndicator color="#5b00ff" style={styles.button} />
      ) : (
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      <View style={styles.footer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={loading}>
          <Text style={styles.link}>Sign Up</Text>
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
    marginBottom: 16,
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
    textAlign: 'center',
    marginBottom: 8,
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

export default LoginScreen;