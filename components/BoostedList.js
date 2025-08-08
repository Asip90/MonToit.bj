

// // import React, { useState, useEffect, useContext , useRef} from 'react';
// // import { 
// //   View, 
// //   Text, 
// //   StyleSheet, 
// //   FlatList, 
// //   Image, 
// //   TouchableOpacity, 
// //   Dimensions,
// //   ActivityIndicator
// // } from 'react-native';
// // import { MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
// // import { COLORS, SIZES, FONTS } from '../constants/Theme';
// // import { db } from '../src/api/FirebaseConfig';
// // import { collection, query, where, getDocs } from 'firebase/firestore';
// // import { toggleFavorite, isPostFavorite } from '../services/favorites'; // Assurez-vous que isPostFavorite est importé
// // import { UserContext } from '../context/AuthContext';

// // const { width } = Dimensions.get('window');

// // const BoostedListings = ({ navigation }) => {
// //   const [boostedListings, setBoostedListings] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const { userData } = useContext(UserContext);


// //   const flatListRef = useRef(null);
// //   const [autoScrollIndex, setAutoScrollIndex] = useState(0);
// //   const [autoScroll, setAutoScroll] = useState(true);

// //   useEffect(() => {
// //     fetchBoostedListings();
// //   }, []);

// //   // Nouvel effet pour le défilement automatique
// //   useEffect(() => {
// //     if (!autoScroll || boostedListings.length === 0) return;

// //     const interval = setInterval(() => {
// //       setAutoScrollIndex(prevIndex => {
// //         const newIndex = (prevIndex + 1) % boostedListings.length;
        
// //         // Faire défiler à la nouvelle position
// //         flatListRef.current?.scrollToIndex({
// //           index: newIndex,
// //           animated: true,
// //         });

// //         return newIndex;
// //       });
// //     }, 1000); // Changement toutes les 3 secondes

// //     return () => clearInterval(interval);
// //   }, [autoScroll, boostedListings.length]);

// //   useEffect(() => {
// //     fetchBoostedListings();
// //   }, []);

// //   const fetchBoostedListings = async () => {
// //     try {
// //       const listingsRef = collection(db, 'posts');
// //       const q = query(listingsRef, where('isBoosted', '==', true));
// //       const querySnapshot = await getDocs(q);
      
// //       const listingsData = [];
// //       for (const doc of querySnapshot.docs) {
// //         const listing = { id: doc.id, ...doc.data() };
// //         // Vérifier si le post est dans les favoris pour l'utilisateur connecté
// //         if (userData?.uid) {
// //           listing.isFavorite = await isPostFavorite(userData.uid, doc.id);
// //         }
// //         listingsData.push(listing);
// //       }
      
// //       setBoostedListings(listingsData);
// //     } catch (error) {
// //       console.error("Error fetching Boosted listings:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleToggleFavorite = async (postId) => {
// //     try {
// //       if (userData?.uid) {
// //         const result = await toggleFavorite(userData.uid, postId);
        
// //         // Mettre à jour l'état isFavorite pour le post concerné
// //         setBoostedListings(prevListings => 
// //           prevListings.map(item => 
// //             item.id === postId ? { ...item, isFavorite: result } : item
// //           )
// //         );
// //       }
// //     } catch (error) {
// //       console.error("Erreur lors de l'ajout/retrait du favori:", error);
// //     }
// //   };

// //   const renderBoostedItem = ({ item }) => (
// //     <TouchableOpacity 
// //       style={styles.boostedCard}
// //       onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
// //       activeOpacity={0.8}
// //     >
// //       <View style={styles.imageContainer}>
// //         <Image 
// //           source={{ uri: item.imageUrls?.[0] || 'https://via.placeholder.com/300' }} 
// //           style={styles.boostedImage} 
// //         />
// //         <View style={styles.imageOverlay} />
        
// //         <View style={styles.boostedBadge}>
// //           <AntDesign name="star" size={14} color={COLORS.gold} />
// //           <Text style={styles.boostedBadgeText}>sponsorisé</Text>
// //         </View>
        
