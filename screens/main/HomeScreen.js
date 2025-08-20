

// import React, { useRef, useState, useEffect, useCallback } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   Animated, 
//   SafeAreaView, 
//   TouchableOpacity, 
//   TextInput, 
//   Platform, 
//   FlatList,
//   StatusBar,
//   Image,
//   RefreshControl,
//   ActivityIndicator
// } from 'react-native';
// import { Ionicons, MaterialIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
// import { db } from '../../src/api/FirebaseConfig';
// import { COLORS } from '../../constants/Theme';
// // Palette Zameen
// // const COLORS = {
// //   primary: '#2DCC70',       // Vert Zameen principal
// //   primaryDark: '#27AE60',   // Vert plus foncé
// //   white: '#FFFFFF',
// //   text: '#2C3E50',         // Texte principal
// //   gray: '#95A5A6',         // Texte secondaire
// //   lightGray: '#ECF0F1',    // Arrière-plan des inputs
// //   border: '#BDC3C7',       // Bordures
// //   error: '#E74C3C',        // Pour les erreurs
// // };

// // Constantes pour l'animation
// const HEADER_MAX_HEIGHT = 200;
// const HEADER_MIN_HEIGHT = 60;
// const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// const CATEGORIES = [
//   { id: 'chambre', name: 'Chambre Simple', icon: 'single-bed' },
//   { id: 'studio', name: 'Studio', icon: 'apartment' },
//   { id: 'appartement', name: 'Appartement', icon: 'meeting-room' },
//   { id: 'maison', name: 'Maison', icon: 'home-work' },
//   { id: 'terrain', name: 'Terrain', icon: 'map' },
//   { id: 'commercial', name: 'Commercial', icon: 'store' },
// ];

// const HomeScreen = () => {
//   const navigation = useNavigation();
//   const insets = useSafeAreaInsets();
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   // Fonction de rafraîchissement
//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchPosts().then(() => setRefreshing(false));
//   }, []);

//   // Récupérer les posts depuis Firebase
//   const fetchPosts = async () => {
//     try {
//       const postsRef = collection(db, 'posts');
//       const q = query(postsRef, orderBy('createdAt', 'desc'), limit(10));
//       const querySnapshot = await getDocs(q);
      
//       const postsData = [];
//       querySnapshot.forEach((doc) => {
//         postsData.push({ id: doc.id, ...doc.data() });
//       });
      
//       setPosts(postsData);
//       // console.log("Posts fetched successfully:", postsData);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//       Alert.alert('Erreur', 'Impossible de charger les annonces');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   // Animations
//   const headerHeight = scrollY.interpolate({
//     inputRange: [0, HEADER_SCROLL_DISTANCE],
//     outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
//     extrapolate: 'clamp',
//   });

//   const searchTranslateY = scrollY.interpolate({
//     inputRange: [0, HEADER_SCROLL_DISTANCE],
//     outputRange: [0, -50],
//     extrapolate: 'clamp',
//   });

//   const searchOpacity = scrollY.interpolate({
//     inputRange: [0, HEADER_SCROLL_DISTANCE / 1.5],
//     outputRange: [1, 0],
//     extrapolate: 'clamp',
//   });

//   const titleOpacity = scrollY.interpolate({
//     inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
//     outputRange: [0, 0, 1],
//     extrapolate: 'clamp',
//   });

//   const handleCategoryPress = (categoryId) => {
//     const categoryName = CATEGORIES.find(c => c.id === categoryId)?.name || 'Catégorie';
//     navigation.navigate('CategoryResults', { categoryId ,
//     categoryName});
//   };

//   const handlePostPress = (postId) => {
//     navigation.navigate('PostDetail', { postId });
//   };

//   const renderCategoryItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.categoryCard}
//       onPress={() => handleCategoryPress(item.id)}
//     >
//       <View style={styles.categoryIcon}>
//         <MaterialIcons name={item.icon} size={24} color={COLORS.primary} />
//       </View>
//       <Text style={styles.categoryName}>{item.name}</Text>
//     </TouchableOpacity>
//   );

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
//         <Text style={styles.postPrice}>{item.price} FCFA</Text>
//         <Text style={styles.postTitle} numberOfLines={1}>{item.title}</Text>
//         <View style={styles.postLocation}>
//           <MaterialIcons name="location-on" size={14} color={COLORS.gray} />
//           <Text style={styles.postLocationText}>
//             {typeof item.location === 'string' ? item.location : item.location?.display_name}
//           </Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
//   const openSearchScren = () => {
//     navigation.navigate('SearchScreen', {
//       searchQuery: '',
//       type: 'all',
//     });
//   };
//   return (
//     <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
//       <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
//       {/* Header animé */}
//       <Animated.View style={[styles.header, { height: headerHeight }]}>
//         {/* Top bar - toujours visible */}
//         <View style={styles.topBar}>
//           <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
//             <Ionicons name="menu" size={26} color="white" />
//           </TouchableOpacity>
          
