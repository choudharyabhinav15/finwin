import React from 'react';
import { View, StyleSheet, ScrollView, Image, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
};

const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  const { t } = useTranslation();
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.header}>
        <Image source={require('../assets/adaptive-icon.png')} style={styles.logo} />
        <Text style={styles.title}>FinWin</Text>
        <Text style={styles.subtitle}>{t(title)}</Text>
      </View>
      <View style={styles.formContainer}>{children}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  title: {
    color: '#5b00ff',
    fontWeight: 'bold',
    fontSize: 28,
    marginTop: 16,
  },
  subtitle: {
    color: '#5b00ff',
    fontSize: 16,
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