
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
//   Platform,
//   TextInput
// } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import { VideoView, useVideoPlayer } from 'expo-video';

// import { Image } from 'expo-image';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { doc, getDoc } from 'firebase/firestore';
// import * as Linking from 'expo-linking';
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { addDoc, collection } from 'firebase/firestore';
// // Importations locales
// import { db } from '../../src/api/FirebaseConfig';
// import { COLORS, SIZES } from '../../constants/Theme';
// import { UserContext } from '../../context/AuthContext';
// import { isPostFavorite, toggleFavorite } from '../../services/favorites';
// import SecureWatermarkedImage from '../../components/SecureWatermarkedImage';
// import OwnerInfo from '../../components/OwnerInfo';
// import PostDetailSkeleton from '../../components/skeletons/PostDetailSkeleton';
// import PoiList from '../../components/PoiList';
// import BoostedListings from '../../components/BoostedList';
// import SimilarListings from '../../components/SimilarListings';
// import GalleryItem from '../../components/GalleryItem';

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

//   // États pour la réservation
//   const [modalVisible, setModalVisible] = useState(false);
//   const [visitType, setVisitType] = useState(null);
//   const [date, setDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [contactMethod, setContactMethod] = useState('');
//   const [contactPromptVisible, setContactPromptVisible] = useState(false);

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
//           // Dans useEffect, remplacez setPost(postData) par :
//  console.log(postData.location)
//           if (postData.userId) {
//             const userRef = doc(db, 'users', postData.userId);
//             const userSnap = await getDoc(userRef);
//             if (userSnap.exists()) {
//               setOwnerPhoneNumber(userSnap.data().phoneNumber);
//             }

//           }
//       //      if (scrollToTop) {
//       // setTimeout(() => {
//       //   scrollToTop();
//       // }, 100);
//     // }
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
//     scrollToTop();
//   }, [postId, userData?.uid ]);

//   // Vérification des URLs
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
//   const scrollRef = useRef(null);

// // Ajoutez cette fonction
// const scrollToTop = () => {
//   if (scrollRef.current) {
//     scrollRef.current.scrollTo({ y: 0, animated: false });
//   }
// };
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
 

// //   const GalleryItem = useCallback(({ item, index }) =>{ (
// //      const player = useVideoPlayer(item.url, player => {
// //   player.shouldPlay = false;
// //   // eventuellement player.loop = true, etc.
// // });
// // return (
// //     <TouchableOpacity 
// //       activeOpacity={0.9} 
// //       onPress={() => item.type === 'image' ? openImage(index) : null}
// //       style={galleryStyles.mediaWrapper}
// //     >
// //       {item.type === 'image' ? (
// //         <SecureWatermarkedImage 
// //           source={{ uri: item.url }}
// //           style={galleryStyles.media}
// //           watermarkSource={require('../../assets/images/filigrane.png')}
// //           contentFit="cover"
// //           transition={300}
// //         />
// //       ) : (
// //         <VideoView
// //   player={player}
// //   style={galleryStyles.media}
// //   allowsFullscreen
// //   allowsPictureInPicture
// // />

       

// //       )}
// //     </TouchableOpacity>
// //   ), [openImage]);
// //   )}

// // const GalleryItem = useCallback(
// //   ({ item, index, openImage }) => {
// //     // 1. Initialisation du player
// //     const player = useVideoPlayer(item.url, player => {
// //       player.shouldPlay = false
// //       // player.loop = true // si besoin
// //     })

// //     // 2. Retour du JSX
// //     return (
// //       <TouchableOpacity
// //         activeOpacity={0.9}
// //         onPress={() =>
// //           item.type === 'image' ? openImage(index) : null
// //         }
// //         style={galleryStyles.mediaWrapper}
// //       >
// //         {item.type === 'image' ? (
// //           <SecureWatermarkedImage
// //             source={{ uri: item.url }}
// //             style={galleryStyles.media}
// //             watermarkSource={require('../../assets/images/filigrane.png')}
// //             contentFit="cover"
// //             transition={300}
// //           />
// //         ) : (
// //           <VideoView
// //             player={player}
// //             style={galleryStyles.media}
// //             allowsFullscreen
// //             allowsPictureInPicture
// //           />
// //         )}
// //       </TouchableOpacity>
// //     )
// //   },
// //   [openImage] // dépendance
// // )
// const renderGalleryItem = useCallback(
//   ({ item, index }) => (
//     <GalleryItem
//       item={item}
//       index={index}
//       openImage={openImage}
//       galleryStyles={galleryStyles}
//     />
//   ),
//   [openImage, galleryStyles]
// )
//   // Gestion de la date
//   const handleDateConfirm = (selectedDate) => {
//     setShowDatePicker(false);
//     setDate(selectedDate);
//     if (visitType === 'virtual') {
//       setContactPromptVisible(true);
//     } else {
//       confirmVisit();
//     }
//   };

  
// const sendNotificationToOwner = async () => {
//   // Utilisez Firebase Cloud Messaging ou votre service de notifications
//   const ownerRef = doc(db, 'users', post.userId);
//   const ownerSnap = await getDoc(ownerRef);
  
//   if (ownerSnap.exists()) {
//     const ownerData = ownerSnap.data();
//     // Ajoutez la notification dans la sous-collection du propriétaire
//     await addDoc(collection(db, 'users', post.userId, 'notifications'), {
//       type: 'new_reservation',
//       message: `Nouvelle réservation pour ${post.title}`,
//       date: new Date().toISOString(),
//       read: false,
//       reservationDate: date.toISOString(),
//       userId: userData.uid
//     });
    
//     // Envoi push notification si nécessaire
//     if (ownerData.fcmToken) {
//       await sendPushNotification(ownerData.fcmToken, 'Nouvelle réservation', `Quelqu'un veut visiter votre propriété ${post.title}`);
//     }
//   }
// };

// const sendNotificationToTenant = async () => {
//   // Notification pour l'utilisateur actuel
//   await addDoc(collection(db, 'users', userData.uid, 'notifications'), {
//     type: 'reservation_confirmed',
//     message: `Réservation confirmée pour ${post.title}`,
//     date: new Date().toISOString(),
//     read: false,
//     reservationDate: date.toISOString()
//   });
// };

// const confirmVisit = async () => {
//   try {
//     // 1. Préparer le payload FedaPay en mode TEST
//     const payload = {
//       amount: Number(post.price),
//       currency: 'XOF',
//       description: post.title,
//       reservationId: post.id,
//       // public_key: 'pk_test_xxx...', // Remplace par ta PUBLIC_KEY_TEST FedaPay
//       metadata: {
//         reservationId: post.id,
//         propertyTitle: post.title
//       },
//       customer: {
//         email: userData.email,
//         phone_number: userData.phone || '',
//         fisrtname: userData.name,
//         lastname: userData.surname || '',

//       },
//       // redirect_url: `montoitbj://payment/return/${post.id}`
//     };
//     console.log("Payload de paiement:", payload);
//     // 2. Envoyer la requête au backend FedaPay (sandbox)
//     const resp = await fetch('https://monbackend-production.up.railway.app/pay/', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload)
//     });
// //https://monbackend-production.up.railway.app/pay
//     // 3. Lire la réponse
//     const result = await resp.json();
//     console.log("Réponse complète du backend:", result);

//     // 4. Vérifier le succès
//     if (!result.success) {
//       throw new Error(result.error || 'Échec de la création de la session de paiement');
//     }

//     // 5. Vérifier et récupérer l'URL de paiement
//     if (!result.paymentUrl) {
//       throw new Error('URL de paiement manquante dans la réponse');
//     }
//     console.log("URL de paiement reçue:", result.paymentUrl);

//     // 6. Ouvrir l'URL dans le navigateur ou via deep link
//     navigation.navigate('Payment',{ paymentUrl : result.paymentUrl});
//   } catch (err) {
//     console.error('Erreur complète:', err);
//     Alert.alert(
//       'Erreur Paiement',
//       err.message || 'Une erreur inattendue est survenue'
//     );
//   }
// };

// // Fonction pour afficher les POIS

// const [pois, setPois] = useState([]);


//    useEffect(() => {
//     const loadPOIs = async () => {
//       // Récupération des coordonnées quel que soit le format
//       const coords = await getCoordinates(post.location);
      
//       if (!coords) {
//         console.log("Coordonnées non disponibles");
//         return;
//       }

//       // Récupération des POIs
//       const poisData = await fetchNearbyPOIs(coords.lat, coords.lon);
//       setPois(formatPOIData(poisData));
//     };

//     loadPOIs();
//   }, [post]);

//   // Fonction de formatage des données POI
//   const formatPOIData = (data) => {
//     return data.map(poi => ({
//       id: poi.id,
//       name: poi.tags?.name || 'Lieu sans nom',
//       type: getPOIType(poi.tags),
//       distance: calculateDistance(post.location, poi) + ' m'
//     }));
//   };
  


//   // Composants internes
//   const ActionButtons = () => (
//     <View style={newStyles.actionBar}>
//       <TouchableOpacity 
//         style={[newStyles.actionButton, newStyles.reserveButton]}
//         onPress={() => {confirmVisit()}}
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
//         onPress={goToMessenger}
//       >
//         <Ionicons name="chatbubbles" size={20} color="white" />
//         <Text style={newStyles.buttonText}>Contacter</Text>
//       </TouchableOpacity>
//     </View>
//   );

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
          
//           <TouchableOpacity 
//             style={newStyles.optionButton}
//             onPress={() => {
//               setVisitType('virtual');
//               setShowDatePicker(true);
//               setModalVisible(false);
//             }}
//           >
//             <Ionicons name="videocam" size={24} color={COLORS.primary} />
//             <View style={newStyles.optionTextContainer}>
//               <Text style={newStyles.optionTitle}>Visite Virtuelle</Text>
//               <Text style={newStyles.optionSubtitle}>Appel vidéo avec le propriétaire</Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={newStyles.optionButton}
//             onPress={() => {
//               setVisitType('physical');
//               setShowDatePicker(true);
//               setModalVisible(false);
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

