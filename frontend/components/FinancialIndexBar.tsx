import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, Text, Title } from 'react-native-paper';

const FinancialIndexBar = ({ index = 5 }: { index: number }) => {
  const [barWidth, setBarWidth] = useState(0);
  const pointerPosition = barWidth > 0 ? (index / 9) * barWidth : 0;

  const getHealthStatus = (value: number) => {
    if (value <= 3) return { text: 'Needs Improvement', color: '#d9534f' };
    if (value <= 6) return { text: 'Average', color: '#f0ad4e' };
    return { text: 'Healthy', color: '#5cb85c' };
  };

  const healthStatus = getHealthStatus(index);

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>Your Financial Health</Title>

        {barWidth > 0 && (
          <View style={styles.indicatorContainer}>
            <View style={[styles.indexValueContainer, { left: pointerPosition }]}>
              <Text style={[styles.indexValue, { color: healthStatus.color }]}>
                {index}
              </Text>
            </View>
            <View style={[styles.pointer, { left: pointerPosition }]} />
          </View>
        )}

        <View onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}>
          <LinearGradient
            colors={['#d9534f', '#f0ad4e', '#5cb85c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bar}
          />
        </View>

        <View style={styles.labelsContainer}>
          <Text style={styles.scaleLabel}>Low</Text>
          <Text style={styles.scaleLabel}>Medium</Text>
          <Text style={styles.scaleLabel}>High</Text>
        </View>

        <Text style={styles.statusText}>
          Status: <Text style={{ color: healthStatus.color, fontWeight: 'bold' }}>{healthStatus.text}</Text>
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    elevation: 4,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  indicatorContainer: {
    height: 30,
    position: 'relative',
    marginBottom: -5,
  },
  indexValueContainer: {
    position: 'absolute',
    top: 0,
    transform: [{ translateX: -15 }],
    width: 30,
    alignItems: 'center',
  },
  indexValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  pointer: {
    position: 'absolute',
    top: 20,
    left: 0,
    width: 2,
    height: 10,
    backgroundColor: '#333',
  },
  bar: {
    height: 15,
    borderRadius: 8,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  scaleLabel: {
    fontSize: 12,
    color: '#666',
  },
  statusText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
  },
});

export default FinancialIndexBar;