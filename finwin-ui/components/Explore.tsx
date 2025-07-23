import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import { useTranslation } from 'react-i18next';
import articles from './articles.json';

const Explore = () => {
  const { i18n } = useTranslation();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openArticle = (article) => {
    setSelectedArticle(article);
    setModalVisible(true);
  };

  const closeArticle = () => {
    setModalVisible(false);
    setSelectedArticle(null);
  };

  const speakArticle = () => {
    if (selectedArticle) {
      const text = `Name: ${selectedArticle.name}. Title: ${selectedArticle.title}. Content: ${selectedArticle.content}. Eligibility: ${selectedArticle.eligibility}. Contact Details: ${selectedArticle.contact}`;
      Speech.speak(text, { language: i18n.language });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.tile} onPress={() => openArticle(item)}>
      <Text style={styles.tileTitle}>{item.title}</Text>
      <Text style={styles.tileSubtitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Explore Articles</Text>
      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
      <Modal visible={modalVisible} animationType="slide" onRequestClose={closeArticle}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={[styles.modalContent, { paddingBottom: 100 }]}> {/* Add bottom padding for footer */}
            {selectedArticle && (
              <>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{selectedArticle.name}</Text>
                <Text style={styles.label}>Title:</Text>
                <Text style={styles.value}>{selectedArticle.title}</Text>
                <Text style={styles.label}>Content:</Text>
                <Text style={styles.value}>{selectedArticle.content}</Text>
                <Text style={styles.label}>Eligibility:</Text>
                <Text style={styles.value}>{selectedArticle.eligibility}</Text>
                <Text style={styles.label}>Contact Details:</Text>
                <Text style={styles.value}>{selectedArticle.contact}</Text>
              </>
            )}
          </ScrollView>
          {/* Floating footer with two buttons */}
          <View style={styles.floatingFooter}>
            <TouchableOpacity style={[styles.speakBtn, { flex: 1, marginRight: 8 }]} onPress={speakArticle}>
              <Text style={styles.speakBtnText}>Read Aloud</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.closeBtn, { flex: 1 }]} onPress={closeArticle}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5b00ff',
    marginBottom: 16,
    alignSelf: 'center',
  },
  list: {
    alignItems: 'center',
  },
  tile: {
    backgroundColor: '#f3f0ff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    width: 150,
    alignItems: 'center',
    elevation: 2,
  },
  tileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5b00ff',
    marginBottom: 4,
    textAlign: 'center',
  },
  tileSubtitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  modalContent: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 12,
    color: '#5b00ff',
  },
  value: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  closeBtn: {
    marginTop: 24,
    backgroundColor: '#5b00ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  speakBtn: {
    marginTop: 12,
    backgroundColor: '#5b00ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  speakBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  floatingFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    justifyContent: 'space-between',
    zIndex: 100,
  },
});

export default Explore;
