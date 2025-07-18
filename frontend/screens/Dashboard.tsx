import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, Appbar } from 'react-native-paper';
import FinancialIndexBar from '../components/FinancialIndexBar';

const financialHealthIndex = 7;

const Dashboard = ({ navigation }: any) => {
  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#5b00ff' }}>
        <Appbar.Action icon="menu" color="#fff" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Dashboard" titleStyle={{ color: '#fff' }} />
      </Appbar.Header>
      <ScrollView style={styles.container}>
        <FinancialIndexBar index={financialHealthIndex} />
        {/* ... rest of dashboard ... */}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
});

export default Dashboard;