

// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
// import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
// import { db } from '../src/api/FirebaseConfig';
// import { COLORS } from '../constants/Theme';
// import SecureWatermarkedImage from './SecureWatermarkedImage';
// import { cacheData, getCachedData } from '../services/cacheManager';

// const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 jours

// const SimilarListings = ({ currentPostId, navigation }) => {
//   const [topSelection, setTopSelection] = useState([]);
//   const [similarListings, setSimilarListings] = useState([]);
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // 1. Récupérer les données du post courant
//         const locKey = `location_${currentPostId}`;
//         const typeKey = `propertyType_${currentPostId}`;
//         let location = null;
//         let propertyType = null;
//         let postData = null;

//         const cachedLoc  = await getCachedData(locKey);
//         const cachedType = await getCachedData(typeKey);
//         if (cachedLoc && cachedType) {
//           location = cachedLoc;
//           propertyType = cachedType;
//         } else {
//           const snap = await getDoc(doc(db, 'posts', currentPostId));
//           if (snap.exists()) {
//             postData = snap.data();
//             location = typeof postData.location === 'string'
//               ? postData.location
//               : postData.location?.display_name;
//             propertyType = postData.propertyType;
//             if (location)    await cacheData(locKey, location);
//             if (propertyType) await cacheData(typeKey, propertyType);
//           }
//         }
//         if (!location || !propertyType) {
//           setLoading(false);
//           return;
//         }

//         // 2. Récupérer toutes les annonces de la même localisation
//         const cacheKey = `similar_${location}`;
//         let allListings = [];
//         const cachedSimilar = await getCachedData(cacheKey);
//         if (cachedSimilar) {
//           allListings = cachedSimilar;
//         } else {
//           const snapshot = await getDocs(collection(db, 'posts'));
//           snapshot.forEach(doc => {
//             const data = doc.data();
//             const loc = typeof data.location === 'string'
//               ? data.location
//               : data.location?.display_name;
//             if (loc === location && doc.id !== currentPostId) {
//               allListings.push({ id: doc.id, ...data });
//             }
//           });
//           if (allListings.length > 0) await cacheData(cacheKey, allListings);
//         }

//         // 3. Séparer en 3 groupes
//         const top = [];
//         const similar = [];
//         const boostedSug = [];
//         const regularSug = [];
//         allListings.forEach(p => {
//           if (p.propertyType === propertyType && p.isBoosted) top.push(p);
//           else if (p.propertyType === propertyType && !p.isBoosted) similar.push(p);
//           else if (p.isBoosted) boostedSug.push(p);
//           else regularSug.push(p);
//         });

//         // Helpers
//         const sortByDate = (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
//         const filterCurrent = arr => arr.filter(p => p.id !== currentPostId);

//         // Top sélection
//         const sortedTop = filterCurrent(top).sort(sortByDate).slice(0, 10);
//         // Annonces similaires
//         const sortedSim = filterCurrent(similar).sort(sortByDate).slice(0, 10);
//         // Suggestions: boostées puis non-boostées
//         const sortedBoost = filterCurrent(boostedSug).sort(sortByDate);
//         const sortedReg   = filterCurrent(regularSug).sort(sortByDate);
//         const sortedSug   = [...sortedBoost, ...sortedReg].slice(0, 10);

//         setTopSelection(sortedTop);
//         setSimilarListings(sortedSim);
//         setSuggestions(sortedSug);
//       } catch (error) {
//         console.error('Erreur chargement annonces similaires :', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [currentPostId]);

//   const renderItem = useCallback(({ item }) => (
//     <TouchableOpacity
//       style={styles.listingCard}
//       onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
//     >
//       {item.imageUrls?.[0] && (
//         <SecureWatermarkedImage
//           source={{ uri: item.imageUrls[0] }}
//           style={styles.listingImage}
//           contentFit="cover"
//           transition={300}
//         />
//       )}
//       <View style={styles.listingInfo}>
//         <Text style={styles.listingPrice}>{item.price?.toLocaleString()} FCFA</Text>
//         <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
//         {item.isBoosted && (
//           <View style={styles.boostedBadge}>
//             <Text style={styles.boostedText}>Boosté</Text>
//           </View>
//         )}
//       </View>
//     </TouchableOpacity>
//   ), [navigation]);

//   const renderSection = (title, data) => (
//     <>
//       <Text style={styles.sectionTitle}>{title}</Text>
//       <FlatList
//         horizontal
//         data={data}
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.listContent}
//       />
//     </>
//   );

//   if (loading) {
//     return <ActivityIndicator size="small" color={COLORS.primary} style={styles.loading} />;
//   }

//   return (
//     <View style={styles.container}>
//       {topSelection.length > 0 && renderSection('Coup de cœur du quartier', topSelection)}
//       {similarListings.length > 0 && renderSection('Annonces similaires', similarListings)}
//       {suggestions.length > 0 && renderSection('On vous propose aussi', suggestions)}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 16,
//     // paddingHorizontal: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 12,
//     marginTop: 20,
//     color: '#333',
//   },
//   listingCard: {
//     width: 200,
//     height: 250,
//     marginRight: 12,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     overflow: 'hidden',
//     elevation: 2,
//   },
//   listingImage: {
//     width: '100%',
//     height: 150,
//     borderTopLeftRadius: 8,
//     borderTopRightRadius: 8,
//   },
//   listingInfo: {
//     padding: 8,
//   },
//   listingPrice: {
//     fontWeight: 'bold',
//     color: COLORS.primary,
//     fontSize: 14,
//   },
//   listingTitle: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 4,
//   },
//   boostedBadge: {
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//     alignSelf: 'flex-start',
//     marginTop: 4,
//   },
//   boostedText: {
//     color: 'white',
//     // fontSize: 10,
//     fontWeight: 'bold',
//   },
//   listContent: {
//     paddingBottom: 5,
//   },
//   loading: {
//     marginVertical: 10,
//   },
// });

