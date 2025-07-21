import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Avatar, Text } from 'react-native-paper';

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
};

const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
        <Avatar.Icon size={80} icon="finance" style={styles.logo} />
        <Text variant="headlineLarge" style={styles.title}>FinWin</Text>
        <Text variant="titleMedium" style={styles.subtitle}>{title}</Text>
        </View>
        <View style={styles.formContainer}>
        {children}
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    backgroundColor: '#5b00ff',
  },
  title: {
    color: '#5b00ff',
    fontWeight: 'bold',
    marginTop: 16,
  },
  subtitle: {
    color: '#5b00ff',
    marginTop: 8,
    opacity: 0.9,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default AuthLayout;