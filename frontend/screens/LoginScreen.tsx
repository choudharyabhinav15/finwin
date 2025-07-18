// LoginScreen.tsx
import React, { useState } from 'react';
import { Platform, View } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { API_URL, LOCAL_API_URL } from '@env';

type Props = {
  onLogin: (userData: { name: string; email: string }) => Promise<void>;
  onNavigateRegister: () => void;
};

const LoginScreen = ({ onLogin, onNavigateRegister }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const onDismissSnackBar = () => setSnackbarVisible(false);

  const showSnackbar = (message: string, isError: boolean = false) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
    setIsError(isError);
  };

  const handleLogin = async () => {
    try {
      const apiUrl = Platform.OS === 'web' ? LOCAL_API_URL : API_URL;
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        onLogin({ name: data.name, email: data.email });
      } else {
        showSnackbar(data.message || 'Login failed', true);
      }
    } catch (error) {
      showSnackbar('A network error occurred. Please try again.', true);
    }
  };

  return (
    <View style={{ padding: 20, justifyContent: 'center', flex: 1 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 20, color: '#5b00ff', textAlign: 'center' }}>Login</Text>
      <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" left={<TextInput.Icon icon="email" />} />
      <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry mode="outlined" left={<TextInput.Icon icon="lock" />} />
      <Button mode="contained" onPress={handleLogin} style={{ marginTop: 20, backgroundColor: '#5b00ff' }}>Login</Button>
      <Text style={{ marginTop: 15, textAlign: 'center' }} onPress={onNavigateRegister}>Don't have an account? Register</Text>
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

export default LoginScreen;