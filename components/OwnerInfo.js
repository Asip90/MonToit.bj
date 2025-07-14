// // import React, { useEffect, useState } from 'react';
// // import { View, Text, Image, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
// // import { doc, getDoc } from 'firebase/firestore';
// // import { useNavigation } from '@react-navigation/native';
// // import { db } from '../src/api/FirebaseConfig'; // adapte le chemin

// // import { COLORS, SIZES, FONTS } from '../constants/Theme'; // adapte ce chemin

// // const OwnerInfo = ({ userId }) => {
// //   const [ownerData, setOwnerData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const navigation = useNavigation();

// //   useEffect(() => {
// //     const fetchOwner = async () => {
// //       try {
// //         const userDocRef = doc(db, 'users', userId);
// //         const userSnap = await getDoc(userDocRef);

// //         if (!userSnap.exists()) {
// //           Alert.alert("Erreur", "Utilisateur non trouvé");
// //           return;
// //         }

// //         setOwnerData(userSnap.data());
// //       } catch (error) {
// //         console.error('Erreur lors du chargement du propriétaire:', error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchOwner();
// //   }, [userId]);

// //   if (loading) {
// //     return <ActivityIndicator size="small" color={COLORS.primary} />;
// //   }

// //   if (!ownerData) {
// //     return <Text style={{ color: COLORS.gray }}>Propriétaire introuvable</Text>;
// //   }

// //   const {
// //     name,
// //     photoURL,
// //     isVerified,
// //     isVIP,
// //     rating = 4.2,
// //     reviewCount = 23,
// //   } = ownerData;

// //   return (
// //     <View style={styles.container}>
// //       {/* Profil */}
// //       <View style={styles.profileRow}>
// //         <Image
// //           source={photoURL ? { uri: photoURL } : require('../assets/images/default-profile.jpg')}
// //           style={styles.avatar}
// //         />
// //         <View style={styles.info}>
// //           <Text style={FONTS.h3}>{name}</Text>
// //           <View style={styles.row}>
// //             {isVerified && <Text style={styles.verified}>✔️ Vérifié</Text>}
// //             {isVIP && <Text style={styles.vipBadge}>VIP</Text>}
// //           </View>
// //           <Text style={FONTS.body4}>
// //             ⭐ {rating.toFixed(1)} ({reviewCount} avis)
// //           </Text>
// //         </View>
// //       </View>

// //       {/* Bouton de notation */}
// //       <TouchableOpacity
// //         style={styles.button}
// //         onPress={() => navigation.navigate('RateOwnerScreen', { userId })}
// //       >
// //         <Text style={styles.buttonText}>Noter ce propriétaire</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     backgroundColor: COLORS.white,
// //     borderRadius: SIZES.radius,
// //     padding: SIZES.base,
// //     marginVertical: SIZES.base,
// //     elevation: 2,
// //   },
// //   profileRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: SIZES.base,
// //   },
// //   avatar: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     marginRight: SIZES.base,
// //     backgroundColor: COLORS.lightGray,
// //   },
// //   info: {
// //     flex: 1,
// //   },
// //   row: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginVertical: 4,
// //   },
// //   verified: {
// //     color: COLORS.secondary,
// //     fontWeight: 'bold',
// //     marginRight: 8,
// //   },
// //   vipBadge: {
// //     backgroundColor: COLORS.orange,
// //     color: COLORS.white,
// //     paddingHorizontal: 6,
// //     paddingVertical: 2,
// //     borderRadius: 8,
// //     fontSize: 12,
// //     overflow: 'hidden',
// //   },
// //   button: {
// //     backgroundColor: COLORS.primary,
// //     paddingVertical: 10,
// //     borderRadius: SIZES.radius,
// //     alignItems: 'center',
// //     marginTop: SIZES.base,
// //   },
// //   buttonText: {
// //     color: COLORS.white,
// //     fontWeight: 'bold',
// //     ...FONTS.body3,
// //   },
// // });

// // export default OwnerInfo;

// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
// import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '../src/api/FirebaseConfig';
// import { COLORS, SIZES, FONTS } from '../constants/Theme';
// import { useNavigation } from '@react-navigation/native';

// const OwnerInfo = ({ userId }) => {
//     const navigation = useNavigation();
//   const [ownerData, setOwnerData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchOwnerData = async () => {
//       try {
        

//         const userDocRef = doc(db, 'users', userId);
//         const userSnap = await getDoc(userDocRef);
        
