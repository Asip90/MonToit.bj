// import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
// import React, { useState, useEffect } from 'react'
// import { getCoordinates } from '../services/getCoordinates'
// import { fetchNearbyPOIs } from '../services/fetchNearbyPOIs'
// import { getPOIType, calculateDistance, getIconName } from '../services/poiUtilis'
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
// import { COLORS, SIZES, FONTS } from '../constants/Theme'

// const PoiList = ({ post }) => {
//   const [pois, setPois] = useState([])
//   const [postCoords, setPostCoords] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [showAll, setShowAll] = useState(false)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const coords = await getCoordinates(post.location)
//         setPostCoords(coords)
        
//         if (coords) {
//           const poisData = await fetchNearbyPOIs(coords.lat, coords.lon)
//           setPois(poisData.map(poi => ({
//             ...poi,
//             distance: calculateDistance(coords, poi) + ' m'
//           })))
//         }
//       } catch (error) {
//         console.error('Error fetching POIs:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [post])

//   const renderItem = ({ item }) => (
//     <View style={styles.poiItem}>
//       <Icon 
//         name={getIconName(getPOIType(item.tags))} 
//         size={SIZES.h3} 
//         color={COLORS.primary} 
//         style={styles.poiIcon}
//       />
//       <View style={styles.poiInfo}>
//         <Text style={styles.poiName} numberOfLines={1}>
//           {item.tags?.name || 'Lieu sans nom'}
//         </Text>
//         <Text style={styles.poiType}>
//           {getPOIType(item.tags)}
//         </Text>
//       </View>
//       <Text style={styles.poiDistance}>
//         {item.distance}
//       </Text>
//     </View>
//   )

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text style={styles.loadingText}>Chargement des points d'intérêt...</Text>
//       </View>
//     )
//   }

//   if (pois.length === 0) {
//     return (
//       <View style={styles.emptyContainer}>
//         <Text style={styles.emptyText}>Aucun point d'intérêt à proximité</Text>
//       </View>
//     )
//   }

//   return (
//     <View style={{ paddingHorizontal: SIZES.padding }}>
//       <Text style={{ ...FONTS.h3, color: COLORS.gray, marginBottom: SIZES.base }}>
//         Propriété située à proximité de :
//       </Text>

//       <FlatList
//         data={showAll ? pois : pois.slice(0, 5)}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderItem}
//         contentContainerStyle={styles.listContainer}
//         showsVerticalScrollIndicator={false}
//       />

//       {pois.length > 5 && (
//         <TouchableOpacity onPress={() => setShowAll(!showAll)} style={{ alignItems: 'center', marginTop: SIZES.base }}>
//           <Text style={{ ...FONTS.body3, color: COLORS.primary }}>
//             {showAll ? 'Voir moins' : 'Voir plus'}
//           </Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   listContainer: {},
//   poiItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: SIZES.base * 1.5,
//     paddingHorizontal: SIZES.base,
//     backgroundColor: COLORS.white,
//     borderRadius: SIZES.radius,
//     marginBottom: SIZES.base,
//     elevation: 1,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2
//   },
//   poiIcon: {
//     marginRight: SIZES.base * 1.5,
//     backgroundColor: COLORS.lightGray,
//     padding: SIZES.base,
//     borderRadius: 50
//   },
//   poiInfo: {
//     flex: 1,
//     marginRight: SIZES.base
//   },
//   poiName: {
//     ...FONTS.body3,
//     color: COLORS.black,
//     fontWeight: '600',
//     marginBottom: 2
//   },
//   poiType: {
//     ...FONTS.body4,
//     color: COLORS.gray
//   },
//   poiDistance: {
//     ...FONTS.body4,
//     color: COLORS.primary,
//     fontWeight: '600'
//   },
//   loadingContainer: {
//     padding: SIZES.padding,
//     alignItems: 'center'
//   },
//   loadingText: {
//     ...FONTS.body4,
//     color: COLORS.gray
//   },
//   emptyContainer: {
//     padding: SIZES.padding,
//     alignItems: 'center'
//   },
//   emptyText: {
//     ...FONTS.body4,
//     color: COLORS.gray
//   }
// })

// export default PoiList
// import { View, Text, FlatList, StyleSheet } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { getCoordinates } from '../services/getCoordinates';
// import { fetchNearbyPOIs } from '../services/fetchNearbyPOIs';
// import { getPOIType, calculateDistance, getIconName } from '../services/poiUtilis';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { COLORS, SIZES, FONTS } from '../constants/Theme';
// import { cacheData, getCachedData } from '../services/cacheManager';

// const PoiList = ({ post }) => {
//   const [pois, setPois] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

// //   // Clé unique pour le cache basée sur la localisation
// //   const cacheKey = `pois_${post.id || post.location}`;

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         setLoading(true);
        
