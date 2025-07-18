import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar } from 'react-native-paper';

const AddData = ({ navigation }: any) => {
  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#5b00ff' }}>
        <Appbar.Action icon="menu" color="#fff" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Add Data" titleStyle={{ color: '#fff' }} />
      </Appbar.Header>
      <ScrollView style={styles.container}>
        
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
});
export default AddData;