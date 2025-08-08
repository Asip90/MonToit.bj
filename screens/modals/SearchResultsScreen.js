
// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ActivityIndicator, Modal, ScrollView } from 'react-native';
// import { MaterialIcons, Ionicons } from '@expo/vector-icons';
// import { COLORS, SIZES, FONTS } from '../../constants/Theme';
// import { db } from '../../src/api/FirebaseConfig';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { auth } from '../../src/api/FirebaseConfig';
// const SearchResultsScreen = ({ route, navigation }) => {
//   const [sortModalVisible, setSortModalVisible] = useState(false);
//   const [sortOption, setSortOption] = useState('recent');
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         setLoading(true);
//         const propertiesRef = collection(db, 'posts');
//         let q = query(propertiesRef);

//         // Appliquer les filtres
//         const { searchQuery, transactionType, location, minPrice, maxPrice, bedrooms, propertyType } = route.params || {};

//         if (transactionType) {
//           q = query(q, where('transactionType', '==', transactionType));
//         }

//         if (propertyType) {
//           q = query(q, where('propertyType', '==', propertyType));
//         }

//         if (bedrooms) {
//           q = query(q, where('bedrooms', '==', parseInt(bedrooms)));
//         }

//         if (minPrice) {
//           q = query(q, where('price', '>=', parseInt(minPrice)));
//         }

//         if (maxPrice) {
//           q = query(q, where('price', '<=', parseInt(maxPrice)));
//         }

//         const querySnapshot = await getDocs(q);
//         const propertiesData = [];
        
//         querySnapshot.forEach((doc) => {
//           propertiesData.push({ id: doc.id, ...doc.data() });
//         });

//         // Trier les résultats
//         let sortedProperties = [...propertiesData];
//         if (sortOption === 'price-low') {
//           sortedProperties.sort((a, b) => a.price - b.price);
//         } else if (sortOption === 'price-high') {
//           sortedProperties.sort((a, b) => b.price - a.price);
//         } else {
//           // Par défaut, trier par date (les plus récents en premier)
//           sortedProperties.sort((a, b) => b.createdAt - a.createdAt);
//         }
//         // modife
//         const filteredByLocation = location
//         ? sortedProperties.filter((item) => {
//             const loc = item.location;
//             const formattedLocation = typeof loc === 'string'
//               ? loc.toLowerCase()
//               : loc?.display_name?.toLowerCase();
//             return formattedLocation?.includes(location.toLowerCase());
//           })
//         : sortedProperties;
// // setProperties(sortedProperties);

//         // setProperties(sortedProperties);
//         setProperties(filteredByLocation);

//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching properties: ", err);
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchProperties();
//   }, [route.params, sortOption]);

//   // Fonction pour normaliser l'affichage de la localisation
//   const getDisplayLocation = (location) => {
//     if (!location) return 'Localisation non précisée';
//     if (typeof location === 'string') return location;
//     if (typeof location === 'object' && location.display_name) return location.display_name;
//     if (typeof location === 'object' && location.address) return location.address;
//     return 'Localisation non précisée';
//   };

//   // const renderPropertyItem = ({ item }) => {
//   //   const displayLocation = getDisplayLocation(item.location);
//   //   const displayNeighborhood = item.neighborhood ? `, ${item.neighborhood}` : '';

//   //   return (
//   //     <TouchableOpacity 
//   //       style={styles.propertyCard}
//   //       onPress={() => navigation.navigate('PostDetail',{ item})} // Assurez-vous que 'PostsDetail' est le nom correct de l'écran de détails
//   //     >
//   //       <Image source={{ uri: item.images?.[0] }} style={styles.propertyImage} />
//   //       {item.featured && (
//   //         <View style={styles.featuredBadge}>
//   //           <Text style={styles.featuredText}>En vedette</Text>
//   //         </View>
//   //       )}
//   //       <View style={styles.propertyInfo}>
//   //         <Text style={styles.propertyPrice}>{item.price?.toLocaleString() || '0'} FCFA</Text>
//   //         <Text style={styles.propertyTitle}>{item.title}</Text>
//   //         <Text style={styles.propertyLocation}>
//   //           {displayLocation}{displayNeighborhood}
//   //         </Text>
//   //         <View style={styles.propertyDetails}>
//   //           <View style={styles.detailItem}>
//   //             <Ionicons name="bed" size={16} color={COLORS.gray} />
//   //             <Text style={styles.detailText}>{item.bedrooms}</Text>
//   //           </View>
//   //           <View style={styles.detailItem}>
//   //             <Ionicons name="water" size={16} color={COLORS.gray} />
//   //             <Text style={styles.detailText}>{item.bathrooms}</Text>
//   //           </View>
//   //           <View style={styles.detailItem}>
//   //             <Ionicons name="resize" size={16} color={COLORS.gray} />
//   //             <Text style={styles.detailText}>{item.size} m²</Text>
//   //           </View>
//   //         </View>
//   //       </View>
//   //     </TouchableOpacity>
//   //   );
//   // };