//         if (!userSnap.exists()) {
//           throw new Error("Utilisateur non trouvé");
//         }

//         setOwnerData(userSnap.data());
//       } catch (err) {
//         console.error('Erreur lors de la récupération du propriétaire:', err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOwnerData();
//   }, [userId]);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="small" color={COLORS.primary} />
//       </View>
//     );
//   }

//   if (error || !ownerData) {
//     return (
//       <View style={styles.container}>
//         <Text style={[FONTS.body4, { color: COLORS.gray }]}>Information non disponible</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Section Photo et Info de base */}
//       <View style={styles.profileSection}>
//         <Image 
           
//             source = { ownerData.photoURL? { uri: ownerData.photoURL }
//              : require('../assets/images/default-profile.jpg')
//          }
//           style={styles.profileImage}
//         />
        
//         <View style={styles.infoContainer}>
//           <View style={styles.nameContainer}>
//             <Text style={[FONTS.h4, styles.nameText]}>{ownerData.name || 'Anonyme'}</Text>
            
//             {/* Badges */}
//             <View style={styles.badgeContainer}>
//               {ownerData.verified && (
//                 <View style={[styles.badge, styles.verifiedBadge]}>
//                   <MaterialIcons name="verified" size={14} color={COLORS.white} />
//                   <Text style={styles.badgeText}>Vérifié</Text>
//                 </View>
//               )}
              
//               {ownerData.vip && (
//                 <View style={[styles.badge, styles.vipBadge]}>
//                   <FontAwesome name="star" size={12} color={COLORS.gold} />
//                   <Text style={styles.badgeText}>VIP</Text>
//                 </View>
//               )}
//             </View>
//           </View>
          
//           <View style={styles.ratingContainer}>
//             <MaterialIcons name="star" size={16} color={COLORS.orange} />
//             <Text style={[FONTS.body4, styles.ratingText]}>
//               {ownerData.rating?.toFixed(1) || 'N/A'} ({ownerData.reviewCount || 0} avis)
//             </Text>
//           </View>
//         </View>
//       </View>
      
//       {/* Bouton Noter */}
//       <TouchableOpacity 
//         style={styles.rateButton}
//         onPress={() => navigation.navigate('RateOwner', { ownerId: userId })}
//       >
//         <Text style={[FONTS.body4, styles.rateButtonText]}>Noter ce propriétaire</Text>
//         <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
//       </TouchableOpacity>
//        <TouchableOpacity 
//         style={styles.rateButton}
//         onPress={() => navigation.navigate('OwnerReview', { ownerId: userId })}
//       >
//         <Text style={[FONTS.body4, styles.rateButtonText]}>voir les avis sur ce Proprietaire</Text>
//         <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: COLORS.white,
//     borderRadius: SIZES.radius,
//     padding: SIZES.padding,
//     marginBottom: SIZES.padding,
//     elevation: 2,
//   },
//   profileSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: SIZES.padding,
//   },
//   profileImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: SIZES.base,
//   },
//   infoContainer: {
//     flex: 1,
//   },
//   nameContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   nameText: {
//     color: COLORS.black,
//     marginRight: SIZES.base,
//   },
//   badgeContainer: {
//     flexDirection: 'row',
//   },
//   badge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//     marginRight: 4,
//   },
//   verifiedBadge: {
//     backgroundColor: COLORS.primary,
//   },
//   vipBadge: {
//     backgroundColor: COLORS.white,
//     borderWidth: 1,
//     borderColor: COLORS.gold,
//   },
//   badgeText: {
//     ...FONTS.body4,
//     fontSize: 10,
//     color: COLORS.white,
//     marginLeft: 2,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   ratingText: {
//     color: COLORS.gray,
//     marginLeft: 4,
//   },
//   rateButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 10,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.lightGray,
//   },
//   rateButtonText: {
//     color: COLORS.primary,
//   },
// });

// export default OwnerInfo;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../src/api/FirebaseConfig';
import { COLORS, SIZES, FONTS } from '../constants/Theme';
import { useNavigation } from '@react-navigation/native';

