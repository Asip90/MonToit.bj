
// import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
// import { 
//   View, 
//   Text, 
//   ScrollView, 
//   TouchableOpacity, 
//   StyleSheet, 
//   Dimensions,
//   FlatList,
//   SafeAreaView,
//   Alert,
//   Animated,
//   ActivityIndicator,
//   Modal,
//   Platform
// } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import { Video } from 'expo-av';
// import { Image } from 'expo-image';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { doc, getDoc } from 'firebase/firestore';
// import * as Linking from 'expo-linking';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import DateTimePickerModal from "react-native-modal-datetime-picker";


// // Importations locales
// import { db } from '../../src/api/FirebaseConfig';
// import { COLORS, SIZES } from '../../constants/Theme';
// import { UserContext } from '../../context/AuthContext';
// import { isPostFavorite, toggleFavorite } from '../../services/favorites';
// import SecureWatermarkedImage from '../../components/SecureWatermarkedImage';
// import OwnerInfo from '../../components/OwnerInfo';

// const { width, height } = Dimensions.get('window');


// const PostDetailScreen = ({ navigation }) => {
//   const route = useRoute();
//   const { postId } = route.params;
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [imageViewerVisible, setImageViewerVisible] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const { userData } = useContext(UserContext);
//   const [ownerPhoneNumber, setOwnerPhoneNumber] = useState(null);
//   const [activeSlide, setActiveSlide] = useState(0);
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const flatListRef = useRef(null);

//   /// constante des bouton
//   const [modalVisible, setModalVisible] = useState(false);
//   const [visitType, setVisitType] = useState(null);
//   const [date, setDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [contactMethod, setContactMethod] = useState('')
// const [contactPromptVisible, setContactPromptVisible] = useState(false);


//   // Chargement des données
//   useEffect(() => {
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 500,
//       useNativeDriver: true,
//     }).start();

//     const fetchData = async () => {
//       try {
//         const postRef = doc(db, 'posts', postId);
//         const postSnap = await getDoc(postRef);
        
//         if (postSnap.exists()) {
//           const postData = { id: postSnap.id, ...postSnap.data() };
//           setPost(postData);

//           if (postData.userId) {
//             const userRef = doc(db, 'users', postData.userId);
//             const userSnap = await getDoc(userRef);
//             if (userSnap.exists()) {
//               setOwnerPhoneNumber(userSnap.data().phoneNumber);
//             }
//           }
//         } else {
//           Alert.alert("Erreur", "Annonce introuvable");
//           navigation.goBack();
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         Alert.alert("Erreur", "Impossible de charger l'annonce");
//         navigation.goBack();
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();

//     const checkFavorite = async () => {
//       if (userData?.uid) {
//         const result = await isPostFavorite(userData.uid, postId);
//         setIsFavorite(result);
//       }
//     };
//     checkFavorite();
//   }, [postId, userData?.uid]);

//   // Médias de l'annonce
//    // Vérification des URLs
//   const isValidUrl = (url) => {
//     try {
//       new URL(url);
//       return true;
//     } catch {
//       return false;
//     }
//   };
//   const mediaItems = post 
//     ? [
//         ...(post.imageUrls?.filter(url => isValidUrl(url)).map(url => ({ type: 'image', url })) || []),
//         ...(post.videoUrls?.filter(url => isValidUrl(url)).map(url => ({ type: 'video', url })) || [])
//       ]
//     : [];

//   const imagesForViewer = mediaItems.filter(item => item.type === 'image');

 

//   // Calcul du temps depuis la publication
//   const calculateTimeSince = useCallback((firestoreTimestamp) => {
//     if (firestoreTimestamp?.seconds) {
//       const timestampMs = firestoreTimestamp.seconds * 1000;
//       const postDate = new Date(timestampMs);
//       const now = new Date();
//       const diffInMs = now - postDate;

//       const seconds = Math.floor(diffInMs / 1000);
//       if (seconds < 60) return `${seconds} sec`;

//       const minutes = Math.floor(seconds / 60);
//       if (minutes < 60) return `${minutes} min`;

//       const hours = Math.floor(minutes / 60);
//       if (hours < 24) return `${hours} h`;

//       const days = Math.floor(hours / 24);
//       if (days < 30) return `${days} j`;

//       const months = Math.floor(days / 30);
//       if (months < 12) return `${months} mois`;

//       const years = Math.floor(months / 12);
//       return `${years} an${years > 1 ? 's' : ''}`;
//     }
//     return "Date invalide";
//   }, []);

//   // Gestion des favoris
//   const handleToggleFavorite = async () => {
//     try {
//       if (userData?.uid) {
//         const result = await toggleFavorite(userData.uid, postId);
//         setIsFavorite(result);
//       }
//     } catch (error) {
//       console.error("Erreur favori:", error);
//       Alert.alert("Erreur", "Impossible de modifier les favoris");
//     }
//   };

//   // Contact par WhatsApp
//   const handleWhatsAppPress = () => {
//     if (!ownerPhoneNumber) {
//       Alert.alert('Erreur', 'Numéro de téléphone non disponible');
//       return;
//     }
//     const message = `Bonjour, je suis intéressé par votre annonce "${post.title}"`;
//     Linking.openURL(`https://wa.me/${ownerPhoneNumber}?text=${encodeURIComponent(message)}`)
//       .catch(() => Alert.alert('Erreur', "WhatsApp n'est pas installé"));
//   };

//   // Contact par téléphone
//   const handlePhonePress = () => {
//     if (!ownerPhoneNumber) {
//       Alert.alert('Erreur', 'Numéro de téléphone non disponible');
//       return;
//     }
//     Linking.openURL(`tel:${ownerPhoneNumber}`)
//       .catch(() => Alert.alert('Erreur', "Impossible de passer l'appel"));
//   };

//   // Messagerie interne
//   const goToMessenger = async () => {
//     if (!post?.userId) return Alert.alert("Erreur", "Propriétaire introuvable");
//     if (post.userId === userData?.uid) return Alert.alert("Action impossible", "Vous ne pouvez pas vous envoyer un message");

//     try {
//       const userDocRef = doc(db, 'users', post.userId);
//       const userSnap = await getDoc(userDocRef);
//       if (!userSnap.exists()) return Alert.alert("Erreur", "Utilisateur non trouvé");

