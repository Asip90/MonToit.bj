// import React, { useState, useEffect } from 'react';
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
// import { MaterialIcons, Ionicons } from '@expo/vector-icons';
// import { COLORS, SIZES, FONTS } from '../../constants/Theme';
// import { auth, db } from '../../src/api/FirebaseConfig';
// import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';

// const MyListingsScreen = ({ navigation }) => {
//   const [listings, setListings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchUserListings = async () => {
//     try {
//       const user = auth.currentUser;
//       if (!user) return;

//       const listingsRef = collection(db, 'posts');
//       const q = query(listingsRef, where('userId', '==', user.uid));
//       const querySnapshot = await getDocs(q);
      
//       const listingsData = [];
//       querySnapshot.forEach((doc) => {
//         listingsData.push({ id: doc.id, ...doc.data() });
//       });
      
//       setListings(listingsData);
//     } catch (error) {
//       console.error("Error fetching listings:", error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserListings();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchUserListings();
//   };

//   const handleDeleteListing = async (listingId) => {
//     try {
//       await deleteDoc(doc(db, 'posts', listingId));
//       setListings(listings.filter(item => item.id !== listingId));
//     } catch (error) {
//       console.error("Error deleting listing:", error);
//     }
//   };

//   const renderListingItem = ({ item }) => (
//     <View style={styles.listingCard}>
//       <Image 
//         source={{ uri: item.imageUrls?.[0] || 'https://via.placeholder.com/300' }} 
//         style={styles.listingImage} 
//       />
      
//       <View style={styles.listingDetails}>
//         <Text style={styles.listingPrice}>{item.price} FCFA</Text>
//         <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
//         <Text style={styles.listingCategory}>{item.category}</Text>
        
//         <View style={styles.listingFooter}>
//           <View style={styles.listingLocation}>
//             <MaterialIcons name="location-on" size={14} color={COLORS.gray} />
//             <Text style={styles.listingLocationText}>
//               {item.location?.display_name || item.location || 'Non spécifié'}
//             </Text>
//           </View>
          
//           <View style={styles.listingActions}>
//             <TouchableOpacity 
//               onPress={() => navigation.navigate('EditListing', { listingId: item.id })}
//               style={styles.actionButton}
//             >
//               <MaterialIcons name="edit" size={20} color={COLORS.primary} />
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               onPress={() => handleDeleteListing(item.id)}
//               style={styles.actionButton}
//             >
//               <MaterialIcons name="delete" size={20} color="#E74C3C" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </View>
//   );

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color={COLORS.black} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Mes Annonces</Text>
//         <View style={{ width: 24 }} /> {/* Pour l'alignement */}
//       </View>
      
//       {listings.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <MaterialIcons name="home-work" size={60} color={COLORS.lightGray} />
//           <Text style={styles.emptyText}>Aucune annonce publiée</Text>
//           <TouchableOpacity 
//             style={styles.addButton}
//             onPress={() => navigation.navigate('PostAdScreen')}
//           >
//             <Text style={styles.addButtonText}>Publier une annonce</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={listings}
//           renderItem={renderListingItem}
//           keyExtractor={item => item.id}
//           contentContainerStyle={styles.listContent}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={[COLORS.primary]}
//               tintColor={COLORS.primary}
//             />
//           }
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.lightGray,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: SIZES.padding,
//     // backgroundColor: COLORS.white,
//     backgroundColor: COLORS.primary,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.lightGray,
//   },
//   headerTitle: {
//     ...FONTS.h3,
//     color: COLORS.white,
//     fontWeight: 'bold',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContent: {
//     padding: SIZES.padding,
//   },
//   listingCard: {
//     backgroundColor: COLORS.white,
//     borderRadius: SIZES.radius,
//     marginBottom: SIZES.padding,
//     overflow: 'hidden',
//     elevation: 2,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   listingImage: {
//     width: '100%',
//     height: 180,
//   },
//   listingDetails: {
//     padding: SIZES.padding,
//   },
//   listingPrice: {
//     ...FONTS.h3,
//     color: COLORS.primary,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   listingTitle: {
//     ...FONTS.body3,
//     color: COLORS.black,
//     marginBottom: 4,
//   },
//   listingCategory: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//     marginBottom: 8,
//   },
//   listingFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   listingLocation: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   listingLocationText: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//     marginLeft: 4,
//   },
//   listingActions: {
//     flexDirection: 'row',
//   },
//   actionButton: {
//     marginLeft: 15,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: SIZES.padding,
//   },
//   emptyText: {
//     ...FONTS.body3,
//     color: COLORS.gray,
//     marginTop: SIZES.padding,
//     marginBottom: 20,
//   },
//   addButton: {
//     backgroundColor: COLORS.primary,
//     borderRadius: SIZES.radius,
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//   },
//   addButtonText: {
//     ...FONTS.body3,
//     color: COLORS.white,
//     fontWeight: 'bold',
//   },
// });