//   const ContactPromptModal = () => (
//     <Modal
//       visible={contactPromptVisible}
//       transparent={true}
//       animationType="slide"
//       onRequestClose={() => setContactPromptVisible(false)}
//     >
//       <View style={newStyles.modalContainer}>
//         <View style={newStyles.modalContent}>
//           <Text style={newStyles.modalTitle}>Contact pour la visite virtuelle</Text>

//           <Text style={{ marginBottom: 8, fontSize: 14, color: '#666' }}>
//             Entrez votre WhatsApp ou email :
//           </Text>

//           <TextInput
//             placeholder="ex: +229 97 00 00 00 ou email@exemple.com"
//             value={contactMethod}
//             onChangeText={setContactMethod}
//             style={{
//               borderWidth: 1,
//               borderColor: '#ccc',
//               borderRadius: 8,
//               padding: 10,
//               marginBottom: 16,
//             }}
//             keyboardType={Platform.OS === 'web' ? 'default' : 'email-address'}
//           />

//           <TouchableOpacity
//             style={[newStyles.actionButton, { backgroundColor: COLORS.primary }]}
//             onPress={() => {
//               // if (!contactMethod) {
//               //   Alert.alert('Erreur', 'Veuillez entrer un moyen de contact');
//               //   return;
//               // }
//               confirmVisit();
//             }}
//           >
//             <Text style={{ color: 'white', fontWeight: 'bold' }}>Confirmer</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={newStyles.closeButton}
//             onPress={() => setContactPromptVisible(false)}
//           >
//             <Text style={newStyles.closeButtonText}>Annuler</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );

//   if (loading) {
//     return (
//       // <View style={styles.loadingContainer}>
//       //   <ActivityIndicator size="large" color={COLORS.primary} />
//       //   <Text style={styles.loadingText}>Chargement de l'annonce...</Text>
//       // </View> <Skeleton show colorMode="light" duration={1200} />
//       <PostDetailSkeleton />

//     );
  
  
//   }

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

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <Animated.ScrollView 
//         ref={scrollRef}
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
//             renderItem={ renderGalleryItem}
//             showsHorizontalScrollIndicator={false}
//             onScroll={onScroll}
//             scrollEventThrottle={16}
//             initialNumToRender={3}
//             maxToRenderPerBatch={3}
//             windowSize={5}
//           />
          
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
          
//           {mediaItems.length > 0 && mediaItems[activeSlide]?.type === 'image' && (
//             <TouchableOpacity 
//               style={galleryStyles.fullscreenButton}
//               onPress={() => openImage(activeSlide)}
//             >
//               <Ionicons name="expand" size={24} color="white" />
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Contenu de l'annonce */}
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
          
//           <View style={styles.locationContainer}>
//             <Ionicons name="location-sharp" size={16} color="#666" />
//             <Text style={styles.locationText} numberOfLines={2}>
//               {typeof post.location === 'string' 
//                 ? post.location 
//                 : post.location?.display_name || 'Localisation non disponible'}
//             </Text>
//           </View>
          
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
     
//          <OwnerInfo userId={post.userId} />
//         <PoiList post={post}/>
//         {/* <BoostedListings/> */}
//         {/*section sugestion*/}
//         <View style={styles.sectionContainer}>
//   <SimilarListings 
//     currentPostId={post.id}
    
//     navigation={navigation}
//   />
// </View>
//       </Animated.ScrollView>
         
//       {/* Boutons d'action */}
//       <ActionButtons />

//       {/* Modales */}
//       <VisitModal />
//       <ContactPromptModal />
      
//       <DateTimePickerModal
//         isVisible={showDatePicker}
//         mode="datetime"
//         onConfirm={handleDateConfirm}
//         onCancel={() => setShowDatePicker(false)}
//         minimumDate={new Date()}
//         locale="fr_FR"
//         headerTextIOS="Choisir une date"
//         confirmTextIOS="Confirmer"
//         cancelTextIOS="Annuler"
//       />

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
//     </SafeAreaView>
//   );
// };

// // Styles (conservez vos styles existants)
// // ...

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
//   Platform,
//   TextInput,
//   LayoutAnimation
// } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import { VideoView, useVideoPlayer } from 'expo-video';
// import { Image } from 'expo-image';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { doc, getDoc } from 'firebase/firestore';
// import * as Linking from 'expo-linking';
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { addDoc, collection } from 'firebase/firestore';
// import LottieView from 'lottie-react-native';
// import CalendarStrip from 'react-native-calendar-strip';

// // Importations locales
// import { db } from '../../src/api/FirebaseConfig';
// import { COLORS, SIZES } from '../../constants/Theme';
// import { UserContext } from '../../context/AuthContext';
// import { isPostFavorite, toggleFavorite } from '../../services/favorites';
// import SecureWatermarkedImage from '../../components/SecureWatermarkedImage';
// import OwnerInfo from '../../components/OwnerInfo';
// import PostDetailSkeleton from '../../components/skeletons/PostDetailSkeleton';
// import PoiList from '../../components/PoiList';
// import SimilarListings from '../../components/SimilarListings';
// import GalleryItem from '../../components/GalleryItem';
// // import WeatherWidget from '../../components/WeatherWidget';

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
  
//   // Animations
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scrollX = useRef(new Animated.Value(0)).current;
//   const heartAnimation = useRef(new Animated.Value(0)).current;
//   const pulseAnim = useRef(new Animated.Value(0)).current;
//   const popularityAnim = useRef(new Animated.Value(0)).current;
//   const flatListRef = useRef(null);
//   const scrollRef = useRef(null);

//   // États pour la réservation
//   const [modalVisible, setModalVisible] = useState(false);
//   const [visitType, setVisitType] = useState(null);
//   const [date, setDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [contactMethod, setContactMethod] = useState('');
//   const [contactPromptVisible, setContactPromptVisible] = useState(false);
//   const [isDeal, setIsDeal] = useState(false);

//   // Chargement des données
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const postRef = doc(db, 'posts', postId);
//         const postSnap = await getDoc(postRef);
        
//         if (postSnap.exists()) {
//           const postData = { id: postSnap.id, ...postSnap.data() };
//           setPost(postData);
          
//           // Vérifier si c'est une bonne affaire (20% moins cher que la moyenne)
//           const isGoodDeal = postData.price < (postData.averageAreaPrice || postData.price * 0.8);
//           setIsDeal(isGoodDeal);
          
//           // Animation de popularité
//           Animated.timing(popularityAnim, {
//             toValue: postData.views || 0,
//             duration: 1500,
//             useNativeDriver: false
//           }).start();

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
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 500,
//           useNativeDriver: true,
//         }).start();
//       }
//     };

//     fetchData();
    
//     // Animation pulsante pour les bonnes affaires
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 1000,
//           useNativeDriver: true
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 0,
//           duration: 1000,
//           useNativeDriver: true
//         })
//       ])
//     ).start();
//   }, [postId]);

//   // Vérification des URLs
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
//          ...(post.imageUrls?.filter(url => isValidUrl(url)).map(url => ({ type: 'image', url })) || []),
//          ...(post.videoUrls?.filter(url => isValidUrl(url)).map(url => ({ type: 'video', url })) || [])
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

//   // Gestion des favoris avec animation
//   const handleToggleFavorite = async () => {
//     try {
//       if (userData?.uid) {
//         const result = await toggleFavorite(userData.uid, postId);
//         setIsFavorite(result);
//         Animated.spring(heartAnimation, {
//           toValue: result ? 1 : 0,
//           useNativeDriver: true
//         }).start();
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

//   // Composant GalleryItem optimisé
//   const renderGalleryItem = useCallback(
//     ({ item, index }) => (
//       <GalleryItem
//         item={item}
//         index={index}
//         openImage={openImage}
//         galleryStyles={galleryStyles}
//       />
//     ),
//     [openImage]
//   );

//   // Gestion de la date
//   const handleDateConfirm = (selectedDate) => {
//     setShowDatePicker(false);
//     setDate(selectedDate);
//     if (visitType === 'virtual') {
//       setContactPromptVisible(true);
//     } else {
//       confirmVisit();
//     }
//   };

//   // Réservation et paiement
//   const confirmVisit = async () => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
//     setContactPromptVisible(false);
    
//     try {
//       // Enregistrer la réservation dans Firestore
//       await addDoc(collection(db, 'reservations'), {
//         userId: userData.uid,
//         postId: post.id,
//         date: date.toISOString(),
//         visitType,
//         contactMethod,
//         status: 'pending',
//         createdAt: new Date()
//       });
      
//       Alert.alert(
//         "Réservation enregistrée", 
//         "Le propriétaire a été notifié de votre demande"
//       );
      
//     } catch (error) {
//       console.error("Erreur réservation:", error);
//       Alert.alert("Erreur", "Impossible d'enregistrer la réservation");
//     }
//   };

//   // Réservation en 1-click
//   const handleInstantBooking = () => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
//     Alert.alert(
//       "Réservation Express",
//       "Confirmez-vous la réservation immédiate ?",
//       [
//         { text: "Annuler", style: "cancel" },
//         { text: "Confirmer", onPress: () => {
//           setVisitType('physical');
//           setDate(new Date());
//           confirmVisit();
//         }}
//       ]
//     );
//   };

//   // Composants optimisés
//   const ActionButtons = React.memo(() => (
//     <View style={styles.actionBar}>
//       <TouchableOpacity 
//         style={[styles.actionButton, styles.instantBookButton]}
//         onPress={handleInstantBooking}
//       >
//         <Ionicons name="flash" size={20} color="white" />
//         <Text style={styles.buttonText}>Réserver maintenant</Text>
//       </TouchableOpacity>