// export default SimilarListings;

import React, { useState, useEffect, useCallback, useContext,useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../src/api/FirebaseConfig';
import { COLORS } from '../constants/Theme';
import { cacheData, getCachedData } from '../services/cacheManager';
import ListingCard from './ListingCard';
import { UserContext } from '../context/AuthContext';
import { toggleFavorite, isPostFavorite } from '../services/favorites';

const CACHE_DURATION = 0.01 * 24 * 60 * 60 * 1000; // 0.01 jour (15 minutes)

const SimilarListings = ({ currentPostId, navigation }) => {
  const [topSelection, setTopSelection] = useState([]);
  const [similarListings, setSimilarListings] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const { userData } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
         
        // 1. Récupérer les données du post courant
        const locKey = `location_${currentPostId}`;
        const typeKey = `propertyType_${currentPostId}`;
        let location = null;
        let propertyType = null;
        let postData = null;

        const cachedLoc  = await getCachedData(locKey);
        const cachedType = await getCachedData(typeKey);
        if (cachedLoc && cachedType) {
          location = cachedLoc;
          propertyType = cachedType;
        } else {
          const snap = await getDoc(doc(db, 'posts', currentPostId));
          if (snap.exists()) {
            postData = snap.data();
            location = typeof postData.location === 'string'
              ? postData.location
              : postData.location?.display_name;
            propertyType = postData.propertyType;
            if (location)    await cacheData(locKey, location);
            if (propertyType) await cacheData(typeKey, propertyType);
          }
        }
        if (!location || !propertyType) {
          setLoading(false);
          return;
        }

        // 2. Récupérer toutes les annonces de la même localisation
        const cacheKey = `similar_${location}`;
        let allListings = [];
        const cachedSimilar = await getCachedData(cacheKey);
        if (cachedSimilar) {
          allListings = cachedSimilar;
        } else {
          const snapshot = await getDocs(collection(db, 'posts'));
          snapshot.forEach(doc => {
            const data = doc.data();
            const loc = typeof data.location === 'string'
              ? data.location
              : data.location?.display_name;
            if (loc === location && doc.id !== currentPostId) {
              allListings.push({ id: doc.id, ...data });
            }
          });
          if (allListings.length > 0) await cacheData(cacheKey, allListings);
        }

        // 3. Séparer en 3 groupes
        const top = [];
        const similar = [];
        const boostedSug = [];
        const regularSug = [];
        allListings.forEach(p => {
          if (p.propertyType === propertyType && p.isBoosted) top.push(p);
          else if (p.propertyType === propertyType && !p.isBoosted) similar.push(p);
          else if (p.isBoosted) boostedSug.push(p);
          else regularSug.push(p);
        });

        // Helpers
        const sortByDate = (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
        const filterCurrent = arr => arr.filter(p => p.id !== currentPostId);

        // Top sélection
        const sortedTop = filterCurrent(top).sort(sortByDate).slice(0, 10);
        // Annonces similaires
        const sortedSim = filterCurrent(similar).sort(sortByDate).slice(0, 10);
        // Suggestions: boostées puis non-boostées
        const sortedBoost = filterCurrent(boostedSug).sort(sortByDate);
        const sortedReg   = filterCurrent(regularSug).sort(sortByDate);
        const sortedSug   = [...sortedBoost, ...sortedReg].slice(0, 10);

        setTopSelection(sortedTop);
        setSimilarListings(sortedSim);
        setSuggestions(sortedSug);
      } catch (error) {
        console.error('Erreur chargement annonces similaires :', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPostId]);

  // Ajout de la gestion des favoris
  const handleToggleFavorite = async (postId) => {
    try {
      if (userData?.uid) {
        const result = await toggleFavorite(userData.uid, postId);
        
        // Mise à jour dans toutes les listes
        const updateList = (list) => list.map(item => 
          item.id === postId ? { ...item, isFavorite: result } : item
        );
        
        setTopSelection(prev => updateList(prev));
        setSimilarListings(prev => updateList(prev));
        setSuggestions(prev => updateList(prev));
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout/retrait du favori:", error);
    }
  };

  // Détection des éléments visibles
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    const newVisibleItems = new Set(viewableItems.map(item => item.item.id));
    setVisibleItems(newVisibleItems);
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300
  }).current;

  // Rendu d'une annonce avec le composant ListingCard
  const renderItem = useCallback(({ item }) => (
    <ListingCard 
      item={item}
      navigation={navigation}
      onToggleFavorite={handleToggleFavorite}
      isVisible={visibleItems.has(item.id)}
      cardWidth={200}
      imageHeight={150}
    />
  ), [navigation, visibleItems]);

  const renderSection = (title, data) => (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        horizontal
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </>
  );

  if (loading) {
    return <ActivityIndicator size="small" color={COLORS.primary} style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      {topSelection.length > 0 && renderSection('Coup de cœur du quartier', topSelection)}
      {similarListings.length > 0 && renderSection('Annonces similaires', similarListings)}
      {suggestions.length > 0 && renderSection('On vous propose aussi', suggestions)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 20,
    color: '#333',
    paddingHorizontal: 16,
  },
  listContent: {
    paddingLeft: 16,
    paddingBottom: 5,
  },
  loading: {
    marginVertical: 10,
  },
});

export default SimilarListings;
