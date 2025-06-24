
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/Theme';
import { db } from '../../src/api/FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../../src/api/FirebaseConfig';
const SearchResultsScreen = ({ route, navigation }) => {
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState('recent');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const propertiesRef = collection(db, 'posts');
        let q = query(propertiesRef);

        // Appliquer les filtres
        const { searchQuery, transactionType, location, minPrice, maxPrice, bedrooms, propertyType } = route.params || {};

        if (transactionType) {
          q = query(q, where('transactionType', '==', transactionType));
        }

        if (propertyType) {
          q = query(q, where('propertyType', '==', propertyType));
        }

        if (bedrooms) {
          q = query(q, where('bedrooms', '==', parseInt(bedrooms)));
        }

        if (minPrice) {
          q = query(q, where('price', '>=', parseInt(minPrice)));
        }

        if (maxPrice) {
          q = query(q, where('price', '<=', parseInt(maxPrice)));
        }

        const querySnapshot = await getDocs(q);
        const propertiesData = [];
        
        querySnapshot.forEach((doc) => {
          propertiesData.push({ id: doc.id, ...doc.data() });
        });

        // Trier les résultats
        let sortedProperties = [...propertiesData];
        if (sortOption === 'price-low') {
          sortedProperties.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-high') {
          sortedProperties.sort((a, b) => b.price - a.price);
        } else {
          // Par défaut, trier par date (les plus récents en premier)
          sortedProperties.sort((a, b) => b.createdAt - a.createdAt);
        }
        // modife
        const filteredByLocation = location
        ? sortedProperties.filter((item) => {
            const loc = item.location;
            const formattedLocation = typeof loc === 'string'
              ? loc.toLowerCase()
              : loc?.display_name?.toLowerCase();
            return formattedLocation?.includes(location.toLowerCase());
          })
        : sortedProperties;
// setProperties(sortedProperties);

        // setProperties(sortedProperties);
        setProperties(filteredByLocation);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching properties: ", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProperties();
  }, [route.params, sortOption]);

  // Fonction pour normaliser l'affichage de la localisation
  const getDisplayLocation = (location) => {
    if (!location) return 'Localisation non précisée';
    if (typeof location === 'string') return location;
    if (typeof location === 'object' && location.display_name) return location.display_name;
    if (typeof location === 'object' && location.address) return location.address;
    return 'Localisation non précisée';
  };

  // const renderPropertyItem = ({ item }) => {
  //   const displayLocation = getDisplayLocation(item.location);
  //   const displayNeighborhood = item.neighborhood ? `, ${item.neighborhood}` : '';

  //   return (
  //     <TouchableOpacity 
  //       style={styles.propertyCard}
  //       onPress={() => navigation.navigate('PostDetail',{ item})} // Assurez-vous que 'PostsDetail' est le nom correct de l'écran de détails
  //     >
  //       <Image source={{ uri: item.images?.[0] }} style={styles.propertyImage} />
  //       {item.featured && (
  //         <View style={styles.featuredBadge}>
  //           <Text style={styles.featuredText}>En vedette</Text>
  //         </View>
  //       )}
  //       <View style={styles.propertyInfo}>
  //         <Text style={styles.propertyPrice}>{item.price?.toLocaleString() || '0'} FCFA</Text>
  //         <Text style={styles.propertyTitle}>{item.title}</Text>
  //         <Text style={styles.propertyLocation}>
  //           {displayLocation}{displayNeighborhood}
  //         </Text>
  //         <View style={styles.propertyDetails}>
  //           <View style={styles.detailItem}>
  //             <Ionicons name="bed" size={16} color={COLORS.gray} />
  //             <Text style={styles.detailText}>{item.bedrooms}</Text>
  //           </View>
  //           <View style={styles.detailItem}>
  //             <Ionicons name="water" size={16} color={COLORS.gray} />
  //             <Text style={styles.detailText}>{item.bathrooms}</Text>
  //           </View>
  //           <View style={styles.detailItem}>
  //             <Ionicons name="resize" size={16} color={COLORS.gray} />
  //             <Text style={styles.detailText}>{item.size} m²</Text>
  //           </View>
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };

  // if (loading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color={COLORS.primary} />
  //     </View>
  //   );
  // }

  // if (error) {
  //   return (
  //     <View style={styles.errorContainer}>
  //       <Text style={styles.errorText}>Erreur: {error}</Text>
  //       <TouchableOpacity onPress={() => navigation.goBack()}>
  //         <Text style={styles.retryText}>Retour</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }
 // si ce n’est pas déjà importé

