import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';

type Props = {
  index: number;
};

const FinancialIndexBar = ({ index = 5 }: Props) => {
  const getStatus = (value: number) => {
    if (value <= 3) return { text: 'Needs Improvement', color: '#d9534f' };
    if (value <= 6) return { text: 'Average', color: '#f0ad4e' };
    return { text: 'Healthy', color: '#5cb85c' };
  };

  const { text: statusText, color } = getStatus(index);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Financial Health</Text>
      <CircularProgress
        value={index}
        maxValue={9}
        radius={90}
        activeStrokeWidth={15}
        inActiveStrokeWidth={15}
        progressValueColor={color}
        activeStrokeColor={color}
        inActiveStrokeColor="#e0e0e0"
        valueSuffix=""
        title="Score"
        titleColor="#333"
        titleStyle={{ fontWeight: 'bold' }}
      />
      <Text style={[styles.status, { color }]}>{statusText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  status: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FinancialIndexBar;