// //         <TouchableOpacity 
// //           onPress={(e) => {
// //             e.stopPropagation(); // Empêche la navigation lorsqu'on clique sur le cœur
// //             handleToggleFavorite(item.id);
// //           }} 
// //           style={styles.favoriteButton}
// //         >
// //           <AntDesign 
// //             name={item.isFavorite ? "heart" : "hearto"} 
// //             size={20} 
// //             color={item.isFavorite ? COLORS.gold : COLORS.white} 
// //           />
// //         </TouchableOpacity>
// //       </View>
      
// //       {/* Détails de l'annonce */}
// //       <View style={styles.boostedDetails}>
// //         <Text style={styles.boostedPrice}>{item.price} FCFA</Text>
// //         <Text style={styles.boostedTitle} numberOfLines={1}>{item.title}</Text>
        
// //         <View style={styles.featuresContainer}>
// //           {item.bedrooms && (
// //             <View style={styles.featureItem}>
// //               <MaterialIcons name="hotel" size={14} color={COLORS.darkgray} />
// //               <Text style={styles.featureText}>{item.bedrooms}</Text>
// //             </View>
// //           )}
          
// //           {item.bathrooms && (
// //             <View style={styles.featureItem}>
// //               <MaterialIcons name="bathtub" size={14} color={COLORS.darkgray} />
// //               <Text style={styles.featureText}><MaterialIcons name="bathroom" size={24} color={COLORS.primary}/>  {item.bathrooms}</Text>
// //             </View>
// //           )}
          
// //           {item.area && (
// //             <View style={styles.featureItem}>
// //               <MaterialIcons name="straighten" size={14} color={COLORS.darkgray} />
// //               <Text style={styles.featureText}>{item.area}m²</Text>
// //             </View>
// //           )}
// //         </View>
        
// //         <View style={styles.boostedLocation}>
// //           <MaterialIcons name="location-on" size={14} color={COLORS.primary} />
// //           <Text style={styles.boostedLocationText} numberOfLines={1}>
// //             {item.location?.display_name || item.location || 'Localisation non précisée'}
// //           </Text>
// //         </View>
        
// //         {/* Bandeau d'urgence */}
// //         {item.urgent && (
// //           <View style={styles.urgentTag}>
// //             <Text style={styles.urgentText}>OFFRE EXCEPTIONNELLE</Text>
// //           </View>
// //         )}
// //       </View>
// //     </TouchableOpacity>
// //   );

// //   if (loading) {
// //     return (
// //       <View style={styles.loadingContainer}>
// //         <ActivityIndicator size="small" color={COLORS.primary} />
// //       </View>
// //     );
// //   }

// //   if (boostedListings.length === 0) {
// //     return null;
// //   }

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.header}>
// //         <View style={styles.headerTitleContainer}>
// //           <Text style={styles.headerTitle}>Nos sélections exclusives</Text>
// //           <Text style={styles.headerSubtitle}>Des biens d'exception vérifiés</Text>
// //         </View>
// //         <TouchableOpacity style={styles.seeAllButton}>
// //           <Text style={styles.seeAllText}>Tout voir</Text>
// //           <AntDesign name="arrowright" size={16} color={COLORS.primary} />
// //         </TouchableOpacity>
// //       </View>
      
