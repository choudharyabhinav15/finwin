import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { Button, TextInput, HelperText, Text, ActivityIndicator } from 'react-native-paper';
import { supabase } from '../lib/supabase';
import AuthLayout from '../components/AuthLayout';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const RegisterScreen = ({ navigation }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; form?: string }>({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const validateInputs = (): boolean => {
    const newErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function signUpWithEmail() {
    setErrors({});
    if (!validateInputs()) return;

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          name: name.trim(),
        },
      },
    });

    if (signUpError) {
      setErrors({ form: signUpError.message });
    } else if (!data.session) {
      Alert.alert('Success!', 'Please check your inbox for email verification.');
      navigation.navigate('Login');
    }
    setLoading(false);
  }

  const areAllFieldsFilled = !!(name.trim() && email.trim() && password && confirmPassword);

  return (
    <AuthLayout title="Create Account">
      <TextInput
        label="Name"
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (errors.name || errors.form) {
            const { name, form, ...rest } = errors;
            setErrors(rest);
          }
        }}
        autoCapitalize="words"
        style={styles.input}
        left={<TextInput.Icon icon="account-outline" />}
        error={!!errors.name}
      />
      {errors.name && <HelperText type="error" visible={!!errors.name}>{errors.name}</HelperText>}

      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errors.email || errors.form) {
            const { email, form, ...rest } = errors;
            setErrors(rest);
          }
        }}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        left={<TextInput.Icon icon="email-outline" />}
        error={!!errors.email}
      />
      {errors.email && <HelperText type="error" visible={!!errors.email}>{errors.email}</HelperText>}

      <TextInput
        label="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password || errors.form) {
            const { password, form, ...rest } = errors;
            setErrors(rest);
          }
        }}
        secureTextEntry={!isPasswordVisible}
        style={styles.input}
        left={<TextInput.Icon icon="lock-outline" />}
        right={<TextInput.Icon icon={isPasswordVisible ? "eye-off" : "eye"} onPress={() => setIsPasswordVisible(!isPasswordVisible)} />}
        error={!!errors.password}
      />
      {errors.password && <HelperText type="error" visible={!!errors.password}>{errors.password}</HelperText>}

      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (errors.confirmPassword || errors.form) {
            const { confirmPassword, form, ...rest } = errors;
            setErrors(rest);
          }
        }}
        secureTextEntry={!isConfirmPasswordVisible}
        style={styles.input}
        left={<TextInput.Icon icon="lock-check-outline" />}
        right={<TextInput.Icon icon={isConfirmPasswordVisible ? "eye-off" : "eye"} onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} />}
        error={!!errors.confirmPassword}
      />
      {errors.confirmPassword && <HelperText type="error" visible={!!errors.confirmPassword}>{errors.confirmPassword}</HelperText>}
      {errors.form && <HelperText type="error" visible={!!errors.form} style={styles.errorText}>{errors.form}</HelperText>}
      
      <Button
        mode="contained"
        onPress={signUpWithEmail}
        disabled={loading || !areAllFieldsFilled || Object.keys(errors).length > 0}
        loading={loading}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        icon="account-plus"
      >
        Register
      </Button>

      <View style={styles.footer}>
         <Text>Already have an account? </Text>
        <Button onPress={() => navigation.navigate('Login')} disabled={loading} labelStyle={styles.linkButton} style={styles.signInButton}>
          Sign In
        </Button>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 2,
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
  signInButton: {
    // Nudge the button up slightly to align text baselines
    transform: [{ translateY: -1 }],
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default RegisterScreen;