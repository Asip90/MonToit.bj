// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   SafeAreaView,
//   StatusBar
// } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import { MaterialIcons } from '@expo/vector-icons';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { db } from '../../src/api/FirebaseConfig';

// const CategoryResultsScreen = ({ navigation }) => {
//   const route = useRoute();
//   const { categoryId } = route.params;
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPostsByCategory = async () => {
//       try {
//         const postsRef = collection(db, 'posts');
//         const q = query(postsRef, where('category', '==', categoryId));
//         const querySnapshot = await getDocs(q);
        
//         const postsData = [];
//         querySnapshot.forEach((doc) => {
//           postsData.push({ id: doc.id, ...doc.data() });
//         });
        
//         setPosts(postsData);
//       } catch (error) {
//         console.error("Error fetching posts:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPostsByCategory();
//   }, [categoryId]);

//   const handlePostPress = (postId) => {
//     navigation.navigate('PostDetail', { postId });
//   };

//   const renderPostItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.postItem}
//       onPress={() => handlePostPress(item.id)}
//     >
//       <Image 
//         source={{ uri: item.imageUrls?.[0] || 'https://via.placeholder.com/300' }} 
//         style={styles.postImage} 
//       />
//       <View style={styles.postDetails}>
//         <Text style={styles.postPrice}>{item.price}</Text>
//         <Text style={styles.postTitle} numberOfLines={1}>{item.title}</Text>
//         <View style={styles.postLocation}>
//           <MaterialIcons name="location-on" size={14} color="#666" />
//           <Text style={styles.postLocationText}>
//             {typeof item.location === 'string' ? item.location : item.location?.display_name}
//           </Text>
//         </View>
//         <View style={styles.postFeatures}>
//           {item.features?.slice(0, 3).map((feature, index) => (
//             <View key={index} style={styles.feature}>
//               <MaterialIcons name={feature.icon} size={14} color="#2bb673" />
//               <Text style={styles.featureText}>{feature.value}</Text>
//             </View>
//           ))}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const getCategoryName = () => {
//     const categories = {
//       'chambre': 'Chambres Simples',
//       'studio': 'Studios',
//       'appartement': 'Appartements',
//       'maison': 'Maisons',
//       'terrain': 'Terrains',
//       'commercial': 'Locaux Commerciaux'
//     };
//     return categories[categoryId] || categoryId;
//   };

//   // if (loading) {
//   //   return (
//   //     <View style={styles.loadingContainer}>
//   //       <ActivityIndicator size="large" color="#2bb673" />
//   //     </View>
//   //   );
//   // }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar backgroundColor="#2bb673" barStyle="light-content" />
      
//       <View style={styles.header}>
//         <TouchableOpacity 
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <MaterialIcons name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>{getCategoryName()}</Text>
//       </View>
//       {
//         loading && ( <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#2bb673" />
//       </View>)
//       }
//       {
//         posts.length > 0 && (
//           <Text style={styles.headerTitle}>Résultats ({posts.length})</Text>
//         )
//       }
//       <FlatList
//         data={posts}
//         renderItem={renderPostItem}
//         keyExtractor={item => item.id}
//         contentContainerStyle={styles.contentContainer}
        
//         ListEmptyComponent={
//           !loading ? (
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyText}>Aucune annonce dans cette catégorie</Text>
//             </View>
//           ) : null
//         }
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   header: {
//     backgroundColor: '#2bb673',
//     padding: 15,
//     flexDirection: 'row',
//     alignItems: 'center',
//     elevation: 3,
//   },
//   backButton: {
//     marginRight: 15,
//   },
//   headerTitle: {
//     color: 'white',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   contentContainer: {
//     padding: 15,
//   },
//   postItem: {
//     backgroundColor: 'white',
//     marginBottom: 15,
//     borderRadius: 8,
//     overflow: 'hidden',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   postImage: {
//     width: '100%',
//     height: 180,
//   },
//   postDetails: {
//     padding: 15,
//   },
//   postPrice: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#2bb673',
//     marginBottom: 5,
//   },
//   postTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 5,
//   },
//   postLocation: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   postLocationText: {
//     fontSize: 13,
//     color: '#666',
//     marginLeft: 5,
//   },
//   postFeatures: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   feature: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 15,
//     marginBottom: 5,
//   },
//   featureText: {
//     fontSize: 12,
//     color: '#666',
//     marginLeft: 3,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//   },
// });

// export default CategoryResultsScreen;
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../src/api/FirebaseConfig';
import { COLORS } from '../../constants/Theme';

const CategoryResultsScreen = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  // console.log(route.params)
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      const postsRef = collection(db, 'posts');
      const q = query(
        postsRef, 
        where('propertyType', '==', categoryId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const postsData = [];
      querySnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() });
      });
      
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching category posts:", error);
      Alert.alert('Erreur', 'Impossible de charger les annonces de cette catégorie');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, [categoryId]);

  const renderPostItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.postItem}
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
    >
      <Image 
        source={{ uri: item.imageUrls?.[0] || 'https://via.placeholder.com/300' }} 
        style={styles.postImage} 
      />
      <View style={styles.postDetails}>
        <Text style={styles.postPrice}>{item.price} FCFA</Text>
        <Text style={styles.postTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.postLocation}>
          <MaterialIcons name="location-on" size={14} color={COLORS.gray} />
          <Text style={styles.postLocationText}>
            {typeof item.location === 'string' ? item.location : item.location?.display_name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categorie {categoryId}</Text>
      </View>

      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.contentContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune annonce dans cette catégorie</Text>
            <TouchableOpacity onPress={fetchPosts} style={styles.refreshButton}>
              <MaterialIcons name="refresh" size={24} color={COLORS.primary} />
              <Text style={styles.refreshText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    // backgroundColor: COLORS.primary,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  contentContainer: {
    padding: 15,
  },
  postItem: {
    backgroundColor: COLORS.white,
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  postImage: {
    width: '100%',
    height: 180,
  },
  postDetails: {
    padding: 15,
  },
  postPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: COLORS.text,
  },
  postLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postLocationText: {
    fontSize: 13,
    color: COLORS.gray,
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 10,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  refreshText: {
    color: COLORS.primary,
    marginLeft: 5,
    fontWeight: '500',
  },
});

export default CategoryResultsScreen;