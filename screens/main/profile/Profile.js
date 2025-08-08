
// import React, { useState, useEffect, useContext, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   ScrollView,
// } from 'react-native';
// import { Ionicons, MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
// import { UserContext } from '../../../context/AuthContext';
// import { db } from '../../../src/api/FirebaseConfig';
// import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
// import { COLORS, SIZES, FONTS } from '../../../constants/Theme';

// const ProfileScreen = ({ navigation }) => {
  
//   const { userData , logoutUser } = useContext(UserContext);
//   const [userProfile, setUserProfile] = useState(null);
//   const [userPosts, setUserPosts] = useState([]);
//   const [favoritesCount, setFavoritesCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//    const [verificationModalVisible, setVerificationModalVisible] = useState(false);
//   const [verificationStatus, setVerificationStatus] = useState('non_verifie'); // 'non_verifie', 'en_attente', 'verifie'

//   const loadData = useCallback(async () => {
//     try {
//       if (!userData?.uid) {
//         setLoading(false);
//         setRefreshing(false);
//         return;
//       }

//       // Charger le profil utilisateur
//       const userDoc = await getDoc(doc(db, 'users', userData.uid));
//       if (userDoc.exists()) {
//         setUserProfile(userDoc.data());
//       } else {
//         setUserProfile({
//           email: userData.email || '',
//           name: userData.displayName || '',
//           photoURL: userData.photoURL || null
//         });
//       }

//       // Charger les posts de l'utilisateur (seulement 3 pour l'aperçu)
//       const postsQuery = query(
//         collection(db, 'posts'),
//         where('userId', '==', userData.uid),
//         orderBy('createdAt', 'desc')
//       );
//       const postsSnapshot = await getDocs(postsQuery);
//       setUserPosts(postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

//       // Charger le nombre de favoris
//       const favoritesQuery = query(
//         collection(db, 'users', userData.uid, 'favorites')
//       );
//       const favoritesSnapshot = await getDocs(favoritesQuery);
//       setFavoritesCount(favoritesSnapshot.size);
//     } catch (error) {
//       console.error("Erreur de chargement:", error);
//       Alert.alert("Erreur", "Impossible de charger les données");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [userData]);

//   useEffect(() => {
//     if (userData) {
//       loadData();
//     }
//   }, [userData, loadData]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadData();
//   };

//   const renderPostItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.postItem}
//       onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
//     >
//       <Image 
//         source={{ uri: item.imageUrls?.[0] || 'https://via.placeholder.com/150' }} 
//         style={styles.postImage}
//       />
//       <View style={styles.postInfo}>
//         <Text style={styles.postTitle} numberOfLines={1}>{item.title || 'Sans titre'}</Text>
//         <View style={styles.postMeta}>
//           <Text style={styles.postPrice}>{item.price ? `${item.price} FCFA` : 'Prix sur demande'}</Text>
//           <View style={styles.postLocation}>
//             <Ionicons name="location-outline" size={14} color={COLORS.gray} />
//             <Text style={styles.locationText}>{item.location || 'Localisation non précisée'}</Text>
//           </View>
//         </View>
//         <Text style={styles.postDate}>
//           {item.createdAt?.toDate ? new Date(item.createdAt.toDate()).toLocaleDateString() : ''}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   if (!userData) {
//     return (
//       <View style={styles.authContainer}>
//         <Image 
//           source={require('../../../assets/icon.png')} 
//           style={styles.logo}
//         />
//         <Text style={styles.authText}>Connectez-vous pour gérer vos propriétés</Text>
//         <TouchableOpacity 
//           style={styles.authButton}
//           onPress={() => navigation.navigate('Auth')}
//         >
//           <Text style={styles.authButtonText}>Connexion / Inscription</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//       </View>
//     );
//   }

 

//   const handleLogout = () => {
//     Alert.alert(
//       "Déconnexion",
//       "Êtes-vous sûr de vouloir vous déconnecter ?",
//       [
//         { text: "Annuler", style: "cancel" },
//         {
//           text: "Se Déconnecter",
//           onPress: async () => {
//             if (logoutUser && typeof logoutUser === 'function') {
//               const success = await logoutUser();
//               if (!success) {
//                 Alert.alert("Erreur", "La déconnexion a échoué");
//               }
//             }
//           },
//           style: "destructive",
//         },
//       ]
//     );
//   };

 

//   // Charger le statut de vérification
//   useEffect(() => {
//     const loadVerificationStatus = async () => {
//       if (userData?.uid) {
//         const verifDoc = await getDoc(doc(db, 'users', userData.uid));
//         if (verifDoc.exists() && verifDoc.data().verificationStatus) {
//           setVerificationStatus(verifDoc.data().verificationStatus);
//         }
//       }
//     };
//     loadVerificationStatus();
//   }, [userData]);

//   // Rendu du bouton de vérification
//   const renderVerificationButton = () => {
//     const buttonStyles = {
//       non_verifie: { backgroundColor: COLORS.error },
//       en_attente: { backgroundColor: COLORS.warning },
//       verifie: { backgroundColor: COLORS.success }
//     };

//     const buttonTexts = {
//       non_verifie: "Ce compte n'est pas vérifié",
//       en_attente: "Vérification en cours",
//       verifie: "Compte vérifié"
//     };

//     return (
//       <TouchableOpacity
//         style={[styles.verificationButton, buttonStyles[verificationStatus]]}
//         onPress={() => verificationStatus === 'non_verifie' && setVerificationModalVisible(true)}
//         disabled={verificationStatus !== 'non_verifie'}
//       >
//         <Text style={styles.verificationButtonText}>
//           {buttonTexts[verificationStatus]}
//         </Text>
//         {verificationStatus === 'verifie' && (
//           <Ionicons name="checkmark-circle" size={20} color="white" style={styles.verifiedIcon} />
//         )}
//       </TouchableOpacity>
//       );};
//   const profileData = userProfile || {
//     email: userData.email || '',
//     name: userData.displayName || userData.email?.split('@')[0] || 'Utilisateur',
//     photoURL: userData.photoURL || null,
//     phone: ''
//   };

//   return (
//     <ScrollView
//     showsVerticalScrollIndicator={false}
//       style={styles.container}
//       refreshControl={
//         <RefreshControl 
//           refreshing={refreshing} 
//           onRefresh={onRefresh}
//           tintColor={COLORS.primary}
//         />
//       }
//     >
//       {/* Header Zameen-like */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Mon Profil</Text>
//       </View>