//       const receiverName = userSnap.data().name || userSnap.data().surname || 'Vendeur';
//       navigation.navigate('MessageStack', {
//         screen: 'ChatScreen',
//         params: {
//           receiverId: post.userId,
//           receiverName,
//           postId: post.id,
//           postTitle: post.title
//         },
//       });
//     } catch (error) {
//       console.error("Erreur messagerie:", error);
//       Alert.alert("Erreur", "Une erreur est survenue");
//     }
//   };

//   // Gestion du carousel
//   const onScroll = useCallback(({ nativeEvent }) => {
//     const slide = Math.round(nativeEvent.contentOffset.x / width);
//     if (slide !== activeSlide) {
//       setActiveSlide(slide);
//     }
//   }, [activeSlide]);

//   // Ouverture d'une image
//   const openImage = useCallback((index) => {
//     setCurrentImageIndex(index);
//     setImageViewerVisible(true);
//   }, []);

//   // Fermeture de la modal
//   const closeImage = useCallback(() => {
//     setImageViewerVisible(false);
//   }, []);

//   // Composant d'item pour le carousel
//   const GalleryItem = useCallback(({ item, index }) => (
//     <TouchableOpacity 
//       activeOpacity={0.9} 
//       onPress={() => item.type === 'image' ? openImage(index) : null}
//       style={galleryStyles.mediaWrapper}
//     >
//       {item.type === 'image' ? (
//         <SecureWatermarkedImage 
//           source={{ uri: item.url }}
//           style={galleryStyles.media}
//           watermarkSource={require('../../assets/images/filigrane.png')}
//           contentFit="cover"
//           transition={300}
//         />
//       ) : (
//         <Video
//           source={{ uri: item.url }}
//           style={galleryStyles.media}
//           resizeMode="cover"
//           shouldPlay={false}
//           useNativeControls
//         />
//       )}
//     </TouchableOpacity>
//   ), [openImage]);

//   // Affichage pendant le chargement
//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//         <Text style={styles.loadingText}>Chargement de l'annonce...</Text>
//       </View>
//     );
//   }

//   // Si pas de données
//   if (!post) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Impossible de charger l'annonce</Text>
//         <TouchableOpacity 
//           style={styles.retryButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={styles.retryButtonText}>Retour</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }
// ;

//   // Nouveaux boutons principaux
//   const ActionButtons = () => (
//     <View style={newStyles.actionBar}>
//       <TouchableOpacity 
//         style={[newStyles.actionButton, newStyles.reserveButton]}
//         onPress={() => Alert.alert('Réservation', 'Chambre réservée avec succès!')}
//       >
//         <Ionicons name="bookmark" size={20} color="white" />
//         <Text style={newStyles.buttonText}>Réserver</Text>
//       </TouchableOpacity>

//       <TouchableOpacity 
//         style={[newStyles.actionButton, newStyles.visitButton]}
//         onPress={() => setModalVisible(true)}
//       >
//         <Ionicons name="calendar" size={20} color="white" />
//         <Text style={newStyles.buttonText}>Visiter</Text>
//       </TouchableOpacity>

//       <TouchableOpacity 
//         style={[newStyles.actionButton, newStyles.contactButton]}
//         onPress={goToMessenger} // Utilise ta fonction existante
//       >
//         <Ionicons name="chatbubbles" size={20} color="white" />
//         <Text style={newStyles.buttonText}>Contacter</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   // Modale de visite
//   const VisitModal = () => (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={modalVisible}
//       onRequestClose={() => setModalVisible(false)}
//     >
//       <View style={newStyles.modalContainer}>
//         <View style={newStyles.modalContent}>
//           <Text style={newStyles.modalTitle}>Type de visite</Text>
          
//           {/* Option Visite Virtuelle */}
//           <TouchableOpacity 
//             style={newStyles.optionButton}
//             onPress={() => {
//               setVisitType('virtual');
//               setShowDatePicker(true);
//             }}
//           >
//             <Ionicons name="videocam" size={24} color={COLORS.primary} />
//             <View style={newStyles.optionTextContainer}>
//               <Text style={newStyles.optionTitle}>Visite Virtuelle</Text>
//               <Text style={newStyles.optionSubtitle}>Appel vidéo avec le propriétaire</Text>
//             </View>
//           </TouchableOpacity>

//           {/* Option Visite Présentielle */}
//           <TouchableOpacity 
//             style={newStyles.optionButton}
//             onPress={() => {
//               setVisitType('physical');
//               setShowDatePicker(true);
//             }}
//           >
//             <Ionicons name="walk" size={24} color={COLORS.primary} />
//             <View style={newStyles.optionTextContainer}>
//               <Text style={newStyles.optionTitle}>Visite sur Place</Text>
//               <Text style={newStyles.optionSubtitle}>RDV physique au logement</Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={newStyles.closeButton}
//             onPress={() => setModalVisible(false)}
//           >
//             <Text style={newStyles.closeButtonText}>Annuler</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );

//   // Date Picker
//   const renderDatePicker = () => (
//     // <DateTimePicker
//     //   value={date}
//     //   mode="datetime"
//     //   display={Platform.OS === 'ios' ? 'spinner' : 'default'}

//     //   onChange={(event, selectedDate) => {
//     //     setShowDatePicker(false);
//     //     if (selectedDate) {
//     //       setDate(selectedDate);
//     //       showContactMethodInput();
//     //     }
//     //   }
//     // }
//     // />
//     <DateTimePickerModal
//   isVisible={showDatePicker}
//   mode="datetime"
//   onConfirm={(selectedDate) => {
//     setShowDatePicker(false);
//     setDate(selectedDate);
//     if (visitType === 'virtual') {
//   setContactPromptVisible(true); // on affichera la modale
// } else {
//   confirmVisit(); // directe pour visite sur place
// }
//   }}
//   onCancel={() => setShowDatePicker(false)}
// />
//   );
// const ContactPromptModal = () => (
//   <Modal
//     visible={contactPromptVisible}
//     transparent={true}
//     animationType="slide"
//     onRequestClose={() => setContactPromptVisible(false)}
//   >
//     <View style={newStyles.modalContainer}>
//       <View style={newStyles.modalContent}>
//         <Text style={newStyles.modalTitle}>Contact pour la visite virtuelle</Text>

//         <Text style={{ marginBottom: 8, fontSize: 14, color: '#666' }}>
//           Entrez votre WhatsApp ou email :
//         </Text>

//         <TextInput
//           placeholder="ex: +229 97 00 00 00 ou email@exemple.com"
//           value={contactMethod}
//           onChangeText={setContactMethod}
//           style={{
//             borderWidth: 1,
//             borderColor: '#ccc',
//             borderRadius: 8,
//             padding: 10,
//             marginBottom: 16,
//           }}
//         />

