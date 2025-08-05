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
  Switch
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/Theme';
import { auth, db } from '../../src/api/FirebaseConfig';
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const MyListingsScreen = ({ navigation }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserListings = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const listingsRef = collection(db, 'posts');
      const q = query(listingsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const listingsData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Vérifier si le champ 'available' existe, sinon le créer avec true par défaut
        if (data.available === undefined) {
          data.available = true;
        }
        listingsData.push({ id: doc.id, ...data });
      });
      
      setListings(listingsData);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserListings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserListings();
  };

  const handleToggleAvailability = async (listingId, currentAvailability) => {
    try {
      const newAvailability = !currentAvailability;
      const listingRef = doc(db, 'posts', listingId);
      
      // Mettre à jour Firestore
      await updateDoc(listingRef, {
        available: newAvailability
      });
      
      // Mettre à jour l'état local
      setListings(listings.map(item => 
        item.id === listingId ? { ...item, available: newAvailability } : item
      ));
      
      Alert.alert(
        "Statut modifié",
        `Votre annonce est maintenant ${newAvailability ? "disponible" : "non disponible"}`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error updating availability:", error);
      Alert.alert("Erreur", "Impossible de modifier le statut de disponibilité");
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      await deleteDoc(doc(db, 'posts', listingId));
      setListings(listings.filter(item => item.id !== listingId));
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  const handleBoostListing = async (listingId) => {
    try {
      Alert.alert(
        "Booster cette annonce",
        "Voulez-vous booster cette annonce pour 1000 FCFA ? Elle sera mise en avant pendant 7 jours.",
        [
          {
            text: "Annuler",
            style: "cancel"
          },
          { 
            text: "Booster", 
            onPress: async () => {
              const listingRef = doc(db, 'posts', listingId);
              await updateDoc(listingRef, {
                isBoosted: true,
                boostedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours à partir de maintenant
              });
              
              // Mettre à jour l'état local
              setListings(listings.map(item => 
                item.id === listingId 
                  ? { ...item, isBoosted: true, boostedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
                  : item
              ));
              
              Alert.alert("Succès", "Votre annonce a été boostée avec succès !");
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error boosting listing:", error);
      Alert.alert("Erreur", "Une erreur est survenue lors du boost de l'annonce");
    }
  };

  const renderListingItem = ({ item }) => (
    <View style={[styles.listingCard, item.isBoosted && styles.boostedCard]}>
      {item.isBoosted && (
        <View style={styles.boostedBadge}>
          <FontAwesome name="bolt" size={14} color={COLORS.white} />
          <Text style={styles.boostedText}>Boosté</Text>
        </View>
      )}
      
      <Image 
        source={{ uri: item.imageUrls?.[0] || 'https://via.placeholder.com/300' }} 
        style={styles.listingImage} 
      />
      
      <View style={styles.listingDetails}>
        <Text style={styles.listingPrice}>{item.price} FCFA</Text>
        <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.listingCategory}>{item.category}</Text>
        
        <View style={styles.availabilityContainer}>
          <Text style={styles.availabilityLabel}>
            Disponible: 
          </Text>
          <Switch
            value={item.available}
            onValueChange={() => handleToggleAvailability(item.id, item.available)}
            trackColor={{ false: "#767577", true: COLORS.primary }}
            thumbColor={item.available ? COLORS.white : "#f4f3f4"}
          />
          <Text style={[styles.availabilityStatus, item.available ? styles.available : styles.unavailable]}>
            {item.available ? "Oui" : "Non"}
          </Text>
        </View>
        
        <View style={styles.listingFooter}>
          <View style={styles.listingLocation}>
            <MaterialIcons name="location-on" size={14} color={COLORS.gray} />
            <Text style={styles.listingLocationText}>
              {item.location?.display_name || item.location || 'Non spécifié'}
            </Text>
          </View>
          
          <View style={styles.listingActions}>
            {!item.isBoosted && (
              <TouchableOpacity 
                onPress={() => handleBoostListing(item.id)}
                style={styles.boostButton}
              >
                <FontAwesome name="bolt" size={16} color={COLORS.white} />
                <Text style={styles.boostButtonText}>Booster</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              onPress={() => navigation.navigate('EditListing', { listingId: item.id })}
              style={styles.actionButton}
            >
              <MaterialIcons name="edit" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => handleDeleteListing(item.id)}
              style={styles.actionButton}
            >
              <MaterialIcons name="delete" size={20} color="#E74C3C" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Annonces</Text>
        <View style={{ width: 24 }} /> {/* Pour l'alignement */}
      </View>
      
      {listings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="home-work" size={60} color={COLORS.lightGray} />
          <Text style={styles.emptyText}>Aucune annonce publiée</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('PostAdScreen')}
          >
            <Text style={styles.addButtonText}>Publier une annonce</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={listings}
          renderItem={renderListingItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: SIZES.padding,
  },
  listingCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    position: 'relative',
  },
  boostedCard: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  boostedBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    zIndex: 1,
  },
  boostedText: {
    ...FONTS.body5,
    color: COLORS.white,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  listingImage: {
    width: '100%',
    height: 180,
  },
  listingDetails: {
    padding: SIZES.padding,
  },
  listingPrice: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  listingTitle: {
    ...FONTS.body3,
    color: COLORS.black,
    marginBottom: 4,
  },
  listingCategory: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: 8,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  availabilityLabel: {
    ...FONTS.body4,
    color: COLORS.darkGray,
    marginRight: 8,
  },
  availabilityStatus: {
    ...FONTS.body4,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  available: {
    color: COLORS.success,
  },
  unavailable: {
    color: COLORS.error,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listingLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listingLocationText: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginLeft: 4,
    flexShrink: 1,
  },
  listingActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  boostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  boostButtonText: {
    ...FONTS.body5,
    color: COLORS.white,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  actionButton: {
    marginLeft: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  emptyText: {
    ...FONTS.body3,
    color: COLORS.gray,
    marginTop: SIZES.padding,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  addButtonText: {
    ...FONTS.body3,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default MyListingsScreen;