// //      <FlatList
// //         ref={flatListRef}
// //         data={boostedListings}
// //         renderItem={renderBoostedItem}
// //         keyExtractor={item => item.id}
// //         horizontal
// //         showsHorizontalScrollIndicator={false}
// //         contentContainerStyle={styles.listContent}
// //         snapToInterval={width * 0.78 + SIZES.padding}
// //         decelerationRate="fast"
// //         onTouchStart={() => setAutoScroll(false)} // Désactive auto-scroll au touch
// //         onTouchEnd={() => setAutoScroll(true)}    // Réactive après le touch
// //         onScrollToIndexFailed={({ index }) => {
// //           // Fallback en cas d'échec du scrollToIndex
// //           flatListRef.current?.scrollToOffset({
// //             offset: index * (width * 0.78 + SIZES.padding),
// //             animated: true,
// //           });
// //         }}
// //       />
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     // marginTop: SIZES.padding * 1.5,
// //     // marginBottom: SIZES.padding,
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 15,
// //     marginBottom: SIZES.base * 1.5,
// //   },
// //   headerTitleContainer: {
// //     flex: 1,
// //   },
// //   headerTitle: {
// //     ...FONTS.h2,
// //     color: COLORS.black,
// //     fontWeight: 'bold',
// //     marginBottom: 2,
// //   },
// //   headerSubtitle: {
// //     ...FONTS.body4,
// //     color: COLORS.darkgray,
// //   },
// //   seeAllButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   seeAllText: {
// //     ...FONTS.body4,
// //     color: COLORS.primary,
// //     marginRight: 4,
// //     fontWeight: 'bold',
// //   },
// //   loadingContainer: {
// //     height: 260,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   listContent: {
// //     paddingLeft: 15,
// //     paddingRight: SIZES.padding / 2,
// //     marginBottom: SIZES.padding * 1.5,
// //   },
// //   boostedCard: {
// //     width: width * 0.78,
// //     backgroundColor: COLORS.white,
// //     borderRadius: 12,
// //     marginRight: SIZES.padding,
// //     overflow: 'hidden',
// //     elevation: 5,
// //     shadowColor: COLORS.black,
// //     shadowOffset: { width: 0, height: 3 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 6,
// //     borderWidth: 1,
// //     borderColor: COLORS.lightGray2,
// //     // height: 350,
// //   },
// //   imageContainer: {
// //     height: 200,
// //     width: '100%',
// //     position: 'relative',
// //   },
// //   boostedImage: {
// //     width: '100%',
// //     height: '100%',
// //     resizeMode: 'cover',
// //   },
// //   // imageOverlay: {
// //   //   position: 'absolute',
// //   //   bottom: 0,
// //   //   left: 0,
// //   //   right: 0,
// //   //   height: '40%',
// //   //   backgroundColor: 'rgba(0,0,0,0.3)',
// //   // },
// //   boostedBadge: {
// //     position: 'absolute',
// //     top: 12,
// //     left: 12,
// //     backgroundColor: COLORS.secondary,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 4,
// //     paddingHorizontal: 10,
// //     borderRadius: 20,
// //     borderWidth: 1,
// //     borderColor: COLORS.gray ,
// //   },
// //   boostedBadgeText: {
// //     ...FONTS.body5,
// //     color: COLORS.gold,
// //     marginLeft: 4,
// //     fontWeight: 'bold',
// //   },
// //   favoriteButton: {
// //     position: 'absolute',
// //     top: 12,
// //     right: 12,
// //     backgroundColor: 'rgba(0,0,0,0.4)',
// //     width: 30,
// //     height: 30,
// //     borderRadius: 15,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   boostedDetails: {
// //     padding: SIZES.padding,
// //   },
// //   boostedPrice: {
// //     ...FONTS.h2,
// //     color: COLORS.primary,
// //     fontWeight: 'bold',
// //     marginBottom: 4,
// //   },
// //   boostedTitle: {
// //     ...FONTS.h4,
// //     color: COLORS.black,
// //     marginBottom: 8,
// //     fontWeight: '600',
// //   },
// //   featuresContainer: {
// //     flexDirection: 'row',
// //     marginBottom: 10,
// //   },
// //   featureItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginRight: 15,
// //   },
// //   featureText: {
// //     ...FONTS.body4,
// //     color: COLORS.darkgray,
// //     marginLeft: 4,
// //   },
// //   boostedLocation: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   boostedLocationText: {
// //     ...FONTS.body4,
// //     color: COLORS.darkgray,
// //     marginLeft: 4,
// //   },
// //   urgentTag: {
// //     backgroundColor: COLORS.secondaryLight,
// //     paddingVertical: 4,
// //     paddingHorizontal: 8,
// //     borderRadius: 4,
// //     alignSelf: 'flex-start',
// //   },
// //   urgentText: {
// //     ...FONTS.body5,
// //     color: COLORS.secondary,
// //     fontWeight: 'bold',
// //     fontSize: 10,
// //   },
// // });

// // export default BoostedListings;

// import React, { useState, useEffect, useContext, useRef } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   FlatList, 
//   Image, 
//   TouchableOpacity, 
//   Dimensions,
//   ActivityIndicator
// } from 'react-native';
// import { MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
// import { COLORS, SIZES, FONTS } from '../constants/Theme';
// import { db } from '../src/api/FirebaseConfig';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { toggleFavorite, isPostFavorite } from '../services/favorites';
// import { UserContext } from '../context/AuthContext';

// const { width } = Dimensions.get('window');

// const BoostedItem = ({ item, navigation, onToggleFavorite }) => {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const timerRef = useRef(null);
//   const images = item.imageUrls || [];

