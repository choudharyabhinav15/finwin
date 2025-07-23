import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import FinancialIndexGauge from '../components/FinancialIndexGauge';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootTabNavigationProp } from '../types/navigation';
import { useTranslation } from 'react-i18next';

const financialHealthIndex = 7;

const Home = () => {
  const navigation = useNavigation<RootTabNavigationProp>();
  const { t } = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <FinancialIndexGauge index={financialHealthIndex} />

      <View style={styles.card}>
        <Text style={styles.title}>{t('Welcome to Your Dashboard')}</Text>
        <Text style={styles.body}>
          {t('Track your financial health, manage expenses, and stay informed.')}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.addGoalButton}
        onPress={() => navigation.navigate('AddGoals')}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
        <Text style={styles.addGoalButtonText}>{t('Add a New Goal')}</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SmartGoals')}>
          <Ionicons name="wallet-outline" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>{t('Track Expenses')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SmartGoals')}>
          <Ionicons name="bar-chart-outline" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>{t('View Insights')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>{t('Settings')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  body: {
    fontSize: 15,
    color: '#555',
  },
  actions: {
    marginTop: 32,
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#1e2a78',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
   addGoalButton: {
    marginTop: 20,
    backgroundColor: '#1e2a78',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  addGoalButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Home;