const renderPropertyItem = ({ item }) => {
  const displayLocation = getDisplayLocation(item.location);
  const displayNeighborhood = item.neighborhood ? `, ${item.neighborhood}` : '';
  const userId = auth.currentUser?.uid;

  return (
    <TouchableOpacity 
      style={styles.propertyCard}
      onPress={() => navigation.navigate('PostDetail', { postId: item.id, userId })}
    >
      {/* <Image source={{ uri: item.images?.[0] }} style={styles.propertyImage} /> */}
      <Image source={{ uri: item.imageUrls?.[0] }} style={styles.propertyImage} />

      {item.featured && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>En vedette</Text>
        </View>
      )}
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyPrice}>{item.price?.toLocaleString() || '0'} FCFA</Text>
        <Text style={styles.propertyTitle}>{item.title}</Text>
        <Text style={styles.propertyLocation}>
          {displayLocation}{displayNeighborhood}
        </Text>
        <View style={styles.propertyDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="bed" size={16} color={COLORS.gray} />
            <Text style={styles.detailText}>{item.bedrooms}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="water" size={16} color={COLORS.gray} />
            <Text style={styles.detailText}>{item.bathrooms}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="resize" size={16} color={COLORS.gray} />
            <Text style={styles.detailText}>{item.size} m²</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

  return (
    <View style={styles.container}>
      {/* Header avec bouton de retour */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Résultats de recherche</Text>
        <TouchableOpacity onPress={() => setSortModalVisible(true)}>
          <Ionicons name="options" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Nombre de résultats */}
      <Text style={styles.resultsCount}>{properties.length} propriétés trouvées</Text>

      {/* Liste des propriétés */}
      {properties.length > 0 ? (
        <FlatList
          data={properties}
          renderItem={renderPropertyItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>Aucun résultat trouvé</Text>
          <Text style={styles.noResultsSubText}>Essayez de modifier vos critères de recherche</Text>
        </View>
      )}

      {/* Modal de tri */}
      <Modal visible={sortModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Trier par</Text>
              <TouchableOpacity onPress={() => setSortModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <TouchableOpacity
                style={styles.sortOption}
                onPress={() => {
                  setSortOption('recent');
                  setSortModalVisible(false);
                }}
              >
                <Text style={styles.sortOptionText}>Plus récent</Text>
                {sortOption === 'recent' && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sortOption}
                onPress={() => {
                  setSortOption('price-low');
                  setSortModalVisible(false);
                }}
              >
                <Text style={styles.sortOptionText}>Prix (bas-haut)</Text>
                {sortOption === 'price-low' && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sortOption}
                onPress={() => {
                  setSortOption('price-high');
                  setSortModalVisible(false);
                }}
              >
                <Text style={styles.sortOptionText}>Prix (haut-bas)</Text>
                {sortOption === 'price-high' && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  errorText: {
    ...FONTS.body3,
    color: COLORS.black,
    marginBottom: SIZES.padding,
  },
  retryText: {
    ...FONTS.body4,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    ...FONTS.h4,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  resultsCount: {
    ...FONTS.body4,
    color: COLORS.gray,
    padding: SIZES.padding,
    paddingBottom: 0,
  },
  listContent: {
    padding: SIZES.padding,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  noResultsText: {
    ...FONTS.h4,
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  noResultsSubText: {
    ...FONTS.body4,
    color: COLORS.gray,
    textAlign: 'center',
  },
  propertyCard: {
    marginBottom: SIZES.padding,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  propertyImage: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.lightGray,
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  featuredText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  propertyInfo: {
    padding: SIZES.padding,
  },
  propertyPrice: {
    ...FONTS.h4,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: SIZES.base / 2,
  },
  propertyTitle: {
    ...FONTS.body3,
    color: COLORS.black,
    fontWeight: 'bold',
    marginBottom: SIZES.base / 2,
  },
  propertyLocation: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: SIZES.base,
  },
  propertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.base,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginLeft: SIZES.base / 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    padding: SIZES.padding,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  modalTitle: {
    ...FONTS.h4,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sortOptionText: {
    ...FONTS.body4,
    color: COLORS.black,
  },
});

export default SearchResultsScreen;
// ... (les styles restent inchangés)