//         <TouchableOpacity
//           style={[newStyles.actionButton, { backgroundColor: COLORS.primary }]}
//           onPress={() => {
//             setContactPromptVisible(false);
//             confirmVisit();
//           }}
//         >
//           <Text style={{ color: 'white', fontWeight: 'bold' }}>Confirmer</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={newStyles.closeButton}
//           onPress={() => setContactPromptVisible(false)}
//         >
//           <Text style={newStyles.closeButtonText}>Annuler</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </Modal>
// );

//   // Formulaire de contact
//   const showContactMethodInput = () => (
//     Alert.prompt(
//       visitType === 'virtual' ? 'Contact pour la visite virtuelle' : 'Confirmation',
//       visitType === 'virtual' 
//         ? 'Entrez votre WhatsApp ou email pour la confirmation:'
//         : 'Un rappel sera envoyé à votre numéro associé.',
//       [
//         {
//           text: 'Annuler',
//           style: 'cancel',
//         },
//         {
//           text: 'Confirmer',
//           onPress: (text) => {
//             setContactMethod(text || '');
//             confirmVisit();
//           },
//         },
//       ],
//       'plain-text'
//     )
//   );

//   // Confirmation finale
//   const confirmVisit = () => {
//     Alert.alert(
//       'Visite confirmée!',
//       `Votre visite ${visitType === 'virtual' ? 'virtuelle' : 'sur place'} est prévue pour le ${date.toLocaleString()}`,
//       [{ text: 'OK', onPress: () => setModalVisible(false) }]
//     );
//     // Ici: Envoyer la notification au propriétaire via Firebase
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <Animated.ScrollView 
//         style={{ opacity: fadeAnim }}
//         contentContainerStyle={styles.scrollContainer}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Galerie d'images/vidéos */}
//         <View style={galleryStyles.container}>
//           <FlatList
//             ref={flatListRef}
//             horizontal
//             pagingEnabled
//             data={mediaItems}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={GalleryItem}
//             showsHorizontalScrollIndicator={false}
//             onScroll={onScroll}
//             scrollEventThrottle={16}
//             initialNumToRender={3}
//             maxToRenderPerBatch={3}
//             windowSize={5}
//           />
          
//           {/* Indicateurs de pagination */}
//           {mediaItems.length > 1 && (
//             <View style={galleryStyles.pagination}>
//               {mediaItems.map((_, index) => (
//                 <View 
//                   key={index}
//                   style={[
//                     galleryStyles.paginationDot,
//                     index === activeSlide && galleryStyles.activeDot
//                   ]}
//                 />
//               ))}
//             </View>
//           )}
          
//           {/* Bouton plein écran */}
//           {mediaItems.length > 0 && mediaItems[activeSlide]?.type === 'image' && (
//             <TouchableOpacity 
//               style={galleryStyles.fullscreenButton}
//               onPress={() => openImage(activeSlide)}
//             >
//               <Ionicons name="expand" size={24} color="white" />
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* En-tête avec prix et titre */}
//         <View style={styles.headerContainer}>
//           <View style={styles.priceRow}>
//             <Text style={styles.priceText}>{post.price?.toLocaleString()} FCFA</Text>
//             {post.transactionType === 'rent' && (
//               <Text style={styles.pricePeriod}>/mois</Text>
//             )}
//           </View>
          
//           <View style={styles.titleRow}>
//             <Text style={styles.titleText} numberOfLines={2}>{post.title}</Text>
//             <TouchableOpacity 
//               onPress={handleToggleFavorite}
//               style={styles.favoriteButton}
//             >
//               <Ionicons 
//                 name={isFavorite ? "heart" : "heart-outline"} 
//                 size={28} 
//                 color={isFavorite ? COLORS.primary : '#ccc'} 
//               />
//             </TouchableOpacity>
//           </View>
          
//           {/* Localisation */}
//           <View style={styles.locationContainer}>
//             <Ionicons name="location-sharp" size={16} color="#666" />
//             <Text style={styles.locationText} numberOfLines={2}>
//               {typeof post.location === 'string' 
//                 ? post.location 
//                 : post.location?.display_name || 'Localisation non disponible'}
//             </Text>
//           </View>
          
//           {/* Date de publication */}
//           {post.createdAt && (
//             <View style={styles.dateContainer}>
//               <Ionicons name="time-outline" size={14} color="#666" />
//               <Text style={styles.timeText}>
//                 {` Publié il y a ${calculateTimeSince(post.createdAt)}`}
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* Caractéristiques principales */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>Caractéristiques</Text>
//           <View style={styles.featuresGrid}>
//             {post.bedrooms > 0 && (
//               <View style={styles.featureItem}>
//                 <MaterialIcons name="hotel" size={20} color={COLORS.primary} />
//                 <Text style={styles.featureText}>{post.bedrooms} Chambre(s)</Text>
//               </View>
//             )}
            
//             {post.bathrooms > 0 && (
//               <View style={styles.featureItem}>
//                 <MaterialIcons name="bathtub" size={20} color={COLORS.primary} />
//                 <Text style={styles.featureText}>{post.bathrooms} Salle(s) de bain</Text>
//               </View>
//             )}
            
//             {post.livingRoom && (
//               <View style={styles.featureItem}>
//                 <MaterialIcons name="weekend" size={20} color={COLORS.primary} />
//                 <Text style={styles.featureText}>Salon</Text>
//               </View>
//             )}
            
//             {post.area > 0 && (
//               <View style={styles.featureItem}>
//                 <MaterialIcons name="straighten" size={20} color={COLORS.primary} />
//                 <Text style={styles.featureText}>{post.area} m²</Text>
//               </View>
//             )}
//           </View>
//         </View>

//         {/* Équipements */}
//         {post.features && (
//           <View style={styles.sectionContainer}>
//             <Text style={styles.sectionTitle}>Équipements</Text>
//             <View style={styles.amenitiesContainer}>
//               {post.features.water && (
//                 <View style={styles.amenityBadge}>
//                   <Ionicons name="water" size={16} color={COLORS.primary} />
//                   <Text style={styles.amenityText}>Eau</Text>
//                 </View>
//               )}
              
//               {post.features.electricity && (
//                 <View style={styles.amenityBadge}>
//                   <Ionicons name="flash" size={16} color={COLORS.primary} />
//                   <Text style={styles.amenityText}>Électricité</Text>
//                 </View>
//               )}
              