//   // Défilement automatique des images
//   useEffect(() => {
//     if (images.length > 1) {
//       timerRef.current = setInterval(() => {
//         setCurrentImageIndex(prevIndex => 
//           (prevIndex + 1) % images.length
//         );
//       }, 3000); // Change d'image toutes les 3 secondes
//     }

//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//     };
//   }, [images.length]);

//   // Gestion du clic manuel sur une image
//   const handleImagePress = () => {
//     navigation.navigate('PostDetail', { postId: item.id });
//   };

//   return (
//     <TouchableOpacity 
//       style={styles.boostedCard}
//       activeOpacity={0.8}
//        onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
//     >
//       <View style={styles.imageContainer}>
//         {images.length > 0 ? (
//           <>
//             <Image 
//               source={{ uri: images[currentImageIndex] }} 
//               style={styles.boostedImage} 
//             />
            
//             {/* Indicateurs de position */}
//             <View style={styles.dotsContainer}>
//               {images.map((_, index) => (
//                 <View 
//                   key={index} 
//                   style={[
//                     styles.dot, 
//                     index === currentImageIndex && styles.activeDot
//                   ]} 
//                 />
//               ))}
//             </View>
//           </>
//         ) : (
//           <View style={styles.placeholderImage}>
//             <FontAwesome name="picture-o" size={40} color={COLORS.lightGray} />
//           </View>
//         )}
        
//         <View style={styles.imageOverlay} />
        
//         <View style={styles.boostedBadge}>
//           <AntDesign name="star" size={14} color={COLORS.gold} />
//           <Text style={styles.boostedBadgeText}>sponsorisé</Text>
//         </View>
        
//         <TouchableOpacity 
//           onPress={() => onToggleFavorite(item.id)} 
//           style={styles.favoriteButton}
//         >
//           <AntDesign 
//             name={item.isFavorite ? "heart" : "hearto"} 
//             size={20} 
//             color={item.isFavorite ? COLORS.gold : COLORS.white} 
//           />
//         </TouchableOpacity>
//       </View>
      
//       {/* Détails de l'annonce */}
//       <View style={styles.boostedDetails}>
//         <Text style={styles.boostedPrice}>{item.price} FCFA</Text>
//         <Text style={styles.boostedTitle} numberOfLines={1}>{item.title}</Text>
        
//         <View style={styles.featuresContainer}>
//           {item.bedrooms && (
//             <View style={styles.featureItem}>
//               <MaterialIcons name="hotel" size={14} color={COLORS.darkgray} />
//               <Text style={styles.featureText}>{item.bedrooms}</Text>
//             </View>
//           )}
          
//           {item.bathrooms && (
//             <View style={styles.featureItem}>
//               <MaterialIcons name="bathtub" size={14} color={COLORS.darkgray} />
//               <Text style={styles.featureText}>{item.bathrooms}</Text>
//             </View>
//           )}
          
//           {item.area && (
//             <View style={styles.featureItem}>
//               <MaterialIcons name="straighten" size={14} color={COLORS.darkgray} />
//               <Text style={styles.featureText}>{item.area}m²</Text>
//             </View>
//           )}
//         </View>
        
//         <View style={styles.boostedLocation}>
//           <MaterialIcons name="location-on" size={14} color={COLORS.primary} />
//           <Text style={styles.boostedLocationText} numberOfLines={1}>
//             {item.location?.display_name || item.location || 'Localisation non précisée'}
//           </Text>
//         </View>
        
//         {/* Bandeau d'urgence */}
//         {item.urgent && (
//           <View style={styles.urgentTag}>
//             <Text style={styles.urgentText}>OFFRE EXCEPTIONNELLE</Text>
//           </View>
//         )}
//       </View>
//     </TouchableOpacity>
//   );
// };

// const BoostedListings = ({ navigation }) => {
//   const [boostedListings, setBoostedListings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { userData } = useContext(UserContext);

//   useEffect(() => {
//     fetchBoostedListings();
//   }, []);

//   const fetchBoostedListings = async () => {
//     try {
//       const listingsRef = collection(db, 'posts');
//       const q = query(listingsRef, where('isBoosted', '==', true));
//       const querySnapshot = await getDocs(q);
      