// export default MyListingsScreen;

// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   FlatList, 
//   Image, 
//   TouchableOpacity, 
//   ActivityIndicator,
//   RefreshControl,
//   Alert 
// } from 'react-native';
// import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
// import { COLORS, SIZES, FONTS } from '../../constants/Theme';
// import { auth, db } from '../../src/api/FirebaseConfig';
// import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

// const MyListingsScreen = ({ navigation }) => {
//   const [listings, setListings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchUserListings = async () => {
//     try {
//       const user = auth.currentUser;
//       if (!user) return;

//       const listingsRef = collection(db, 'posts');
//       const q = query(listingsRef, where('userId', '==', user.uid));
//       const querySnapshot = await getDocs(q);
      
//       const listingsData = [];
//       querySnapshot.forEach((doc) => {
//         listingsData.push({ id: doc.id, ...doc.data() });
//       });
      
//       setListings(listingsData);
//     } catch (error) {
//       console.error("Error fetching listings:", error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserListings();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchUserListings();
//   };

//   const handleDeleteListing = async (listingId) => {
//     try {
//       await deleteDoc(doc(db, 'posts', listingId));
//       setListings(listings.filter(item => item.id !== listingId));
//     } catch (error) {
//       console.error("Error deleting listing:", error);
//     }
//   };

//   const handleBoostListing = async (listingId) => {
//     try {
//       // Ici vous devriez intégrer votre logique de paiement
//       // Pour l'exemple, nous allons simplement marquer l'annonce comme boostée
      
//       Alert.alert(
//         "Booster cette annonce",
//         "Voulez-vous booster cette annonce pour 1000 FCFA ? Elle sera mise en avant pendant 7 jours.",
//         [
//           {
//             text: "Annuler",
//             style: "cancel"
//           },
//           { 
//             text: "Booster", 
//             onPress: async () => {
//               const listingRef = doc(db, 'posts', listingId);
//               await updateDoc(listingRef, {
//                 isBoosted: true,
//                 boostedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours à partir de maintenant
//               });
              
//               // Mettre à jour l'état local
//               setListings(listings.map(item => 
//                 item.id === listingId 
//                   ? { ...item, isBoosted: true, boostedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
//                   : item
//               ));
              
//               Alert.alert("Succès", "Votre annonce a été boostée avec succès !");
//             }
//           }
//         ]
//       );
//     } catch (error) {
//       console.error("Error boosting listing:", error);
//       Alert.alert("Erreur", "Une erreur est survenue lors du boost de l'annonce");
//     }
//   };

//   const renderListingItem = ({ item }) => (
//     <View style={[styles.listingCard, item.isBoosted && styles.boostedCard]}>
//       {item.isBoosted && (
//         <View style={styles.boostedBadge}>
//           <FontAwesome name="bolt" size={14} color={COLORS.white} />
//           <Text style={styles.boostedText}>Boosté</Text>
//         </View>
//       )}
      
//       <Image 
//         source={{ uri: item.imageUrls?.[0] || 'https://via.placeholder.com/300' }} 
//         style={styles.listingImage} 
//       />
      
//       <View style={styles.listingDetails}>
//         <Text style={styles.listingPrice}>{item.price} FCFA</Text>
//         <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
//         <Text style={styles.listingCategory}>{item.category}</Text>
        