//               {post.features.ac && (
//                 <View style={styles.amenityBadge}>
//                   <MaterialIcons name="ac-unit" size={16} color={COLORS.primary} />
//                   <Text style={styles.amenityText}>Climatisation</Text>
//                 </View>
//               )}
              
//               {post.features.parking && (
//                 <View style={styles.amenityBadge}>
//                   <MaterialIcons name="local-parking" size={16} color={COLORS.primary} />
//                   <Text style={styles.amenityText}>Parking</Text>
//                 </View>
//               )}
              
//               {post.features.security && (
//                 <View style={styles.amenityBadge}>
//                   <MaterialIcons name="security" size={16} color={COLORS.primary} />
//                   <Text style={styles.amenityText}>Sécurité</Text>
//                 </View>
//               )}
              
//               {post.features.wifi && (
//                 <View style={styles.amenityBadge}>
//                   <MaterialIcons name="wifi" size={16} color={COLORS.primary} />
//                   <Text style={styles.amenityText}>Wi-Fi</Text>
//                 </View>
//               )}
//             </View>
//           </View>
//         )}

//         {/* Description */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>Description</Text>
//           <Text style={styles.descriptionText}>
//             {post.description || 'Aucune description fournie'}
//           </Text>
//         </View>

//         {/* Informations du propriétaire */}
//         <TouchableOpacity onPress={()=> navigation.navigate('OwnerPosts', ownerId =userId)}>
//          <OwnerInfo userId={post.userId} />
//         </TouchableOpacity>
       
//       </Animated.ScrollView>
//       {/* Modal de visualisation d'image */}
//       <Modal
//         visible={imageViewerVisible}
//         transparent={true}
//         onRequestClose={closeImage}
//         statusBarTranslucent={true}
//         hardwareAccelerated={true}
//       >
//         <View style={styles.imageModalContainer}>
//           <TouchableOpacity 
//             style={styles.closeButton}
//             onPress={closeImage}
//             activeOpacity={0.8}
//           >
//             <Ionicons name="close" size={30} color="white" />
//           </TouchableOpacity>
          
//           <View style={styles.imageViewerContent}>
//             <Image
//               source={{ uri: imagesForViewer[currentImageIndex]?.url }}
//               style={styles.expandedImage}
//               contentFit="contain"
//               transition={300}
//               priority="high"
//             />
            
//             {imagesForViewer.length > 1 && (
//               <View style={styles.imageNavContainer}>
//                 <TouchableOpacity 
//                   onPress={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
//                   disabled={currentImageIndex === 0}
//                   style={styles.navButton}
//                   activeOpacity={0.6}
//                 >
//                   <Ionicons 
//                     name="chevron-back" 
//                     size={30} 
//                     color={currentImageIndex === 0 ? 'rgba(255,255,255,0.3)' : 'white'} 
//                   />
//                 </TouchableOpacity>
                
//                 <Text style={styles.imageCounter}>
//                   {`${currentImageIndex + 1}/${imagesForViewer.length}`}
//                 </Text>
                
//                 <TouchableOpacity 
//                   onPress={() => setCurrentImageIndex(prev => Math.min(imagesForViewer.length - 1, prev + 1))}
//                   disabled={currentImageIndex === imagesForViewer.length - 1}
//                   style={styles.navButton}
//                   activeOpacity={0.6}
//                 >
//                   <Ionicons 
//                     name="chevron-forward" 
//                     size={30} 
//                     color={currentImageIndex === imagesForViewer.length - 1 ? 'rgba(255,255,255,0.3)' : 'white'} 
//                   />
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         </View>
//       </Modal>
//       {/* Boutons d'action */}
//          <ActionButtons />

//       {/* Ajoute les nouveaux composants */}
//       <VisitModal />
//       {contactPromptVisible && <ContactPromptModal />}

//       {showDatePicker && renderDatePicker()}
//       {/* <View style={styles.actionButtons}>
//         <TouchableOpacity 
//           style={styles.messageButton}
//           onPress={goToMessenger}
//         >
//           <Ionicons name="chatbubble-ellipses" size={20} color="white" />
//           <Text style={styles.actionButtonText}>Message</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={styles.whatsappButton}
//           onPress={handleWhatsAppPress}
//         >
//           <Ionicons name="logo-whatsapp" size={20} color="white" />
//           <Text style={styles.actionButtonText}>WhatsApp</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={styles.callButton}
//           onPress={handlePhonePress}
//         >
//           <Ionicons name="call" size={20} color="white" />
//           <Text style={styles.actionButtonText}>Appeler</Text>
//         </TouchableOpacity>
//       </View> */}

      
//     </SafeAreaView>
//   );
// };

