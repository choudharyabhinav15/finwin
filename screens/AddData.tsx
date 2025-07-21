import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
const AddData = () => {
  return (
      <ScrollView style={styles.container}>
          <Text> Add Data </Text>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff'},
});

export default AddData;