//       <TouchableOpacity 
//         style={[styles.actionButton, styles.contactButton]}
//         onPress={goToMessenger}
//       >
//         <Ionicons name="chatbubbles" size={20} color="white" />
//         <Text style={styles.buttonText}>Contacter</Text>
//       </TouchableOpacity>
//     </View>
//   ));

//   const VisitModal = () => (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={modalVisible}
//       onRequestClose={() => setModalVisible(false)}
//     >
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <Text style={styles.modalTitle}>Type de visite</Text>
          
//           <TouchableOpacity 
//             style={styles.optionButton}
//             onPress={() => {
//               setVisitType('virtual');
//               setShowDatePicker(true);
//               setModalVisible(false);
//             }}
//           >
//             <Ionicons name="videocam" size={24} color={COLORS.primary} />
//             <View style={styles.optionTextContainer}>
//               <Text style={styles.optionTitle}>Visite Virtuelle</Text>
//               <Text style={styles.optionSubtitle}>Appel vidéo avec le propriétaire</Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.optionButton}
//             onPress={() => {
//               setVisitType('physical');
//               setShowDatePicker(true);
//               setModalVisible(false);
//             }}
//           >
//             <Ionicons name="walk" size={24} color={COLORS.primary} />
//             <View style={styles.optionTextContainer}>
//               <Text style={styles.optionTitle}>Visite sur Place</Text>
//               <Text style={styles.optionSubtitle}>RDV physique au logement</Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             style={styles.closeButton}
//             onPress={() => setModalVisible(false)}
//           >
//             <Text style={styles.closeButtonText}>Annuler</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );

//   const ContactPromptModal = () => (
//     <Modal
//       visible={contactPromptVisible}
//       transparent={true}
//       animationType="slide"
//       onRequestClose={() => setContactPromptVisible(false)}
//     >
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <Text style={styles.modalTitle}>Contact pour la visite virtuelle</Text>

//           <Text style={{ marginBottom: 8, fontSize: 14, color: '#666' }}>
//             Entrez votre WhatsApp ou email :
//           </Text>

//           <TextInput
//             placeholder="ex: +229 97 00 00 00 ou email@exemple.com"
//             value={contactMethod}
//             onChangeText={setContactMethod}
//             style={styles.contactInput}
//             keyboardType={Platform.OS === 'web' ? 'default' : 'email-address'}
//           />

//           <TouchableOpacity
//             style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
//             onPress={confirmVisit}
//           >
//             <Text style={{ color: 'white', fontWeight: 'bold' }}>Confirmer</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.closeButton}
//             onPress={() => setContactPromptVisible(false)}
//           >
//             <Text style={styles.closeButtonText}>Annuler</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );

//   if (loading) {
//     return <PostDetailSkeleton />;
//   }

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

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <Animated.ScrollView 
//         ref={scrollRef}
//         style={{ opacity: fadeAnim }}
//         contentContainerStyle={styles.scrollContainer}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Galerie d'images/vidéos améliorée */}
//         <View style={galleryStyles.container}>
//           <Animated.FlatList
//             ref={flatListRef}
//             horizontal
//             pagingEnabled
//             data={mediaItems}
//             keyExtractor={(item, index) => `${item.type}-${index}`}
//             renderItem={renderGalleryItem}
//             showsHorizontalScrollIndicator={false}
//             onScroll={Animated.event(
//               [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//               { useNativeDriver: false }
//             )}
//             scrollEventThrottle={16}
//             initialNumToRender={3}
//             maxToRenderPerBatch={3}
//             windowSize={5}
//           />
          
//           {mediaItems.length > 1 && (
//             <Animated.View style={styles.paginationWrapper}>
//               {mediaItems.map((_, i) => {
//                 const opacity = scrollX.interpolate({
//                   inputRange: [
//                     (i - 1) * width,
//                     i * width,
//                     (i + 1) * width
//                   ],
//                   outputRange: [0.3, 1, 0.3],
//                   extrapolate: 'clamp'
//                 });
                
//                 return (
//                   <Animated.View 
//                     key={i}
//                     style={[
//                       galleryStyles.paginationDot,
//                       i === activeSlide && galleryStyles.activeDot,
//                       { opacity }
//                     ]}
//                   />
//                 );
//               })}
//             </Animated.View>
//           )}
          
//           {mediaItems.length > 0 && mediaItems[activeSlide]?.type === 'image' && (
//             <TouchableOpacity 
//               style={galleryStyles.fullscreenButton}
//               onPress={() => openImage(activeSlide)}
//             >
//               <Ionicons name="expand" size={24} color="white" />
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* En-tête dynamique */}
//         <View style={styles.headerContainer}>
//           <View style={styles.priceRow}>
//             <Text style={styles.priceText}>{post.price?.toLocaleString()} FCFA</Text>
//             {post.transactionType === 'rent' && (
//               <Text style={styles.pricePeriod}>/mois</Text>
//             )}
            
//             {isDeal && (
//               <Animated.View style={[
//                 styles.dealBadge,
//                 { 
//                   transform: [{
//                     scale: pulseAnim.interpolate({
//                       inputRange: [0, 1],
//                       outputRange: [1, 1.1]
//                     })
//                   }] 
//                 }
//               ]}>
//                 <Text style={styles.dealText}>BONNE AFFAIRE</Text>
//               </Animated.View>
//             )}
//           </View>
          
//           <View style={styles.titleRow}>
//             <Text style={styles.titleText} numberOfLines={2}>{post.title}</Text>
//             <TouchableOpacity onPress={handleToggleFavorite}>
//               <LottieView
//                 source={require('../../assets/animations/heart.json')}
//                 progress={heartAnimation}
//                 style={styles.lottieHeart}
//                 speed={2}
//               />
//             </TouchableOpacity>
//           </View>
          
//           <View style={styles.metaContainer}>
//             <View style={styles.locationContainer}>
//               <Ionicons name="location-sharp" size={16} color="#666" />
//               <Text style={styles.locationText} numberOfLines={2}>
//                 {typeof post.location === 'string' 
//                   ? post.location 
//                   : post.location?.display_name || 'Localisation non disponible'}
//               </Text>
//             </View>
            
//             {/* <WeatherWidget 
//               coordinates={post.location?.coordinates} 
//               style={styles.weather}
//             /> */}
//           </View>
          
//           {post.createdAt && (
//             <View style={styles.dateContainer}>
//               <Ionicons name="time-outline" size={14} color="#666" />
//               <Text style={styles.timeText}>
//                 {` Publié il y a ${calculateTimeSince(post.createdAt)}`}
//               </Text>
//             </View>
//           )}
          
//           <View style={styles.popularityContainer}>
//             <Animated.View 
//               style={[
//                 styles.popularityBar,
//                 {
//                   width: popularityAnim.interpolate({
//                     inputRange: [0, Math.max(100, post.views || 0)],
//                     outputRange: ['0%', '100%']
//                   })
//                 }
//               ]}
//             />
//             <Text style={styles.popularityText}>
//               {post.views || 0} vues récentes
//             </Text>
//           </View>
//         </View>

//         {/* Calendrier de disponibilité */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>Disponibilité</Text>
//           <CalendarStrip
//             scrollable
//             style={styles.calendar}
//             calendarColor={COLORS.white}
//             selectedDate={new Date()}
//             markedDates={post.availability || []}
//           />
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
//         <OwnerInfo userId={post.userId} />
        
//         {/* Points d'intérêt à proximité */}
//         <PoiList post={post}/>
        
//         {/* Suggestions de logements similaires */}
//         <View style={styles.sectionContainer}>
//           <SimilarListings 
//             currentPostId={post.id}
//             navigation={navigation}
//           />
//         </View>
//       </Animated.ScrollView>
         
//       {/* Boutons d'action */}
//       <ActionButtons />

//       {/* Modales */}
//       <VisitModal />
//       <ContactPromptModal />
      
//       <DateTimePickerModal
//         isVisible={showDatePicker}
//         mode="datetime"
//         onConfirm={handleDateConfirm}
//         onCancel={() => setShowDatePicker(false)}
//         minimumDate={new Date()}
//         locale="fr_FR"
//         headerTextIOS="Choisir une date"
//         confirmTextIOS="Confirmer"
//         cancelTextIOS="Annuler"
//       />

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
//     </SafeAreaView>
//   );
// };

// // Styles galerie
// const galleryStyles = StyleSheet.create({
//   container: {
//     height: 350,
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
//     paddingBottom: 100
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
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: COLORS.primary,
//   },
//   pricePeriod: {
//     fontSize: 16,
//     color: '#666',
//     marginLeft: 4,
//     marginBottom: 2
//   },
//   dealBadge: {
//     backgroundColor: '#FF4757',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//     marginLeft: 10,
//     alignSelf: 'flex-start'
//   },
//   dealText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold'
//   },
//   titleRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8
//   },
//   titleText: {
//     fontSize: 22,
//     fontWeight: '600',
//     color: '#333',
//     flex: 1,
//     marginRight: 10
//   },
//   lottieHeart: {
//     width: 50,
//     height: 50
//   },
//   metaContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1
//   },
//   locationText: {
//     fontSize: 14,
//     color: '#666',
//     marginLeft: 4
//   },
//   weather: {
//     flexDirection: 'row',
//     alignItems: 'center'
//   },
//   dateContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8
//   },
//   timeText: {
//     fontSize: 12,
//     color: '#666',
//     marginLeft: 4
//   },
//   popularityContainer: {
//     marginTop: 10
//   },
//   popularityBar: {
//     height: 5,
//     backgroundColor: COLORS.primary,
//     borderRadius: 3
//   },
//   popularityText: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 5
//   },
//   sectionContainer: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0'
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 12
//   },
//   calendar: {
//     height: 100,
//     paddingVertical: 5
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
//     fontSize: 15,
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
//     fontSize: 16,
//     lineHeight: 24,
//     color: '#555'
//   },
//   actionBar: {
//     flexDirection: 'row',
//     padding: 12,
//     backgroundColor: 'white',
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
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
//   actionButton: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 15,
//     borderRadius: 8,
//     marginHorizontal: 5
//   },
//   instantBookButton: {
//     flex: 2,
//     backgroundColor: '#FF6B6B',
//   },
//   contactButton: {
//     flex: 1,
//     backgroundColor: COLORS.primary,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     marginLeft: 8,
//     fontSize: 16
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
//     fontSize: 20,
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
//     fontSize: 14,
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
//     fontSize: 16
//   },
//   contactInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//     fontSize: 16
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
//     fontSize: 18,
//     fontWeight: 'bold',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     paddingHorizontal: 15,
//     paddingVertical: 5,
//     borderRadius: 10
//   },
//   paginationWrapper: {
//     position: 'absolute',
//     bottom: 20,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'center'
//   }
// });