//   // if (loading) {
//   //   return (
//   //     <View style={styles.loadingContainer}>
//   //       <ActivityIndicator size="large" color={COLORS.primary} />
//   //     </View>
//   //   );
//   // }

//   // if (error) {
//   //   return (
//   //     <View style={styles.errorContainer}>
//   //       <Text style={styles.errorText}>Erreur: {error}</Text>
//   //       <TouchableOpacity onPress={() => navigation.goBack()}>
//   //         <Text style={styles.retryText}>Retour</Text>
//   //       </TouchableOpacity>
//   //     </View>
//   //   );
//   // }
//  // si ce n’est pas déjà importé

// const renderPropertyItem = ({ item }) => {
//   const displayLocation = getDisplayLocation(item.location);
//   const displayNeighborhood = item.neighborhood ? `, ${item.neighborhood}` : '';
//   const userId = auth.currentUser?.uid;

//   return (
//     <TouchableOpacity 
//       style={styles.propertyCard}
//       onPress={() => navigation.navigate('PostDetail', { postId: item.id, userId })}
//     >
//       {/* <Image source={{ uri: item.images?.[0] }} style={styles.propertyImage} /> */}
//       <Image source={{ uri: item.imageUrls?.[0] }} style={styles.propertyImage} />

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

//   return (
//     <View style={styles.container}>
//       {/* Header avec bouton de retour */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color={COLORS.black} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Résultats de recherche</Text>
//         <TouchableOpacity onPress={() => setSortModalVisible(true)}>
//           <Ionicons name="options" size={24} color={COLORS.primary} />
//         </TouchableOpacity>
//       </View>

//       {/* Nombre de résultats */}
//       <Text style={styles.resultsCount}>{properties.length} propriétés trouvées</Text>

//       {/* Liste des propriétés */}
//       {properties.length > 0 ? (
//         <FlatList
//           data={properties}
//           renderItem={renderPropertyItem}
//           keyExtractor={item => item.id}
//           contentContainerStyle={styles.listContent}
//           showsVerticalScrollIndicator={false}
//         />
//       ) : (
//         <View style={styles.noResults}>
//           <Text style={styles.noResultsText}>Aucun résultat trouvé</Text>
//           <Text style={styles.noResultsSubText}>Essayez de modifier vos critères de recherche</Text>
//         </View>
//       )}

