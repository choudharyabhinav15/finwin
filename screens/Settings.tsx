import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
const Settings = () => {
  return (
      <ScrollView style={styles.container}>
        <Text> Settings </Text>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff'},
});

export default Settings;