// export default PostDetailScreen;
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
//   Modal,
//   Platform,
//   TextInput,
//   Share,
//   Linking
// } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import { Video } from 'expo-av';
// import { Image } from 'expo-image';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { doc, getDoc } from 'firebase/firestore';

// // Importations locales
// import { db } from '../../src/api/FirebaseConfig';
// import { COLORS , SIZES , FONTS } from '../../constants/Theme';
// import { UserContext } from '../../context/AuthContext';
// import { isPostFavorite, toggleFavorite } from '../../services/favorites';
// import OwnerInfo from '../../components/OwnerInfo';
// import PostDetailSkeleton from '../../components/skeletons/PostDetailSkeleton';
// import PoiList from '../../components/PoiList';
// import SimilarListings from '../../components/SimilarListings';

// const { width } = Dimensions.get('window');
// const HEADER_MAX_HEIGHT = 300;
// const HEADER_MIN_HEIGHT = 100;
// const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// const PostDetailScreen = ({ navigation }) => {
//   const route = useRoute();
//   const { postId } = route.params;
  
//   // États
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [imageViewerVisible, setImageViewerVisible] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [ownerPhoneNumber, setOwnerPhoneNumber] = useState(null);
//   const [activeSlide, setActiveSlide] = useState(0);
//   const [toastVisible, setToastVisible] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   //
//   const [isReservationModalVisible, setIsReservationModalVisible] = useState(false);
//   const [reservationDays, setReservationDays] = useState(3); // Durée par défaut
//   const [reservationPrice, setReservationPrice] = useState(0);
//   //
//   const flatListRef = useRef(null);
//   const videoRefs = useRef({});

//   // Références et contextes
//   const { userData } = useContext(UserContext);
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const heartScale = useRef(new Animated.Value(1)).current;

//   // Animation du header
//   const headerHeight = scrollY.interpolate({
//     inputRange: [0, HEADER_SCROLL_DISTANCE],
//     outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
//     extrapolate: 'clamp',
//   });

//   const headerTitleOpacity = scrollY.interpolate({
//     inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
//     outputRange: [0, 0, 1],
//     extrapolate: 'clamp',
//   });

//   // Chargement des données
//   useEffect(() => {
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
// // calcul du prix de réservation
//   useEffect(() => {
//     if (post?.price && reservationDays > 0) {
//       const dailyRate = post.price / 30;
//       const serviceFee = 500; // Frais de service fixes pour la réservation
//       const calculatedPrice = Math.round(dailyRate * reservationDays) + serviceFee;
//       setReservationPrice(calculatedPrice);
//     }
//   }, [reservationDays, post]);
//   // Fonctions utilitaires
//   const isValidUrl = (url) => {
//     try {
//       new URL(url);
//       return true;
//     } catch {
//       return false;
//     }
//   };
  
//   const calculateTimeSince = useCallback((firestoreTimestamp) => {
//     if (!firestoreTimestamp?.seconds) return "Date invalide";
    
//     const timestampMs = firestoreTimestamp.seconds * 1000;
//     const postDate = new Date(timestampMs);
//     const now = new Date();
//     const diffInMs = now - postDate;

//     const seconds = Math.floor(diffInMs / 1000);
//     if (seconds < 60) return `${seconds} sec`;

//     const minutes = Math.floor(seconds / 60);
//     if (minutes < 60) return `${minutes} min`;

//     const hours = Math.floor(minutes / 60);
//     if (hours < 24) return `${hours} h`;

//     const days = Math.floor(hours / 24);
//     if (days < 30) return `${days} j`;

//     const months = Math.floor(days / 30);
//     if (months < 12) return `${months} mois`;

//     const years = Math.floor(months / 12);
//     return `${years} an${years > 1 ? 's' : ''}`;
//   }, []);
//   // --- NOUVELLE FONCTION POUR OUVRIR LA MODALE DE RÉSERVATION ---
//   const openReservationModal = () => {
//     if (!userData) {
//       Alert.alert("Connexion requise", "Veuillez vous connecter pour réserver une chambre.");
//       return;
//     }
//     // Réinitialiser au cas où
//     setReservationDays(3); 
//     setIsReservationModalVisible(true);
//   };
  
//   // --- L'ANCIENNE handleReservation DEVIENT initiateReservationPayment ---
//   const initiateReservationPayment = async () => {
//     setIsReservationModalVisible(false); // Ferme la modale avant de procéder
//     try {
//       const payload = {
//         reservationId: `reservation-${post.id}-${Date.now()}`,
//         amount: Number(reservationPrice), // Utilise le prix calculé
//         currency: 'XOF',
//         description: `Réservation (${reservationDays} jours) pour : ${post.title}`,
//         reference: `reservation-${post.id}-${Date.now()}`,
//         metadata: { 
//           listingId: post.id, 
//           propertyTitle: post.title,
//           reservationDays: reservationDays, // Envoie la durée au backend
//           userId: userData.uid 
//         },
//         customer: {
//           email: userData.email,
//           phone_number: userData.phone || '',
//           firstname: userData.name || '',
//           lastname: userData.surname || '',
//         },
//       };

//       const response = await fetch('https://monbackend-production.up.railway.app/pay/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });

//       const result = await response.json();
//       console.log('Résultat de la création de session de paiement:', result);
//       if (!result.success ||  !result.paymentUrl) {
//         throw new Error(result.message || 'Échec de la création de la session de paiement');
//       }

//       navigation.navigate('Payment', { paymentUrl: result.paymentUrl });
//     } catch (err) {
//       console.error('Erreur paiement:', err);
//       Alert.alert('Erreur Paiement', err.message || 'Une erreur est survenue');
//     }
//   };
//   // Gestion des médias
//   const mediaItems = post 
//      ? [
//        ...(post.imageUrls?.filter(url => isValidUrl(url)).map(url => ({ type: 'image', url })) || []),
//        ...(post.videoUrls?.filter(url => isValidUrl(url)).map(url => ({ type: 'video', url })) || [])
//        ]
//      : [];

//   const imagesForViewer = mediaItems.filter(item => item.type === 'image');
  
//   // Animation du cœur
//   const animateHeart = () => {
//     Animated.sequence([
//       Animated.timing(heartScale, {
//         toValue: 1.5,
//         duration: 200,
//         useNativeDriver: true,
//       }),
//       Animated.spring(heartScale, {
//         toValue: 1,
//         friction: 3,
//         useNativeDriver: true,
//       })
//     ]).start();
//   };

//   // Gestion des favoris
//   const handleToggleFavorite = async () => {
//     try {
//       if (userData?.uid) {
//         const result = await toggleFavorite(userData.uid, postId);
//         setIsFavorite(result);
//         animateHeart();
        
//         setToastMessage(result ? 'Ajouté aux favoris' : 'Retiré des favoris');
//         setToastVisible(true);
//         setTimeout(() => setToastVisible(false), 2000);
//       }
//     } catch (error) {
//       console.error("Erreur favori:", error);
//       Alert.alert("Erreur", "Impossible de modifier les favoris");
//     }
//   };

//   // Navigation et interactions
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

//   // Nouvelle fonction: Ouvrir WhatsApp
//   const generateClickableLink = (postId) => {
//   return `[Voir l'annonce](montoitbj://annonce/${postId})`;
// };
//   const openWhatsApp = () => {
//     if (!ownerPhoneNumber) {
//       Alert.alert('Erreur', 'Numéro de téléphone non disponible');
//       return;
//     }

//     // Nettoyer le numéro de téléphone
//     const cleanedPhone = ownerPhoneNumber.replace(/[^0-9+]/g, '');
    
//     // Générer le lien de l'annonce (à adapter selon votre structure)
//     const announcementLink = `https://monbackend-production.up.railway.app/PostDetail?postId=${post.id}`;
    
//     // Message pré-rempli
//     const message = `Bonjour, je suis intéressé par votre annonce "${post.title}" sur RoomRent. 
    
// Détails :
// - Prix : ${post.price} FCFA
// - Lieu : ${post.location?.display_name || 'Non spécifié'}
// - Lien : ${announcementLink}

// Pouvons-nous discuter de cette annonce ?`;

//     // Encoder le message pour URL
//     const encodedMessage = encodeURIComponent(message);
    
//     // Construire l'URL WhatsApp
//     const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodedMessage}`;
    
//     // Ouvrir WhatsApp
//     Linking.openURL(whatsappUrl).catch(() => {
//       Alert.alert('Erreur', "WhatsApp n'est pas installé");
//     });
//   };

//   // Nouvelle fonction: Partager l'annonce
//   const shareAnnouncement = async () => {
//     try {
//       const announcementLink = `https://monbackend-production.up.railway.app/PostDetail?postId=${post.id}`;
      
//       const message = `Découvrez cette annonce sur RoomRent : 
// ${post.title}
// ${post.price} FCFA
// ${announcementLink}
// ${generateClickableLink(post.id)}`;

//       await Share.share({
//         message,
//         title: 'Partager cette annonce',
//       });
//     } catch (error) {
//       console.error('Erreur de partage:', error);
//       Alert.alert('Erreur', 'Impossible de partager cette annonce');
//     }
//   };