//       {/* Modal de tri */}
//       <Modal visible={sortModalVisible} animationType="slide" transparent>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Trier par</Text>
//               <TouchableOpacity onPress={() => setSortModalVisible(false)}>
//                 <Ionicons name="close" size={24} color={COLORS.gray} />
//               </TouchableOpacity>
//             </View>
//             <ScrollView>
//               <TouchableOpacity
//                 style={styles.sortOption}
//                 onPress={() => {
//                   setSortOption('recent');
//                   setSortModalVisible(false);
//                 }}
//               >
//                 <Text style={styles.sortOptionText}>Plus récent</Text>
//                 {sortOption === 'recent' && (
//                   <Ionicons name="checkmark" size={20} color={COLORS.primary} />
//                 )}
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.sortOption}
//                 onPress={() => {
//                   setSortOption('price-low');
//                   setSortModalVisible(false);
//                 }}
//               >
//                 <Text style={styles.sortOptionText}>Prix (bas-haut)</Text>
//                 {sortOption === 'price-low' && (
//                   <Ionicons name="checkmark" size={20} color={COLORS.primary} />
//                 )}
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.sortOption}
//                 onPress={() => {
//                   setSortOption('price-high');
//                   setSortModalVisible(false);
//                 }}
//               >
//                 <Text style={styles.sortOptionText}>Prix (haut-bas)</Text>
//                 {sortOption === 'price-high' && (
//                   <Ionicons name="checkmark" size={20} color={COLORS.primary} />
//                 )}
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: SIZES.padding,
//   },
//   errorText: {
//     ...FONTS.body3,
//     color: COLORS.black,
//     marginBottom: SIZES.padding,
//   },
//   retryText: {
//     ...FONTS.body4,
//     color: COLORS.primary,
//     textDecorationLine: 'underline',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: SIZES.padding,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.lightGray,
//   },
//   headerTitle: {
//     ...FONTS.h4,
//     color: COLORS.black,
//     fontWeight: 'bold',
//   },
//   resultsCount: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//     padding: SIZES.padding,
//     paddingBottom: 0,
//   },
//   listContent: {
//     padding: SIZES.padding,
//   },
//   noResults: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: SIZES.padding,
//   },
//   noResultsText: {
//     ...FONTS.h4,
//     color: COLORS.black,
//     marginBottom: SIZES.base,
//   },
//   noResultsSubText: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//     textAlign: 'center',
//   },
//   propertyCard: {
//     marginBottom: SIZES.padding,
//     borderRadius: SIZES.radius,
//     overflow: 'hidden',
//     backgroundColor: COLORS.white,
//     elevation: 2,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   propertyImage: {
//     width: '100%',
//     height: 200,
//     backgroundColor: COLORS.lightGray,
//   },
//   featuredBadge: {
//     position: 'absolute',
//     top: 10,
//     left: 10,
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: SIZES.base,
//     paddingVertical: SIZES.base / 2,
//     borderRadius: SIZES.radius,
//   },
//   featuredText: {
//     ...FONTS.body4,
//     color: COLORS.white,
//     fontWeight: 'bold',
//   },
//   propertyInfo: {
//     padding: SIZES.padding,
//   },
//   propertyPrice: {
//     ...FONTS.h4,
//     color: COLORS.primary,
//     fontWeight: 'bold',
//     marginBottom: SIZES.base / 2,
//   },
//   propertyTitle: {
//     ...FONTS.body3,
//     color: COLORS.black,
//     fontWeight: 'bold',
//     marginBottom: SIZES.base / 2,
//   },
//   propertyLocation: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//     marginBottom: SIZES.base,
//   },
//   propertyDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: SIZES.base,
//   },
//   detailItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   detailText: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//     marginLeft: SIZES.base / 2,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: COLORS.white,
//     borderTopLeftRadius: SIZES.radius * 2,
//     borderTopRightRadius: SIZES.radius * 2,
//     padding: SIZES.padding,
//     maxHeight: '50%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: SIZES.padding,
//   },
//   modalTitle: {
//     ...FONTS.h4,
//     color: COLORS.black,
//     fontWeight: 'bold',
//   },
//   sortOption: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: SIZES.padding,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.lightGray,
//   },
//   sortOptionText: {
//     ...FONTS.body4,
//     color: COLORS.black,
//   },
// });

// export default SearchResultsScreen;
// // ... (les styles restent inchangés)

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  Image, 
  Modal, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { COLORS, SIZES, FONTS } from '../../constants/Theme';
import { db, auth } from '../../src/api/FirebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const { width } = Dimensions.get('window');

// --- Composants placés EN DEHORS de l'écran principal ---

// Composant pour le "Skeleton Loader"
const PropertyCardSkeleton = () => (
  <View style={styles.propertyCard}>
    <View style={[styles.propertyImage, styles.skeleton]} />
    <View style={styles.propertyInfo}>
      <View style={[styles.skeleton, { width: '50%', height: 24, marginBottom: SIZES.base }]} />
      <View style={[styles.skeleton, { width: '80%', height: 20, marginBottom: SIZES.base }]} />
      <View style={[styles.skeleton, { width: '60%', height: 16, marginBottom: SIZES.padding }]} />
      <View style={styles.propertyDetails}>
        <View style={[styles.skeleton, { width: '25%', height: 16 }]} />
        <View style={[styles.skeleton, { width: '25%', height: 16 }]} />
        <View style={[styles.skeleton, { width: '25%', height: 16 }]} />
      </View>
    </View>
  </View>
);