//       const listingsData = [];
//       for (const doc of querySnapshot.docs) {
//         const listing = { id: doc.id, ...doc.data() };
//         if (userData?.uid) {
//           listing.isFavorite = await isPostFavorite(userData.uid, doc.id);
//         }
//         listingsData.push(listing);
//       }
      
//       setBoostedListings(listingsData);
//     } catch (error) {
//       console.error("Error fetching Boosted listings:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleToggleFavorite = async (postId) => {
//     try {
//       if (userData?.uid) {
//         const result = await toggleFavorite(userData.uid, postId);
//         setBoostedListings(prevListings => 
//           prevListings.map(item => 
//             item.id === postId ? { ...item, isFavorite: result } : item
//           )
//         );
//       }
//     } catch (error) {
//       console.error("Erreur lors de l'ajout/retrait du favori:", error);
//     }
//   };

//   const renderBoostedItem = ({ item }) => (
//     <BoostedItem 
//       item={item} 
//       navigation={navigation} 
//       onToggleFavorite={handleToggleFavorite} 
//     />
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="small" color={COLORS.primary} />
//       </View>
//     );
//   }

//   if (boostedListings.length === 0) {
//     return null;
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.headerTitleContainer}>
//           <Text style={styles.headerTitle}>Nos sélections exclusives</Text>
//           <Text style={styles.headerSubtitle}>Des biens d'exception vérifiés</Text>
//         </View>
//         <TouchableOpacity style={styles.seeAllButton}>
//           <Text style={styles.seeAllText}>Tout voir</Text>
//           <AntDesign name="arrowright" size={16} color={COLORS.primary} />
//         </TouchableOpacity>
//       </View>
      
//       <FlatList
//         data={boostedListings}
//         renderItem={renderBoostedItem}
//         keyExtractor={item => item.id}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.listContent}
//         snapToInterval={width * 0.78 + SIZES.padding}
//         decelerationRate="fast"
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   // ... autrcontainer: {
//     // marginTop: SIZES.padding * 1.5,
//     // marginBottom: SIZES.padding,
//   // },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 15,
//     marginBottom: SIZES.base * 1.5,
//   },
//   headerTitleContainer: {
//     flex: 1,
//   },
//   headerTitle: {
//     ...FONTS.h2,
//     color: COLORS.black,
//     fontWeight: 'bold',
//     marginBottom: 2,
//   },
//   headerSubtitle: {
//     ...FONTS.body4,
//     color: COLORS.darkgray,
//   },
//   seeAllButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   seeAllText: {
//     ...FONTS.body4,
//     color: COLORS.primary,
//     marginRight: 4,
//     fontWeight: 'bold',
//   },
//   loadingContainer: {
//     height: 260,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContent: {
//     paddingLeft: 15,
//     paddingRight: SIZES.padding / 2,
//     marginBottom: SIZES.padding * 1.5,
//   },
//   boostedCard: {
//     width: width * 0.78,
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//     marginRight: SIZES.padding,
//     overflow: 'hidden',
//     elevation: 5,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     borderWidth: 1,
//     borderColor: COLORS.lightGray2,
//     // height: 350,
//   },
//   // imageContainer: {
//   //   height: 200,
//   //   width: '100%',
//   //   position: 'relative',
//   // },
//   // boostedImage: {
//   //   width: '100%',
//   //   height: '100%',
//   //   resizeMode: 'cover',
//   // },
//   // imageOverlay: {
//   //   position: 'absolute',
//   //   bottom: 0,
//   //   left: 0,
//   //   right: 0,
//   //   height: '40%',
//   //   backgroundColor: 'rgba(0,0,0,0.3)',
//   // },
//   boostedBadge: {
//     position: 'absolute',
//     top: 12,
//     left: 12,
//     backgroundColor: COLORS.secondary,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: COLORS.gray ,
//   },
//   boostedBadgeText: {
//     ...FONTS.body5,
//     color: COLORS.gold,
//     marginLeft: 4,
//     fontWeight: 'bold',
//   },
//   favoriteButton: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   boostedDetails: {
//     padding: SIZES.padding,
//   },
//   boostedPrice: {
//     ...FONTS.h2,
//     color: COLORS.primary,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   boostedTitle: {
//     ...FONTS.h4,
//     color: COLORS.black,
//     marginBottom: 8,
//     fontWeight: '600',
//   },
//   featuresContainer: {
//     flexDirection: 'row',
//     marginBottom: 10,
//   },
//   featureItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   featureText: {
//     ...FONTS.body4,
//     color: COLORS.darkgray,
//     marginLeft: 4,
//   },
//   boostedLocation: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   boostedLocationText: {
//     ...FONTS.body4,
//     color: COLORS.darkgray,
//     marginLeft: 4,
//   },
//   urgentTag: {
//     backgroundColor: COLORS.secondaryLight,
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 4,
//     alignSelf: 'flex-start',
//   },
//   urgentText: {
//     ...FONTS.body5,
//     color: COLORS.secondary,
//     fontWeight: 'bold',
//     fontSize: 10,
//   },