// //         // 1. Vérifier le cache d'abord
// //         const cachedPOIs = getCachedData(cacheKey);
// //         if (cachedPOIs) {
// //           setPois(cachedPOIs);
// //           return;
// //         }

// //         // 2. Sinon, faire les appels API
// //         const coords = await getCoordinates(post.location);
// //         if (!coords) throw new Error('Coordonnées non disponibles');

// //         const poisData = await fetchNearbyPOIs(coords.lat, coords.lon);
// //         const formattedPOIs = poisData.map(poi => ({
// //           ...poi,
// //           distance: calculateDistance(coords, poi) + ' m'
// //         }));

// //         // 3. Mettre en cache
// //         cacheData(cacheKey, formattedPOIs);
// //         setPois(formattedPOIs);

// //       } catch (err) {
// //         setError(err.message);
// //         console.error('POI Error:', err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [post, cacheKey]);


// // components/PoiList.js

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const cacheKey = `pois_${post.id}`;
        
//         // 1. Essayer de récupérer depuis le cache
//         const cached = await getCachedData(cacheKey);
//         if (cached) {
//           setPois(cached);
//           return;
//         }

//         // 2. Sinon, charger depuis l'API
//         const coords = await getCoordinates(post.location);
//         const freshData = await fetchNearbyPOIs(coords.lat, coords.lon);
        
//         // 3. Mettre en cache et afficher
//         await cacheData(cacheKey, freshData);
//         setPois(freshData);

//       } catch (error) {
//         console.error('Erreur chargement POIs:', error);
//       }
//     };

//     loadData();
//   }, [post]);

 
// };




//   const renderItem = ({ item }) => (
//     <View style={styles.poiItem}>
//       <Icon 
//         name={getIconName(getPOIType(item.tags))} 
//         size={SIZES.h3} 
//         color={COLORS.primary} 
//         style={styles.poiIcon}
//       />
//       <View style={styles.poiInfo}>
//         <Text style={styles.poiName} numberOfLines={1}>
//           {item.tags?.name || 'Lieu sans nom'}
//         </Text>
//         <Text style={styles.poiType}>
//           {getPOIType(item.tags)}
//         </Text>
//       </View>
//       <Text style={styles.poiDistance}>
//         {item.distance}
//       </Text>
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text style={styles.loadingText}>Chargement en cours...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Erreur: {error}</Text>
//         <Text style={styles.retryText} onPress={() => setError(null)}>
//           Réessayer
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <FlatList
//       data={pois}
//       keyExtractor={(item) => item.id.toString()}
//       renderItem={renderItem}
//       contentContainerStyle={styles.listContainer}
//       ListEmptyComponent={
//         <View style={styles.emptyContainer}>
//           <Text style={styles.emptyText}>Aucun point d'intérêt trouvé</Text>
//         </View>
//       }
//       initialNumToRender={5}
//       maxToRenderPerBatch={5}
//       windowSize={5}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   listContainer: {},
//   poiItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: SIZES.base * 1.5,
//     paddingHorizontal: SIZES.base,
//     backgroundColor: COLORS.white,
//     borderRadius: SIZES.radius,
//     marginBottom: SIZES.base,
//     elevation: 1,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2
//   },
//   poiIcon: {
//     marginRight: SIZES.base * 1.5,
//     backgroundColor: COLORS.lightGray,
//     padding: SIZES.base,
//     borderRadius: 50
//   },
//   poiInfo: {
//     flex: 1,
//     marginRight: SIZES.base
//   },
//   poiName: {
//     ...FONTS.body3,
//     color: COLORS.black,
//     fontWeight: '600',
//     marginBottom: 2
//   },
//   poiType: {
//     ...FONTS.body4,
//     color: COLORS.gray
//   },
//   poiDistance: {
//     ...FONTS.body4,
//     color: COLORS.primary,
//     fontWeight: '600'
//   },
//   loadingContainer: {
//     padding: SIZES.padding,
//     alignItems: 'center'
//   },
//   loadingText: {
//     ...FONTS.body4,
//     color: COLORS.gray
//   },
//   emptyContainer: {
//     padding: SIZES.padding,
//     alignItems: 'center'
//   },
//   emptyText: {
//     ...FONTS.body4,
//     color: COLORS.gray
//   }
// })
//  export default PoiList;


import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getCoordinates } from '../services/getCoordinates';
import { fetchNearbyPOIs } from '../services/fetchNearbyPOIs';
import { getPOIType, calculateDistance, getIconName } from '../services/poiUtilis';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, FONTS } from '../constants/Theme';
import { cacheData, getCachedData } from '../services/cacheManager';

