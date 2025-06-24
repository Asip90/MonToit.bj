// import React, { useState, useEffect, useContext } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   FlatList, 
//   Image, 
//   TouchableOpacity, 
//   ActivityIndicator,
//   RefreshControl 
// } from 'react-native';
// import { getFavoritePosts } from '../../services/favorites';
// import { getUserFavoritesIds, getPostsByIds } from '../../services/favorites';
// import { UserContext } from '../../context/AuthContext';
// import { COLORS } from '../../constants/Theme';

// const FavoritesScreen = ({ navigation }) => {
//   const {userData } = useContext(UserContext);
//   const [favorites, setFavorites] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   // const loadFavorites = async () => {
//   //   try {
//   //     // 1. Récupère les IDs
//   //     const postIds = await getUserFavoritesIds(userData.uid);
      
//   //     // 2. Récupère les posts complets
//   //     if (postIds.length > 0) {
//   //       const posts = await getPostsByIds(postIds);
//   //       // Trie par date de favori
//   //       const sorted = postIds
//   //         .map(id => posts.find(p => p.id === id))
//   //         .filter(p => p); // Enlève les undefined si post supprimé
//   //       setFavorites(sorted);
//   //     } else {
//   //       setFavorites([]);
//   //     }
//   //   } catch (error) {
//   //     console.error("Failed to load favorites:", error);
//   //   }
//   // };

//   // Rafraîchir à chaque focus
  
//   const loadFavorites = async () => {
//   try {
//     setLoading(true);  // <-- démarrer le chargement
//     const postIds = await getUserFavoritesIds(userData.uid);
//     if (postIds.length > 0) {
//       const posts = await getPostsByIds(postIds);
//       const sorted = postIds
//         .map(id => posts.find(p => p.id === id))
//         .filter(p => p);
//       setFavorites(sorted);
//     } else {
//       setFavorites([]);
//     }
//   } catch (error) {
//     console.error("Failed to load favorites:", error);
//   } finally {
//     setLoading(false); // <-- arrêter le chargement
//     setRefreshing(false); // aussi arrêter le refresh control si actif
//   }
// };

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', loadFavorites);
//     return unsubscribe;
//   }, [navigation]);

//  const onRefresh = async () => {
//   setRefreshing(true);
//   await loadFavorites();
//   setRefreshing(false);
// };


//   const renderItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.item}
//       onPress={() => navigation.navigate('PostDetail', {
//   postId: item.id,
//   userId: userData.uid
// })}

//     >
//       <Image source={{ uri: item.imageUrls[0] }} style={styles.image} />
//       <View style={styles.details}>
//         <Text style={styles.price}>{item.price} FCFA</Text>
//         <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
//         <Text style={styles.location}>{typeof item.location === 'string' 
//                 ? item.location 
//                 : item.location?.display_name || 'Localisation non disponible'}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={favorites}
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={[COLORS.primary]}
//           />
//         }
//         ListEmptyComponent={
//           <View style={styles.empty}>
//             <Text style={styles.emptyText}>Aucun favori pour le moment</Text>
//             <Text style={styles.emptySubText}>
//               Appuyez sur ♡ pour ajouter des annonces à vos favoris
//             </Text>
//           </View>
//         }
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   item: {
//     flexDirection: 'row',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.lightGray,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     borderRadius: 5,
//   },
//   details: {
//     flex: 1,
//     marginLeft: 15,
//     justifyContent: 'center',
//   },
//   price: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: COLORS.primary,
//   },
//   title: {
//     fontSize: 16,
//     marginVertical: 5,
//     color: COLORS.text,
//   },
//   location: {
//     fontSize: 14,
//     color: COLORS.gray,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   empty: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 18,
//     color: COLORS.text,
//     marginBottom: 10,
//   },
//   emptySubText: {
//     fontSize: 14,
//     color: COLORS.gray,
//     textAlign: 'center',
//   },
// });

// export default FavoritesScreen;
import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  ScrollView
} from 'react-native';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getUserFavoritesIds, getPostsByIds } from '../../services/favorites';
import { UserContext } from '../../context/AuthContext';
import { COLORS, SIZES, FONTS } from '../../constants/Theme';

