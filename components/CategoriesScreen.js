import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { 
    id: 'chambre', 
    name: 'Chambre', 
    icon: 'single-bed', 
    image: require('../assets/images/chambres.jpg'),
    color: '#FF6B6B'
  },
  { 
    id: 'studio', 
    name: 'Entrer-coucher', 
    icon: 'apartment', 
    image: require('../assets/images/studio.jpeg'),
    color: '#4ECDC4'
  },
  { 
    id: 'commercial', 
    name: 'boutique-magasin', 
    icon: 'store', 
    image: require('../assets/images/commercial.jpeg'),
    color: '#FFBE0B'
  },
  { 
    id: 'appartement', 
    name: 'Appartement', 
    icon: 'meeting-room', 
    image: require('../assets/images/appartement.jpg'),
    color: '#FB5607'
  },
  { 
    id: 'maison', 
    name: 'Maison', 
    icon: 'home-work', 
    image: require('../assets/images/maison.jpg'),
    color: '#8338EC'
  },
  { 
    id: 'terrain', 
    name: 'Terrain', 
    icon: 'map', 
    image: require('../assets/images/terrain.jpeg'),
    color: '#3A86FF'
  },
];

const CategoriesScreen = () => {
  const navigation = useNavigation();
  const handleCategoryPress = (categoryId) => {
    navigation.navigate('CategoryResults', { categoryId });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.categoryCard, { backgroundColor: item.color }]}
      onPress={() => handleCategoryPress(item.id)}
    >
      <Image 
        source={item.image} 
        style={styles.categoryImage}
        blurRadius={1}
      />
      <View style={styles.categoryContent}>
        <View style={styles.iconContainer}>
          <MaterialIcons name={item.icon} size={32} color="white" />
        </View>
        <Text style={styles.categoryName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisissez une catégorie</Text>
      
      <FlatList
        data={CATEGORIES}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryCard: {
    width: width / 2 - 24,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.7,
  },
  categoryContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default CategoriesScreen;