//   imageContainer: {
//     height: 200,
//     width: '100%',
//     position: 'relative',
//   },
//   boostedImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   placeholderImage: {
//     width: '100%',
//     height: '100%',
//     backgroundColor: COLORS.lightGray2,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dotsContainer: {
//     position: 'absolute',
//     bottom: 10,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: 'rgba(255,255,255,0.5)',
//     marginHorizontal: 4,
//   },
//   activeDot: {
//     backgroundColor: COLORS.white,
//     width: 10,
//     height: 10,
//   },
//   // ... autres styles inchangés ...
// });

// export default BoostedListings;

import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  ActivityIndicator,
  Animated
} from 'react-native';
import { MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../constants/Theme';
import { db } from '../src/api/FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { toggleFavorite, isPostFavorite } from '../services/favorites';
import { UserContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.78;
const CARD_SPACING = SIZES.padding;

const BoostedItem = ({ item, navigation, onToggleFavorite, isVisible }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = item.imageUrls || [];
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  // Animation fluide pour le changement d'image
  const animateImageChange = (newIndex) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentImageIndex(newIndex);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  // Défilement automatique uniquement si la carte est visible
  useEffect(() => {
    if (isVisible && images.length > 1) {
      timerRef.current = setInterval(() => {
        animateImageChange((currentImageIndex + 1) % images.length);
      }, 3000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isVisible, images.length, currentImageIndex]);

  // Gestion du clic manuel sur une image
  const handleImagePress = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    navigation.navigate('PostDetail', { postId: item.id });
  };

  return (
    <TouchableOpacity 
      style={styles.boostedCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
    >
      <View style={styles.imageContainer}>
        {images.length > 0 ? (
          <>
            <Animated.View style={{ opacity: fadeAnim }}>
              <Image 
                source={{ uri: images[currentImageIndex] }} 
                style={styles.boostedImage} 
              />
            </Animated.View>
            
            {/* Indicateurs de position */}
            <View style={styles.dotsContainer}>
              {images.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (timerRef.current) clearInterval(timerRef.current);
                    animateImageChange(index);
                  }}
                >
                  <View 
                    style={[
                      styles.dot, 
                      index === currentImageIndex && styles.activeDot
                    ]} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.placeholderImage}>
            <FontAwesome name="picture-o" size={40} color={COLORS.lightGray} />
          </View>
        )}
        
        <View style={styles.imageOverlay} />
        
        <View style={styles.boostedBadge}>
          <AntDesign name="star" size={14} color={COLORS.gold} />
          <Text style={styles.boostedBadgeText}>sponsorisé</Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => onToggleFavorite(item.id)} 
          style={styles.favoriteButton}
        >
          <AntDesign 
            name={item.isFavorite ? "heart" : "hearto"} 
            size={20} 
            color={item.isFavorite ? COLORS.gold : COLORS.white} 
          />
        </TouchableOpacity>
      </View>
      
      {/* Détails de l'annonce */}
      <View style={styles.boostedDetails}>
        <Text style={styles.boostedPrice}>{item.price} FCFA</Text>
        <Text style={styles.boostedTitle} numberOfLines={1}>{item.title}</Text>
        
        <View style={styles.featuresContainer}>
          {item.bedrooms && (
            <View style={styles.featureItem}>
              <MaterialIcons name="hotel" size={14} color={COLORS.darkgray} />
              <Text style={styles.featureText}>{item.bedrooms}</Text>
            </View>
          )}
          
          {item.bathrooms && (
            <View style={styles.featureItem}>
              <MaterialIcons name="bathtub" size={14} color={COLORS.darkgray} />
              <Text style={styles.featureText}>{item.bathrooms}</Text>
            </View>
          )}
          
          {item.area && (
            <View style={styles.featureItem}>
              <MaterialIcons name="straighten" size={14} color={COLORS.darkgray} />
              <Text style={styles.featureText}>{item.area}m²</Text>
            </View>
          )}
        </View>
        
        <View style={styles.boostedLocation}>
          <MaterialIcons name="location-on" size={14} color={COLORS.primary} />
          <Text style={styles.boostedLocationText} numberOfLines={1}>
            {item.location?.display_name || item.location || 'Localisation non précisée'}
          </Text>
        </View>
        
        {/* Bandeau d'urgence */}
        {item.urgent && (
          <View style={styles.urgentTag}>
            <Text style={styles.urgentText}>OFFRE EXCEPTIONNELLE</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const BoostedListings = ({ navigation }) => {
  const [boostedListings, setBoostedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const { userData } = useContext(UserContext);
  const flatListRef = useRef(null);

  useEffect(() => {
    fetchBoostedListings();
  }, []);

  const fetchBoostedListings = async () => {
    try {
      const listingsRef = collection(db, 'posts');
      const q = query(listingsRef, where('isBoosted', '==', true));
      const querySnapshot = await getDocs(q);
      
      const listingsData = [];
      for (const doc of querySnapshot.docs) {
        const listing = { id: doc.id, ...doc.data() };
        if (userData?.uid) {
          listing.isFavorite = await isPostFavorite(userData.uid, doc.id);
        }
        listingsData.push(listing);
      }
      
      setBoostedListings(listingsData);
    } catch (error) {
      console.error("Error fetching Boosted listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (postId) => {
    try {
      if (userData?.uid) {
        const result = await toggleFavorite(userData.uid, postId);
        setBoostedListings(prevListings => 
          prevListings.map(item => 
            item.id === postId ? { ...item, isFavorite: result } : item
          )
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout/retrait du favori:", error);
    }
  };

  // Détecter les éléments visibles à l'écran
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    const newVisibleItems = new Set();
    viewableItems.forEach(item => {
      newVisibleItems.add(item.item.id);
    });
    setVisibleItems(newVisibleItems);
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300
  }).current;

  const renderBoostedItem = ({ item }) => (
    <BoostedItem 
      item={item} 
      navigation={navigation} 
      onToggleFavorite={handleToggleFavorite}
      isVisible={visibleItems.has(item.id)}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }

  if (boostedListings.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Nos sélections exclusives</Text>
          <Text style={styles.headerSubtitle}>Des biens d'exception vérifiés</Text>
        </View>
        <TouchableOpacity 
          style={styles.seeAllButton}
          onPress={() => navigation.navigate('SearchResults', { boostedOnly: true })}
        >
          <Text style={styles.seeAllText}>Tout voir</Text>
          <AntDesign name="arrowright" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={boostedListings}
        renderItem={renderBoostedItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.padding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: SIZES.base * 1.5,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.black,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    ...FONTS.body4,
    color: COLORS.darkgray,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    ...FONTS.body4,
    color: COLORS.primary,
    marginRight: 4,
    fontWeight: 'bold',
  },
  loadingContainer: {
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingLeft: 15,
    paddingRight: SIZES.padding / 2,
    paddingBottom: SIZES.padding,
  },
  boostedCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginRight: CARD_SPACING,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.lightGray2,
  },
  imageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  boostedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.lightGray2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.white,
    width: 10,
    height: 10,
  },
  boostedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  boostedBadgeText: {
    ...FONTS.body5,
    color: COLORS.gold,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boostedDetails: {
    padding: SIZES.padding,
  },
  boostedPrice: {
    ...FONTS.h2,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  boostedTitle: {
    ...FONTS.h4,
    color: COLORS.black,
    marginBottom: 8,
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  featureText: {
    ...FONTS.body4,
    color: COLORS.darkgray,
    marginLeft: 4,
  },
  boostedLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  boostedLocationText: {
    ...FONTS.body4,
    color: COLORS.darkgray,
    marginLeft: 4,
    flexShrink: 1,
  },
  urgentTag: {
    backgroundColor: COLORS.secondaryLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  urgentText: {
    ...FONTS.body5,
    color: COLORS.secondary,
    fontWeight: 'bold',
    fontSize: 10,
  },
});

export default BoostedListings;