/*
  ------------------------------------------------------------------
  OwnerInfo
  Affiche les informations du propriétaire + moyenne des avis.
  Les avis sont stockés dans la sous‑collection "reviews" du document
  utilisateur (users/{userId}/reviews).
  ------------------------------------------------------------------
*/
const OwnerInfo = ({ userId }) => {
  console.log('userId dans OwnerInfo:', userId);
  const navigation = useNavigation();

  // état des infos du propriétaire
  const [ownerData, setOwnerData] = useState(null);
  // état des avis
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // console.log('ownerdta', ownerData)
  /* ----------------------------------------------------------------
     Chargement des données
     1. Récupérer le document user
     2. Récupérer les reviews pour calculer la moyenne
  -----------------------------------------------------------------*/
  useEffect(() => {
    const fetchData = async () => {
      try {
        /* ---- Doc utilisateur ---- */
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        //  console.log('Données du propriétaire:', userSnap);
        if (!userSnap.exists()) throw new Error('Utilisateur non trouvé');
        setOwnerData(userSnap.data());
        // console.log('Données du propriétaire:', userSnap);

        /* ---- Reviews ---- */
        const reviewsRef = collection(userRef, 'reviews');
        const q = query(reviewsRef, orderBy('createdAt', 'desc'));
        const querySnap = await getDocs(q);

        if (!querySnap.empty) {
          let total = 0;
          querySnap.forEach((d) => {
            total += d.data().rating || 0;
          });
          setReviewCount(querySnap.size);
          setAverageRating(total / querySnap.size);
        }
      } catch (err) {
        console.error('Erreur OwnerInfo:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  /* ------------------- UI States ------------------- */
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !ownerData) {
    return (
      <View style={styles.container}>
        <Text style={[FONTS.body4, { color: COLORS.gray }]}>Information non disponible</Text>
      </View>
    );
  }

  /* ------------------- Render ------------------- */
  return (
    <View style={styles.container}>
      {/* Photo + Infos de base */}
      <TouchableOpacity onPress={()=> navigation.navigate('OwnerPosts',{ ownerId : userId, ownerName : ownerData.name})}>
      
      <View style={styles.profileSection}>
        <Image
          source={
            ownerData.photoURL
              ? { uri: ownerData.photoURL }
              : require('../assets/images/default-profile.jpg')
          }
          style={styles.profileImage}
        />

        <View style={styles.infoContainer}>
          {/* Nom + Badges */}
          <View style={styles.nameContainer}>
            <Text style={[FONTS.h4, styles.nameText]}>{ownerData.name || 'Anonyme'}</Text>

            <View style={styles.badgeContainer}>
              {ownerData.verified && (
                <View style={[styles.badge, styles.verifiedBadge]}>
                  <MaterialIcons name="verified" size={14} color={COLORS.white} />
                  <Text style={styles.badgeText}>Vérifié</Text>
                </View>
              )}
              {ownerData.vip && (
                <View style={[styles.badge, styles.vipBadge]}>
                  <FontAwesome name="star" size={12} color={COLORS.gold} />
                  <Text style={styles.badgeText}>VIP</Text>
                </View>
              )}
            </View>
          </View>

          {/* Note moyenne */}
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color={COLORS.orange} />
            <Text style={[FONTS.body4, styles.ratingText]}>
              {reviewCount > 0 ? `${averageRating.toFixed(1)} (${reviewCount} avis)` : 'N/A'}
            </Text>
          </View>
        </View>
      </View>
      </TouchableOpacity>
      {/* Boutons (noter / voir avis) */}
      <TouchableOpacity
        style={styles.rateButton}
        onPress={() => navigation.navigate('RateOwner', { ownerId: userId })}
      >
        <Text style={[FONTS.body4, styles.rateButtonText]}>Noter ce propriétaire</Text>
        <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.rateButton}
        onPress={() => navigation.navigate('OwnerReview', { ownerId: userId })}
      >
        <Text style={[FONTS.body4, styles.rateButtonText]}>Voir les avis sur ce propriétaire</Text>
        <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

/* ----------------------------------------------------------------
  Styles (inchangés)
-----------------------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    elevation: 2,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SIZES.base,
  },
  infoContainer: { flex: 1 },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    color: COLORS.black,
    marginRight: SIZES.base,
  },
  badgeContainer: { flexDirection: 'row' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  verifiedBadge: { backgroundColor: COLORS.primary },
  vipBadge: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  badgeText: {
    ...FONTS.body4,
    fontSize: 10,
    color: COLORS.white,
    marginLeft: 2,
  },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { color: COLORS.gray, marginLeft: 4 },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  rateButtonText: { color: COLORS.primary },
});

export default OwnerInfo;