//       {/* Section profil */}
//       <View style={styles.profileSection}>
//         <View style={styles.avatarContainer}>
//           <Image
//             source={profileData.photoURL ? 
//               { uri: profileData.photoURL } : 
//               require('../../../assets/images/default-profile.jpg')}
//             style={styles.avatar}
//           />
//         </View>

//         <Text style={styles.userName}>{profileData.name}</Text>
        
//         <View style={styles.profileActions}>
//           <TouchableOpacity 
//             style={styles.profileActionButton}
//             onPress={() => navigation.navigate('EditProfile', { profileData })}
//           >
//             <Ionicons name="pencil-outline" size={18} color={COLORS.primary} />
//             <Text style={styles.profileActionText}>Modifier</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.profileActionButton}
//             onPress={() => navigation.navigate('Settings')}
//           >
//             <Ionicons name="settings-outline" size={18} color={COLORS.primary} />
//             <Text style={styles.profileActionText}>Paramètres</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Statistiques Zameen-like */}
//       <View style={styles.statsContainer}>
//         <TouchableOpacity style={styles.statItem}>
//           <View style={styles.statIconCircle}>
//             <FontAwesome name="home" size={20} color={COLORS.primary} />
//           </View>
//           <Text style={styles.statValue}>{userPosts.length}</Text>
//           <Text style={styles.statLabel}>Annonces</Text>
//         </TouchableOpacity>

//         <TouchableOpacity 
//           style={styles.statItem}
//           onPress={() => navigation.navigate('Favorites')}
//         >
//           <View style={styles.statIconCircle}>
//             <AntDesign name="heart" size={18} color={COLORS.primary} />
//           </View>
//           <Text style={styles.statValue}>{favoritesCount}</Text>
//           <Text style={styles.statLabel}>Favoris</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.statItem}>
//           <View style={styles.statIconCircle}>
//             <Ionicons name="chatbubble-ellipses-outline" size={18} color={COLORS.primary} />
//           </View>
//           <Text style={styles.statValue}>0</Text>
//           <Text style={styles.statLabel}>Messages</Text>
//         </TouchableOpacity>
//           <VerificationModal
//         visible={verificationModalVisible}
//         onClose={() => setVerificationModalVisible(false)}
//         userId={userData?.uid}
//         onSubmissionSuccess={() => setVerificationStatus('en_attente')}
//       />
//       </View>

//       {/* Section Mes Annonces */}
//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Mes Annonces</Text>
//           {userPosts.length > 0 && (
//             <TouchableOpacity onPress={() => navigation.navigate('MyProperties')}>
//               <Text style={styles.seeAll}>Tout voir</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {userPosts.length > 0 ? (
//           <FlatList
//             data={userPosts.slice(0, 3)} // Seulement 3 éléments comme dans Zameen
//             renderItem={renderPostItem}
//             keyExtractor={item => item.id}
//             scrollEnabled={false}
//             contentContainerStyle={styles.postsList}
//           />
//         ) : (
//           <View style={styles.emptyState}>
//             <Image 
//               source={require('../../../assets/adaptive-icon.png')} 
//               style={styles.emptyImage}
//             />
//             <Text style={styles.emptyText}>Vous n'avez pas encore d'annonces</Text>
//             <Text style={styles.emptySubtext}>Publiez votre première propriété</Text>
//             <TouchableOpacity 
//               style={styles.addButton}
//               onPress={() => navigation.navigate('PostAd')}
//             >
//               <Text style={styles.addButtonText}>+ Publier une annonce</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>

//       {/* Autres options du menu comme dans Zameen */}
//       <View style={styles.menuSection}>
//         <TouchableOpacity style={styles.menuItem}>
//           <Ionicons name="notifications-outline" size={22} color={COLORS.black} />
//           <Text style={styles.menuText}>Notifications</Text>
//           <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.gray} />
//         </TouchableOpacity>

//         <TouchableOpacity onPress={()=>{ navigation.navigate('Subscription')}}  style={styles.menuItem}>
//           <Ionicons name="wallet-outline" size={22} color={COLORS.black} />
//           <Text style={styles.menuText}>Abonnements</Text>
//           <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.gray} />
//         </TouchableOpacity>

//         {/* <TouchableOpacity style={styles.menuItem}>
//           <Ionicons name="help-circle-outline" size={22} color={COLORS.black} />
//           <Text style={styles.menuText}>Aide & Support</Text>
//           <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.gray} />
//         </TouchableOpacity> */}
//         <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
//           <Ionicons name='log-out' size={22} color={COLORS.error || '#e74c3c'} />
//           <Text style={styles.logoutText }>Deconnexion</Text>
//           <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.gray} />
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };



// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.lightGray,
//   },
//   header: {
//     padding: 16,
//     backgroundColor: COLORS.primary,
//   },
//   headerTitle: {
//     ...FONTS.h2,
//     color: COLORS.white,
//     textAlign: 'center',
//   },
//   authContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: SIZES.padding * 2,
//     backgroundColor: COLORS.white,
//   },
//   logo: {
//     width: 120,
//     height: 50,
//     resizeMode: 'contain',
//     marginBottom: 30,
//   },
//   authText: {
//     ...FONTS.body3,
//     marginBottom: 20,
//     textAlign: 'center',
//     color: COLORS.black,
//   },
//   authButton: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 14,
//     paddingHorizontal: 40,
//     borderRadius: 4,
//     elevation: 2,
//   },
//   authButtonText: {
//     color: COLORS.white,
//     ...FONTS.h4,
//     fontWeight: 'bold',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//   },
//   profileSection: {
//     alignItems: 'center',
//     paddingVertical: 25,
//     paddingHorizontal: 20,
//     backgroundColor: COLORS.white,
//     marginBottom: 10,
//   },
//   avatarContainer: {
//     marginBottom: 15,
//   },
//   avatar: {
//     width: 90,
//     height: 90,
//     borderRadius: 45,
//     borderWidth: 2,
//     borderColor: COLORS.primary,
//   },
//   userName: {
//     ...FONTS.h2,
//     marginBottom: 15,
//     color: COLORS.black,
//   },
//   profileActions: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     width: '100%',
//   },
//   profileActionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 15,
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 20,
//   },
//   profileActionText: {
//     marginLeft: 5,
//     color: COLORS.primary,
//     ...FONTS.body4,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 20,
//     backgroundColor: COLORS.white,
//     marginBottom: 10,
//   },
//   statItem: {
//     alignItems: 'center',
//     width: '30%',
//   },
//   statIconCircle: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#E8F5E9',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   statValue: {
//     ...FONTS.h3,
//     color: COLORS.black,
//     fontWeight: 'bold',
//     marginBottom: 3,
//   },
//   statLabel: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//   },
//   section: {
//     backgroundColor: COLORS.white,
//     marginBottom: 10,
//     paddingVertical: 10,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.lightGray,
//   },
//   sectionTitle: {
//     ...FONTS.h3,
//     color: COLORS.black,
//     fontWeight: 'bold',
//   },
//   seeAll: {
//     ...FONTS.body4,
//     color: COLORS.primary,
//   },
//   postsList: {
//     paddingBottom: 5,
//   },
//   postItem: {
//     flexDirection: 'row',
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.lightGray,
//   },
//   postImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 5,
//     marginRight: 12,
//   },
//   postInfo: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   postTitle: {
//     ...FONTS.body3,
//     color: COLORS.black,
//     marginBottom: 5,
//   },
//   postMeta: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   postPrice: {
//     ...FONTS.body4,
//     color: COLORS.primary,
//     fontWeight: 'bold',
//     marginRight: 15,
//   },
//   postLocation: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   locationText: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//     marginLeft: 3,
//   },
//   postDate: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//     fontSize: 12,
//   },
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: 30,
//     paddingHorizontal: 20,
//   },
//   emptyImage: {
//     width: 120,
//     height: 120,
//     marginBottom: 15,
//     opacity: 0.7,
//   },
//   emptyText: {
//     ...FONTS.h4,
//     color: COLORS.black,
//     marginBottom: 5,
//   },
//   emptySubtext: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//     marginBottom: 20,
//   },
//   addButton: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 12,
//     paddingHorizontal: 25,
//     borderRadius: 4,
//   },
//   addButtonText: {
//     color: COLORS.white,
//     ...FONTS.h4,
//     fontWeight: 'bold',
//   },
//   menuSection: {
//     backgroundColor: COLORS.white,
//     marginBottom: 10,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.lightGray,
//   },
//   menuText: {
//     ...FONTS.body3,
//     color: COLORS.black,
//     flex: 1,
//     marginLeft: 15,
//   },
//   logoutText: {
//     ...FONTS.body3,
//     color: COLORS.error || '#e74c3c',
//     flex: 1,
//     marginLeft: 15,
//     fontWeight: '500',
//     marginLeft: SIZES.base,
//   },
//   verificationButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     marginVertical: 15,
//   },
//   verificationButtonText: {
//     ...FONTS.body4,
//     color: COLORS.white,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   verifiedIcon: {
//     marginLeft: 8,
//   },
// });

// export default ProfileScreen;

// import React, { useState, useEffect, useContext, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   ScrollView,
//   Modal
// } from 'react-native';
// import { Ionicons, MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
// import { UserContext } from '../../../context/AuthContext';
// import { db } from '../../../src/api/FirebaseConfig';
// import { doc, setDoc, getDoc, collection, query, where, getDocs, orderBy, addDoc } from 'firebase/firestore';
// import { COLORS, SIZES, FONTS } from '../../../constants/Theme';
// import * as ImagePicker from 'expo-image-picker';

// // Configuration Cloudinary
// const CLOUDINARY_CLOUD_NAME = "dfpxwlhu0";
// const UPLOAD_PRESET_NAME = "My_ROOMAPP_Media_file";
// const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

// // Composant VerificationModal
// const VerificationModal = ({ visible, onClose, userId, onSubmissionSuccess }) => {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission requise', 'Nous avons besoin de la permission pour accéder à vos photos');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.8,
//       allowsEditing: true,
//       aspect: [3, 2]
//     });

//     if (!result.canceled && result.assets?.[0]?.uri) {
//       setSelectedImage(result.assets[0].uri);
//     }
//   };

//   const uploadToCloudinary = async (uri) => {
//     const formData = new FormData();
//     const filename = uri.split('/').pop();
    
//     formData.append('file', {
//       uri,
//       name: filename,
//       type: `image/${filename.split('.').pop()}`
//     });
//     formData.append('upload_preset', UPLOAD_PRESET_NAME);
//     formData.append('folder', 'identity_verification');

//     const response = await fetch(CLOUDINARY_UPLOAD_URL, {
//       method: 'POST',
//       body: formData,
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     const data = await response.json();
//     if (!response.ok) {
//       console.error('Erreur Cloudinary:', data);
//       throw new Error(data.error?.message || 'Upload failed');
//     }
//     return data.secure_url;
//   };

//   const handleSubmit = async () => {
//     if (!selectedImage || !userId) return;

//     setUploading(true);
    
//     try {
//       // Upload de l'image vers Cloudinary
//       const idCardUrl = await uploadToCloudinary(selectedImage);

//       // Enregistrement dans Firestore
//       await addDoc(collection(db, 'verificationRequests'), {
//         userId,
//         idCardUrl,
//         status: 'pending',
//         createdAt: new Date(),
//       });

//       // Mettre à jour le statut de l'utilisateur
//       await setDoc(doc(db, 'users', userId), {
//         verificationStatus: 'en_attente'
//       }, { merge: true });

//       onSubmissionSuccess();
//       onClose();
//       Alert.alert("Succès", "Votre demande a été soumise avec succès");

//     } catch (error) {
//       console.error("Erreur de soumission:", error);
//       Alert.alert("Erreur", "Une erreur s'est produite lors de la soumission: " + error.message);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <Text style={styles.modalTitle}>Vérification d'identité</Text>
          
//           <Text style={styles.modalText}>
//             Veuillez uploader une photo claire de l'une de ces pièces :
//           </Text>
          
//           <Text style={styles.idTypes}>
//             • Carte d'identité • Passeport • Certificat d'identification (CIP)
//           </Text>

//           {selectedImage ? (
//             <Image source={{ uri: selectedImage }} style={styles.idCardImage} />
//           ) : (
//             <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
//               <Ionicons name="cloud-upload-outline" size={50} color={COLORS.primary} />
//               <Text style={styles.uploadButtonText}>Sélectionner une pièce d'identité</Text>
//             </TouchableOpacity>
//           )}