//         <View style={styles.listingFooter}>
//           <View style={styles.listingLocation}>
//             <MaterialIcons name="location-on" size={14} color={COLORS.gray} />
//             <Text style={styles.listingLocationText}>
//               {item.location?.display_name || item.location || 'Non spécifié'}
//             </Text>
//           </View>
          
//           <View style={styles.listingActions}>
//             {!item.isBoosted && (
//               <TouchableOpacity 
//                 onPress={() => handleBoostListing(item.id)}
//                 style={styles.boostButton}
//               >
//                 <FontAwesome name="bolt" size={16} color={COLORS.white} />
//                 <Text style={styles.boostButtonText}>Booster</Text>
//               </TouchableOpacity>
//             )}
            
//             <TouchableOpacity 
//               onPress={() => navigation.navigate('EditListing', { listingId: item.id })}
//               style={styles.actionButton}
//             >
//               <MaterialIcons name="edit" size={20} color={COLORS.primary} />
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               onPress={() => handleDeleteListing(item.id)}
//               style={styles.actionButton}
//             >
//               <MaterialIcons name="delete" size={20} color="#E74C3C" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </View>
//   );

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color={COLORS.black} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Mes Annonces</Text>
//         <View style={{ width: 24 }} /> {/* Pour l'alignement */}
//       </View>
      
//       {listings.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <MaterialIcons name="home-work" size={60} color={COLORS.lightGray} />
//           <Text style={styles.emptyText}>Aucune annonce publiée</Text>
//           <TouchableOpacity 
//             style={styles.addButton}
//             onPress={() => navigation.navigate('PostAdScreen')}
//           >
//             <Text style={styles.addButtonText}>Publier une annonce</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={listings}
//           renderItem={renderListingItem}
//           keyExtractor={item => item.id}
//           contentContainerStyle={styles.listContent}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={[COLORS.primary]}
//               tintColor={COLORS.primary}
//             />
//           }
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.lightGray,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: SIZES.padding,
//     backgroundColor: COLORS.primary,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.lightGray,
//   },
//   headerTitle: {
//     ...FONTS.h3,
//     color: COLORS.white,
//     fontWeight: 'bold',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContent: {
//     padding: SIZES.padding,
//   },
//   listingCard: {
//     backgroundColor: COLORS.white,
//     borderRadius: SIZES.radius,
//     marginBottom: SIZES.padding,
//     overflow: 'hidden',
//     elevation: 2,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     position: 'relative',
//   },
//   boostedCard: {
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//   },
//   boostedBadge: {
//     position: 'absolute',
//     top: 10,
//     left: 10,
//     backgroundColor: COLORS.primary,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 12,
//     zIndex: 1,
//   },
//   boostedText: {
//     ...FONTS.body5,
//     color: COLORS.white,
//     marginLeft: 4,
//     fontWeight: 'bold',
//   },
//   listingImage: {
//     width: '100%',
//     height: 180,
//   },
//   listingDetails: {
//     padding: SIZES.padding,
//   },
//   listingPrice: {
//     ...FONTS.h3,
//     color: COLORS.primary,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   listingTitle: {
//     ...FONTS.body3,
//     color: COLORS.black,
//     marginBottom: 4,
//   },
//   listingCategory: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//     marginBottom: 8,
//   },
//   listingFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   listingLocation: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   listingLocationText: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//     marginLeft: 4,
//   },
//   listingActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   boostButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.secondary,
//     borderRadius: 15,
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     marginRight: 8,
//   },
//   boostButtonText: {
//     ...FONTS.body5,
//     color: COLORS.white,
//     marginLeft: 4,
//     fontWeight: 'bold',
//   },
//   actionButton: {
//     marginLeft: 15,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: SIZES.padding,
//   },
//   emptyText: {
//     ...FONTS.body3,
//     color: COLORS.gray,
//     marginTop: SIZES.padding,
//     marginBottom: 20,
//   },
//   addButton: {
//     backgroundColor: COLORS.primary,
//     borderRadius: SIZES.radius,
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//   },
//   addButtonText: {
//     ...FONTS.body3,
//     color: COLORS.white,
//     fontWeight: 'bold',
//   },
// });

// export default MyListingsScreen;

// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   FlatList, 
//   Image, 
//   TouchableOpacity, 
//   ActivityIndicator,
//   RefreshControl,
//   Alert,
//   Switch
// } from 'react-native';
// import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
// import { COLORS, SIZES, FONTS } from '../../constants/Theme';
// import { auth, db } from '../../src/api/FirebaseConfig';
// import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

// const MyListingsScreen = ({ navigation }) => {
//   const [listings, setListings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchUserListings = async () => {
//     try {
//       const user = auth.currentUser;
//       if (!user) return;

//       const listingsRef = collection(db, 'posts');
//       const q = query(listingsRef, where('userId', '==', user.uid));
//       const querySnapshot = await getDocs(q);
      
//       const listingsData = [];
//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         // Vérifier si le champ 'available' existe, sinon le créer avec true par défaut
//         if (data.available === undefined) {
//           data.available = true;
//         }
//         listingsData.push({ id: doc.id, ...data });
//       });
      
//       setListings(listingsData);
//     } catch (error) {
//       console.error("Error fetching listings:", error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchUserListings();
//   }, []);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchUserListings();
//   };

//   const handleToggleAvailability = async (listingId, currentAvailability) => {
//     try {
//       const newAvailability = !currentAvailability;
//       const listingRef = doc(db, 'posts', listingId);
      
//       // Mettre à jour Firestore
//       await updateDoc(listingRef, {
//         available: newAvailability
//       });
      
//       // Mettre à jour l'état local
//       setListings(listings.map(item => 
//         item.id === listingId ? { ...item, available: newAvailability } : item
//       ));
      
//       Alert.alert(
//         "Statut modifié",
//         `Votre annonce est maintenant ${newAvailability ? "disponible" : "non disponible"}`,
//         [{ text: "OK" }]
//       );
//     } catch (error) {
//       console.error("Error updating availability:", error);
//       Alert.alert("Erreur", "Impossible de modifier le statut de disponibilité");
//     }
//   };

//   const handleDeleteListing = async (listingId) => {
//     try {
//       await deleteDoc(doc(db, 'posts', listingId));
//       setListings(listings.filter(item => item.id !== listingId));
//     } catch (error) {
//       console.error("Error deleting listing:", error);
//     }
//   };

//   const handleBoostListing = async (listingId) => {
//     try {
//       Alert.alert(
//         "Booster cette annonce",
//         "Voulez-vous booster cette annonce pour 1000 FCFA ? Elle sera mise en avant pendant 7 jours.",
//         [
//           {
//             text: "Annuler",
//             style: "cancel"
//           },
//           { 
//             text: "Booster", 
//             onPress: async () => {
//               const listingRef = doc(db, 'posts', listingId);
//               await updateDoc(listingRef, {
//                 isBoosted: true,
//                 boostedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours à partir de maintenant
//               });
              
//               // Mettre à jour l'état local
//               setListings(listings.map(item => 
//                 item.id === listingId 
//                   ? { ...item, isBoosted: true, boostedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
//                   : item
//               ));
              
//               Alert.alert("Succès", "Votre annonce a été boostée avec succès !");
//             }
//           }
//         ]
//       );
//     } catch (error) {
//       console.error("Error boosting listing:", error);
//       Alert.alert("Erreur", "Une erreur est survenue lors du boost de l'annonce");
//     }
//   };

//   const renderListingItem = ({ item }) => (
//     <View style={[styles.listingCard, item.isBoosted && styles.boostedCard]}>
//       {item.isBoosted && (
//         <View style={styles.boostedBadge}>
//           <FontAwesome name="bolt" size={14} color={COLORS.white} />
//           <Text style={styles.boostedText}>Boosté</Text>
//         </View>
//       )}
      
//       <Image 
//         source={{ uri: item.imageUrls?.[0] || 'https://via.placeholder.com/300' }} 
//         style={styles.listingImage} 
//       />
      
//       <View style={styles.listingDetails}>
//         <Text style={styles.listingPrice}>{item.price} FCFA</Text>
//         <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
//         <Text style={styles.listingCategory}>{item.category}</Text>
        