// // Styles pour la galerie
// const galleryStyles = StyleSheet.create({
//   container: {
//     height: 300,
//     position: 'relative',
//     backgroundColor: '#f5f5f5'
//   },
//   mediaWrapper: {
//     width: width,
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   media: {
//     width: '100%',
//     height: '100%',
//   },
//   pagination: {
//     position: 'absolute',
//     bottom: 20,
//     flexDirection: 'row',
//     alignSelf: 'center',
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     borderRadius: 10,
//     paddingHorizontal: 8,
//     paddingVertical: 4
//   },
//   paginationDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: 'rgba(255,255,255,0.5)',
//     marginHorizontal: 4
//   },
//   activeDot: {
//     backgroundColor: COLORS.primary,
//     width: 20
//   },
//   fullscreenButton: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     padding: 8,
//     borderRadius: 20
//   }
// });

// // Styles principaux
// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   scrollContainer: {
//     paddingBottom: 80
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: COLORS.white
//   },
//   loadingText: {
//     marginTop: 10,
//     color: COLORS.gray,
//     fontSize: 16
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//     padding: 20
//   },
//   errorText: {
//     fontSize: 16,
//     color: COLORS.error,
//     textAlign: 'center',
//     marginBottom: 20
//   },
//   retryButton: {
//     backgroundColor: COLORS.primary,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 5
//   },
//   retryButtonText: {
//     color: 'white',
//     fontWeight: 'bold'
//   },
//   headerContainer: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0'
//   },
//   priceRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     marginBottom: 8
//   },
//   priceText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: COLORS.primary,
//   },
//   pricePeriod: {
//     fontSize: 16,
//     color: '#666',
//     marginLeft: 4,
//     marginBottom: 2
//   },
//   titleRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8
//   },
//   titleText: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#333',
//     flex: 1,
//     marginRight: 10
//   },
//   favoriteButton: {
//     padding: 5
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4
//   },
//   locationText: {
//     fontSize: 14,
//     color: '#666',
//     marginLeft: 4,
//     flex: 1
//   },
//   dateContainer: {
//     flexDirection: 'row',
//     alignItems: 'center'
//   },
//   timeText: {
//     fontSize: 12,
//     color: '#666',
//     marginLeft: 4
//   },
//   sectionContainer: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0'
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 12
//   },
//   featuresGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap'
//   },
//   featureItem: {
//     width: '50%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12
//   },
//   featureText: {
//     fontSize: 14,
//     color: '#555',
//     marginLeft: 8
//   },
//   amenitiesContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap'
//   },
//   amenityBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f8f8f8',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 16,
//     marginRight: 8,
//     marginBottom: 8
//   },
//   amenityText: {
//     fontSize: 14,
//     color: '#555',
//     marginLeft: 6
//   },
//   descriptionText: {
//     fontSize: 15,
//     lineHeight: 22,
//     color: '#555'
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     padding: 12,
//     backgroundColor: 'white',
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: -2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 5,
//       },
//     }),
//   },
//   messageButton: {
//     flex: 1,
//     backgroundColor: COLORS.primary,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 12,
//     borderRadius: 8,
//     marginRight: 8
//   },
//   whatsappButton: {
//     flex: 1,
//     backgroundColor: '#25D366',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 12,
//     borderRadius: 8,
//     marginRight: 8
//   },
//   callButton: {
//     flex: 1,
//     backgroundColor: '#2ECC71',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 12,
//     borderRadius: 8
//   },
//   actionButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     marginLeft: 8
//   },
//   imageModalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.9)',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   closeButton: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 50 : 20,
//     right: 20,
//     zIndex: 1,
//     padding: 10,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 20
//   },
//   imageViewerContent: {
//     width: '100%',
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   expandedImage: {
//     width: '100%',
//     height: '80%',
//   },
//   imageNavContainer: {
//     position: 'absolute',
//     bottom: 50,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20
//   },
//   navButton: {
//     padding: 15,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     borderRadius: 30
//   },
//   imageCounter: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 10
//   }
// });

// const newStyles = StyleSheet.create({
//   actionBar: {
//     flexDirection: 'row',
//     padding: 12,
//     backgroundColor: 'white',
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
//   },
//   actionButton: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 12,
//     borderRadius: 8,
//     marginHorizontal: 4,
//   },
//   reserveButton: {
//     backgroundColor: '#FF6B6B',
//   },
//   visitButton: {
//     backgroundColor: '#4ECDC4',
//   },
//   contactButton: {
//     backgroundColor: '#5F7A61',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     marginLeft: 8,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   optionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   optionTextContainer: {
//     marginLeft: 15,
//   },
//   optionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   optionSubtitle: {
//     fontSize: 12,
//     color: '#666',
//   },
//   closeButton: {
//     marginTop: 20,
//     padding: 10,
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     color: COLORS.primary,
//     fontWeight: 'bold',
//   },
// });

// export default PostDetailScreen;


////
import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  FlatList,
  SafeAreaView,
  Alert,
  Animated,
  ActivityIndicator,
  Modal,
  Platform,
  TextInput
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Video } from 'expo-video';
import { Image } from 'expo-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { doc, getDoc } from 'firebase/firestore';
import * as Linking from 'expo-linking';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { addDoc, collection } from 'firebase/firestore';
// Importations locales
import { db } from '../../src/api/FirebaseConfig';
import { COLORS, SIZES } from '../../constants/Theme';
import { UserContext } from '../../context/AuthContext';
import { isPostFavorite, toggleFavorite } from '../../services/favorites';
import SecureWatermarkedImage from '../../components/SecureWatermarkedImage';
import OwnerInfo from '../../components/OwnerInfo';
import PostDetailSkeleton from '../../components/skeletons/PostDetailSkeleton';
import PoiList from '../../components/PoiList';

const { width, height } = Dimensions.get('window');

const PostDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { postId } = route.params;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { userData } = useContext(UserContext);
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  // États pour la réservation
  const [modalVisible, setModalVisible] = useState(false);
  const [visitType, setVisitType] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [contactMethod, setContactMethod] = useState('');
  const [contactPromptVisible, setContactPromptVisible] = useState(false);

  // Chargement des données
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    const fetchData = async () => {
      try {
        const postRef = doc(db, 'posts', postId);
        const postSnap = await getDoc(postRef);
        
        if (postSnap.exists()) {
          const postData = { id: postSnap.id, ...postSnap.data() };
          setPost(postData);

          if (postData.userId) {
            const userRef = doc(db, 'users', postData.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              setOwnerPhoneNumber(userSnap.data().phoneNumber);
            }
          }
        } else {
          Alert.alert("Erreur", "Annonce introuvable");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Erreur", "Impossible de charger l'annonce");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const checkFavorite = async () => {
      if (userData?.uid) {
        const result = await isPostFavorite(userData.uid, postId);
        setIsFavorite(result);
      }
    };
    checkFavorite();
  }, [postId, userData?.uid]);

  // Vérification des URLs
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const mediaItems = post 
    ? [
        ...(post.imageUrls?.filter(url => isValidUrl(url)).map(url => ({ type: 'image', url })) || []),
        ...(post.videoUrls?.filter(url => isValidUrl(url)).map(url => ({ type: 'video', url })) || [])
      ]
    : [];

  const imagesForViewer = mediaItems.filter(item => item.type === 'image');

  // Calcul du temps depuis la publication
  const calculateTimeSince = useCallback((firestoreTimestamp) => {
    if (firestoreTimestamp?.seconds) {
      const timestampMs = firestoreTimestamp.seconds * 1000;
      const postDate = new Date(timestampMs);
      const now = new Date();
      const diffInMs = now - postDate;

      const seconds = Math.floor(diffInMs / 1000);
      if (seconds < 60) return `${seconds} sec`;

      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} min`;

      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} h`;

      const days = Math.floor(hours / 24);
      if (days < 30) return `${days} j`;

      const months = Math.floor(days / 30);
      if (months < 12) return `${months} mois`;

      const years = Math.floor(months / 12);
      return `${years} an${years > 1 ? 's' : ''}`;
    }
    return "Date invalide";
  }, []);

  // Gestion des favoris
  const handleToggleFavorite = async () => {
    try {
      if (userData?.uid) {
        const result = await toggleFavorite(userData.uid, postId);
        setIsFavorite(result);
      }
    } catch (error) {
      console.error("Erreur favori:", error);
      Alert.alert("Erreur", "Impossible de modifier les favoris");
    }
  };

  // Contact par WhatsApp
  const handleWhatsAppPress = () => {
    if (!ownerPhoneNumber) {
      Alert.alert('Erreur', 'Numéro de téléphone non disponible');
      return;
    }
    const message = `Bonjour, je suis intéressé par votre annonce "${post.title}"`;
    Linking.openURL(`https://wa.me/${ownerPhoneNumber}?text=${encodeURIComponent(message)}`)
      .catch(() => Alert.alert('Erreur', "WhatsApp n'est pas installé"));
  };

  // Contact par téléphone
  const handlePhonePress = () => {
    if (!ownerPhoneNumber) {
      Alert.alert('Erreur', 'Numéro de téléphone non disponible');
      return;
    }
    Linking.openURL(`tel:${ownerPhoneNumber}`)
      .catch(() => Alert.alert('Erreur', "Impossible de passer l'appel"));
  };

  // Messagerie interne
  const goToMessenger = async () => {
    if (!post?.userId) return Alert.alert("Erreur", "Propriétaire introuvable");
    if (post.userId === userData?.uid) return Alert.alert("Action impossible", "Vous ne pouvez pas vous envoyer un message");

    try {
      const userDocRef = doc(db, 'users', post.userId);
      const userSnap = await getDoc(userDocRef);
      if (!userSnap.exists()) return Alert.alert("Erreur", "Utilisateur non trouvé");

      const receiverName = userSnap.data().name || userSnap.data().surname || 'Vendeur';
      navigation.navigate('MessageStack', {
        screen: 'ChatScreen',
        params: {
          receiverId: post.userId,
          receiverName,
          postId: post.id,
          postTitle: post.title
        },
      });
    } catch (error) {
      console.error("Erreur messagerie:", error);
      Alert.alert("Erreur", "Une erreur est survenue");
    }
  };

  // Gestion du carousel
  const onScroll = useCallback(({ nativeEvent }) => {
    const slide = Math.round(nativeEvent.contentOffset.x / width);
    if (slide !== activeSlide) {
      setActiveSlide(slide);
    }
  }, [activeSlide]);

  // Ouverture d'une image
  const openImage = useCallback((index) => {
    setCurrentImageIndex(index);
    setImageViewerVisible(true);
  }, []);

  // Fermeture de la modal
  const closeImage = useCallback(() => {
    setImageViewerVisible(false);
  }, []);

  // Composant d'item pour le carousel
  const GalleryItem = useCallback(({ item, index }) => (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={() => item.type === 'image' ? openImage(index) : null}
      style={galleryStyles.mediaWrapper}
    >
      {item.type === 'image' ? (
        <SecureWatermarkedImage 
          source={{ uri: item.url }}
          style={galleryStyles.media}
          watermarkSource={require('../../assets/images/filigrane.png')}
          contentFit="cover"
          transition={300}
        />
      ) : (
        <Video
          source={{ uri: item.url }}
          style={galleryStyles.media}
          resizeMode="cover"
          shouldPlay={false}
          useNativeControls
        />
      )}
    </TouchableOpacity>
  ), [openImage]);

  // Gestion de la date
  const handleDateConfirm = (selectedDate) => {
    setShowDatePicker(false);
    setDate(selectedDate);
    if (visitType === 'virtual') {
      setContactPromptVisible(true);
    } else {
      confirmVisit();
    }
  };

  // Confirmation finale
  // const confirmVisit = () => {
  //   Alert.alert(
  //     'Visite confirmée!',
  //     `Votre visite ${visitType === 'virtual' ? 'virtuelle' : 'sur place'} est prévue pour le ${date.toLocaleString()}`,
  //     [{ text: 'OK', onPress: () => {
  //       setModalVisible(false);
  //       setContactPromptVisible(false);
  //     }}]
  //   );
  //   // Ici: Envoyer la notification au propriétaire via Firebase
  // };