//           <Animated.View style={{ opacity: titleOpacity }}>
//             <Text style={styles.appTitle}>MonToit.bj</Text>
//           </Animated.View>
          
//           <View style={styles.actions}>
//             <TouchableOpacity style={styles.actionButton}>
//               <MaterialIcons name="location-pin" size={22} color="white" />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.actionButton}>
//               <Ionicons name="notifications-outline" size={22} color="white" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Search section - se replie */}
//         <Animated.View style={[
//           styles.searchSection,
//           { 
//             opacity: searchOpacity,
//             transform: [{ translateY: searchTranslateY }] 
//           }
//         ]}>
//           <TouchableOpacity onPress={openSearchScren} style={styles.searchContainer}>
//             <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
            
//             <Text style={{color:COLORS.gray}}> Rechercher un logement...</Text>
//             <TouchableOpacity style={styles.filterButton}>
//               <MaterialIcons name="tune" size={20} color="white" />
//             </TouchableOpacity>
//           </TouchableOpacity>

//           <View style={styles.tabs}>
//             <TouchableOpacity style={[styles.tab, styles.activeTab]}>
//               <Text style={[styles.tabText, styles.activeTabText]}>Acheter</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.tab}>
//               <Text style={styles.tabText}>Louer</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.tab}>
//               <Text style={styles.tabText}>Commercial</Text>
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </Animated.View>

//       {/* Contenu principal */}
//       {loading && !refreshing ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={COLORS.primary} />
//         </View>
//       ) : (
//         <Animated.FlatList
//           data={posts}
//           renderItem={renderPostItem}
//           keyExtractor={item => item.id}
//           contentContainerStyle={[styles.contentContainer, { paddingTop: HEADER_MAX_HEIGHT + 20 }]}
//           scrollEventThrottle={16}
//           onScroll={Animated.event(
//             [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//             { useNativeDriver: false }
//           )}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={[COLORS.primary]}
//               tintColor={COLORS.primary}
//             />
//           }
//           ListHeaderComponent={
//             <>
//               {/* Section Catégories */}
//               <View style={styles.section}>
//                 <Text style={styles.sectionTitle}>Catégories</Text>
//                 <FlatList
//                   horizontal
//                   data={CATEGORIES}
//                   renderItem={renderCategoryItem}
//                   keyExtractor={item => item.id}
//                   showsHorizontalScrollIndicator={false}
//                   contentContainerStyle={styles.categoriesContainer}
//                 />
//               </View>

//               {/* Dernières annonces */}
//               <Text style={styles.sectionTitle}>Dernières annonces</Text>
//             </>
//           }
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyText}>Aucune annonce disponible</Text>
//               <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
//                 <Ionicons name="refresh" size={24} color={COLORS.primary} />
//                 <Text style={styles.refreshText}>Rafraîchir</Text>
//               </TouchableOpacity>
//             </View>
//           }
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   header: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: COLORS.primary,
//     zIndex: 10,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   topBar: {
//     height: HEADER_MIN_HEIGHT,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 15,
//     paddingTop: Platform.OS === 'android' ? 10 : 0,
//   },
//   appTitle: {
//     color: COLORS.white,
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
//   menuButton: {
//     padding: 5,
//     zIndex:30 ,
//   },
//   actions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   actionButton: {
//     padding: 5,
//     marginLeft: 15,
//   },
//   searchSection: {
//     paddingHorizontal: 15,
//     paddingBottom: 15,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: COLORS.white,
//     borderRadius: 8,
//     height: 48,
//     paddingHorizontal: 10,
//     marginBottom: 12,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 14,
//     color: COLORS.text,
//     paddingVertical: 0,
//   },
//   filterButton: {
//     backgroundColor: COLORS.primary,
//     borderRadius: 4,
//     padding: 5,
//     marginLeft: 10,
//   },
//   tabs: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   tab: {
//     flex: 1,
//     alignItems: 'center',
//     paddingVertical: 8,
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: COLORS.white,
//   },
//   tabText: {
//     color: 'rgba(255,255,255,0.8)',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   activeTabText: {
//     color: COLORS.white,
//     fontWeight: '600',
//   },
//   contentContainer: {
//     paddingBottom: 20,
//   },
//   section: {
//     backgroundColor: COLORS.white,
//     paddingVertical: 15,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     paddingHorizontal: 15,
//     marginBottom: 10,
//     color: COLORS.text,
//   },
//   categoriesContainer: {
//     paddingLeft: 15,
//   },
//   categoryCard: {
//     width: 100,
//     marginRight: 15,
//     alignItems: 'center',
//   },
//   categoryIcon: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#f0faf5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   categoryName: {
//     fontSize: 14,
//     textAlign: 'center',
//     color: COLORS.text,
//   },
//   postItem: {
//     backgroundColor: COLORS.white,
//     marginHorizontal: 15,
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
//     color: COLORS.primary,
//     marginBottom: 5,
//   },
//   postTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 5,
//     color: COLORS.text,
//   },
//   postLocation: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   postLocationText: {
//     fontSize: 13,
//     color: COLORS.gray,
//     marginLeft: 5,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: HEADER_MAX_HEIGHT,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: COLORS.gray,
//     marginBottom: 10,
//   },
//   refreshButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   refreshText: {
//     color: COLORS.primary,
//     marginLeft: 5,
//     fontWeight: '500',
//   },
// });