//         <View style={styles.availabilityContainer}>
//           <Text style={styles.availabilityLabel}>
//             Disponible: 
//           </Text>
//           <Switch
//             value={item.available}
//             onValueChange={() => handleToggleAvailability(item.id, item.available)}
//             trackColor={{ false: "#767577", true: COLORS.primary }}
//             thumbColor={item.available ? COLORS.white : "#f4f3f4"}
//           />
//           <Text style={[styles.availabilityStatus, item.available ? styles.available : styles.unavailable]}>
//             {item.available ? "Oui" : "Non"}
//           </Text>
//         </View>
        
//         <View style={styles.listingFooter}>
//           <View style={styles.listingLocation}>
//             <MaterialIcons name="location-on" size={14} color={COLORS.gray} />
//             <Text style={styles.listingLocationText}>
//               {item.location?.display_name || item.location || 'Non spécifié'}
//             </Text>
//           </View>
          
//           <View style={styles.listingActions}>
//             {!item.isBoosted && (
//               <TouchableOpacity 
//                 onPress={() => handleBoostListing(item.id)}
//                 style={styles.boostButton}
//               >
//                 <FontAwesome name="bolt" size={16} color={COLORS.white} />
//                 <Text style={styles.boostButtonText}>Booster</Text>
//               </TouchableOpacity>
//             )}
            
//             <TouchableOpacity 
//               onPress={() => navigation.navigate('EditListing', { listingId: item.id })}
//               style={styles.actionButton}
//             >
//               <MaterialIcons name="edit" size={20} color={COLORS.primary} />
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               onPress={() => handleDeleteListing(item.id)}
//               style={styles.actionButton}
//             >
//               <MaterialIcons name="delete" size={20} color="#E74C3C" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </View>
//   );

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color={COLORS.white} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Mes Annonces</Text>
//         <View style={{ width: 24 }} /> {/* Pour l'alignement */}
//       </View>
      
//       {listings.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <MaterialIcons name="home-work" size={60} color={COLORS.lightGray} />
//           <Text style={styles.emptyText}>Aucune annonce publiée</Text>
//           <TouchableOpacity 
//             style={styles.addButton}
//             onPress={() => navigation.navigate('PostAdScreen')}
//           >
//             <Text style={styles.addButtonText}>Publier une annonce</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={listings}
//           renderItem={renderListingItem}
//           keyExtractor={item => item.id}
//           contentContainerStyle={styles.listContent}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={[COLORS.primary]}
//               tintColor={COLORS.primary}
//             />
//           }
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.lightGray,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: SIZES.padding,
//     backgroundColor: COLORS.primary,
//   },
//   headerTitle: {
//     ...FONTS.h3,
//     color: COLORS.white,
//     fontWeight: 'bold',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContent: {
//     padding: SIZES.padding,
//   },
//   listingCard: {
//     backgroundColor: COLORS.white,
//     borderRadius: SIZES.radius,
//     marginBottom: SIZES.padding,
//     overflow: 'hidden',
//     elevation: 2,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     position: 'relative',
//   },
//   boostedCard: {
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//   },
//   boostedBadge: {
//     position: 'absolute',
//     top: 10,
//     left: 10,
//     backgroundColor: COLORS.primary,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 12,
//     zIndex: 1,
//   },
//   boostedText: {
//     ...FONTS.body5,
//     color: COLORS.white,
//     marginLeft: 4,
//     fontWeight: 'bold',
//   },
//   listingImage: {
//     width: '100%',
//     height: 180,
//   },
//   listingDetails: {
//     padding: SIZES.padding,
//   },
//   listingPrice: {
//     ...FONTS.h3,
//     color: COLORS.primary,
//     fontWeight: 'bold',
//     marginBottom: 4,
//   },
//   listingTitle: {
//     ...FONTS.body3,
//     color: COLORS.black,
//     marginBottom: 4,
//   },
//   listingCategory: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//     marginBottom: 8,
//   },
//   availabilityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   availabilityLabel: {
//     ...FONTS.body4,
//     color: COLORS.darkGray,
//     marginRight: 8,
//   },
//   availabilityStatus: {
//     ...FONTS.body4,
//     fontWeight: 'bold',
//     marginLeft: 8,
//   },
//   available: {
//     color: COLORS.success,
//   },
//   unavailable: {
//     color: COLORS.error,
//   },
//   listingFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   listingLocation: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   listingLocationText: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//     marginLeft: 4,
//     flexShrink: 1,
//   },
//   listingActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 10,
//   },
//   boostButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.secondary,
//     borderRadius: 15,
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     marginRight: 8,
//   },
//   boostButtonText: {
//     ...FONTS.body5,
//     color: COLORS.white,
//     marginLeft: 4,
//     fontWeight: 'bold',
//   },
//   actionButton: {
//     marginLeft: 15,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: SIZES.padding,
//   },
//   emptyText: {
//     ...FONTS.body3,
//     color: COLORS.gray,
//     marginTop: SIZES.padding,
//     marginBottom: 20,
//   },
//   addButton: {
//     backgroundColor: COLORS.primary,
//     borderRadius: SIZES.radius,
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//   },
//   addButtonText: {
//     ...FONTS.body3,
//     color: COLORS.white,
//     fontWeight: 'bold',
//   },
// });

