import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator, HelperText } from 'react-native-paper';
import { supabase } from '../lib/supabase';
import AuthLayout from '../components/AuthLayout';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

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
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (signInError) {
      setError(signInError.message);
    }
    setLoading(false);
  };

  return (
    <AuthLayout title="Login to Your Account">
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (error) setError(null);
        }}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        left={<TextInput.Icon icon="email-outline" />}
        error={!!error}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (error) setError(null);
        }}
        secureTextEntry={!isPasswordVisible}
        style={styles.input}
        left={<TextInput.Icon icon="lock-outline" />}
        right={<TextInput.Icon icon={isPasswordVisible ? "eye-off" : "eye"} onPress={() => setIsPasswordVisible(!isPasswordVisible)} />}
        error={!!error}
      />
      {error && <HelperText type="error" visible={!!error} style={styles.errorText}>{error}</HelperText>}
      {loading ? (
        <ActivityIndicator animating={true} style={styles.button} />
      ) : (
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          icon="login"
          disabled={loading || !email || !password}
        >
          Login
        </Button>
      )}
      <View style={styles.footer}>
        <Text>Don't have an account? </Text>
        <Button onPress={() => navigation.navigate('Register')} disabled={loading} labelStyle={styles.linkButton}>
          Sign Up
        </Button>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 30,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  linkButton: {
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default LoginScreen;