// Carte de propriété animée
const AnimatedPropertyCard = ({ item, navigation, index }) => {
  const getDisplayLocation = (location) => {
    if (!location) return 'Localisation non précisée';
    if (typeof location === 'string') return location;
    return location.display_name || location.address || 'Localisation non précisée';
  };

  const displayLocation = getDisplayLocation(item.location);
  const userId = auth.currentUser?.uid;

  return (
    <Animatable.View
      animation="fadeInUp"
      duration={600}
      delay={index * 100}
      useNativeDriver
    >
      <TouchableOpacity 
        style={styles.propertyCard}
        onPress={() => navigation.navigate('PostDetail', { postId: item.id, userId })}
      >
        <Image 
          source={{ uri: item.imageUrls?.[0] }} 
          style={styles.propertyImage} 
        />
        {item.isBoosted && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={12} color={COLORS.white} />
            <Text style={styles.featuredText}>Sponsorisé</Text>
          </View>
        )}
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyPrice}>{item.price?.toLocaleString('fr-FR') || 'N/A'} FCFA</Text>
          <Text style={styles.propertyTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color={COLORS.gray} />
            <Text style={styles.propertyLocation} numberOfLines={1}>
              {displayLocation}
            </Text>
          </View>
          <View style={styles.propertyDetails}>
            {item.bedrooms ? <View style={styles.detailItem}><Ionicons name="bed-outline" size={16} color={COLORS.gray} /><Text style={styles.detailText}>{item.bedrooms}</Text></View> : null}
            {item.bathrooms ? <View style={styles.detailItem}><Ionicons name="water-outline" size={16} color={COLORS.gray} /><Text style={styles.detailText}>{item.bathrooms}</Text></View> : null}
            {item.area ? <View style={styles.detailItem}><Ionicons name="resize" size={16} color={COLORS.gray} /><Text style={styles.detailText}>{item.area} m²</Text></View> : null}
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

// **CORRECTION :** Le Header est maintenant un composant autonome, défini AVANT d'être utilisé.
const Header = ({ onSortPress, onBackPress, title = "Résultats" }) => (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={styles.headerButton}>
        <Ionicons name="arrow-back" size={24} color={COLORS.black} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity onPress={onSortPress} style={styles.headerButton}>
        <Ionicons name="options-outline" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );


// --- Le composant écran principal ---

const SearchResultsScreen = ({ route, navigation }) => {
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState({ value: 'createdAt', direction: 'desc' });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        let q = collection(db, 'posts');
        
        const queryConstraints = [];
        const { transactionType, propertyType, bedrooms, minPrice, maxPrice } = route.params || {};

        if (transactionType) queryConstraints.push(where('transactionType', '==', transactionType));
        if (propertyType) queryConstraints.push(where('propertyType', '==', propertyType));
        if (bedrooms) queryConstraints.push(where('bedrooms', '==', parseInt(bedrooms)));
        if (minPrice) queryConstraints.push(where('price', '>=', parseInt(minPrice)));
        if (maxPrice) queryConstraints.push(where('price', '<=', parseInt(maxPrice)));
        
        queryConstraints.push(orderBy(sortOption.value, sortOption.direction));

        const finalQuery = query(q, ...queryConstraints);
        const querySnapshot = await getDocs(finalQuery);
        let propertiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const { location } = route.params || {};
        if (location) {
          propertiesData = propertiesData.filter((item) => {
            const itemLoc = item.location?.display_name || item.location || '';
            return itemLoc.toLowerCase().includes(location.toLowerCase());
          });
        }
        
        setProperties(propertiesData);

      } catch (err) {
        console.error("Error fetching properties: ", err);
        setError("Une erreur est survenue lors de la récupération des annonces.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [route.params, sortOption]);

  const handleSortChange = (value, direction) => {
    setSortOption({ value, direction });
    setSortModalVisible(false);
  };
  
  const renderItem = ({ item, index }) => <AnimatedPropertyCard item={item} navigation={navigation} index={index} />;

  if (loading) {
    return (
      <View style={styles.container}>
        <Header onBackPress={() => navigation.goBack()} onSortPress={() => {}} />
        <FlatList
          data={Array(5).fill(0)}
          renderItem={() => <PropertyCardSkeleton />}
          keyExtractor={(_, index) => `skeleton-${index}`}
          contentContainerStyle={styles.listContent}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
         <Header onBackPress={() => navigation.goBack()} onSortPress={() => {}} />
         <View style={styles.noResultsContainer}>
           <Ionicons name="cloud-offline-outline" size={60} color={COLORS.lightGray} />
           <Text style={styles.noResultsText}>Oops! Une erreur est survenue</Text>
           <Text style={styles.noResultsSubText}>{error}</Text>
         </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header onBackPress={() => navigation.goBack()} onSortPress={() => setSortModalVisible(true)} />

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{properties.length} bien{properties.length > 1 ? 's' : ''} trouvé{properties.length > 1 ? 's' : ''}</Text>
      </View>

      {properties.length > 0 ? (
        <FlatList
          data={properties}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search-outline" size={60} color={COLORS.lightGray} />
          <Text style={styles.noResultsText}>Aucun résultat trouvé</Text>
          <Text style={styles.noResultsSubText}>Essayez de modifier ou d'élargir vos critères de recherche.</Text>
        </View>
      )}

      <Modal visible={sortModalVisible} animationType="fade" transparent>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSortModalVisible(false)}>
          <Animatable.View 
            animation="fadeInUpBig"
            duration={400}
            style={styles.modalContent}
            onStartShouldSetResponder={() => true} // Empêche le clic de se propager et fermer le modal
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Trier par</Text>
              <TouchableOpacity onPress={() => setSortModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color={COLORS.lightGray} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.sortOption} onPress={() => handleSortChange('createdAt', 'desc')}>
              <Text style={styles.sortOptionText}>Plus récent</Text>
              {sortOption.value === 'createdAt' && <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.sortOption} onPress={() => handleSortChange('price', 'asc')}>
              <Text style={styles.sortOptionText}>Prix (croissant)</Text>
              {sortOption.value === 'price' && sortOption.direction === 'asc' && <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.sortOption} onPress={() => handleSortChange('price', 'desc')}>
              <Text style={styles.sortOptionText}>Prix (décroissant)</Text>
              {sortOption.value === 'price' && sortOption.direction === 'desc' && <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />}
            </TouchableOpacity>
          </Animatable.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};


// Styles (inchangés)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding / 2,
    paddingVertical: SIZES.base,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerButton: {
    padding: SIZES.base,
  },
  headerTitle: {
    ...FONTS.h3,
    fontWeight: 'bold',
  },
  resultsHeader: {
    paddingHorizontal: SIZES.padding,
    paddingTop: SIZES.padding,
    paddingBottom: SIZES.base,
  },
  resultsCount: {
    ...FONTS.body4,
    color: COLORS.darkgray,
  },
  listContent: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  noResultsText: {
    ...FONTS.h3,
    color: COLORS.black,
    marginTop: SIZES.padding,
    marginBottom: SIZES.base,
  },
  noResultsSubText: {
    ...FONTS.body3,
    color: COLORS.gray,
    textAlign: 'center',
  },
  propertyCard: {
    marginBottom: SIZES.padding * 1.5,
    borderRadius: SIZES.radius * 1.5,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  propertyImage: {
    width: '100%',
    height: 220,
    borderTopLeftRadius: SIZES.radius * 1.5,
    borderTopRightRadius: SIZES.radius * 1.5,
    backgroundColor: COLORS.lightGray,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radius,
  },
  featuredText: {
    ...FONTS.body5,
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: SIZES.base / 2,
  },
  propertyInfo: {
    padding: SIZES.padding,
  },
  propertyPrice: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  propertyTitle: {
    ...FONTS.h4,
    marginVertical: SIZES.base / 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  propertyLocation: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginLeft: SIZES.base / 2,
    flexShrink: 1,
  },
  propertyDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray2,
    paddingTop: SIZES.base,
    marginTop: SIZES.base,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.padding,
  },
  detailText: {
    ...FONTS.body4,
    color: COLORS.darkgray,
    marginLeft: SIZES.base,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    padding: SIZES.padding,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SIZES.padding,
  },
  modalTitle: {
    ...FONTS.h3,
    fontWeight: 'bold',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding * 1.2,
  },
  sortOptionText: {
    ...FONTS.body2,
  },
  skeleton: {
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
  },
  skeletonLine: {
    height: 16,
  },
});

export default SearchResultsScreen;