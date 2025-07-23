import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { RootTabParamList } from '../types/navigation';
import { useTranslation } from 'react-i18next';

type Goal = {
  id: string;
  title: string;
  icon: string;
};

const SmartGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();
  const { t } = useTranslation();

  const fetchGoals = async () => {
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(t('User not logged in'));
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setGoals(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5b00ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{t(error)}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('Your Financial Goals')}</Text>

      {goals.length === 0 ? (
        <Text style={styles.noGoals}>{t('No goals found.')}</Text>
      ) : (
        goals.map((goal) => (
          <View key={goal.id} style={styles.goalCard}>
            <Ionicons name={goal.icon as any} size={24} color="#5b00ff" style={styles.goalIcon} />
            <View style={styles.goalDetails}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.goalAmount}>{t('Amount')}: ₹{goal.amount}</Text>
              <Text style={styles.goalTimeline}>{t('Timeline')}: {goal.timeline}</Text>
            </View>
          </View>
        ))
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddGoals')}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
        <Text style={styles.addButtonText}>{t('Add New Goal')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5b00ff',
    marginBottom: 20,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  goalIcon: {
    marginRight: 12,
  },
  goalDetails: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1,
  },
  goalAmount: {
    fontSize: 14,
    color: '#666',
  },
  goalTimeline: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    marginTop: 30,
    backgroundColor: '#5b00ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginBottom: 12,
  },
});

export default SmartGoals;