// export default HomeScreen;

// import React, { useRef, useState, useEffect, useCallback } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   Animated, 
//   SafeAreaView, 
//   TouchableOpacity, 
//   FlatList,
//   StatusBar,
//   Image,
//   ImageBackground,
//   RefreshControl,
//   ActivityIndicator,
//   Dimensions
// } from 'react-native';
// import { Ionicons, MaterialIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
// import { db } from '../../src/api/FirebaseConfig';
// import { COLORS } from '../../constants/Theme';
// import BoostedListings from '../../components/BoostedList';
// import ZameenHeader from '../../components/ZameenHeader';
// import CategoriesScreen from '../../components/CategoriesScreen';

// const { width } = Dimensions.get('window');
// const HEADER_MAX_HEIGHT = 200;
// const HEADER_MIN_HEIGHT = 60;
// const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// // Catégories améliorées avec images
// // const CATEGORIES = [
// //   { id: 'chambre', name: 'Chambre', icon: 'single-bed', image: require('../../assets/images/chambres.jpg') },
// //   { id: 'studio', name: 'Studio', icon: 'apartment', image: require('../../assets/images/studio.jpeg') },
// //   { id: 'commercial', name: 'Commercial', icon: 'store', image: require('../../assets/images/commercial.jpeg') },
// //   { id: 'appartement', name: 'Appartement', icon: 'meeting-room', image: require('../../assets/images/appartement.jpg') },
// //   { id: 'maison', name: 'Maison', icon: 'home-work', image: require('../../assets/images/maison.jpg') },
// //   { id: 'terrain', name: 'Terrain', icon: 'map', image: require('../../assets/images/terrain.jpeg') },

// // ];

// const HomeScreen = () => {
//   const navigation = useNavigation();
//   const insets = useSafeAreaInsets();
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [lastVisible, setLastVisible] = useState(null);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [activeFilter, setActiveFilter] = useState('all');

//   // Filtres pour remplacer les tabs
//   const FILTERS = [
//     { id: 'all', name: 'Tout voir' },
//     { id: 'recent', name: 'Plus récents' },
//     { id: 'affordable', name: 'Moins chers' },
//     { id: 'premium', name: 'Premium' },
//   ];

//   // Charger les premières annonces
//   const fetchPosts = useCallback(async (filter = 'all') => {
//     try {
//       setLoading(true);
//       let q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(10));
      
//       // Ajouter des filtres selon la sélection
//       if (filter === 'affordable') {
//         q = query(collection(db, 'posts'), orderBy('price'), limit(10));
//       } else if (filter === 'premium') {
//         q = query(collection(db, 'posts'), orderBy('price', 'desc'), limit(10));
//       }

//       const querySnapshot = await getDocs(q);
//       const postsData = [];
      
//       querySnapshot.forEach((doc) => {
//         postsData.push({ id: doc.id, ...doc.data() });
//       });
      
//       setPosts(postsData);
//       setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
//     } catch (error) {
//       console.error("Error fetching posts:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Charger plus d'annonces pour le scroll infini
//   const loadMorePosts = useCallback(async () => {
//     if (!lastVisible || loadingMore) return;
    
//     setLoadingMore(true);
//     try {
//       let q = query(
//         collection(db, 'posts'), 
//         orderBy('createdAt', 'desc'),
//         startAfter(lastVisible),
//         limit(5)
//       );

//       if (activeFilter === 'affordable') {
//         q = query(
//           collection(db, 'posts'), 
//           orderBy('price'),
//           startAfter(lastVisible),
//           limit(5)
//         );
//       } else if (activeFilter === 'premium') {
//         q = query(
//           collection(db, 'posts'), 
//           orderBy('price', 'desc'),
//           startAfter(lastVisible),
//           limit(5)
//         );
//       }

