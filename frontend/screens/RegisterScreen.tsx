import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Button, TextInput, Text, Snackbar } from 'react-native-paper';
import axios, { isAxiosError } from 'axios';

interface Props {
  onRegister: () => void;
  onNavigateLogin: () => void;
}

const RegisterScreen = ({ onRegister, onNavigateLogin }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const onDismissSnackBar = () => setSnackbarVisible(false);

  const showSnackbar = (message: string, isError: boolean = false) => {
    setSnackbarMessage(message);
    setIsError(isError);
    setSnackbarVisible(true);
  };

  const register = async () => {
    try {
      const ip = Platform.OS === 'android' ? '192.168.29.238' : 'localhost';
      await axios.post(`http://${ip}:3000/api/register`, { name, email, password, confirmPassword });
      setRegistrationSuccess(true);
    } catch (e: any) {
      if (isAxiosError(e) && e.response?.data?.message) {
        showSnackbar('Registration failed: ' + e.response.data.message, true);
      } else {
        showSnackbar('Registration failed: ' + e.message, true);
      }
    }
  };

  if (registrationSuccess) {
    return (
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.successTitle}>
          Registration Successful!
        </Text>
        <Text style={styles.successMessage}>
          You can now log in with your credentials.
        </Text>
        <Button mode="contained" style={styles.button} onPress={onRegister}>
          Go to Login
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={{ marginBottom: 20, color: '#5b00ff', textAlign: 'center' }}>Register</Text>
      <TextInput label="Name" value={name} onChangeText={setName} mode="outlined" left={<TextInput.Icon icon="account" />} />
      <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" left={<TextInput.Icon icon="email" />} />
      <TextInput label="Password" value={password} onChangeText={setPassword} mode="outlined" secureTextEntry left={<TextInput.Icon icon="lock" />} />
      <TextInput label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} mode="outlined" secureTextEntry left={<TextInput.Icon icon="lock" />} />
      <Button mode="contained" style={styles.button} onPress={register}>Register</Button>
      <Text style={styles.loginText} onPress={onNavigateLogin}>
        Already have an account? Login
      </Text>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackBar}
        style={isError ? { backgroundColor: 'red' } : {}}
        action={{
          label: 'Dismiss',
          onPress: onDismissSnackBar,
        }}>
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  button: { marginTop: 20, backgroundColor: '#5b00ff' },
  loginText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#5b00ff',
    textDecorationLine: 'underline',
  },
  successTitle: { marginBottom: 10, textAlign: 'center', color: '#5b00ff' },
  successMessage: { marginBottom: 20, textAlign: 'center', fontSize: 16 },
});

export default RegisterScreen;