//           <View style={styles.buttonContainer}>
//             <TouchableOpacity 
//               style={styles.cancelButton} 
//               onPress={onClose}
//               disabled={uploading}
//             >
//               <Text style={styles.cancelButtonText}>Annuler</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity 
//               style={styles.submitButton} 
//               onPress={handleSubmit}
//               disabled={!selectedImage || uploading}
//             >
//               {uploading ? (
//                 <ActivityIndicator color="white" />
//               ) : (
//                 <Text style={styles.submitButtonText}>Soumettre</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const ProfileScreen = ({ navigation }) => {
//   // Tous les hooks déclarés au début
//   const { userData, logoutUser } = useContext(UserContext);
//   const [userProfile, setUserProfile] = useState(null);
//   const [userPosts, setUserPosts] = useState([]);
//   const [favoritesCount, setFavoritesCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [verificationModalVisible, setVerificationModalVisible] = useState(false);
//   const [verificationStatus, setVerificationStatus] = useState('non_verifie');

//   const loadData = useCallback(async () => {
//     try {
//       if (!userData?.uid) {
//         setLoading(false);
//         setRefreshing(false);
//         return;
//       }

//       // Charger le profil utilisateur
//       const userDoc = await getDoc(doc(db, 'users', userData.uid));
//       if (userDoc.exists()) {
//         setUserProfile(userDoc.data());
//         // Mettre à jour le statut de vérification
//         if (userDoc.data().verificationStatus) {
//           setVerificationStatus(userDoc.data().verificationStatus);
//         }
//       } else {
//         setUserProfile({
//           email: userData.email || '',
//           name: userData.displayName || '',
//           photoURL: userData.photoURL || null
//         });
//       }

//       // Charger les posts de l'utilisateur
//       const postsQuery = query(
//         collection(db, 'posts'),
//         where('userId', '==', userData.uid),
//         orderBy('createdAt', 'desc')
//       );
//       const postsSnapshot = await getDocs(postsQuery);
//       setUserPosts(postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

//       // Charger le nombre de favoris
//       const favoritesQuery = query(
//         collection(db, 'users', userData.uid, 'favorites')
//       );
//       const favoritesSnapshot = await getDocs(favoritesQuery);
//       setFavoritesCount(favoritesSnapshot.size);
//     } catch (error) {
//       console.error("Erreur de chargement:", error);
//       Alert.alert("Erreur", "Impossible de charger les données");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [userData]);

//   useEffect(() => {
//     if (userData) {
//       loadData();
//     }
//   }, [userData, loadData]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadData();
//   };

//   const renderPostItem = ({ item }) => (
//     <TouchableOpacity 
//       style={styles.postItem}
//       onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
//     >
//       <Image 
//         source={{ uri: item.imageUrls?.[0] || 'https://via.placeholder.com/150' }} 
//         style={styles.postImage}
//       />
//       <View style={styles.postInfo}>
//         <Text style={styles.postTitle} numberOfLines={1}>{item.title || 'Sans titre'}</Text>
//         <View style={styles.postMeta}>
//           <Text style={styles.postPrice}>{item.price ? `${item.price} FCFA` : 'Prix sur demande'}</Text>
//           <View style={styles.postLocation}>
//             <Ionicons name="location-outline" size={14} color={COLORS.gray} />
//             <Text style={styles.locationText}>{item.location || 'Localisation non précisée'}</Text>
//           </View>
//         </View>
//         <Text style={styles.postDate}>
//           {item.createdAt?.toDate ? new Date(item.createdAt.toDate()).toLocaleDateString() : ''}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   if (!userData) {
//     return (
//       <View style={styles.authContainer}>
//         <Image 
//           source={require('../../../assets/icon.png')} 
//           style={styles.logo}
//         />
//         <Text style={styles.authText}>Connectez-vous pour gérer vos propriétés</Text>
//         <TouchableOpacity 
//           style={styles.authButton}
//           onPress={() => navigation.navigate('Auth')}
//         >
//           <Text style={styles.authButtonText}>Connexion / Inscription</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//       </View>
//     );
//   }

//   const handleLogout = () => {
//     Alert.alert(
//       "Déconnexion",
//       "Êtes-vous sûr de vouloir vous déconnecter ?",
//       [
//         { text: "Annuler", style: "cancel" },
//         {
//           text: "Se Déconnecter",
//           onPress: async () => {
//             if (logoutUser && typeof logoutUser === 'function') {
//               const success = await logoutUser();
//               if (!success) {
//                 Alert.alert("Erreur", "La déconnexion a échoué");
//               }
//             }
//           },
//           style: "destructive",
//         },
//       ]
//     );
//   };

//   // Rendu du bouton de vérification
//   const renderVerificationButton = () => {
//     const buttonStyles = {
//       non_verifie: { backgroundColor: COLORS.red },
//       en_attente: { backgroundColor: COLORS.gray },
//       verifie: { backgroundColor: COLORS.primary }
//     };

//     const buttonTexts = {
//       non_verifie: "Ce compte n'est pas vérifié",
//       en_attente: "Vérification en cours",
//       verifie: "Compte vérifié"
//     };

//     return (
//       <TouchableOpacity
//         style={[styles.verificationButton, buttonStyles[verificationStatus]]}
//         onPress={() => verificationStatus === 'non_verifie' && setVerificationModalVisible(true)}
//         disabled={verificationStatus !== 'non_verifie'}
//       >
//         <Text style={styles.verificationButtonText}>
//           {buttonTexts[verificationStatus]}
//         </Text>
//         {verificationStatus === 'verifie' && (
//           <Ionicons name="checkmark-circle" size={20} color="white" style={styles.verifiedIcon} />
//         )}
//       </TouchableOpacity>
//     );
//   };

//   const profileData = userProfile || {
//     email: userData.email || '',
//     name: userData.displayName || userData.email?.split('@')[0] || 'Utilisateur',
//     photoURL: userData.photoURL || null,
//     phone: ''
//   };

//   return (
//     <ScrollView
//       showsVerticalScrollIndicator={false}
//       style={styles.container}
//       refreshControl={
//         <RefreshControl 
//           refreshing={refreshing} 
//           onRefresh={onRefresh}
//           tintColor={COLORS.primary}
//         />
//       }
//     >
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Mon Profil</Text>
//       </View>

//       {/* Section profil */}
//       <View style={styles.profileSection}>
//         <View style={styles.avatarContainer}>
//           <Image
//             source={profileData.photoURL ? 
//               { uri: profileData.photoURL } : 
//               require('../../../assets/images/default-profile.jpg')}
//             style={styles.avatar}
//           />
//         </View>