//   const handleReservation = async () => {
//     try {
//       const payload = {
//         amount: Number(post.price),
//         currency: 'XOF',
//         description: post.title,
//         reservationId: post.id,
//         metadata: { reservationId: post.id, propertyTitle: post.title },
//         customer: {
//           email: userData.email,
//           phone_number: userData.phone || '',
//           fisrtname: userData.name,
//           lastname: userData.surname || '',
//         },
//       };

//       const response = await fetch('https://monbackend-production.up.railway.app/pay/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });

//       const result = await response.json();
      
//       if (!result.success) {
//         throw new Error(result.error || 'Échec de la création de la session de paiement');
//       }

//       if (!result.paymentUrl) {
//         throw new Error('URL de paiement manquante');
//       }

//       navigation.navigate('Payment', { paymentUrl: result.paymentUrl });
//     } catch (err) {
//       console.error('Erreur paiement:', err);
//       Alert.alert('Erreur Paiement', err.message || 'Une erreur est survenue');
//     }
//   };

//   // Rendu des éléments de la galerie
//   const renderGalleryItem = useCallback(
//     ({ item, index }) => {
//       if (item.type === 'image') {
//         return (
//           <TouchableOpacity 
//             style={styles.galleryItem}
//             onPress={() => openImage(index)}
//             activeOpacity={0.9}
//           >
//             <Image 
//               source={{ uri: item.url }}
//               style={styles.media}
//               contentFit="cover"
//             />
//           </TouchableOpacity>
//         );
//       } else if (item.type === 'video') {
//         return (
//           <View style={styles.galleryItem}>
//             <Video
//               ref={ref => videoRefs.current[index] = ref}
//               source={{ uri: item.url }}
//               style={styles.media}
//               resizeMode="cover"
//               shouldPlay={false}
//               isMuted={true}
//               useNativeControls
//             />
//           </View>
//         );
//       }
//       return null;
//     },
//     []
//   );

//   const openImage = useCallback((index) => {
//     setCurrentImageIndex(index);
//     setImageViewerVisible(true);
//   }, []);

//   const closeImage = useCallback(() => {
//     setImageViewerVisible(false);
//   }, []);

//   // Composants d'interface
//   const ActionButtons = () => (
//     <View style={styles.actionBar}>
//       <TouchableOpacity
//         style={[styles.actionButton, styles.reserveButton]}
//         onPress={openReservationModal} // <- MODIFICATION ICI
//       >
//         <Ionicons name="bookmark" size={20} color="white" />
//         <Text style={styles.buttonText}>Réserver</Text>
//       </TouchableOpacity>
//       <TouchableOpacity 
//         style={[styles.actionButton, styles.whatsappButton]}
//         onPress={openWhatsApp}
//       >
//         <Ionicons name="logo-whatsapp" size={20} color="white" />
//         <Text style={styles.buttonText}>WhatsApp</Text>
//       </TouchableOpacity>

//       <TouchableOpacity 
//         style={[styles.actionButton, styles.contactButton]}
//         onPress={goToMessenger}
//       >
//         <Ionicons name="chatbubbles" size={20} color="white" />
//         <Text style={styles.buttonText}>Contacter</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   if (loading) return <PostDetailSkeleton />;
//   if (!post) return (
//     <View style={styles.errorContainer}>
//       <Text style={styles.errorText}>Impossible de charger l'annonce</Text>
//       <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
//         <Text style={styles.retryButtonText}>Retour</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       {/* Header fixe avec titre animé, bouton retour et partage */}
//       <Animated.View style={[styles.fixedHeader, { opacity: headerTitleOpacity }]}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
//         </TouchableOpacity>
//         <Text style={styles.fixedHeaderTitle} numberOfLines={1}>{post.title}</Text>
//         <TouchableOpacity onPress={shareAnnouncement} style={styles.shareButton}>
//           <Ionicons name="share-social" size={24} color={COLORS.primary} />
//         </TouchableOpacity>
//       </Animated.View>
      
//       <Animated.ScrollView 
//         scrollEventThrottle={16}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//           { useNativeDriver: false }
//         )}
//         contentContainerStyle={styles.scrollContainer}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Galerie d'images/vidéos avec header animé */}
//         <Animated.View style={[styles.galleryContainer, { height: headerHeight }]}>
//           <FlatList
//             horizontal
//             ref={flatListRef}
//             pagingEnabled
//             data={mediaItems}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={renderGalleryItem}
//             showsHorizontalScrollIndicator={false}
//             onScroll={(e) => {
//               const slide = Math.round(e.nativeEvent.contentOffset.x / width);
//               if (slide !== activeSlide) setActiveSlide(slide);
//             }}
//             scrollEventThrottle={16}
//             initialNumToRender={3}
//             maxToRenderPerBatch={3}
//             windowSize={5}
//           />
          
//           {mediaItems.length > 1 && (
//             <View style={styles.pagination}>
//               {mediaItems.map((_, index) => (
//                 <View 
//                   key={index}
//                   style={[
//                     styles.paginationDot,
//                     index === activeSlide && styles.activeDot
//                   ]}
//                 />
//               ))}
//             </View>
//           )}
          
//           {mediaItems.length > 0 && mediaItems[activeSlide]?.type === 'image' && (
//             <TouchableOpacity 
//               style={styles.fullscreenButton}
//               onPress={() => openImage(activeSlide)}
//             >
//               <Ionicons name="expand" size={24} color="white" />
//             </TouchableOpacity>
//           )}
//         </Animated.View>

//         {/* Contenu de l'annonce */}
//         <View style={styles.content}>
//           <View style={styles.headerContainer}>
//             <View style={styles.priceRow}>
//               <Text style={styles.priceText}>{post.price?.toLocaleString()} FCFA</Text>
//               {post.transactionType === 'rent' && (
//                 <Text style={styles.pricePeriod}>/mois</Text>
//               )}
//             </View>
            
//             <View style={styles.titleRow}>
//               <Text style={styles.titleText} numberOfLines={2}>{post.title}</Text>
//               <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
//                 <Animated.View style={{ transform: [{ scale: heartScale }] }}>
//                   <Ionicons 
//                     name={isFavorite ? "heart" : "heart-outline"} 
//                     size={28} 
//                     color={isFavorite ? COLORS.primary : '#ccc'} 
//                   />
//                 </Animated.View>
//               </TouchableOpacity>
//             </View>
            
//             <View style={styles.locationContainer}>
//               <Ionicons name="location-sharp" size={16} color="#666" />
//               <Text style={styles.locationText} numberOfLines={2}>
//                 {post.location?.display_name || post.location || 'Localisation non disponible'}
//               </Text>
//             </View>
            
//             {post.createdAt && (
//               <View style={styles.dateContainer}>
//                 <Ionicons name="time-outline" size={14} color="#666" />
//                 <Text style={styles.timeText}>
//                   Publié il y a {calculateTimeSince(post.createdAt)}
//                 </Text>
//               </View>
//             )}
//           </View>
          
//           {/* Caractéristiques principales */}
//           <View style={styles.sectionContainer}>
//             <Text style={styles.sectionTitle}>Caractéristiques</Text>
//             <View style={styles.featuresGrid}>
//               {post.bedrooms > 0 && renderFeatureItem('hotel', `${post.bedrooms} Chambre(s)`) }
//               {post.bathrooms > 0 && renderFeatureItem('bathtub', `${post.bathrooms} Salle(s) de bain`) }
//               {post.livingRoom && renderFeatureItem('weekend', 'Salon')}
//               {post.area > 0 && renderFeatureItem('straighten', `${post.area} m²`)}
//             </View>
//           </View>

//           {/* Équipements */}
//           {post.features && (
//             <View style={styles.sectionContainer}>
//               <Text style={styles.sectionTitle}>Équipements</Text>
//               <View style={styles.amenitiesContainer}>
//                 {post.features.water && renderAmenity('water', 'Eau')}
//                 {post.features.electricity && renderAmenity('flash', 'Électricité')}
//                 {post.features.ac && renderAmenity('ac-unit', 'Climatisation')}
//                 {post.features.parking && renderAmenity('local-parking', 'Parking')}
//                 {post.features.security && renderAmenity('security', 'Sécurité')}
//                 {post.features.wifi && renderAmenity('wifi', 'Wi-Fi')}
//               </View>
//             </View>
//           )}

//           {/* Description */}
//           <View style={styles.sectionContainer}>
//             <Text style={styles.sectionTitle}>Description</Text>
//             <Text style={styles.descriptionText}>
//               {post.description || 'Aucune description fournie'}
//             </Text>
//           </View>

//           {/* Informations du propriétaire et suggestions */}
//           <OwnerInfo userId={post.userId} />
//           <PoiList post={post}/>
//           <View style={styles.sectionContainer}>
//             <SimilarListings currentPostId={post.id} navigation={navigation} />
//           </View>
//         </View>
//       </Animated.ScrollView>
         
//       {/* Boutons d'action */}
//       <ActionButtons />
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isReservationModalVisible}
//         onRequestClose={() => setIsReservationModalVisible(false)}
//       >
//         <View style={styles.reservationModalOverlay}>
//           <View style={styles.reservationModalContent}>
//             <Ionicons name="shield-checkmark-outline" size={40} color={COLORS.primary} />
//             <Text style={styles.reservationModalTitle}>Sécurisez cette chambre !</Text>
//             <Text style={styles.reservationModalText}>
//               En réservant, vous bloquez la chambre et vous vous assurez que personne d'autre ne puisse la prendre le temps que vous organisiez votre visite ou finalisiez le contrat.
//             </Text>