const sendNotificationToOwner = async () => {
  // Utilisez Firebase Cloud Messaging ou votre service de notifications
  const ownerRef = doc(db, 'users', post.userId);
  const ownerSnap = await getDoc(ownerRef);
  
  if (ownerSnap.exists()) {
    const ownerData = ownerSnap.data();
    // Ajoutez la notification dans la sous-collection du propriétaire
    await addDoc(collection(db, 'users', post.userId, 'notifications'), {
      type: 'new_reservation',
      message: `Nouvelle réservation pour ${post.title}`,
      date: new Date().toISOString(),
      read: false,
      reservationDate: date.toISOString(),
      userId: userData.uid
    });
    
    // Envoi push notification si nécessaire
    if (ownerData.fcmToken) {
      await sendPushNotification(ownerData.fcmToken, 'Nouvelle réservation', `Quelqu'un veut visiter votre propriété ${post.title}`);
    }
  }
};

const sendNotificationToTenant = async () => {
  // Notification pour l'utilisateur actuel
  await addDoc(collection(db, 'users', userData.uid, 'notifications'), {
    type: 'reservation_confirmed',
    message: `Réservation confirmée pour ${post.title}`,
    date: new Date().toISOString(),
    read: false,
    reservationDate: date.toISOString()
  });
};
const confirmVisit = async () => {
  try {
    // 1. Redirection vers la page de finalisation
    navigation.navigate('ReservationConfirmation', {
      reservationDetails: {
        postId: post.id,
        date: date.toISOString(),
        visitType,
        contactMethod,
        propertyTitle: post.title,
        price: post.price
      }
    });

    // 2. Envoyer la notification au propriétaire
    await sendNotificationToOwner();

    // 3. Envoyer la notification au locataire
    await sendNotificationToTenant();

  } catch (error) {
    console.error("Erreur lors de la confirmation:", error);
    Alert.alert("Erreur", "Un problème est survenu lors de la réservation");
  }
};
//POIs Point of Interest


// Dans votre composant
const [pois, setPois] = useState([]);