//         <Text style={styles.userName}>{profileData.name}</Text>
        
//         {/* Bouton de vérification d'identité */}
//         {renderVerificationButton()}
        
//         <View style={styles.profileActions}>
//           <TouchableOpacity 
//             style={styles.profileActionButton}
//             onPress={() => navigation.navigate('EditProfile', { profileData })}
//           >
//             <Ionicons name="pencil-outline" size={18} color={COLORS.primary} />
//             <Text style={styles.profileActionText}>Modifier</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={styles.profileActionButton}
//             onPress={() => navigation.navigate('Settings')}
//           >
//             <Ionicons name="settings-outline" size={18} color={COLORS.primary} />
//             <Text style={styles.profileActionText}>Paramètres</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Statistiques */}
//       <View style={styles.statsContainer}>
//         <TouchableOpacity style={styles.statItem}>
//           <View style={styles.statIconCircle}>
//             <FontAwesome name="home" size={20} color={COLORS.primary} />
//           </View>
//           <Text style={styles.statValue}>{userPosts.length}</Text>
//           <Text style={styles.statLabel}>Annonces</Text>
//         </TouchableOpacity>

//         <TouchableOpacity 
//           style={styles.statItem}
//           onPress={() => navigation.navigate('Favorites')}
//         >
//           <View style={styles.statIconCircle}>
//             <AntDesign name="heart" size={18} color={COLORS.primary} />
//           </View>
//           <Text style={styles.statValue}>{favoritesCount}</Text>
//           <Text style={styles.statLabel}>Favoris</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.statItem}>
//           <View style={styles.statIconCircle}>
//             <Ionicons name="chatbubble-ellipses-outline" size={18} color={COLORS.primary} />
//           </View>
//           <Text style={styles.statValue}>0</Text>
//           <Text style={styles.statLabel}>Messages</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Section Mes Annonces */}
//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Mes Annonces</Text>
//           {userPosts.length > 0 && (
//             <TouchableOpacity onPress={() => navigation.navigate('MyProperties')}>
//               <Text style={styles.seeAll}>Tout voir</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {userPosts.length > 0 ? (
//           <FlatList
//             data={userPosts.slice(0, 3)}
//             renderItem={renderPostItem}
//             keyExtractor={item => item.id}
//             scrollEnabled={false}
//             contentContainerStyle={styles.postsList}
//           />
//         ) : (
//           <View style={styles.emptyState}>
//             <Image 
//               source={require('../../../assets/adaptive-icon.png')} 
//               style={styles.emptyImage}
//             />
//             <Text style={styles.emptyText}>Vous n'avez pas encore d'annonces</Text>
//             <Text style={styles.emptySubtext}>Publiez votre première propriété</Text>
//             <TouchableOpacity 
//               style={styles.addButton}
//               onPress={() => navigation.navigate('PostAd')}
//             >
//               <Text style={styles.addButtonText}>+ Publier une annonce</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>

//       {/* Options du menu */}
//       <View style={styles.menuSection}>
//         {/* <TouchableOpacity style={styles.menuItem}>
//           <Ionicons name="notifications-outline" size={22} color={COLORS.black} />
//           <Text style={styles.menuText}>Notifications</Text>
//           <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.gray} />
//         </TouchableOpacity> */}

//         {/* <TouchableOpacity onPress={()=>{ navigation.navigate('Subscription')}}  style={styles.menuItem}>
//           <Ionicons name="wallet-outline" size={22} color={COLORS.black} />
//           <Text style={styles.menuText}>Abonnements</Text>
//           <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.gray} />
//         </TouchableOpacity> */}

//         <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
//           <Ionicons name='log-out' size={22} color={COLORS.error || '#e74c3c'} />
//           <Text style={styles.logoutText }>Deconnexion</Text>
//           <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.gray} />
//         </TouchableOpacity>
//       </View>