//             <Text style={styles.reservationSectionTitle}>Choisissez la durée de la réservation :</Text>
//             <View style={styles.daysSelector}>
//               <TouchableOpacity style={styles.daysButton} onPress={() => setReservationDays(d => Math.max(1, d - 1))}>
//                 <Ionicons name="remove-circle-outline" size={32} color={COLORS.primary} />
//               </TouchableOpacity>
//               <Text style={styles.daysValue}>{reservationDays} jour{reservationDays > 1 ? 's' : ''}</Text>
//               <TouchableOpacity style={styles.daysButton} onPress={() => setReservationDays(d => Math.min(30, d + 1))}>
//                 <Ionicons name="add-circle-outline" size={32} color={COLORS.primary} />
//               </TouchableOpacity>
//             </View>
            
//             <View style={styles.priceInfo}>
//                 <Text style={styles.priceLabel}>Prix de la réservation :</Text>
//                 <Text style={styles.priceValue}>{reservationPrice.toLocaleString()} FCFA</Text>
//             </View>
//             <Text style={styles.priceDetail}>(Inclut des frais de service de 500 FCFA)</Text>

//             <TouchableOpacity style={styles.confirmReservationButton} onPress={initiateReservationPayment}>
//               <Text style={styles.confirmReservationButtonText}>Payer et Réserver</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.cancelButton} onPress={() => setIsReservationModalVisible(false)}>
//               <Text style={styles.cancelButtonText}>Annuler</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Notification Toast */}
//       {toastVisible && (
//         <View style={styles.toast}>
//           <Text style={styles.toastText}>{toastMessage}</Text>
//         </View>
//       )}

//       {/* Modal de visualisation d'image */}
//       {imageViewerVisible && (
//         <Modal
//           transparent={true}
//           onRequestClose={closeImage}
//           statusBarTranslucent={true}
//           hardwareAccelerated={true}
//         >
//           <View style={styles.imageModalContainer}>
//             <TouchableOpacity style={styles.closeImageButton} onPress={closeImage}>
//               <Ionicons name="close" size={30} color="white" />
//             </TouchableOpacity>
            
//             <View style={styles.imageViewerContent}>
//               <Image
//                 source={{ uri: imagesForViewer[currentImageIndex]?.url }}
//                 style={styles.expandedImage}
//                 contentFit="contain"
//                 transition={300}
//               />
              
//               {imagesForViewer.length > 1 && (
//                 <View style={styles.imageNavContainer}>
//                   <TouchableOpacity 
//                     onPress={() => setCurrentImageIndex(prev => Math.max(0, prev - 1))}
//                     disabled={currentImageIndex === 0}
//                     style={styles.navButton}
//                   >
//                     <Ionicons 
//                       name="chevron-back" 
//                       size={30} 
//                       color={currentImageIndex === 0 ? 'rgba(255,255,255,0.3)' : 'white'} 
//                     />
//                   </TouchableOpacity>
                  
//                   <Text style={styles.imageCounter}>
//                     {`${currentImageIndex + 1}/${imagesForViewer.length}`}
//                   </Text>
                  
//                   <TouchableOpacity 
//                     onPress={() => setCurrentImageIndex(prev => Math.min(imagesForViewer.length - 1, prev + 1))}
//                     disabled={currentImageIndex === imagesForViewer.length - 1}
//                     style={styles.navButton}
//                   >
//                     <Ionicons 
//                       name="chevron-forward" 
//                       size={30} 
//                       color={currentImageIndex === imagesForViewer.length - 1 ? 'rgba(255,255,255,0.3)' : 'white'} 
//                     />
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>
//           </View>
//         </Modal>
//       )}
//     </SafeAreaView>
//   );
// };

// // Fonctions de rendu réutilisables
// const renderFeatureItem = (icon, text) => (
//   <View style={styles.featureItem}>
//     <MaterialIcons name={icon} size={20} color={COLORS.primary} />
//     <Text style={styles.featureText}>{text}</Text>
//   </View>
// );

// const renderAmenity = (icon, text) => (
//   <View style={styles.amenityBadge}>
//     {icon === 'water' || icon === 'flash' ? (
//       <Ionicons name={icon} size={16} color={COLORS.primary} />
//     ) : (
//       <MaterialIcons name={icon} size={16} color={COLORS.primary} />
//     )}
//     <Text style={styles.amenityText}>{text}</Text>
//   </View>
// );

// // Styles regroupés
// const styles = StyleSheet.create({
//   // Layout
//   safeArea: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//   },
//   scrollContainer: {
//     paddingBottom: 100
//   },
  
//   // Header
//   fixedHeader: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: 60,
//     backgroundColor: 'white',
//     zIndex: 100,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//     paddingTop: Platform.OS === 'ios' ? 40 : 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   backButton: {
//     padding: 8,
//   },
//   shareButton: {
//     padding: 8,
//     marginLeft: 'auto',
//   },
//   fixedHeaderTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: COLORS.primary,
//     textAlign: 'center',
//     flex: 1,
//     marginHorizontal: 10,
//   },
  
//   // Galerie
//   galleryContainer: {
//     position: 'relative',
//     backgroundColor: '#f5f5f5'
//   },
//   galleryItem: {
//     width: width,
//     height: '100%',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   media: {
//     width: '100%',
//     height: '100%',
//     backgroundColor: '#e1e1e1'
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
//   },
  
//   // Détails de l'annonce
//   headerContainer: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
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
  
//   // Sections
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
  
//   // Barre d'actions
//   actionBar: {
//     flexDirection: 'row',
//     padding: 12,
//     backgroundColor: 'white',
//     borderTopWidth: 1,
//     borderTopColor: '#f0f0f0',
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
//   actionButton: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 12,
//     borderRadius: 8,
//     marginHorizontal: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   reserveButton: {
//     backgroundColor: '#FF6B6B',
//     flex: 1.5,
//   },
//   whatsappButton: {
//     backgroundColor: '#25D366',
//     flex: 1,
//   },
//   contactButton: {
//     backgroundColor: '#5F7A61',
//     flex: 1,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     marginLeft: 8,
//     fontSize: 16
//   },
  
//   // Toast
//   toast: {
//     position: 'absolute',
//     bottom: 100,
//     alignSelf: 'center',
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     borderRadius: 20,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },
//   toastText: {
//     color: 'white',
//   },
  
//   // Visualisateur d'images
//   imageModalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.9)',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   closeImageButton: {
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
//   },
  