//       const nextSnapshot = await getDocs(q);
//       const newPosts = [];
      
//       nextSnapshot.forEach((doc) => {
//         newPosts.push({ id: doc.id, ...doc.data() });
//       });

//       if (newPosts.length > 0) {
//         setPosts(prev => [...prev, ...newPosts]);
//         setLastVisible(nextSnapshot.docs[nextSnapshot.docs.length - 1]);
//       }
//     } catch (error) {
//       console.error("Error loading more posts:", error);
//     } finally {
//       setLoadingMore(false);
//     }
//   }, [lastVisible, loadingMore, activeFilter]);

//   // Rafraîchir les annonces
//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchPosts(activeFilter).then(() => setRefreshing(false));
//   }, [fetchPosts, activeFilter]);

//   useEffect(() => {
//     fetchPosts();
//   }, [fetchPosts]);

//   // Animations
//   const headerHeight = scrollY.interpolate({
//     inputRange: [0, HEADER_SCROLL_DISTANCE],
//     outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
//     extrapolate: 'clamp',
//   });

//   const searchTranslateY = scrollY.interpolate({
//     inputRange: [0, HEADER_SCROLL_DISTANCE],
//     outputRange: [0, -50],
//     extrapolate: 'clamp',
//   });

//   const searchOpacity = scrollY.interpolate({
//     inputRange: [0, HEADER_SCROLL_DISTANCE / 1.5],
//     outputRange: [1, 0],
//     extrapolate: 'clamp',
//   });

//   const titleOpacity = scrollY.interpolate({
//     inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
//     outputRange: [0, 0, 1],
//     extrapolate: 'clamp',
//   });

//   const handleCategoryPress = (categoryId) => {
//     navigation.navigate('CategoryResults', { 
//       categoryId,
//       categoryName: CATEGORIES.find(c => c.id === categoryId)?.name || 'Catégorie'
//     });
//   };

//   const handlePostPress = (postId) => {
//     navigation.navigate('PostDetail', { postId });
//   };

//   const handleFilterPress = (filterId) => {
//     setActiveFilter(filterId);
//     fetchPosts(filterId);
//   };

//   const openSearchScreen = () => {
//     navigation.navigate('SearchScreen', {
//       searchQuery: '',
//       type: 'all',
//     });
//   };

//   // const renderCategoryItem = ({ item }) => (
//   //   <TouchableOpacity 
//   //     style={styles.categoryCard}
//   //     onPress={() => handleCategoryPress(item.id)}
//   //   >
//   //     {/* <Image source={item.image} style={styles.categoryImage} /> */}
//   //     <View style={styles.categoryOverlay} />
//   //     <Text style={styles.categoryName}>{item.name}</Text>
//   //   </TouchableOpacity>
//   // );
// //  console.log("Posts:", posts);
//   const renderPostItem = ({ item }) => {
//     const isNew = () => {
    
    
//     if (!item.createdAt || !item.createdAt.seconds) return false;

//     const postDate = new Date(item.createdAt.seconds * 1000); // conversion en millisecondes
//     const currentDate = new Date();
//     const diffTime = currentDate - postDate;
//     const diffDays = diffTime / (1000 * 60 * 60 * 24);
//     return diffDays < 3; // Considérer comme nouveau si moins de 3 jours
//   };
//     return (
//     <TouchableOpacity 
//       style={styles.postItem}
//       onPress={() => handlePostPress(item.id)}
//     >
//       <Image 
//         source={{ uri: item.imageUrls?.[0] || 'https://via.placeholder.com/300' }} 
//         style={styles.postImage} 
//       />
//       <View style={styles.postDetails}>
//         <View>
//           <Text style={styles.postPrice}>{item.price.toLocaleString()} FCFA</Text>
//         <Text style={styles.postTitle} numberOfLines={1}>{item.title}</Text>
//         <View style={styles.postLocation}>
//           <MaterialIcons name="location-on" size={14} color={COLORS.gray} />
//           <Text style={styles.postLocationText}>
//             {typeof item.location === 'string' ? item.location : item.location?.display_name}
//           </Text>
          
//         </View>
//         </View> 
        
//         <View>
//            {isNew() ? (
//         <View style={styles.newBadge}>
//           <Text style={styles.newBadgeText}>Nouveau</Text>
//         </View>
//       ) : 
//       null 
//     } 
//         </View>
//       </View>
//     </TouchableOpacity>
//   )}
   
    
//   // );

//   const renderFilterItem = ({ item }) => (
//     <TouchableOpacity
//       style={[
//         styles.filterButton,
//         activeFilter === item.id && styles.activeFilterButton
//       ]}
//       onPress={() => handleFilterPress(item.id)}
//     >
//       <Text style={[
//         styles.filterText,
//         activeFilter === item.id && styles.activeFilterText
//       ]}>
//         {item.name}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
    