// export default MyListingsScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Switch,
  Modal
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/Theme'; // Assurez-vous que ce chemin est correct
import { auth, db } from '../../src/api/FirebaseConfig'; // Assurez-vous que ce chemin est correct
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';

const MyListingsScreen = ({ navigation }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isBoostModalVisible, setIsBoostModalVisible] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [userData, setUserData] = useState(null);

  // Récupère les informations de l'utilisateur depuis Firestore
  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      // Assurez-vous que votre collection utilisateurs s'appelle bien 'users'
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserData({ id: userDoc.id, ...userDoc.data() });
      } else {
        Alert.alert("Profil incomplet", "Certaines informations utilisateur sont manquantes.");
        setUserData({ email: user.email, name: user.displayName || 'Utilisateur', phone: '' });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur:", error);
    }
  };

  const fetchUserListings = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }
      const listingsRef = collection(db, 'posts');
      const q = query(listingsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const listingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        available: true, // Valeur par défaut
        ...doc.data()
      }));
      setListings(listingsData);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // S'exécute au chargement et lorsque l'écran est focus
  useEffect(() => {
    fetchUserData();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserListings();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserListings();
  };

  const handleToggleAvailability = async (listingId, currentAvailability) => {
    // Le code de cette fonction reste identique
    try {
        const newAvailability = !currentAvailability;
        const listingRef = doc(db, 'posts', listingId);
        await updateDoc(listingRef, { available: newAvailability });
        setListings(listings.map(item =>
          item.id === listingId ? { ...item, available: newAvailability } : item
        ));
        Alert.alert("Statut modifié", `Votre annonce est maintenant ${newAvailability ? "disponible" : "non disponible"}.`);
      } catch (error) {
        Alert.alert("Erreur", "Impossible de modifier le statut de disponibilité");
      }
  };

  const handleDeleteListing = async (listingId) => {
    // Le code de cette fonction reste identique
    Alert.alert(
        "Confirmer la suppression",
        "Êtes-vous sûr de vouloir supprimer cette annonce ?",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Supprimer",
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteDoc(doc(db, 'posts', listingId));
                setListings(listings.filter(item => item.id !== listingId));
              } catch (error) {
                console.error("Error deleting listing:", error);
              }
            }
          }
        ]
      );
  };

  // Ouvre la modale en stockant l'annonce sélectionnée
  const handleOpenBoostModal = (listing) => {
    setSelectedListing(listing);
    setIsBoostModalVisible(true);
  };

  // Lance le processus de paiement
  const handleSelectBoostOption = async (boostOption) => {
    if (!selectedListing || !userData) {
      Alert.alert("Erreur", "Données de l'annonce ou de l'utilisateur manquantes. Veuillez réessayer.");
      return;
    }

    setIsBoostModalVisible(false);

    try {
      const payload = {
        amount: Number(boostOption.price),//number
        currency: 'XOF',
        listingId: selectedListing.id,//c'est le post id
        boostDuration: boostOption.duration,//number le nombre de jours
        description: `Boost (${boostOption.duration} jours) pour: ${selectedListing.title}`,
        reference: `boost-${selectedListing.id}-${Date.now()}`,
        metadata: {
          listingId: selectedListing.id,
          boostDuration: boostOption.duration,
          userId: auth.currentUser.uid
        },
        customer: {
          email: userData.email,
          phone_number: userData.phone || '',
          firstname: userData.name || 'Prénom', // Assurez-vous que 'name' et 'surname' sont dans vos documents 'users'
          lastname: userData.surname || 'Nom',
        },
      };

      const response = await fetch('https://monbackend-production.up.railway.app/pay/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('Résultat de la création de session de paiement:', result);
      if (!result.success ||  !result.paymentUrl) {
        throw new Error(result.message || 'Échec de la création de la session de paiement');
      }

      // Naviguer vers l'écran de paiement
      navigation.navigate('Payment', { paymentUrl: result.paymentUrl });

    } catch (err) {
      console.error('Erreur durant l\'initiation du paiement:', err);
      Alert.alert('Erreur de Paiement', err.message || 'Une erreur est survenue.');
    } finally {
      setSelectedListing(null);
    }
  };

  const boostOptions = [
    { duration: 7, price: 1990, label: 'Essentiel' },
    { duration: 15, price: 3490, label: 'Populaire' },
    { duration: 30, price: 4990, label: 'Premium' },
  ];

  const renderListingItem = ({ item }) => (
    <View style={[styles.listingCard, item.isBoosted && styles.boostedCard]}>
      {item.isBoosted && (
        <View style={styles.boostedBadge}>
          <FontAwesome name="bolt" size={14} color={COLORS.white} />
          <Text style={styles.boostedText}>Boosté</Text>
        </View>
      )}
      <Image source={{ uri: item.imageUrls?.[0] || 'https://via.placeholder.com/300' }} style={styles.listingImage} />
      <View style={styles.listingDetails}>
        <Text style={styles.listingPrice}>{item.price} FCFA</Text>
        <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.listingCategory}>{item.category}</Text>
        <View style={styles.availabilityContainer}>
          <Text style={styles.availabilityLabel}>Disponible:</Text>
          <Switch
            value={!!item.available}
            onValueChange={() => handleToggleAvailability(item.id, item.available)}
            trackColor={{ false: "#767577", true: COLORS.primary }}
            thumbColor={item.available ? COLORS.white : "#f4f3f4"}
          />
        </View>
        <View style={styles.listingFooter}>
          <View style={styles.listingLocation}>
            <MaterialIcons name="location-on" size={14} color={COLORS.gray} />
            <Text style={styles.listingLocationText} numberOfLines={1}>
              {item.location?.display_name || item.location || 'Non spécifié'}
            </Text>
          </View>
          <View style={styles.listingActions}>
            {!item.isBoosted && (
              <TouchableOpacity onPress={() => handleOpenBoostModal(item)} style={styles.boostButton}>
                <FontAwesome name="bolt" size={16} color={COLORS.white} />
                <Text style={styles.boostButtonText}>Booster</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => navigation.navigate('EditListing', { listingId: item.id })} style={styles.actionButton}>
              <MaterialIcons name="edit" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteListing(item.id)} style={styles.actionButton}>
              <MaterialIcons name="delete" size={20} color="#E74C3C" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Annonces</Text>
        <View style={{ width: 24 }} />
      </View>

      <Modal animationType="slide" transparent={true} visible={isBoostModalVisible} onRequestClose={() => setIsBoostModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FontAwesome name="rocket" size={40} color={COLORS.secondary} />
            <Text style={styles.modalTitle}>Donnez un coup de pouce !</Text>
            <Text style={styles.modalSubtitle}>Votre annonce sera affichée en priorité pour toucher plus de locataires potentiels.</Text>
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitItem}><Ionicons name="eye" size={16} color={COLORS.primary} /> Jusqu'à 10x plus de vues</Text>
              <Text style={styles.benefitItem}><Ionicons name="checkmark-circle" size={16} color={COLORS.primary} /> Des contacts plus qualifiés</Text>
              <Text style={styles.benefitItem}><Ionicons name="flash" size={16} color={COLORS.primary} /> Louez votre bien plus rapidement</Text>
            </View>
            {boostOptions.map((option) => (
              <TouchableOpacity key={option.duration} style={styles.optionButton} onPress={() => handleSelectBoostOption(option)}>
                <View>
                  <Text style={styles.optionText}>{`${option.duration} jours`}</Text>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </View>
                <Text style={styles.optionPrice}>{`${option.price} FCFA`}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsBoostModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Peut-être plus tard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {listings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="home-work" size={60} color={COLORS.lightGray} />
          <Text style={styles.emptyText}>Aucune annonce publiée</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('PostAdScreen')}>
            <Text style={styles.addButtonText}>Publier une annonce</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={listings}
          renderItem={renderListingItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        />
      )}
    </View>
  );
};

// Styles (incluant les styles existants et les nouveaux pour la modale)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SIZES.padding, backgroundColor: COLORS.primary },
    headerTitle: { ...FONTS.h3, color: COLORS.white, fontWeight: 'bold' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { padding: SIZES.padding },
    listingCard: { backgroundColor: COLORS.white, borderRadius: SIZES.radius, marginBottom: SIZES.padding, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, position: 'relative' },
    boostedCard: { borderColor: COLORS.secondary, borderWidth: 2 },
    boostedBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: COLORS.secondary, flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12, zIndex: 1 },
    boostedText: { ...FONTS.body5, color: COLORS.white, marginLeft: 4, fontWeight: 'bold' },
    listingImage: { width: '100%', height: 180 },
    listingDetails: { padding: SIZES.padding },
    listingPrice: { ...FONTS.h3, color: COLORS.primary, fontWeight: 'bold', marginBottom: 4 },
    listingTitle: { ...FONTS.body3, color: COLORS.black, marginBottom: 4 },
    listingCategory: { ...FONTS.body4, color: COLORS.gray, marginBottom: 8 },
    availabilityContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    availabilityLabel: { ...FONTS.body4, color: COLORS.darkGray, marginRight: 8 },
    listingFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, borderTopWidth: 1, borderTopColor: COLORS.lightGray, paddingTop: 10 },
    listingLocation: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    listingLocationText: { ...FONTS.body4, color: COLORS.gray, marginLeft: 4, flexShrink: 1 },
    listingActions: { flexDirection: 'row', alignItems: 'center' },
    boostButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.secondary, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12, marginRight: 8 },
    boostButtonText: { ...FONTS.body5, color: COLORS.white, marginLeft: 6, fontWeight: 'bold' },
    actionButton: { marginLeft: 16 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SIZES.padding },
    emptyText: { ...FONTS.body3, color: COLORS.gray, marginTop: SIZES.padding, marginBottom: 20 },
    addButton: { backgroundColor: COLORS.primary, borderRadius: SIZES.radius, paddingVertical: 12, paddingHorizontal: 24 },
    addButtonText: { ...FONTS.body3, color: COLORS.white, fontWeight: 'bold' },
    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
    modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: SIZES.radius * 2, borderTopRightRadius: SIZES.radius * 2, padding: SIZES.padding, alignItems: 'center', paddingBottom: 30 },
    modalTitle: { ...FONTS.h2, color: COLORS.primary, marginVertical: 15 },
    modalSubtitle: { ...FONTS.body4, color: COLORS.gray, textAlign: 'center', marginBottom: 20, maxWidth: '90%' },
    benefitsContainer: { width: '100%', backgroundColor: '#F7F7F7', borderRadius: SIZES.radius, padding: 15, marginBottom: 20 },
    benefitItem: { ...FONTS.body4, color: COLORS.darkGray, marginBottom: 10, lineHeight: 22 },
    optionButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: 15, borderWidth: 1, borderColor: COLORS.lightGray, borderRadius: SIZES.radius, marginBottom: 12 },
    optionText: { ...FONTS.h4, fontWeight: 'bold', color: COLORS.darkGray },
    optionLabel: { ...FONTS.body5, color: COLORS.gray },
    optionPrice: { ...FONTS.h3, color: COLORS.primary, fontWeight: 'bold' },
    cancelButton: { marginTop: 10, padding: 10 },
    cancelButtonText: { ...FONTS.body4, color: COLORS.gray },
});

export default MyListingsScreen;