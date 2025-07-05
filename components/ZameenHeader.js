// ZameenHeader.js
import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TextInput,
  SafeAreaView,
  StatusBar,
    Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons'; // Assurez-vous d'avoir installé @expo/vector-icons

// --- CONSTANTES POUR L'ANIMATION ---
// Hauteur maximale du header (état initial)
const HEADER_MAX_HEIGHT = 220;
// Hauteur minimale du header (état final, après scroll)
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 70;
// Distance sur laquelle l'animation va se produire
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const ZameenHeader = () => {
  // On utilise useRef pour garder la valeur de l'animation entre les re-renderings
  const scrollY = useRef(new Animated.Value(0)).current;

  // --- INTERPOLATIONS ---
  // On mappe la position de scroll (scrollY) à la hauteur du header
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp', // 'clamp' empêche la valeur de dépasser l'outputRange
  });

  // Animation pour l'opacité du logo/titre
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Animation pour la position verticale (translation) du logo/titre
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });
  
  // Animation pour la position de la barre de recherche
  const searchBarTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 55], // Ajustez cette valeur pour un positionnement parfait
    extrapolate: 'clamp',
  });

  // Crée une liste factice pour permettre le défilement
  const renderDummyList = () => {
    const data = Array.from({ length: 30 }, (_, i) => i);
    return data.map((item) => (
      <View key={item} style={styles.listItem}>
        <Text>Propriété à louer #{item + 1}</Text>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Le conteneur du header qui sera animé */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.View 
          style={[
            styles.titleContainer, 
            { opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] }
          ]}
        >
          <Text style={styles.title}>zameen</Text>
          <Text style={styles.subtitle}>Pakistan's Biggest Property Portal</Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.searchBarContainer,
            { transform: [{ translateY: searchBarTranslateY }]}
          ]}
        >
          <View style={styles.searchBar}>
            <Feather name="search" size={20} color="#888" />
            <TextInput
              placeholder="Search for properties..."
              style={styles.searchInput}
              placeholderTextColor="#888"
            />
          </View>
        </Animated.View>
      </Animated.View>

      {/* La liste déroulante qui contrôle l'animation */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false } // 'false' car on anime la 'height' qui n'est pas supportée par le native driver
        )}
        scrollEventThrottle={16} // Fréquence de mise à jour de l'événement de scroll (16ms ≈ 60fps)
      >
        {renderDummyList()}
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#006400', // Vert Zameen
    overflow: 'hidden',
    zIndex: 1, // Pour s'assurer que le header est au-dessus de la liste
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'sans-serif-condensed', // Une police qui ressemble à celle de Zameen
  },
  subtitle: {
    color: 'white',
    fontSize: 14,
  },
  searchBarContainer: {
    position: 'absolute',
    bottom: 15,
    width: '90%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    elevation: 5, // Ombre pour Android
    shadowColor: '#000', // Ombre pour iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    // Le padding top doit être égal à la hauteur maximale du header
    // pour que le premier élément de la liste ne soit pas caché derrière.
    paddingTop: HEADER_MAX_HEIGHT,
  },
  listItem: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default ZameenHeader;