const FavoritesScreen = ({ navigation }) => {
  const { userData } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      if (!userData?.uid) {
        setFavorites([]);
        return;
      }

      const postIds = await getUserFavoritesIds(userData.uid);
      if (postIds.length > 0) {
        const posts = await getPostsByIds(postIds);
        const sorted = postIds
          .map(id => posts.find(p => p.id === id))
          .filter(p => p)
          .sort((a, b) => b.favoritedAt - a.favoritedAt); // Tri par date de favori
        setFavorites(sorted);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Failed to load favorites:", error);
      Alert.alert("Erreur", "Impossible de charger les favoris");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadFavorites);
    return unsubscribe;
  }, [navigation, userData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.item}
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
    >
      <Image 
        source={{ uri: item.imageUrls?.[0] || 'https://via.placeholder.com/150' }} 
        style={styles.image} 
      />
      <View style={styles.details}>
        <Text style={styles.price}>{item.price ? `${item.price} FCFA` : 'Prix sur demande'}</Text>
        <Text style={styles.title} numberOfLines={2}>{item.title || 'Sans titre'}</Text>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color={COLORS.gray} />
          <Text style={styles.location}>
            {typeof item.location === 'string' 
              ? item.location 
              : item.location?.display_name || 'Localisation non disponible'}
          </Text>
        </View>

        <View style={styles.metaContainer}>
          <Text style={styles.date}>
            Ajouté le {item.favoritedAt?.toDate ? 
              new Date(item.favoritedAt.toDate()).toLocaleDateString() : 
              'Date inconnue'}
          </Text>
          <TouchableOpacity style={styles.heartIcon}>
            <AntDesign name="heart" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!userData) {
    return (
      <View style={styles.authContainer}>
        <Image 
          source={require('../../assets/icon.png')} 
          style={styles.logo}
        />
        <Text style={styles.authText}>Connectez-vous pour voir vos favoris</Text>
        <TouchableOpacity 
          style={styles.authButton}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.authButtonText}>Connexion / Inscription</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Zameen-like */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Favoris</Text>
        <Text style={styles.headerSubtitle}>{favorites.length} {favorites.length === 1 ? 'annonce' : 'annonces'} sauvegardée{favorites.length === 1 ? '' : 's'}</Text>
      </View>

      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <AntDesign name="hearto" size={50} color={COLORS.lightGray} />
          </View>
          <Text style={styles.emptyTitle}>Aucun favori</Text>
          <Text style={styles.emptyText}>
            Appuyez sur l'icône ♡ pour enregistrer des annonces
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseButtonText}>Parcourir les annonces</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Section suggestions comme dans Zameen */}
      {favorites.length === 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.sectionTitle}>Suggestions pour vous</Text>
          <Text style={styles.sectionSubtitle}>Annonces susceptibles de vous intéresser</Text>
          
          <TouchableOpacity style={styles.suggestionItem}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.suggestionImage}
            />
            <View style={styles.suggestionDetails}>
              <Text style={styles.suggestionPrice}>250,000 FCFA</Text>
              <Text style={styles.suggestionTitle}>Appartement moderne à Cocody</Text>
              <Text style={styles.suggestionLocation}>Abidjan, Côte d'Ivoire</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    padding: SIZES.padding,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    ...FONTS.body4,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: SIZES.base / 2,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
    backgroundColor: COLORS.white,
  },
  logo: {
    width: 120,
    height: 50,
    resizeMode: 'contain',
    marginBottom: SIZES.padding,
  },
  authText: {
    ...FONTS.body3,
    marginBottom: SIZES.padding,
    textAlign: 'center',
    color: COLORS.black,
  },
  authButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base * 1.5,
    paddingHorizontal: SIZES.padding * 2,
    borderRadius: SIZES.radius,
    elevation: 2,
  },
  authButtonText: {
    color: COLORS.white,
    ...FONTS.h4,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  item: {
    flexDirection: 'row',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.lightGray,
  },
  details: {
    flex: 1,
    marginLeft: SIZES.padding,
    justifyContent: 'space-between',
  },
  price: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  title: {
    ...FONTS.body3,
    color: COLORS.black,
    marginVertical: SIZES.base / 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  location: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginLeft: SIZES.base / 2,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    ...FONTS.body4,
    color: COLORS.gray,
    fontSize: 12,
  },
  heartIcon: {
    padding: SIZES.base / 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.lightGray + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  emptyTitle: {
    ...FONTS.h3,
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  emptyText: {
    ...FONTS.body4,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SIZES.padding,
    paddingHorizontal: SIZES.padding * 2,
  },
  browseButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base * 1.5,
    paddingHorizontal: SIZES.padding * 2,
    borderRadius: SIZES.radius,
  },
  browseButtonText: {
    color: COLORS.white,
    ...FONTS.h4,
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    padding: SIZES.padding,
    borderTopWidth: 8,
    borderTopColor: COLORS.lightGray,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.black,
    fontWeight: 'bold',
    marginBottom: SIZES.base / 2,
  },
  sectionSubtitle: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: SIZES.padding,
  },
  suggestionItem: {
    flexDirection: 'row',
    marginBottom: SIZES.padding,
  },
  suggestionImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.lightGray,
  },
  suggestionDetails: {
    flex: 1,
    marginLeft: SIZES.padding,
    justifyContent: 'center',
  },
  suggestionPrice: {
    ...FONTS.body3,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  suggestionTitle: {
    ...FONTS.body4,
    color: COLORS.black,
    marginVertical: SIZES.base / 3,
  },
  suggestionLocation: {
    ...FONTS.body4,
    color: COLORS.gray,
    fontSize: 12,
  },
});

export default FavoritesScreen;