const PoiList = ({ post }) => {
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const cacheKey = `pois_${post.id || post.location}`;

        // 1. Essayer le cache
        const cached = await getCachedData(cacheKey);
        // console.log('cache trouver',cached)
        if (cached) {
          setPois(cached);
          return;
        }

        // 2. Récupérer les coordonnées
        const coords = await getCoordinates(post.location);
        if (!coords) throw new Error('Coordonnées non disponibles');

        // 3. Récupérer les POIs
        const rawData = await fetchNearbyPOIs(coords.lat, coords.lon);
        const formatted = rawData
        .map(poi => {
            const rawDistance = calculateDistance(coords, poi); // nombre
            return {
            ...poi,
            distance: rawDistance,         // en mètres (number)
            distanceLabel: rawDistance + ' m' // pour affichage
            };
        })
        .sort((a, b) => a.distance - b.distance); // tri du plus proche au plus loin


        // 4. Mettre en cache et afficher
        await cacheData(cacheKey, formatted);
        setPois(formatted);
      } catch (err) {
        setError(err.message);
        console.error('Erreur chargement POIs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [post]);

//   const renderItem = ({ item }) => (
//     <View style={styles.poiItem}>
//       <Icon 
//         name={getIconName(getPOIType(item.tags))} 
//         size={SIZES.h3} 
//         color={COLORS.primary} 
//         style={styles.poiIcon}
//       />
//       <View style={styles.poiInfo}>
//         <Text style={styles.poiName} numberOfLines={1}>
//           {item.tags?.name || 'Lieu sans nom'}
//         </Text>
//         <Text style={styles.poiType}>
//           {getPOIType(item.tags)}
//         </Text>
//       </View>
//       <Text >mettre</Text>
//       <Text style={styles.poiDistance}>
//  Mettre{item.distance}
//       </Text>
//     </View>
//   );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement des points d'intérêt...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erreur : {error}</Text>
        <Text style={styles.retryText} onPress={() => setError(null)}>
          Réessayer
        </Text>
      </View>
    );
  }

  const displayedPois = showAll ? pois : pois.slice(0, 5);

  return (
    <View style={{ paddingHorizontal: SIZES.padding }}>
      <Text style={{ ...FONTS.h3, color: COLORS.primary, marginBottom: SIZES.base }}>
        Propriété située à proximité de :
      </Text>

      
  <View>
    {displayedPois.map((item) => (
      <View key={item.id} style={styles.poiItem}>
        <Icon 
          name={getIconName(getPOIType(item.tags))} 
          size={SIZES.h3} 
          color={COLORS.primary} 
          style={styles.poiIcon}
        />
        <View style={styles.poiInfo}>
          <Text style={styles.poiName} numberOfLines={1}>
            {item.tags?.name || 'Lieu sans nom'}
          </Text>
          <Text style={styles.poiType}>
            {getPOIType(item.tags)}
          </Text>
        </View>
        <Text style={styles.poiDistance}>
          {item.distance} m
        </Text>
      </View>
    ))}
    {pois.length > 5 && (
      <TouchableOpacity onPress={() => setShowAll(!showAll)}>
        <Text style={{ ...FONTS.body3, color: COLORS.primary, textAlign: 'center' }}>
          {showAll ? 'Voir moins' : 'Voir plus'}
        </Text>
      </TouchableOpacity>
    )}
  </View>



      {/* {pois.length > 5 && (
        <TouchableOpacity onPress={() => setShowAll(!showAll)} style={{ alignItems: 'center', marginTop: SIZES.base }}>
          <Text style={{ ...FONTS.body3, color: COLORS.primary }}>
            {showAll ? 'Voir moins' : 'Voir plus'}
          </Text>
        </TouchableOpacity>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {},
  poiItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.base * 1.5,
    paddingHorizontal: SIZES.base,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.base,
    elevation: 1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  poiIcon: {
    marginRight: SIZES.base * 1.5,
    backgroundColor: COLORS.lightGray,
    padding: SIZES.base,
    borderRadius: 50
  },
  poiInfo: {
    flex: 1,
    marginRight: SIZES.base
  },
  poiName: {
    ...FONTS.body3,
    color: COLORS.black,
    fontWeight: '600',
    marginBottom: 2
  },
  poiType: {
    ...FONTS.body4,
    color: COLORS.gray
  },
  poiDistance: {
    ...FONTS.body4,
    color: COLORS.primary,
    fontWeight: '600'
  },
  loadingContainer: {
    padding: SIZES.padding,
    alignItems: 'center'
  },
  loadingText: {
    ...FONTS.body4,
    color: COLORS.gray
  },
  emptyContainer: {
    padding: SIZES.padding,
    alignItems: 'center'
  },
  emptyText: {
    ...FONTS.body4,
    color: COLORS.gray
  },
  errorContainer: {
    padding: SIZES.padding,
    alignItems: 'center'
  },
  errorText: {
    ...FONTS.body4,
    color: 'red'
  },
  retryText: {
    ...FONTS.body4,
    color: COLORS.primary,
    marginTop: 4,
    textDecorationLine: 'underline'
  }
});

export default PoiList;