//       {/* Modal de vérification */}
//       <VerificationModal
//         visible={verificationModalVisible}
//         onClose={() => setVerificationModalVisible(false)}
//         userId={userData?.uid}
//         onSubmissionSuccess={() => setVerificationStatus('en_attente')}
//       />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.lightGray,
//   },
//   header: {
//     padding: 16,
//     backgroundColor: COLORS.primary,
//   },
//   headerTitle: {
//     ...FONTS.h2,
//     color: COLORS.white,
//     textAlign: 'center',
//   },
//   authContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: SIZES.padding * 2,
//     backgroundColor: COLORS.white,
//   },
//   logo: {
//     width: 120,
//     height: 50,
//     resizeMode: 'contain',
//     marginBottom: 30,
//   },
//   authText: {
//     ...FONTS.body3,
//     marginBottom: 20,
//     textAlign: 'center',
//     color: COLORS.black,
//   },
//   authButton: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 14,
//     paddingHorizontal: 40,
//     borderRadius: 4,
//     elevation: 2,
//   },
//   authButtonText: {
//     color: COLORS.white,
//     ...FONTS.h4,
//     fontWeight: 'bold',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//   },
//   profileSection: {
//     alignItems: 'center',
//     paddingVertical: 25,
//     paddingHorizontal: 20,
//     backgroundColor: COLORS.white,
//     marginBottom: 10,
//   },
//   avatarContainer: {
//     marginBottom: 15,
//   },
//   avatar: {
//     width: 90,
//     height: 90,
//     borderRadius: 45,
//     borderWidth: 2,
//     borderColor: COLORS.primary,
//   },
//   userName: {
//     ...FONTS.h2,
//     marginBottom: 15,
//     color: COLORS.black,
//   },
//   profileActions: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     width: '100%',
//   },
//   profileActionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 15,
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 20,
//   },
//   profileActionText: {
//     marginLeft: 5,
//     color: COLORS.primary,
//     ...FONTS.body4,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 20,
//     backgroundColor: COLORS.white,
//     marginBottom: 10,
//   },
//   statItem: {
//     alignItems: 'center',
//     width: '30%',
//   },
//   statIconCircle: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#E8F5E9',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   statValue: {
//     ...FONTS.h3,
//     color: COLORS.black,
//     fontWeight: 'bold',
//     marginBottom: 3,
//   },
//   statLabel: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//   },
//   section: {
//     backgroundColor: COLORS.white,
//     marginBottom: 10,
//     paddingVertical: 10,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.lightGray,
//   },
//   sectionTitle: {
//     ...FONTS.h3,
//     color: COLORS.black,
//     fontWeight: 'bold',
//   },
//   seeAll: {
//     ...FONTS.body4,
//     color: COLORS.primary,
//   },
//   postsList: {
//     paddingBottom: 5,
//   },
//   postItem: {
//     flexDirection: 'row',
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.lightGray,
//   },
//   postImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 5,
//     marginRight: 12,
//   },
//   postInfo: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   postTitle: {
//     ...FONTS.body3,
//     color: COLORS.black,
//     marginBottom: 5,
//   },
//   postMeta: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 5,
//   },
//   postPrice: {
//     ...FONTS.body4,
//     color: COLORS.primary,
//     fontWeight: 'bold',
//     marginRight: 15,
//   },
//   postLocation: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   locationText: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//     marginLeft: 3,
//   },
//   postDate: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//     fontSize: 12,
//   },
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: 30,
//     paddingHorizontal: 20,
//   },
//   emptyImage: {
//     width: 120,
//     height: 120,
//     marginBottom: 15,
//     opacity: 0.7,
//   },
//   emptyText: {
//     ...FONTS.h4,
//     color: COLORS.black,
//     marginBottom: 5,
//   },
//   emptySubtext: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//     marginBottom: 20,
//   },
//   addButton: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 12,
//     paddingHorizontal: 25,
//     borderRadius: 4,
//   },
//   addButtonText: {
//     color: COLORS.white,
//     ...FONTS.h4,
//     fontWeight: 'bold',
//   },
//   menuSection: {
//     backgroundColor: COLORS.white,
//     marginBottom: 10,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.lightGray,
//   },
//   menuText: {
//     ...FONTS.body3,
//     color: COLORS.black,
//     flex: 1,
//     marginLeft: 15,
//   },
//   logoutText: {
//     ...FONTS.body3,
//     color: COLORS.error || '#e74c3c',
//     flex: 1,
//     marginLeft: 15,
//     fontWeight: '500',
//   },
//   verificationButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     marginVertical: 15,
//     minWidth: '80%',
//   },
//   verificationButtonText: {
//     ...FONTS.body4,
//     color: COLORS.white,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   verifiedIcon: {
//     marginLeft: 8,
//   },
//   // Styles pour la modal
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     width: '90%',
//     backgroundColor: 'white',
//     borderRadius: 15,
//     padding: 20,
//     alignItems: 'center',
//   },
//   modalTitle: {
//     ...FONTS.h3,
//     marginBottom: 15,
//     color: COLORS.black,
//   },
//   modalText: {
//     ...FONTS.body4,
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   idTypes: {
//     ...FONTS.body4,
//     textAlign: 'center',
//     marginBottom: 20,
//     fontStyle: 'italic',
//   },
//   idCardImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 10,
//     marginBottom: 20,
//     resizeMode: 'contain',
//     backgroundColor: COLORS.lightGray,
//   },
//   uploadButton: {
//     alignItems: 'center',
//     padding: 20,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderRadius: 10,
//     marginBottom: 20,
//     width: '100%',
//   },
//   uploadButtonText: {
//     ...FONTS.body4,
//     color: COLORS.primary,
//     marginTop: 10,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   cancelButton: {
//     backgroundColor: COLORS.gray,
//     padding: 15,
//     borderRadius: 8,
//     flex: 1,
//     marginRight: 10,
//     alignItems: 'center',
//   },
//   submitButton: {
//     backgroundColor: COLORS.primary,
//     padding: 15,
//     borderRadius: 8,
//     flex: 1,
//     marginLeft: 10,
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     ...FONTS.body4,
//     color: COLORS.white,
//   },
//   submitButtonText: {
//     ...FONTS.body4,
//     color: COLORS.white,
//     fontWeight: 'bold',
//   },
// });

// export default ProfileScreen;
// ProfileScreen.jsx
import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Modal,
  Platform,
  Animated,
  Easing,
  Pressable
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { UserContext } from '../../../context/AuthContext';
import { db } from '../../../src/api/FirebaseConfig';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  addDoc
} from 'firebase/firestore';
import { COLORS, SIZES, FONTS } from '../../../constants/Theme';
import * as ImagePicker from 'expo-image-picker';

// Configuration Cloudinary
const CLOUDINARY_CLOUD_NAME = "dfpxwlhu0";
const UPLOAD_PRESET_NAME = "My_ROOMAPP_Media_file";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

/* ---------------------- VerificationModal (UI uniquement) ---------------------- */
const VerificationModal = ({ visible, onClose, userId, onSubmissionSuccess }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Nous avons besoin de la permission pour accéder à vos photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [3, 2]
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadToCloudinary = async (uri) => {
    const formData = new FormData();
    const filename = uri.split('/').pop();

    formData.append('file', {
      uri,
      name: filename,
      type: `image/${filename.split('.').pop()}`
    });
    formData.append('upload_preset', UPLOAD_PRESET_NAME);
    formData.append('folder', 'identity_verification');

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Erreur Cloudinary:', data);
      throw new Error(data.error?.message || 'Upload failed');
    }
    return data.secure_url;
  };

  const handleSubmit = async () => {
    if (!selectedImage || !userId) return;

    setUploading(true);

    try {
      const idCardUrl = await uploadToCloudinary(selectedImage);

      await addDoc(collection(db, 'verificationRequests'), {
        userId,
        idCardUrl,
        status: 'pending',
        createdAt: new Date(),
      });

      await setDoc(doc(db, 'users', userId), {
        verificationStatus: 'en_attente'
      }, { merge: true });

      onSubmissionSuccess?.();
      onClose?.();
      Alert.alert("Succès", "Votre demande a été soumise avec succès");
    } catch (error) {
      console.error("Erreur de soumission:", error);
      Alert.alert("Erreur", "Une erreur s'est produite lors de la soumission: " + (error.message || ''));
    } finally {
      setUploading(false);
    }
  };

  const animatePress = (toValue = 0.96) => {
    Animated.spring(scale, {
      toValue,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6
    }).start(() => {
      if (toValue === 0.96) {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }).start();
      }
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.modalContent, { transform: [{ scale }] }]}>
          <Text style={styles.modalTitle}>Vérification d'identité</Text>

          <Text style={styles.modalText}>
            Uploadez une photo claire d'une pièce d'identité :
          </Text>

          <Text style={styles.idTypes}>
            • Carte d'identité • Passeport • Certificat d'identification (CIP)
          </Text>

          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.idCardImage} />
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => { animatePress(); pickImage(); }}
              activeOpacity={0.85}
            >
              <Ionicons name="cloud-upload-outline" size={48} color={COLORS.primary} />
              <Text style={styles.uploadButtonText}>Sélectionner une pièce d'identité</Text>
            </TouchableOpacity>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.cancelButton]}
              onPress={onClose}
              disabled={uploading}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, styles.submitButton, (!selectedImage || uploading) && { opacity: 0.65 }]}
              onPress={handleSubmit}
              disabled={!selectedImage || uploading}
            >
              {uploading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.submitButtonText}>Soumettre</Text>}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