//   // Erreur
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
//   ///
//   reservationModalOverlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.6)',
//   },
//   reservationModalContent: {
//     backgroundColor: 'white',
//     padding: SIZES.padding * 1.5,
//     borderTopLeftRadius: SIZES.radius * 2,
//     borderTopRightRadius: SIZES.radius * 2,
//     alignItems: 'center',
//   },
//   reservationModalTitle: {
//     ...FONTS.h2,
//     color: COLORS.primary,
//     marginVertical: 10,
//   },
//   reservationModalText: {
//     ...FONTS.body4,
//     textAlign: 'center',
//     color: COLORS.gray,
//     marginBottom: 20,
//     lineHeight: 20,
//   },
//   reservationSectionTitle: {
//     ...FONTS.h4,
//     color: COLORS.darkGray,
//     marginBottom: 15,
//   },
//   daysSelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   daysButton: {
//     padding: 10,
//   },
//   daysValue: {
//     ...FONTS.h2,
//     color: COLORS.black,
//     marginHorizontal: 30,
//     width: 100,
//     textAlign: 'center',
//   },
//   priceInfo: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     padding: 10,
//     backgroundColor: '#f8f9fa',
//     borderRadius: SIZES.radius,
//     marginBottom: 5,
//   },
//   priceLabel: {
//     ...FONTS.body3,
//     color: COLORS.darkGray,
//     marginRight: 10,
//   },
//   priceValue: {
//     ...FONTS.h3,
//     color: COLORS.primary,
//     fontWeight: 'bold',
//   },
//   priceDetail: {
//     ...FONTS.body5,
//     color: COLORS.gray,
//     marginBottom: 20,
//   },
//   confirmReservationButton: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 15,
//     borderRadius: SIZES.radius,
//     alignItems: 'center',
//     width: '100%',
//     marginBottom: 10,
//   },
//   confirmReservationButtonText: {
//     ...FONTS.h4,
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   cancelButton: {
//     padding: 10,
//   },
//   cancelButtonText: {
//     ...FONTS.body3,
//     color: COLORS.gray,
//   },
// });

// export default PostDetailScreen;
// PostDetailScreen.js (plein écran swipe sync avec carrousel)
import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Alert,
  Animated,
  Modal,
  Platform,
  Share,
  Linking,
  Image,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import ImageViewing from 'react-native-image-viewing';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { doc, getDoc } from 'firebase/firestore';

// Importations locales
import { db } from '../../src/api/FirebaseConfig';
import { COLORS, SIZES, FONTS } from '../../constants/Theme';
import { UserContext } from '../../context/AuthContext';
import { isPostFavorite, toggleFavorite } from '../../services/favorites';
import OwnerInfo from '../../components/OwnerInfo';
import PostDetailSkeleton from '../../components/skeletons/PostDetailSkeleton';
import PoiList from '../../components/PoiList';
import SimilarListings from '../../components/SimilarListings';

const { width, height } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 100;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const PostDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { postId } = route.params;
  
  // États
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [ownerPhoneNumber, setOwnerPhoneNumber] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isReservationModalVisible, setIsReservationModalVisible] = useState(false);
  const [reservationDays, setReservationDays] = useState(3);
  const [reservationPrice, setReservationPrice] = useState(0);

  const flatListRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  // Header animation
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  // Contexte utilisateur
  const { userData } = useContext(UserContext);

  // Chargement des données
  useEffect(() => {
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

  // Calcul prix réservation
  useEffect(() => {
    if (post?.price && reservationDays > 0) {
      const dailyRate = post.price / 30;
      const serviceFee = 500;
      const calculatedPrice = Math.round(dailyRate * reservationDays) + serviceFee;
      setReservationPrice(calculatedPrice);
    }
  }, [reservationDays, post]);

  // Utilitaires
  const isValidUrl = (url) => {
    try { new URL(url); return true; } catch { return false; }
  };

  const calculateTimeSince = useCallback((firestoreTimestamp) => {
    if (!firestoreTimestamp?.seconds) return "Date invalide";
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
  }, []);

  // Favoris
  const animateHeart = () => {
    Animated.sequence([
      Animated.timing(heartScale, { toValue: 1.5, duration: 180, useNativeDriver: true }),
      Animated.spring(heartScale, { toValue: 1, friction: 3, useNativeDriver: true })
    ]).start();
  };
  const handleToggleFavorite = async () => {
    
    
    try {
      if (userData?.uid) {
        const result = await toggleFavorite(userData.uid, postId);
        setIsFavorite(result);
        animateHeart();
        setToastMessage(result ? 'Ajouté aux favoris' : 'Retiré des favoris');
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 2000);
      } else {
        Alert.alert('Connexion requise', "Veuillez vous connecter pour ajouter aux favoris.");
      }
    } catch (error) {
      console.error("Erreur favori:", error);
    }
  };

  // Media items (images + vidéos)
  const mediaItems = post 
    ? [
      ...(post.imageUrls?.filter(url => isValidUrl(url)).map(url => ({ type: 'image', url })) || []),
      ...(post.videoUrls?.filter(url => isValidUrl(url)).map(url => ({ type: 'video', url })) || []),
    ]
    : [];

  // images-only array for ImageViewing
  const imagesForViewer = mediaItems.filter(m => m.type === 'image').map(m => ({ uri: m.url }));

  // Helpers pour convertir index entre mediaItems et imagesForViewer
  const mediaIndexToImagesIndex = (mediaIndex) => {
    if (!mediaItems || mediaItems.length === 0) return 0;
    let count = -1;
    for (let i = 0; i <= mediaIndex && i < mediaItems.length; i++) {
      if (mediaItems[i].type === 'image') count++;
    }
    return Math.max(0, Math.min(count, imagesForViewer.length - 1));
  };

  const imagesIndexToMediaIndex = (imagesIndex) => {
    if (!mediaItems || mediaItems.length === 0) return 0;
    let count = -1;
    for (let i = 0; i < mediaItems.length; i++) {
      if (mediaItems[i].type === 'image') {
        count++;
        if (count === imagesIndex) return i;
      }
    }
    return 0;
  };

  // Ouvrir viewer plein écran depuis l'index global mediaItems
  const openImageFromMediaIndex = (mediaIndex) => {
    const imagesIdx = mediaIndexToImagesIndex(mediaIndex);
    setViewerIndex(imagesIdx);
    setIsViewerVisible(true);

    // synchroniser activeSlide (media index) et scroller si besoin
    setActiveSlide(mediaIndex);
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: mediaIndex * width, animated: false });
    }, 50);
  };

  // Ouvrir viewer quand on clique sur un item images-only
  const openImageViewer = (imagesOnlyIndex) => {
    setViewerIndex(imagesOnlyIndex);
    setIsViewerVisible(true);
    const mediaIdx = imagesIndexToMediaIndex(imagesOnlyIndex);
    setActiveSlide(mediaIdx);
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: mediaIdx * width, animated: false });
    }, 50);
  };

  // Lecture vidéos : ouverture externe
  const onPressVideo = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) Linking.openURL(url);
      else Alert.alert('Impossible', "Impossible d'ouvrir la vidéo");
    } catch (err) {
      console.error('Erreur ouverture vidéo', err);
    }
  };

  // Render d'un item galerie : TAP via TapGestureHandler (ne bloque pas le swipe)
  const renderGalleryItem = useCallback(({ item, index }) => {
    if (item.type === 'image') {
      return (
        <TapGestureHandler onActivated={() => openImageFromMediaIndex(index)}>
          <View style={styles.galleryItem}>
            <Image source={{ uri: item.url }} style={styles.media} resizeMode="cover" />
          </View>
        </TapGestureHandler>
      );
    } else if (item.type === 'video') {
      return (
        <View style={styles.galleryItem}>
          <Image source={{ uri: item.thumbnail || 'https://via.placeholder.com/800x600?text=Vid\u00e9o' }} style={styles.media} resizeMode="cover" />
          <TouchableOpacity style={styles.playOverlay} onPress={() => onPressVideo(item.url)}>
            <Ionicons name="play" size={44} color="white" />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }, [mediaItems]);

  // Scroll handler pour pagination dot
  const onGalleryScroll = (e) => {
    const slide = Math.round(e.nativeEvent.contentOffset.x / width);
    if (slide !== activeSlide) setActiveSlide(slide);
  };

  // Partage / WhatsApp / Messagerie
  const generateClickableLink = (postId) => `[Voir l'annonce](montoitbj://annonce/${postId})`;
  const openWhatsApp = () => {
    if (!ownerPhoneNumber) { Alert.alert('Erreur', 'Num\u00e9ro de t\u00e9l\u00e9phone non disponible'); return; }
    const cleanedPhone = ownerPhoneNumber.replace(/[^0-9+]/g, '');
    const announcementLink = `https://monbackend-production.up.railway.app/PostDetail?postId=${post.id}`;
    const message = `Bonjour, je suis int\u00e9ress\u00e9 par votre annonce "${post.title}" sur RoomRent.\n\nD\u00e9tails :\n- Prix : ${post.price} FCFA\n- Lieu : ${post.location?.display_name || 'Non sp\u00e9cifi\u00e9'}\n- Lien : ${announcementLink}\n\nPouvons-nous discuter ?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodedMessage}`;
    Linking.openURL(whatsappUrl).catch(() => Alert.alert('Erreur', "WhatsApp n'est pas install\u00e9"));
  };

  const shareAnnouncement = async () => {
    try {
      const announcementLink = `https://monbackend-production.up.railway.app/PostDetail?postId=${post.id}`;
      const message = `D\u00e9couvrez cette annonce :\n${post.title}\n${post.price} FCFA\n${announcementLink}\n${generateClickableLink(post.id)}`;
      await Share.share({ message, title: 'Partager cette annonce' });
    } catch (error) { console.error('Erreur de partage:', error); }
  };

  // Reservation + paiement
  const openReservationModal = () => {
    if (!userData) { Alert.alert("Connexion requise", "Veuillez vous connecter pour r\u00e9server une chambre."); return; }
    setReservationDays(3);
    setIsReservationModalVisible(true);
  };

  const initiateReservationPayment = async () => {
    setIsReservationModalVisible(false);
    try {
      const payload = {
        reservationId: `reservation-${post.id}-${Date.now()}`,
        amount: Number(reservationPrice),
        currency: 'XOF',
        description: `R\u00e9servation (${reservationDays} jours) pour : ${post.title}`,
        reference: `reservation-${post.id}-${Date.now()}`,
        metadata: { listingId: post.id, propertyTitle: post.title, reservationDays, userId: userData.uid },
        customer: { email: userData.email, phone_number: userData.phone || '', firstname: userData.name || '', lastname: userData.surname || '' },
      };
      const response = await fetch('https://monbackend-production.up.railway.app/pay/', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!result.success || !result.paymentUrl) throw new Error(result.message || 'Échec');
      navigation.navigate('Payment', { paymentUrl: result.paymentUrl });
    } catch (err) { console.error('Erreur paiement:', err); Alert.alert('Erreur Paiement', err.message || 'Une erreur est survenue'); }
  };

  // UI Actions bar
  const ActionButtons = () => (
    <View style={styles.actionBar}>
      <TouchableOpacity style={[styles.actionButton, styles.reserveButton]} onPress={openReservationModal}>
        <Ionicons name="bookmark" size={20} color="white" />
        <Text style={styles.buttonText}>Réserver</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButton, styles.whatsappButton]} onPress={openWhatsApp}>
        <Ionicons name="logo-whatsapp" size={20} color="white" />
        <Text style={styles.buttonText}>WhatsApp</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButton, styles.contactButton]} onPress={() => {
        if (!post?.userId) return Alert.alert("Erreur", "Propri\u00e9taire introuvable");
        if (post.userId === userData?.uid) return Alert.alert("Action impossible", "Vous ne pouvez pas vous envoyer un message");
        navigation.navigate('MessageStack', { screen: 'ChatScreen', params: { receiverId: post.userId, receiverName: post.title, postId: post.id } });
      }}>
        <Ionicons name="chatbubbles" size={20} color="white" />
        <Text style={styles.buttonText}>Contacter</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return <PostDetailSkeleton />;
  if (!post) return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Impossible de charger l'annonce</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
        <Text style={styles.retryButtonText}>Retour</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.fixedHeader, { opacity: headerTitleOpacity }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.fixedHeaderTitle} numberOfLines={1}>{post.title}</Text>
        <TouchableOpacity onPress={shareAnnouncement} style={styles.shareButton}>
          <Ionicons name="share-social" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.galleryContainer, { height: headerHeight }]}>
          <FlatList
            horizontal
            ref={flatListRef}
            pagingEnabled
            snapToInterval={width}
            decelerationRate="fast"
            data={mediaItems}
            keyExtractor={(item, idx) => `${item.type}-${idx}`}
            renderItem={renderGalleryItem}
            showsHorizontalScrollIndicator={false}
            onScroll={onGalleryScroll}
            scrollEventThrottle={16}
            initialNumToRender={3}
            maxToRenderPerBatch={3}
            windowSize={3}
            removeClippedSubviews={false}
          />

          {mediaItems.length > 1 && (
            <View style={styles.pagination}>
              {mediaItems.map((_, index) => (
                <View key={index} style={[styles.paginationDot, index === activeSlide && styles.activeDot]} />
              ))}
            </View>
          )}

          {mediaItems.length > 0 && mediaItems[activeSlide]?.type === 'image' && (
            <TouchableOpacity style={styles.fullscreenButton} onPress={() => openImageFromMediaIndex(activeSlide)}>
              <Ionicons name="expand" size={24} color="white" />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Détails de l'annonce (identique à ton code) */}
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>{post.price?.toLocaleString()} FCFA</Text>
              {post.transactionType === 'rent' && (<Text style={styles.pricePeriod}>/mois</Text>)}
            </View>

            <View style={styles.titleRow}>
              <Text style={styles.titleText} numberOfLines={2}>{post.title}</Text>
              <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
                <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                  <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color={isFavorite ? COLORS.primary : '#ccc'} />
                </Animated.View>
              </TouchableOpacity>
            </View>

            <View style={styles.locationContainer}>
              <Ionicons name="location-sharp" size={16} color={COLORS.gray} />
              <Text style={styles.locationText} numberOfLines={2}>
                {post.location?.display_name || post.location || 'Localisation non disponible'}
              </Text>
            </View>

            {post.createdAt && (
              <View style={styles.dateContainer}>
                <Ionicons name="time-outline" size={14} color={COLORS.gray} />
                <Text style={styles.timeText}>Publié il y a {calculateTimeSince(post.createdAt)}</Text>
              </View>
            )}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Caractéristiques</Text>
            <View style={styles.featuresGrid}>
              {post.bedrooms > 0 && renderFeatureItem('hotel', `${post.bedrooms} Chambre(s)`)}
              {post.bathrooms > 0 && renderFeatureItem('bathtub', `${post.bathrooms} Salle(s) de bain`)}
              {post.livingRoom && renderFeatureItem('weekend', 'Salon')}
              {post.area > 0 && renderFeatureItem('straighten', `${post.area} m²`)}
            </View>
          </View>

          {post.features && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Équipements</Text>
              <View style={styles.amenitiesContainer}>
                {post.features.water && renderAmenity('water', 'Eau')}
                {post.features.electricity && renderAmenity('flash', 'Électricité')}
                {post.features.ac && renderAmenity('ac-unit', 'Climatisation')}
                {post.features.parking && renderAmenity('local-parking', 'Parking')}
                {post.features.security && renderAmenity('security', 'Sécurité')}
                {post.features.wifi && renderAmenity('wifi', 'Wi-Fi')}
              </View>
            </View>
          )}

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{post.description || 'Aucune description fournie'}</Text>
          </View>

          <OwnerInfo userId={post.userId} />
          <PoiList post={post} />
          <View style={styles.sectionContainer}>
            <SimilarListings currentPostId={post.id} navigation={navigation} />
          </View>
        </View>
      </Animated.ScrollView>

      <ActionButtons />

      {/* Reservation modal */}
      <Modal transparent visible={isReservationModalVisible} animationType="slide" onRequestClose={() => setIsReservationModalVisible(false)}>
        <View style={styles.reservationModalOverlay}>
          <View style={styles.reservationModalContent}>
            <Ionicons name="shield-checkmark-outline" size={40} color={COLORS.primary} />
            <Text style={styles.reservationModalTitle}>Sécurisez cette Anoonce !</Text>
            <Text style={styles.reservationModalText}>En réservant, vous bloquez l'annone et vous vous assurez que personne d'autre ne puisse la prendre le temps que vous organisiez votre visite ou finalisiez le contrat.</Text>

            <Text style={styles.reservationSectionTitle}>Choisissez la durée :</Text>
            <View style={styles.daysSelector}>
              <TouchableOpacity style={styles.daysButton} onPress={() => setReservationDays(d => Math.max(1, d - 1))}>
                <Ionicons name="remove-circle-outline" size={32} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.daysValue}>{reservationDays} jour{reservationDays > 1 ? 's' : ''}</Text>
              <TouchableOpacity style={styles.daysButton} onPress={() => setReservationDays(d => Math.min(30, d + 1))}>
                <Ionicons name="add-circle-outline" size={32} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.priceInfo}>
              <Text style={styles.priceLabel}>Prix de la réservation :</Text>
              <Text style={styles.priceValue}>{reservationPrice.toLocaleString()} FCFA</Text>
            </View>

            <TouchableOpacity style={styles.confirmReservationButton} onPress={initiateReservationPayment}>
              <Text style={styles.confirmReservationButtonText}>Payer et réserver</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsReservationModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Toast */}
      {toastVisible && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      {/* Viewer plein \u00e9cran (react-native-image-viewing) */}
      <ImageViewing
        images={imagesForViewer}
        imageIndex={viewerIndex}
        visible={isViewerVisible}
        onRequestClose={() => setIsViewerVisible(false)}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
        onImageIndexChange={(imagesIdx) => {
          // Sync viewer index
          setViewerIndex(imagesIdx);
          // Convert to media index and sync FlatList + pagination
          const mediaIdx = imagesIndexToMediaIndex(imagesIdx);
          setActiveSlide(mediaIdx);
          // scroll the underlying flatlist to match (animated true for smoothness)
          flatListRef.current?.scrollToOffset({ offset: mediaIdx * width, animated: true });
        }}
      />
    </SafeAreaView>
  );
};