//     <SafeAreaView  style={[styles.safeArea, { paddingTop: insets.top , flex : 1}]}>
//       <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
     
//       {/* Header animé */}
//       {/* <Animated.View style={[styles.header, { height: headerHeight }]}> */}
       
//       <Animated.View style={[styles.header, { height: headerHeight }]}>
//         {/* Top bar - toujours visible */}
//          {/* <ImageBackground
//           source={require('../../assets/images/city-banner.jpeg')}
//           style={styles.headerBackground}
//           imageStyle={{ opacity: 0.9 }}
//         > */}
//         <View style={styles.topBar}>
//           <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
//             <Ionicons name="menu" size={26} color="white" />
//           </TouchableOpacity>
          
//           <Animated.View style={{ opacity: titleOpacity }}>
//             <Text style={styles.appTitle}>MonToit.bj</Text>
//           </Animated.View>
          
//           <View style={styles.actions}>
//             {/* <TouchableOpacity 
//               style={styles.actionButton}
//               onPress={() => navigation.navigate('LocationPicker')}
//             >
//               <MaterialIcons name="location-pin" size={22} color="white" />
//             </TouchableOpacity> */}
//             <TouchableOpacity 
//               style={styles.actionButton}
//               onPress={() => navigation.navigate('Notifications')}
//             >
//               <Ionicons name="notifications-outline" size={22} color="white" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Search section - se replie */}
//         <Animated.View style={[
//           styles.searchSection,
//           { 
//             opacity: searchOpacity,
//             transform: [{ translateY: searchTranslateY }] 
//           }
//         ]}>
//           <TouchableOpacity onPress={openSearchScreen} style={styles.searchContainer}>
//             <Ionicons name="search" size={20} color={COLORS.primary} style={styles.searchIcon} />
//             <Text style={{color: COLORS.gray}}>Rechercher un logement...</Text>
//             <TouchableOpacity 
//               style={styles.filterButton} onPress={openSearchScreen}
//               // onPress={() => navigation.navigate('AdvancedSearch')}
//             >
//               <MaterialIcons name="tune" size={20} color={COLORS.primary} />
//             </TouchableOpacity>
//           </TouchableOpacity>
//            <></>
//            <FlatList
//                 horizontal
//                 data={FILTERS}
//                 renderItem={renderFilterItem}
//                 keyExtractor={item => item.id}
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.filtersContainer}
//               />
//         </Animated.View>
//         {/* </ImageBackground> */}
//       </Animated.View> 

//       {/* Contenu principal */}
//       <View style={{ flex: 1 }}> 
//       {loading && !refreshing ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={COLORS.primary} />
//         </View>
//       ) : (
//         <Animated.FlatList
//           data={posts}
//           style={{ flex: 1 }}  
//           renderItem={renderPostItem}
//           keyExtractor={item => item.id}
//           showsVerticalScrollIndicator={false}

//           contentContainerStyle={[styles.contentContainer, { paddingTop: HEADER_MAX_HEIGHT + 20 }]}
//           scrollEventThrottle={16}
//           onScroll={Animated.event(
//             [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//             { useNativeDriver: false }
//           )}
//           onEndReached={loadMorePosts}
//           onEndReachedThreshold={0.5}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={[COLORS.primary]}
//               tintColor={COLORS.primary}
//             />
//           }
//           ListHeaderComponent={
//             <>
//               {/* Filtres */}
//               {/* <FlatList
//                 horizontal
//                 data={FILTERS}
//                 renderItem={renderFilterItem}
//                 keyExtractor={item => item.id}
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.filtersContainer}
//               /> */}

             
//               {/*Annonces en vedette */}
//               <BoostedListings navigation={navigation}/>

