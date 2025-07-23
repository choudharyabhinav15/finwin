import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView, Image } from 'react-native';
import * as Speech from 'expo-speech';
import { useTranslation } from 'react-i18next';
import articles from './articles.json';

const Explore = () => {
  const { i18n, t } = useTranslation();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const openArticle = (article) => {
    setSelectedArticle(article);
    setModalVisible(true);
  };

  const closeArticle = () => {
    Speech.stop(); // Stop any ongoing speech
    setModalVisible(false);
    setSelectedArticle(null);
  };

  const speakArticle = () => {
    if (selectedArticle) {
      const text = `Name: ${selectedArticle.name}. Title: ${selectedArticle.title}. Content: ${selectedArticle.content}. Eligibility: ${selectedArticle.eligibility}. Contact Details: ${selectedArticle.contact}`;
      Speech.speak(text, { language: i18n.language });
    }
  };

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(articles.filter(a => a.language === i18n.language).map(a => a.category)))];

  // Filter articles by selected language and category
  const filteredArticles = articles.filter(a => a.language === i18n.language && (selectedCategory === 'All' || a.category === selectedCategory));

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.tile} onPress={() => openArticle(item)}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.tileImage} resizeMode="cover" />
      )}
      <Text style={styles.tileTitle}>{item.title}</Text>
      <Text style={styles.tileSubtitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('Explore Articles')}</Text>
      {/* Category Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={styles.categoryContainer}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonSelected]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextSelected]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={filteredArticles}
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
                {selectedArticle.image && (
                  <Image source={{ uri: selectedArticle.image }} style={styles.modalImage} resizeMode="contain" />
                )}
                <Text style={styles.label}>{t('Name')}:</Text>
                <Text style={styles.value}>{selectedArticle.name}</Text>
                <Text style={styles.label}>{t('Title')}:</Text>
                <Text style={styles.value}>{selectedArticle.title}</Text>
                <Text style={styles.label}>{t('Content')}:</Text>
                <Text style={styles.value}>{selectedArticle.content}</Text>
                <Text style={styles.label}>{t('Eligibility')}:</Text>
                <Text style={styles.value}>{selectedArticle.eligibility}</Text>
                <Text style={styles.label}>{t('Contact Details')}:</Text>
                <Text style={styles.value}>{selectedArticle.contact}</Text>
              </>
            )}
          </ScrollView>
          {/* Floating footer with two buttons */}
          <View style={styles.floatingFooter}>
            <TouchableOpacity style={styles.speakBtn} onPress={speakArticle}>
              <Text style={styles.speakBtnText}>{t('Read Aloud')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeBtn} onPress={closeArticle}>
              <Text style={styles.closeBtnText}>{t('Close')}</Text>
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
    color: '#1e2a78',
    marginBottom: 16,
    alignSelf: 'center',
  },
  list: {
    alignItems: 'center',
  },
  tile: {
    backgroundColor: '#f3f0ff',
    borderRadius: 16,
    padding: 16,
    margin: 8,
    width: 170,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  tileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
  },
  tileTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e2a78',
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
    color: '#1e2a78',
  },
  value: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  closeBtn: {
    backgroundColor: '#1e2a78',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 12,
    minWidth: 100,
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  speakBtn: {
    backgroundColor: '#1e2a78',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
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
    justifyContent: 'center',
    zIndex: 100,
    gap: 16, // Add gap between buttons
  },
  categoryScroll: {
    marginBottom: 16,
  },
  categoryContainer: {
    alignItems: 'center',
  },
  categoryButton: {
    backgroundColor: '#e1e1e1',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
  },
  categoryButtonSelected: {
    backgroundColor: '#1e2a78',
  },
  categoryText: {
    color: '#333',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#f3f0ff',
  },
});

export default Explore;