// useEffect(() => {
//   const fetchPOIs = async () => {
    // // 1. Récupérer les coordonnées depuis votre objet Post
    // // (vous devriez stocker lat/lng dans Firebase lors de la création)
    // const { latitude, longitude } = post.location; 
    
    // // 2. Appeler l'API
    // const nearbyPOIs = await fetchNearbyPOIs(latitude, longitude);
    
    // // 3. Formater les données
    // const formattedPOIs = nearbyPOIs.map(poi => ({
    //   id: poi.id,
    //   name: poi.tags.name || 'Non nommé',
    //   type: Object.entries(poi.tags)
    //     .find(([key]) => key === 'amenity' || key === 'shop')[1],
    //   distance: (poi.distance || 0).toFixed(0) + 'm'
    // }));
   useEffect(() => {
    const loadPOIs = async () => {
      // Récupération des coordonnées quel que soit le format
      const coords = await getCoordinates(post.location);
      
      if (!coords) {
        console.log("Coordonnées non disponibles");
        return;
      }

      // Récupération des POIs
      const poisData = await fetchNearbyPOIs(coords.lat, coords.lon);
      setPois(formatPOIData(poisData));
    };

    loadPOIs();
  }, [post]);

  // Fonction de formatage des données POI
  const formatPOIData = (data) => {
    return data.map(poi => ({
      id: poi.id,
      name: poi.tags?.name || 'Lieu sans nom',
      type: getPOIType(poi.tags),
      distance: calculateDistance(post.location, poi) + ' m'
    }));
  };
  


  // Composants internes
  const ActionButtons = () => (
    <View style={newStyles.actionBar}>
      <TouchableOpacity 
        style={[newStyles.actionButton, newStyles.reserveButton]}
        onPress={() => Alert.alert('Réservation', 'Chambre réservée avec succès!')}
      >
        <Ionicons name="bookmark" size={20} color="white" />
        <Text style={newStyles.buttonText}>Réserver</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[newStyles.actionButton, newStyles.visitButton]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="calendar" size={20} color="white" />
        <Text style={newStyles.buttonText}>Visiter</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[newStyles.actionButton, newStyles.contactButton]}
        onPress={goToMessenger}
      >
        <Ionicons name="chatbubbles" size={20} color="white" />
        <Text style={newStyles.buttonText}>Contacter</Text>
      </TouchableOpacity>
    </View>
  );

  const VisitModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={newStyles.modalContainer}>
        <View style={newStyles.modalContent}>
          <Text style={newStyles.modalTitle}>Type de visite</Text>
          
          <TouchableOpacity 
            style={newStyles.optionButton}
            onPress={() => {
              setVisitType('virtual');
              setShowDatePicker(true);
              setModalVisible(false);
            }}
          >
            <Ionicons name="videocam" size={24} color={COLORS.primary} />
            <View style={newStyles.optionTextContainer}>
              <Text style={newStyles.optionTitle}>Visite Virtuelle</Text>
              <Text style={newStyles.optionSubtitle}>Appel vidéo avec le propriétaire</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={newStyles.optionButton}
            onPress={() => {
              setVisitType('physical');
              setShowDatePicker(true);
              setModalVisible(false);
            }}
          >
            <Ionicons name="walk" size={24} color={COLORS.primary} />
            <View style={newStyles.optionTextContainer}>
              <Text style={newStyles.optionTitle}>Visite sur Place</Text>
              <Text style={newStyles.optionSubtitle}>RDV physique au logement</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={newStyles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={newStyles.closeButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const ContactPromptModal = () => (
    <Modal
      visible={contactPromptVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setContactPromptVisible(false)}
    >
      <View style={newStyles.modalContainer}>
        <View style={newStyles.modalContent}>
          <Text style={newStyles.modalTitle}>Contact pour la visite virtuelle</Text>

          <Text style={{ marginBottom: 8, fontSize: 14, color: '#666' }}>
            Entrez votre WhatsApp ou email :
          </Text>

          <TextInput
            placeholder="ex: +229 97 00 00 00 ou email@exemple.com"
            value={contactMethod}
            onChangeText={setContactMethod}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              padding: 10,
              marginBottom: 16,
            }}
            keyboardType={Platform.OS === 'web' ? 'default' : 'email-address'}
          />

          <TouchableOpacity
            style={[newStyles.actionButton, { backgroundColor: COLORS.primary }]}
            onPress={() => {
              if (!contactMethod) {
                Alert.alert('Erreur', 'Veuillez entrer un moyen de contact');
                return;
              }
              confirmVisit();
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Confirmer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={newStyles.closeButton}
            onPress={() => setContactPromptVisible(false)}
          >
            <Text style={newStyles.closeButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      // <View style={styles.loadingContainer}>
      //   <ActivityIndicator size="large" color={COLORS.primary} />
      //   <Text style={styles.loadingText}>Chargement de l'annonce...</Text>
      // </View> <Skeleton show colorMode="light" duration={1200} />
      <PostDetailSkeleton />

    );
  
  
  }

  if (!post) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Impossible de charger l'annonce</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.ScrollView 
        style={{ opacity: fadeAnim }}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Galerie d'images/vidéos */}
        <View style={galleryStyles.container}>
          <FlatList
            ref={flatListRef}
            horizontal
            pagingEnabled
            data={mediaItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={GalleryItem}
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            initialNumToRender={3}
            maxToRenderPerBatch={3}
            windowSize={5}
          />
          
          {mediaItems.length > 1 && (
            <View style={galleryStyles.pagination}>
              {mediaItems.map((_, index) => (
                <View 
                  key={index}
                  style={[
                    galleryStyles.paginationDot,
                    index === activeSlide && galleryStyles.activeDot
                  ]}
                />
              ))}
            </View>
          )}
          
          {mediaItems.length > 0 && mediaItems[activeSlide]?.type === 'image' && (
            <TouchableOpacity 
              style={galleryStyles.fullscreenButton}
              onPress={() => openImage(activeSlide)}
            >
              <Ionicons name="expand" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Contenu de l'annonce */}
        <View style={styles.headerContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>{post.price?.toLocaleString()} FCFA</Text>
            {post.transactionType === 'rent' && (
              <Text style={styles.pricePeriod}>/mois</Text>
            )}
          </View>
          
          <View style={styles.titleRow}>
            <Text style={styles.titleText} numberOfLines={2}>{post.title}</Text>
            <TouchableOpacity 
              onPress={handleToggleFavorite}
              style={styles.favoriteButton}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={28} 
                color={isFavorite ? COLORS.primary : '#ccc'} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location-sharp" size={16} color="#666" />
            <Text style={styles.locationText} numberOfLines={2}>
              {typeof post.location === 'string' 
                ? post.location 
                : post.location?.display_name || 'Localisation non disponible'}
            </Text>
          </View>
          
          {post.createdAt && (
            <View style={styles.dateContainer}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.timeText}>
                {` Publié il y a ${calculateTimeSince(post.createdAt)}`}
              </Text>
            </View>
          )}
        </View>

       
        {/* Caractéristiques principales */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Caractéristiques</Text>
          <View style={styles.featuresGrid}>
            {post.bedrooms > 0 && (
              <View style={styles.featureItem}>
                <MaterialIcons name="hotel" size={20} color={COLORS.primary} />
                <Text style={styles.featureText}>{post.bedrooms} Chambre(s)</Text>
              </View>
            )}
            
            {post.bathrooms > 0 && (
              <View style={styles.featureItem}>
                <MaterialIcons name="bathtub" size={20} color={COLORS.primary} />
                <Text style={styles.featureText}>{post.bathrooms} Salle(s) de bain</Text>
              </View>
            )}
            
            {post.livingRoom && (
              <View style={styles.featureItem}>
                <MaterialIcons name="weekend" size={20} color={COLORS.primary} />
                <Text style={styles.featureText}>Salon</Text>
              </View>
            )}
            
            {post.area > 0 && (
              <View style={styles.featureItem}>
                <MaterialIcons name="straighten" size={20} color={COLORS.primary} />
                <Text style={styles.featureText}>{post.area} m²</Text>
              </View>
            )}
          </View>
        </View>

        {/* Équipements */}
        {post.features && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Équipements</Text>
            <View style={styles.amenitiesContainer}>
              {post.features.water && (
                <View style={styles.amenityBadge}>
                  <Ionicons name="water" size={16} color={COLORS.primary} />
                  <Text style={styles.amenityText}>Eau</Text>
                </View>
              )}
              
              {post.features.electricity && (
                <View style={styles.amenityBadge}>
                  <Ionicons name="flash" size={16} color={COLORS.primary} />
                  <Text style={styles.amenityText}>Électricité</Text>
                </View>
              )}
              
              {post.features.ac && (
                <View style={styles.amenityBadge}>
                  <MaterialIcons name="ac-unit" size={16} color={COLORS.primary} />
                  <Text style={styles.amenityText}>Climatisation</Text>
                </View>
              )}
              
              {post.features.parking && (
                <View style={styles.amenityBadge}>
                  <MaterialIcons name="local-parking" size={16} color={COLORS.primary} />
                  <Text style={styles.amenityText}>Parking</Text>
                </View>
              )}
              
              {post.features.security && (
                <View style={styles.amenityBadge}>
                  <MaterialIcons name="security" size={16} color={COLORS.primary} />
                  <Text style={styles.amenityText}>Sécurité</Text>
                </View>
              )}
              
              {post.features.wifi && (
                <View style={styles.amenityBadge}>
                  <MaterialIcons name="wifi" size={16} color={COLORS.primary} />
                  <Text style={styles.amenityText}>Wi-Fi</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Description */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {post.description || 'Aucune description fournie'}
          </Text>
        </View>

        {/* Informations du propriétaire */}
     
         <OwnerInfo userId={post.userId} />
        <PoiList post={post}/>
      </Animated.ScrollView>
         
      {/* Boutons d'action */}
      <ActionButtons />

      {/* Modales */}
      <VisitModal />
      <ContactPromptModal />
      
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="datetime"
        onConfirm={handleDateConfirm}
        onCancel={() => setShowDatePicker(false)}
        minimumDate={new Date()}
        locale="fr_FR"
        headerTextIOS="Choisir une date"
        confirmTextIOS="Confirmer"
        cancelTextIOS="Annuler"
      />

      {/* Modal de visualisation d'image */}
      <Modal
        visible={imageViewerVisible}
        transparent={true}
        onRequestClose={closeImage}
        statusBarTranslucent={true}
        hardwareAccelerated={true}
      >
        <View style={styles.imageModalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={closeImage}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          
          <View style={styles.imageViewerContent}>
            <Image
              source={{ uri: imagesForViewer[currentImageIndex]?.url }}
              style={styles.expandedImage}
              contentFit="contain"
              transition={300}
              priority="high"
            />
            
            {imagesForViewer.length > 1 && (
              <View style={styles.imageNavContainer}>
                <TouchableOpacity 
                  onPress={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentImageIndex === 0}
                  style={styles.navButton}
                  activeOpacity={0.6}
                >
                  <Ionicons 
                    name="chevron-back" 
                    size={30} 
                    color={currentImageIndex === 0 ? 'rgba(255,255,255,0.3)' : 'white'} 
                  />
                </TouchableOpacity>
                
                <Text style={styles.imageCounter}>
                  {`${currentImageIndex + 1}/${imagesForViewer.length}`}
                </Text>
                
                <TouchableOpacity 
                  onPress={() => setCurrentImageIndex(prev => Math.min(imagesForViewer.length - 1, prev + 1))}
                  disabled={currentImageIndex === imagesForViewer.length - 1}
                  style={styles.navButton}
                  activeOpacity={0.6}
                >
                  <Ionicons 
                    name="chevron-forward" 
                    size={30} 
                    color={currentImageIndex === imagesForViewer.length - 1 ? 'rgba(255,255,255,0.3)' : 'white'} 
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Styles (conservez vos styles existants)
// ...

const galleryStyles = StyleSheet.create({
  container: {
    height: 300,
    position: 'relative',
    backgroundColor: '#f5f5f5'
  },
  mediaWrapper: {
    width: width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  media: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 20
  },
  fullscreenButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20
  }
});

// Styles principaux
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    paddingBottom: 80
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.gray,
    fontSize: 16
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 20
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 20
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  headerContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  pricePeriod: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
    marginBottom: 2
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  titleText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10
  },
  favoriteButton: {
    padding: 5
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    flex: 1
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },
  sectionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  featureItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  featureText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  amenityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8
  },
  amenityText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 6
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555'
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  messageButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginRight: 8
  },
  whatsappButton: {
    flex: 1,
    backgroundColor: '#25D366',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginRight: 8
  },
  callButton: {
    flex: 1,
    backgroundColor: '#2ECC71',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    zIndex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20
  },
  imageViewerContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  expandedImage: {
    width: '100%',
    height: '80%',
  },
  imageNavContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  navButton: {
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30
  },
  imageCounter: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10
  }
});

const newStyles = StyleSheet.create({
  actionBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  reserveButton: {
    backgroundColor: '#FF6B6B',
  },
  visitButton: {
    backgroundColor: '#4ECDC4',
  },
  contactButton: {
    backgroundColor: '#5F7A61',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionTextContainer: {
    marginLeft: 15,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default PostDetailScreen;