// Fonctions de rendu réutilisables
const renderFeatureItem = (icon, text) => (
  <View style={styles.featureItem}>
    <MaterialIcons name={icon} size={20} color={COLORS.primary} />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const renderAmenity = (icon, text) => (
  <View style={styles.amenityBadge}>
    {icon === 'water' || icon === 'flash' ? (
      <Ionicons name={icon} size={16} color={COLORS.primary} />
    ) : (
      <MaterialIcons name={icon} size={16} color={COLORS.primary} />
    )}
    <Text style={styles.amenityText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  scrollContainer: { paddingBottom: 100 },
  fixedHeader: { position: 'absolute', top: 0, left: 0, right: 0, height: 60, backgroundColor: COLORS.white, zIndex: 100, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingTop: Platform.OS === 'ios' ? 40 : 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  backButton: { padding: 8 },
  shareButton: { padding: 8, marginLeft: 'auto' },
  fixedHeaderTitle: { flex: 1, marginHorizontal: 10, fontSize: 16, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center' },

  galleryContainer: { position: 'relative', backgroundColor: '#f5f5f5', overflow: 'hidden' },
  galleryItem: { width: width, height: '100%', justifyContent: 'center', alignItems: 'center' },
  media: { width: '100%', height: '100%', backgroundColor: '#e1e1e1' },
  playOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  pagination: { position: 'absolute', bottom: 20, flexDirection: 'row', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  paginationDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 4 },
  activeDot: { backgroundColor: COLORS.primary, width: 16 },
  fullscreenButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 },

  content: { backgroundColor: COLORS.white },
  headerContainer: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8 },
  priceText: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  pricePeriod: { fontSize: 16, color: COLORS.gray, marginLeft: 4, marginBottom: 2 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  titleText: { fontSize: 20, fontWeight: '600', color: COLORS.darkGray, flex: 1, marginRight: 10 },
  favoriteButton: { padding: 5 },
  locationContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  locationText: { fontSize: 14, color: COLORS.gray, marginLeft: 4, flex: 1 },
  dateContainer: { flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: 12, color: COLORS.gray, marginLeft: 4 },

  sectionContainer: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: COLORS.darkGray, marginBottom: 12 },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  featureItem: { width: '50%', flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  featureText: { fontSize: 14, color: COLORS.gray, marginLeft: 8 },
  amenitiesContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  amenityBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  amenityText: { fontSize: 14, color: COLORS.gray, marginLeft: 6 },
  descriptionText: { fontSize: 15, lineHeight: 22, color: COLORS.gray },

  actionBar: { flexDirection: 'row', padding: 12, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: '#eee', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4 }, android: { elevation: 5 } }) },
  actionButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 8, marginHorizontal: 5 },
  reserveButton: { backgroundColor: '#FF6B6B', flex: 1.5 },
  whatsappButton: { backgroundColor: '#25D366', flex: 1 },
  contactButton: { backgroundColor: '#5F7A61', flex: 1 },
  buttonText: { color: COLORS.white, fontWeight: 'bold', marginLeft: 8, fontSize: 16 },

  toast: { position: 'absolute', bottom: 100, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10 },
  toastText: { color: COLORS.white },

  reservationModalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  reservationModalContent: { backgroundColor: COLORS.white, padding: SIZES.padding * 1.5, borderTopLeftRadius: SIZES.radius * 2, borderTopRightRadius: SIZES.radius * 2, alignItems: 'center' },
  reservationModalTitle: { ...FONTS.h2, color: COLORS.primary, marginVertical: 10 },
  reservationModalText: { ...FONTS.body4, textAlign: 'center', color: COLORS.gray, marginBottom: 20, lineHeight: 20 },
  reservationSectionTitle: { ...FONTS.h4, color: COLORS.darkGray, marginBottom: 15 },
  daysSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  daysButton: { padding: 10 },
  daysValue: { ...FONTS.h2, color: COLORS.black, marginHorizontal: 30, width: 100, textAlign: 'center' },
  priceInfo: { flexDirection: 'row', alignItems: 'flex-end', padding: 10, backgroundColor: '#f8f9fa', borderRadius: SIZES.radius, marginBottom: 5 },
  priceLabel: { ...FONTS.body3, color: COLORS.darkGray, marginRight: 10 },
  priceValue: { ...FONTS.h3, color: COLORS.primary, fontWeight: 'bold' },
  priceDetail: { ...FONTS.body5, color: COLORS.gray, marginBottom: 20 },
  confirmReservationButton: { backgroundColor: COLORS.primary, paddingVertical: 15, borderRadius: SIZES.radius, alignItems: 'center', width: '100%', marginBottom: 10 },
  confirmReservationButtonText: { ...FONTS.h4, color: COLORS.white, fontWeight: 'bold' },
  cancelButton: { padding: 10 },
  cancelButtonText: { ...FONTS.body3, color: COLORS.gray },

  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white, padding: 20 },
  errorText: { fontSize: 16, color: COLORS.error, textAlign: 'center', marginBottom: 20 },
  retryButton: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5 },
  retryButtonText: { color: COLORS.white, fontWeight: 'bold' },
});

export default PostDetailScreen;