//                {/* Section Catégories */}
//               {/* <View style={styles.section}>
//                 <Text style={styles.sectionTitle}>Explorer par catégorie</Text>
//                 <FlatList
//                   horizontal
//                   data={CATEGORIES}
//                   renderItem={renderCategoryItem}
//                   keyExtractor={item => item.id}
//                   showsHorizontalScrollIndicator={false}
//                   contentContainerStyle={styles.categoriesContainer}
//                 />
//               </View> */}<CategoriesScreen/>
//               {/* Dernières annonces */}
//               <Text style={styles.sectionTitle}>Dernières annonces</Text>
//             </>
//           }
//           ListFooterComponent={
//             loadingMore ? (
//               <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 20 }} />
//             ) : null
//           }
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyText}>Aucune annonce disponible</Text>
//               <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
//                 <Ionicons name="refresh" size={24} color={COLORS.primary} />
//                 <Text style={styles.refreshText}>Rafraîchir</Text>
//               </TouchableOpacity>
//             </View>
//           }
//         />
//       )}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     // paddingLeft: 10,
//     // paddingRight: ,
//     //  paddingHorizontal: 15,
//     // paddingVertical: 10,
//   },
//   header: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: COLORS.primary,
//     zIndex: 10,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   topBar: {
//     height: HEADER_MIN_HEIGHT,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 15,
//   },
//   appTitle: {
//     color: COLORS.white,
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
//   menuButton: {
//     padding: 5,
//     zIndex: 30,
//   },
//   actions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   actionButton: {
//     padding: 5,
//     marginLeft: 15,
//   },
//   searchSection: {
//     paddingHorizontal: 15,
//     paddingBottom: 15,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: COLORS.white,
//     borderRadius: 8,
//     height: 48,
//     paddingHorizontal: 10,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   searchIcon: {
//     marginRight: 10,
//   },
//   filtersContainer: {
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//   },
//   filterButton: {
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: COLORS.lightGray,
//     marginRight: 10,
//   },
//   activeFilterButton: {
//     backgroundColor: COLORS.primary,
//   },
//   filterText: {
//     color: COLORS.gray,
//     fontSize: 14,
//   },
//   activeFilterText: {
//     color: COLORS.white,
//     fontWeight: '600',
//   },
//   contentContainer: {
//     paddingBottom: 20,
//   },
//   section: {
//     backgroundColor: COLORS.white,
//     paddingVertical: 15,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     paddingHorizontal: 15,
//     marginBottom: 10,
//     color: COLORS.text,
//   },
//   categoriesContainer: {
//     paddingLeft: 15,
//   },
//   categoryCard: {
//     width: 120,
//     height: 120,
//     marginRight: 15,
//     borderRadius: 10,
//     overflow: 'hidden',
//     justifyContent: 'flex-end',
//     position: 'relative',
//   },
//   categoryImage: {
//     width: '100%',
//     height: '100%',
//     position: 'absolute',
//   },
//   categoryOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },
//   categoryName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.white,
//     padding: 10,
//     textShadowColor: 'rgba(0,0,0,0.5)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   postItem: {
//     backgroundColor: COLORS.white,
//     marginHorizontal: 15,
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
//     flexDirection: 'row',
//     justifyContent:'space-between',
//     alignItems: 'flex-end',
//     width: '100%',
//   },
//   newBadge: {
//     backgroundColor: COLORS.gray,
//     padding: 5,
//     borderRadius: 5,
//     marginBottom: 5,
//   },
//   newBadgeText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   postPrice: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: COLORS.primary,
//     marginBottom: 5,
//   },
//   postTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 5,
//     color: COLORS.text,
//   },
//   postLocation: {
//     flexDirection: 'row',
//     alignItems: 'center',
    
//   },
//   postLocationText: {
//     fontSize: 13,
//     color: COLORS.gray,
//     // marginLeft: 5,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: HEADER_MAX_HEIGHT,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     marginTop: HEADER_MAX_HEIGHT,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: COLORS.gray,
//     marginBottom: 10,
//   },
//   refreshButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   refreshText: {
//     color: COLORS.primary,
//     marginLeft: 5,
//     fontWeight: '500',
//   },
// });

// export default HomeScreen;
// HomeScreen.js
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  SafeAreaView, 
  TouchableOpacity, 
  FlatList,
  StatusBar,
  Image,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Button
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../../src/api/FirebaseConfig';
import { COLORS } from '../../constants/Theme';
import BoostedListings from '../../components/BoostedList';
import CategoriesScreen from '../../components/CategoriesScreen';
import * as Linking from 'expo-linking';