/* ---------------------------- ProfileScreen (principal) --------------------------- */
const ProfileScreen = ({ navigation }) => {
  const { userData, logoutUser } = useContext(UserContext);
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('non_verifie');

  // subtle animation refs for header/profile
  const headerElevation = useRef(new Animated.Value(0)).current;

  const loadData = useCallback(async () => {
    try {
      if (!userData?.uid) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', userData.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
        if (userDoc.data().verificationStatus) {
          setVerificationStatus(userDoc.data().verificationStatus);
        }
      } else {
        setUserProfile({
          email: userData.email || '',
          name: userData.displayName || '',
          photoURL: userData.photoURL || null
        });
      }

      const postsQuery = query(
        collection(db, 'posts'),
        where('userId', '==', userData.uid),
        orderBy('createdAt', 'desc')
      );
      const postsSnapshot = await getDocs(postsQuery);
      setUserPosts(postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const favoritesQuery = query(collection(db, 'users', userData.uid, 'favorites'));
      const favoritesSnapshot = await getDocs(favoritesQuery);
      setFavoritesCount(favoritesSnapshot.size);
    } catch (error) {
      console.error("Erreur de chargement:", error);
      Alert.alert("Erreur", "Impossible de charger les données");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      loadData();
    }
  }, [userData, loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  useEffect(() => {
    // small header elevation animation when loaded
    Animated.timing(headerElevation, {
      toValue: 1,
      duration: 450,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false
    }).start();
  }, [headerElevation]);

  const renderPostItem = ({ item }) => {
    const scale = new Animated.Value(1);

    const onPressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
    const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

    return (
      <Pressable
        onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={{ marginHorizontal: 16 }}
      >
        <Animated.View style={[styles.postItem, { transform: [{ scale }] }]}>
          <Image
            source={{ uri: item.imageUrls?.[0] || 'https://via.placeholder.com/150' }}
            style={styles.postImage}
          />
          <View style={styles.postInfo}>
            <Text style={styles.postTitle} numberOfLines={1}>{item.title || 'Sans titre'}</Text>
            <View style={styles.postMeta}>
              <Text style={styles.postPrice}>{item.price ? `${item.price} FCFA` : 'Prix sur demande'}</Text>
              <View style={styles.postLocation}>
                <Ionicons name="location-outline" size={14} color={COLORS.gray} />
                <Text style={styles.locationText} numberOfLines={1}>{item.location || 'Localisation non précisée'}</Text>
              </View>
            </View>
            <Text style={styles.postDate}>
              {item.createdAt?.toDate ? new Date(item.createdAt.toDate()).toLocaleDateString() : ''}
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    );
  };

  if (!userData) {
    return (
      <View style={styles.authContainer}>
        <Image source={require('../../../assets/icon.png')} style={styles.logo} />
        <Text style={styles.authText}>Connectez-vous pour gérer vos propriétés</Text>
        <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate('Auth')}>
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

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Se Déconnecter",
          onPress: async () => {
            if (logoutUser && typeof logoutUser === 'function') {
              const success = await logoutUser();
              if (!success) {
                Alert.alert("Erreur", "La déconnexion a échoué");
              }
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderVerificationButton = () => {
    const buttonStyles = {
      non_verifie: { backgroundColor: COLORS.error || '#e74c3c' },
      en_attente: { backgroundColor: COLORS.gray },
      verifie: { backgroundColor: COLORS.primary }
    };

    const buttonTexts = {
      non_verifie: "Compte non vérifié",
      en_attente: "Vérification en cours",
      verifie: "Compte vérifié"
    };

    return (
      <TouchableOpacity
        style={[styles.verificationButton, buttonStyles[verificationStatus]]}
        onPress={() => verificationStatus === 'non_verifie' && setVerificationModalVisible(true)}
        disabled={verificationStatus !== 'non_verifie'}
        activeOpacity={0.85}
      >
        <Text style={styles.verificationButtonText}>
          {buttonTexts[verificationStatus]}
        </Text>
        {verificationStatus === 'verifie' && (
          <Ionicons name="checkmark-circle" size={20} color="white" style={styles.verifiedIcon} />
        )}
      </TouchableOpacity>
    );
  };

  const profileData = userProfile || {
    email: userData.email || '',
    name: userData.displayName || userData.email?.split('@')[0] || 'Utilisateur',
    photoURL: userData.photoURL || null,
    phone: ''
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      {/* Header */}
      <Animated.View style={[styles.header, {
        shadowOpacity: headerElevation.interpolate({ inputRange: [0, 1], outputRange: [0, 0.15] })
      }]}>
        <Text style={styles.headerTitle}>Mon Profil</Text>
      </Animated.View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Image
            source={profileData.photoURL ? { uri: profileData.photoURL } : require('../../../assets/images/default-profile.jpg')}
            style={styles.avatar}
          />
        </View>

        <View style={{ alignItems: 'center' }}>
          <Text style={styles.userName}>{profileData.name}</Text>
          <Text style={styles.userEmail}>{profileData.email}</Text>

          {renderVerificationButton()}

          <View style={styles.profileActions}>
            <TouchableOpacity
              style={styles.profileActionButton}
              onPress={() => navigation.navigate('EditProfile', { profileData })}
            >
              <Ionicons name="pencil-outline" size={18} color={COLORS.primary} />
              <Text style={styles.profileActionText}>Modifier</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.profileActionButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Ionicons name="settings-outline" size={18} color={COLORS.primary} />
              <Text style={styles.profileActionText}>Paramètres</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statItem}>
          <View style={[styles.statIconCircle, { backgroundColor: '#E9F7EF' }]}>
            <FontAwesome name="home" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.statValue}>{userPosts.length}</Text>
          <Text style={styles.statLabel}>Annonces</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('Favorites')}>
          <View style={[styles.statIconCircle, { backgroundColor: '#FFF1F0' }]}>
            <AntDesign name="heart" size={18} color={COLORS.primary} />
          </View>
          <Text style={styles.statValue}>{favoritesCount}</Text>
          <Text style={styles.statLabel}>Favoris</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statItem}>
          <View style={[styles.statIconCircle, { backgroundColor: '#EEF8FF' }]}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={COLORS.primary} />
          </View>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Messages</Text>
        </TouchableOpacity>
      </View>

      {/* My Posts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mes Annonces</Text>
          {userPosts.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('MyProperties')}>
              <Text style={styles.seeAll}>Tout voir</Text>
            </TouchableOpacity>
          )}
        </View>

        {userPosts.length > 0 ? (
          <FlatList
            data={userPosts.slice(0, 3)}
            renderItem={renderPostItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.postsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Image source={require('../../../assets/adaptive-icon.png')} style={styles.emptyImage} />
            <Text style={styles.emptyText}>Vous n'avez pas encore d'annonces</Text>
            <Text style={styles.emptySubtext}>Publiez votre première propriété</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('PostAd')}>
              <Text style={styles.addButtonText}>+ Publier une annonce</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Menu */}
      <View style={styles.menuSection}>
        <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
          <Ionicons name='log-out' size={22} color={COLORS.error || '#e74c3c'} />
          <Text style={styles.logoutText}>Déconnexion</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>
      <View style={styles.menuSection}>
        <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
          <Ionicons name='log-out' size={22} color={COLORS.error || '#e74c3c'} />
          <Text style={styles.logoutText}>Déconnexion</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>
      <View style={styles.menuSection}>
        <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
          <Ionicons name='log-out' size={22} color={COLORS.error || '#e74c3c'} />
          <Text style={styles.logoutText}>Déconnexion</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      {/* Verification Modal */}
      <VerificationModal
        visible={verificationModalVisible}
        onClose={() => setVerificationModalVisible(false)}
        userId={userData?.uid}
        onSubmissionSuccess={() => setVerificationStatus('en_attente')}
      />
    </ScrollView>
  );
};

/* ---------------------------------- styles ---------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || '#F6F7FB',
  },
  header: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 12
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.white,
    textAlign: 'center'
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
    marginBottom: 30,
  },
  authText: {
    ...FONTS.body3,
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.black,
  },
  authButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    elevation: 3
  },
  authButtonText: {
    color: COLORS.white,
    ...FONTS.h4,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    marginHorizontal: 16,
    marginTop: -30,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10
  },
  avatarContainer: {
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: COLORS.white,
    backgroundColor: '#EFEFEF'
  },
  userName: {
    ...FONTS.h3,
    marginTop: 6,
    color: COLORS.black,
    fontWeight: '700'
  },
  userEmail: {
    ...FONTS.body5,
    color: COLORS.gray,
    marginTop: 4,
    marginBottom: 8
  },
  profileActions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  profileActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#EDF2F7',
    borderRadius: 999,
    backgroundColor: '#FFFFFF'
  },
  profileActionText: {
    marginLeft: 8,
    color: COLORS.primary,
    ...FONTS.body4,
    fontWeight: '600'
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: 'transparent'
  },
  statItem: {
    alignItems: 'center',
    width: '33%',
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    paddingHorizontal: 8
  },
  statIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  statValue: {
    ...FONTS.h3,
    color: COLORS.black,
    fontWeight: '700',
    marginBottom: 4
  },
  statLabel: {
    ...FONTS.body5,
    color: COLORS.gray,
    textAlign: 'center'
  },
  section: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    overflow: 'hidden'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.black,
    fontWeight: '700',
  },
  seeAll: {
    ...FONTS.body4,
    color: COLORS.primary,
    fontWeight: '600'
  },
  postsList: {
    paddingBottom: 8
  },
  postItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F2',
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingHorizontal: 8
  },
  postImage: {
    width: 84,
    height: 84,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#EEE'
  },
  postInfo: {
    flex: 1,
    justifyContent: 'center'
  },
  postTitle: {
    ...FONTS.body3,
    color: COLORS.black,
    marginBottom: 6,
    fontWeight: '700'
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  postPrice: {
    ...FONTS.body4,
    color: COLORS.primary,
    fontWeight: '700',
    marginRight: 12
  },
  postLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  locationText: {
    ...FONTS.body5,
    color: COLORS.gray,
    marginLeft: 6
  },
  postDate: {
    ...FONTS.body5,
    color: COLORS.gray,
    fontSize: 12
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 26,
    paddingHorizontal: 20
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    opacity: 0.9
  },
  emptyText: {
    ...FONTS.h4,
    color: COLORS.black,
    marginBottom: 6,
    fontWeight: '700'
  },
  emptySubtext: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: 16
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3
  },
  addButtonText: {
    color: COLORS.white,
    ...FONTS.h4,
    fontWeight: '700'
  },
  menuSection: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 22,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F6'
  },
  menuText: {
    ...FONTS.body3,
    color: COLORS.black,
    flex: 1,
    marginLeft: 15
  },
  logoutText: {
    ...FONTS.body3,
    color: COLORS.error || '#e74c3c',
    flex: 1,
    marginLeft: 15,
    fontWeight: '700'
  },
  verificationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    marginVertical: 12,
    minWidth: '72%'
  },
  verificationButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: '700'
  },
  verifiedIcon: {
    marginLeft: 8
  },

  /* Modal (VerificationModal shared) */
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(5,10,15,0.5)'
  },
  modalContent: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    elevation: 6
  },
  modalTitle: {
    ...FONTS.h3,
    marginBottom: 8,
    color: COLORS.black,
    fontWeight: '700'
  },
  modalText: {
    ...FONTS.body4,
    textAlign: 'center',
    marginBottom: 8,
    color: COLORS.gray
  },
  idTypes: {
    ...FONTS.body5,
    textAlign: 'center',
    marginBottom: 14,
    color: COLORS.gray,
    fontStyle: 'italic'
  },
  idCardImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 14,
    resizeMode: 'cover',
    backgroundColor: '#F5F6F8'
  },
  uploadButton: {
    alignItems: 'center',
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    marginBottom: 8,
    width: '100%'
  },
  uploadButtonText: {
    ...FONTS.body4,
    color: COLORS.primary,
    marginTop: 8
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#F2F4F6',
    marginRight: 8
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    marginLeft: 8
  },
  cancelButtonText: {
    ...FONTS.body4,
    color: COLORS.black
  },
  submitButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: '700'
  }
});

export default ProfileScreen;