const { width, height } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = height * 0.16;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const HomeScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const FILTERS = [
    { id: 'all', name: 'Tout', icon: 'list' },
    { id: 'recent', name: 'Récents', icon: 'time-outline' },
    { id: 'affordable', name: 'Économiques', icon: 'cash-outline' },
    { id: 'premium', name: 'Premium', icon: 'diamond-outline' },
  ];

  const fetchPosts = useCallback(async (filter = 'all') => {
    try {
      setLoading(true);
      let q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(10));
      
      if (filter === 'affordable') {
        q = query(collection(db, 'posts'), orderBy('price'), limit(10));
      } else if (filter === 'premium') {
        q = query(collection(db, 'posts'), orderBy('price', 'desc'), limit(10));
      }

      const querySnapshot = await getDocs(q);
      const postsData = [];
      
      querySnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() });
      });
      
      setPosts(postsData);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMorePosts = useCallback(async () => {
    if (!lastVisible || loadingMore) return;
    
    setLoadingMore(true);
    try {
      let q = query(
        collection(db, 'posts'), 
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(5)
      );

      if (activeFilter === 'affordable') {
        q = query(
          collection(db, 'posts'), 
          orderBy('price'),
          startAfter(lastVisible),
          limit(5)
        );
      } else if (activeFilter === 'premium') {
        q = query(
          collection(db, 'posts'), 
          orderBy('price', 'desc'),
          startAfter(lastVisible),
          limit(5)
        );
      }

      const nextSnapshot = await getDocs(q);
      const newPosts = [];
      
      nextSnapshot.forEach((doc) => {
        newPosts.push({ id: doc.id, ...doc.data() });
      });

      if (newPosts.length > 0) {
        setPosts(prev => [...prev, ...newPosts]);
        setLastVisible(nextSnapshot.docs[nextSnapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [lastVisible, loadingMore, activeFilter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts(activeFilter).then(() => setRefreshing(false));
  }, [fetchPosts, activeFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Animations fluidifiées
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.7, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const searchTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.5],
    outputRange: [0, -HEADER_SCROLL_DISTANCE * 0.4],
    extrapolate: 'clamp',
  });

  const searchOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.7],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const contentTranslateY = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

  // Animation de frappe pour le placeholder
  const searchPlaceholders = [
    'un logement...',
    'une chambre...',
    'une maison...',
    'un terrain...',
    'une boutique...'
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const cursorAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorAnim, { 
          toValue: 0, 
          duration: 300, 
          useNativeDriver: true 
        }),
        Animated.timing(cursorAnim, { 
          toValue: 1, 
          duration: 300, 
          useNativeDriver: true 
        })
      ])
    ).start();
  }, []);

  useEffect(() => {
    const currentWord = searchPlaceholders[currentWordIndex];
    let timeoutId;

    if (isDeleting) {
      if (displayedText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayedText(currentWord.substring(0, displayedText.length - 1));
        }, 70);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % searchPlaceholders.length);
      }
    } else {
      if (displayedText.length < currentWord.length) {
        timeoutId = setTimeout(() => {
          setDisplayedText(currentWord.substring(0, displayedText.length + 1));
        }, 120);
      } else {
        timeoutId = setTimeout(() => setIsDeleting(true), 1200);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [displayedText, isDeleting, currentWordIndex]);

  const handlePostPress = (postId) => {
    navigation.navigate('PostDetail', { postId });
  };

  const handleFilterPress = (filterId) => {
    setActiveFilter(filterId);
    fetchPosts(filterId);
  };

  const openSearchScreen = () => {
    navigation.navigate('SearchScreen', {
      searchQuery: '',
      type: 'all',
    });
  };

  const renderPostItem = ({ item }) => {
    const isNew = () => {
      if (!item.createdAt || !item.createdAt.seconds) return false;
      const postDate = new Date(item.createdAt.seconds * 1000);
      const currentDate = new Date();
      const diffDays = (currentDate - postDate) / (1000 * 60 * 60 * 24);
      return diffDays < 3;
    };
    

    return (
    <View>
      {/* <Button
        title="Ouvrir le deep link"
        onPress={() => Linking.openURL(url).catch(err => console.warn('openURL error', err))}
      /> */}
      <TouchableOpacity 
        style={styles.postItem}
        onPress={() => handlePostPress(item.id)}
      >
        <Image 
          source={{ uri: item.imageUrls?.[0] || 'https://via.placeholder.com/300' }} 
          style={styles.postImage} 
        />
        {isNew() && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>Nouveau</Text>
          </View>
        )}
        
        <View style={styles.postDetails}>
          <View style={styles.priceContainer}>
            <Text style={styles.postPrice}>{item.price?.toLocaleString() || '0'} FCFA</Text>
            <Ionicons name="bookmark-outline" size={20} color={COLORS.gray} />
          </View>
          
          <Text style={styles.postTitle} numberOfLines={1}>{item.title}</Text>
          
          <View style={styles.postLocation}>
            <MaterialIcons name="location-on" size={14} color={COLORS.gray} />
            <Text style={styles.postLocationText} numberOfLines={1}>
              {typeof item.location === 'string' ? item.location : item.location?.display_name}
            </Text>
          </View>
          
          <View style={styles.postMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="bed-outline" size={16} color={COLORS.darkGray} />
              <Text style={styles.metaText}>{item.bedrooms || 'N/A'} ch</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="water-outline" size={16} color={COLORS.darkGray} />
              <Text style={styles.metaText}>{item.bathrooms || 'N/A'} sdb</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="resize-outline" size={16} color={COLORS.darkGray} />
              <Text style={styles.metaText}>{item.size || 'N/A'} m²</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
    );
  };
   

  const renderFilterItem = ({ item }) => (
    
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === item.id && styles.activeFilterButton
      ]}
      onPress={() => handleFilterPress(item.id)}
    >
      <Ionicons 
        name={item.icon} 
        size={18} 
        color={activeFilter === item.id ? COLORS.white : COLORS.primary} 
        style={styles.filterIcon}
      />
      <Text style={[
        styles.filterText,
        activeFilter === item.id && styles.activeFilterText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
     
      <Animated.View style={[
        styles.header, 
        { 
          height: headerHeight,
        }
      ]}>
        <View style={styles.topBar}>
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={() => navigation.openDrawer()}
          >
            <Ionicons name="menu" size={26} color="white" />
          </TouchableOpacity>
          
          <Animated.View style={{ opacity: headerTitleOpacity }}>
            <Text style={styles.appTitle}>MonToit.bj</Text>
          </Animated.View>
          
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={22} color="white" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View style={[
          styles.searchSection,
          { 
            opacity: searchOpacity,
            transform: [{ translateY: searchTranslateY }] 
          }
        ]}>
          <TouchableOpacity 
            onPress={openSearchScreen} 
            style={styles.searchContainer}
            activeOpacity={0.8}
          >
            <View style={styles.searchInput}>
              <Ionicons name="search" size={22} color={COLORS.primary} />
              
              <View style={styles.placeholderContainer}>
                <Text style={styles.searchPlaceholder}>Rechercher </Text>
                <Text style={styles.searchPlaceholderDynamic}>{displayedText}</Text>
                <Animated.View style={{ opacity: cursorAnim }}>
                  <Text style={styles.cursor}>|</Text>
                </Animated.View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.filterButtonIcon}
              onPress={openSearchScreen}
            >
              <MaterialIcons name="tune" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View> 

      <Animated.FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { 
            useNativeDriver: false,
            listener: event => {
              scrollY.setValue(event.nativeEvent.contentOffset.y);
            }
          }
        )}
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
            progressViewOffset={HEADER_MAX_HEIGHT}
          />
        }
        ListHeaderComponent={
          <>
            <Animated.View style={{ transform: [{ translateY: contentTranslateY }] }}>
              <View style={styles.filtersWrapper}>
                <FlatList
                  horizontal
                  data={FILTERS}
                  renderItem={renderFilterItem}
                  keyExtractor={item => item.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filtersContainer}
                />
              </View>

              <BoostedListings navigation={navigation}/>

              <CategoriesScreen navigation={navigation}/>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Dernières annonces</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAll}>Voir tout</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </>
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" color={COLORS.primary} style={styles.loadingMore} />
          ) : (
            <View style={styles.listFooter} />
          )
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Ionicons name="home-outline" size={60} color={COLORS.lightGray} />
              <Text style={styles.emptyText}>Aucune annonce disponible</Text>
              <Text style={styles.emptySubText}>Essayez de modifier vos filtres</Text>
              <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
                <Ionicons name="refresh" size={24} color={COLORS.primary} />
                <Text style={styles.refreshText}>Actualiser</Text>
              </TouchableOpacity>
            </View>
          )
        }
        ListHeaderComponentStyle={{ paddingTop: HEADER_MAX_HEIGHT + 10 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.lightBackground,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    zIndex: 100,
    overflow: 'hidden',
  },
  topBar: {
    height: HEADER_MIN_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: COLORS.primary,
  },
  appTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  menuButton: {
    padding: 6,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    position: 'relative',
    padding: 5,
  },
  notificationBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  searchSection: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    height: 52,
    paddingLeft: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  placeholderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: COLORS.gray,
  },
  searchPlaceholderDynamic: {
    fontSize: 15,
    color: COLORS.darkGray,
    fontWeight: '500',
  },
  cursor: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  filterButtonIcon: {
    backgroundColor: COLORS.secondary,
    height: '100%',
    width: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersWrapper: {
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 5,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    color: COLORS.darkGray,
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.darkText,
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  postItem: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  newBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 12,
  },
  postDetails: {
    padding: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  postPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: COLORS.darkText,
  },
  postLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postLocationText: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 4,
    flex: 1,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: HEADER_MAX_HEIGHT,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: HEADER_MAX_HEIGHT,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginTop: 20,
    marginBottom: 5,
  },
  emptySubText: {
    fontSize: 15,
    color: COLORS.gray,
    marginBottom: 20,
    textAlign: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightPrimary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  refreshText: {
    color: COLORS.primary,
    marginLeft: 8,
    fontWeight: '600',
  },
  loadingMore: {
    marginVertical: 20,
  },
  listFooter: {
    height: 30,
  },
});

export default HomeScreen;