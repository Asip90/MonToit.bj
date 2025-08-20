
// import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   SafeAreaView,
//   Alert,
//   Animated,
//   Modal,
//   Platform,
//   Share,
//   Linking,
//   Image,
// } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import { TapGestureHandler } from 'react-native-gesture-handler';
// import ImageViewing from 'react-native-image-viewing';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { doc, getDoc } from 'firebase/firestore';

// // Importations locales
// import { db } from '../../src/api/FirebaseConfig';
// import { COLORS, SIZES, FONTS } from '../../constants/Theme';
// import { UserContext } from '../../context/AuthContext';
// import { isPostFavorite, toggleFavorite } from '../../services/favorites';
// import OwnerInfo from '../../components/OwnerInfo';
// import PostDetailSkeleton from '../../components/skeletons/PostDetailSkeleton';
// import PoiList from '../../components/PoiList';
// import SimilarListings from '../../components/SimilarListings';

// const { width, height } = Dimensions.get('window');
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
//   const [isViewerVisible, setIsViewerVisible] = useState(false);
//   const [viewerIndex, setViewerIndex] = useState(0);
//   const [ownerPhoneNumber, setOwnerPhoneNumber] = useState(null);
//   const [activeSlide, setActiveSlide] = useState(0);
//   const [toastVisible, setToastVisible] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [isReservationModalVisible, setIsReservationModalVisible] = useState(false);
//   const [reservationDays, setReservationDays] = useState(3);
//   const [reservationPrice, setReservationPrice] = useState(0);

//   const flatListRef = useRef(null);
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const heartScale = useRef(new Animated.Value(1)).current;

//   // Header animation
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

//   // Contexte utilisateur
//   const { userData } = useContext(UserContext);

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

//   // Calcul prix réservation
//   useEffect(() => {
//     if (post?.price && reservationDays > 0) {
//       const dailyRate = post.price / 30;
//       const serviceFee = 500;
//       const calculatedPrice = Math.round(dailyRate * reservationDays) + serviceFee;
//       setReservationPrice(calculatedPrice);
//     }
//   }, [reservationDays, post]);

//   // Utilitaires
//   const isValidUrl = (url) => {
//     try { new URL(url); return true; } catch { return false; }
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

//   // Favoris
//   const animateHeart = () => {
//     Animated.sequence([
//       Animated.timing(heartScale, { toValue: 1.5, duration: 180, useNativeDriver: true }),
//       Animated.spring(heartScale, { toValue: 1, friction: 3, useNativeDriver: true })
//     ]).start();
//   };
//   const handleToggleFavorite = async () => {
    
    
//     try {
//       if (userData?.uid) {
//         const result = await toggleFavorite(userData.uid, postId);
//         setIsFavorite(result);
//         animateHeart();
//         setToastMessage(result ? 'Ajouté aux favoris' : 'Retiré des favoris');
//         setToastVisible(true);
//         setTimeout(() => setToastVisible(false), 2000);
//       } else {
//         Alert.alert('Connexion requise', "Veuillez vous connecter pour ajouter aux favoris.");
//       }
//     } catch (error) {
//       console.error("Erreur favori:", error);
//     }
//   };

//   // Media items (images + vidéos)
//   const mediaItems = post 
//     ? [
//       ...(post.imageUrls?.filter(url => isValidUrl(url)).map(url => ({ type: 'image', url })) || []),
//       ...(post.videoUrls?.filter(url => isValidUrl(url)).map(url => ({ type: 'video', url })) || []),
//     ]
//     : [];

//   // images-only array for ImageViewing
//   const imagesForViewer = mediaItems.filter(m => m.type === 'image').map(m => ({ uri: m.url }));

//   // Helpers pour convertir index entre mediaItems et imagesForViewer
//   const mediaIndexToImagesIndex = (mediaIndex) => {
//     if (!mediaItems || mediaItems.length === 0) return 0;
//     let count = -1;
//     for (let i = 0; i <= mediaIndex && i < mediaItems.length; i++) {
//       if (mediaItems[i].type === 'image') count++;
//     }
//     return Math.max(0, Math.min(count, imagesForViewer.length - 1));
//   };

//   const imagesIndexToMediaIndex = (imagesIndex) => {
//     if (!mediaItems || mediaItems.length === 0) return 0;
//     let count = -1;
//     for (let i = 0; i < mediaItems.length; i++) {
//       if (mediaItems[i].type === 'image') {
//         count++;
//         if (count === imagesIndex) return i;
//       }
//     }
//     return 0;
//   };

//   // Ouvrir viewer plein écran depuis l'index global mediaItems
//   const openImageFromMediaIndex = (mediaIndex) => {
//     const imagesIdx = mediaIndexToImagesIndex(mediaIndex);
//     setViewerIndex(imagesIdx);
//     setIsViewerVisible(true);

//     // synchroniser activeSlide (media index) et scroller si besoin
//     setActiveSlide(mediaIndex);
//     setTimeout(() => {
//       flatListRef.current?.scrollToOffset({ offset: mediaIndex * width, animated: false });
//     }, 50);
//   };

//   // Ouvrir viewer quand on clique sur un item images-only
//   const openImageViewer = (imagesOnlyIndex) => {
//     setViewerIndex(imagesOnlyIndex);
//     setIsViewerVisible(true);
//     const mediaIdx = imagesIndexToMediaIndex(imagesOnlyIndex);
//     setActiveSlide(mediaIdx);
//     setTimeout(() => {
//       flatListRef.current?.scrollToOffset({ offset: mediaIdx * width, animated: false });
//     }, 50);
//   };

//   // Lecture vidéos : ouverture externe
//   const onPressVideo = async (url) => {
//     try {
//       const supported = await Linking.canOpenURL(url);
//       if (supported) Linking.openURL(url);
//       else Alert.alert('Impossible', "Impossible d'ouvrir la vidéo");
//     } catch (err) {
//       console.error('Erreur ouverture vidéo', err);
//     }
//   };

//   // Render d'un item galerie : TAP via TapGestureHandler (ne bloque pas le swipe)
//   const renderGalleryItem = useCallback(({ item, index }) => {
//     if (item.type === 'image') {
//       return (
//         <TapGestureHandler onActivated={() => openImageFromMediaIndex(index)}>
//           <View style={styles.galleryItem}>
//             <Image source={{ uri: item.url }} style={styles.media} resizeMode="cover" />
//           </View>
//         </TapGestureHandler>
//       );
//     } else if (item.type === 'video') {
//       return (
//         <View style={styles.galleryItem}>
//           <Image source={{ uri: item.thumbnail || 'https://via.placeholder.com/800x600?text=Vid\u00e9o' }} style={styles.media} resizeMode="cover" />
//           <TouchableOpacity style={styles.playOverlay} onPress={() => onPressVideo(item.url)}>
//             <Ionicons name="play" size={44} color="white" />
//           </TouchableOpacity>
//         </View>
//       );
//     }
//     return null;
//   }, [mediaItems]);

//   // Scroll handler pour pagination dot
//   const onGalleryScroll = (e) => {
//     const slide = Math.round(e.nativeEvent.contentOffset.x / width);
//     if (slide !== activeSlide) setActiveSlide(slide);
//   };

//   // Partage / WhatsApp / Messagerie
//   const generateClickableLink = (postId) => `[Voir l'annonce](montoitbj://annonce/${postId})`;
//   const openWhatsApp = () => {
//     if (!ownerPhoneNumber) { Alert.alert('Erreur', 'Num\u00e9ro de t\u00e9l\u00e9phone non disponible'); return; }
//     const cleanedPhone = ownerPhoneNumber.replace(/[^0-9+]/g, '');
//     const announcementLink = `https://monbackend-production.up.railway.app/PostDetail?postId=${post.id}`;
//     const message = `Bonjour, je suis int\u00e9ress\u00e9 par votre annonce "${post.title}" sur RoomRent.\n\nD\u00e9tails :\n- Prix : ${post.price} FCFA\n- Lieu : ${post.location?.display_name || 'Non sp\u00e9cifi\u00e9'}\n- Lien : ${announcementLink}\n\nPouvons-nous discuter ?`;
//     const encodedMessage = encodeURIComponent(message);
//     const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${encodedMessage}`;
//     Linking.openURL(whatsappUrl).catch(() => Alert.alert('Erreur', "WhatsApp n'est pas install\u00e9"));
//   };

//   const shareAnnouncement = async () => {
//     try {
//       const announcementLink = `https://monbackend-production.up.railway.app/PostDetail?postId=${post.id}`;
//       const message = `D\u00e9couvrez cette annonce :\n${post.title}\n${post.price} FCFA\n${announcementLink}\n${generateClickableLink(post.id)}`;
//       await Share.share({ message, title: 'Partager cette annonce' });
//     } catch (error) { console.error('Erreur de partage:', error); }
//   };

//   // Reservation + paiement
//   const openReservationModal = () => {
//     if (!userData) { Alert.alert("Connexion requise", "Veuillez vous connecter pour r\u00e9server une chambre."); return; }
//     setReservationDays(3);
//     setIsReservationModalVisible(true);
//   };

//   const initiateReservationPayment = async () => {
//     setIsReservationModalVisible(false);
//     try {
//       const payload = {
//         reservationId: `reservation-${post.id}-${Date.now()}`,
//         amount: Number(reservationPrice),
//         currency: 'XOF',
//         description: `R\u00e9servation (${reservationDays} jours) pour : ${post.title}`,
//         reference: `reservation-${post.id}-${Date.now()}`,
//         metadata: { listingId: post.id, propertyTitle: post.title, reservationDays, userId: userData.uid },
//         customer: { email: userData.email, phone_number: userData.phone || '', firstname: userData.name || '', lastname: userData.surname || '' },
//       };
//       const response = await fetch('https://monbackend-production.up.railway.app/pay/', {
//         method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
//       });
//       const result = await response.json();
//       if (!result.success || !result.paymentUrl) throw new Error(result.message || 'Échec');
//       navigation.navigate('Payment', { paymentUrl: result.paymentUrl });
//     } catch (err) { console.error('Erreur paiement:', err); Alert.alert('Erreur Paiement', err.message || 'Une erreur est survenue'); }
//   };

//   // UI Actions bar
//   const ActionButtons = () => (
//     <View style={styles.actionBar}>
//       <TouchableOpacity style={[styles.actionButton, styles.reserveButton]} onPress={openReservationModal}>
//         <Ionicons name="bookmark" size={20} color="white" />
//         <Text style={styles.buttonText}>Réserver</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={[styles.actionButton, styles.whatsappButton]} onPress={openWhatsApp}>
//         <Ionicons name="logo-whatsapp" size={20} color="white" />
//         <Text style={styles.buttonText}>WhatsApp</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={[styles.actionButton, styles.contactButton]} onPress={() => {
//         if (!post?.userId) return Alert.alert("Erreur", "Propri\u00e9taire introuvable");
//         if (post.userId === userData?.uid) return Alert.alert("Action impossible", "Vous ne pouvez pas vous envoyer un message");
//         navigation.navigate('MessageStack', { screen: 'ChatScreen', params: { receiverId: post.userId, receiverName: post.title, postId: post.id } });
//       }}>
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
//         onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
//         contentContainerStyle={styles.scrollContainer}
//         showsVerticalScrollIndicator={false}
//       >
//         <Animated.View style={[styles.galleryContainer, { height: headerHeight }]}>
//           <FlatList
//             horizontal
//             ref={flatListRef}
//             pagingEnabled
//             snapToInterval={width}
//             decelerationRate="fast"
//             data={mediaItems}
//             keyExtractor={(item, idx) => `${item.type}-${idx}`}
//             renderItem={renderGalleryItem}
//             showsHorizontalScrollIndicator={false}
//             onScroll={onGalleryScroll}
//             scrollEventThrottle={16}
//             initialNumToRender={3}
//             maxToRenderPerBatch={3}
//             windowSize={3}
//             removeClippedSubviews={false}
//           />

//           {mediaItems.length > 1 && (
//             <View style={styles.pagination}>
//               {mediaItems.map((_, index) => (
//                 <View key={index} style={[styles.paginationDot, index === activeSlide && styles.activeDot]} />
//               ))}
//             </View>
//           )}

//           {mediaItems.length > 0 && mediaItems[activeSlide]?.type === 'image' && (
//             <TouchableOpacity style={styles.fullscreenButton} onPress={() => openImageFromMediaIndex(activeSlide)}>
//               <Ionicons name="expand" size={24} color="white" />
//             </TouchableOpacity>
//           )}
//         </Animated.View>

//         {/* Détails de l'annonce (identique à ton code) */}
//         <View style={styles.content}>
//           <View style={styles.headerContainer}>
//             <View style={styles.priceRow}>
//               <Text style={styles.priceText}>{post.price?.toLocaleString()} FCFA</Text>
//               {post.transactionType === 'rent' && (<Text style={styles.pricePeriod}>/mois</Text>)}
//             </View>

//             <View style={styles.titleRow}>
//               <Text style={styles.titleText} numberOfLines={2}>{post.title}</Text>
//               <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
//                 <Animated.View style={{ transform: [{ scale: heartScale }] }}>
//                   <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color={isFavorite ? COLORS.primary : '#ccc'} />
//                 </Animated.View>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.locationContainer}>
//               <Ionicons name="location-sharp" size={16} color={COLORS.gray} />
//               <Text style={styles.locationText} numberOfLines={2}>
//                 {post.location?.display_name || post.location || 'Localisation non disponible'}
//               </Text>
//             </View>

//             {post.createdAt && (
//               <View style={styles.dateContainer}>
//                 <Ionicons name="time-outline" size={14} color={COLORS.gray} />
//                 <Text style={styles.timeText}>Publié il y a {calculateTimeSince(post.createdAt)}</Text>
//               </View>
//             )}
//           </View>

//           <View style={styles.sectionContainer}>
//             <Text style={styles.sectionTitle}>Caractéristiques</Text>
//             <View style={styles.featuresGrid}>
//               {post.bedrooms > 0 && renderFeatureItem('hotel', `${post.bedrooms} Chambre(s)`)}
//               {post.bathrooms > 0 && renderFeatureItem('bathtub', `${post.bathrooms} Salle(s) de bain`)}
//               {post.livingRoom && renderFeatureItem('weekend', 'Salon')}
//               {post.area > 0 && renderFeatureItem('straighten', `${post.area} m²`)}
//             </View>
//           </View>

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

//           <View style={styles.sectionContainer}>
//             <Text style={styles.sectionTitle}>Description</Text>
//             <Text style={styles.descriptionText}>{post.description || 'Aucune description fournie'}</Text>
//           </View>

//           <OwnerInfo userId={post.userId} />
//           <PoiList post={post} />
//           <View style={styles.sectionContainer}>
//             <SimilarListings currentPostId={post.id} navigation={navigation} />
//           </View>
//         </View>
//       </Animated.ScrollView>

//       <ActionButtons />

//       {/* Reservation modal */}
//       <Modal transparent visible={isReservationModalVisible} animationType="slide" onRequestClose={() => setIsReservationModalVisible(false)}>
//         <View style={styles.reservationModalOverlay}>
//           <View style={styles.reservationModalContent}>
//             <Ionicons name="shield-checkmark-outline" size={40} color={COLORS.primary} />
//             <Text style={styles.reservationModalTitle}>Sécurisez cette Anoonce !</Text>
//             <Text style={styles.reservationModalText}>En réservant, vous bloquez l'annone et vous vous assurez que personne d'autre ne puisse la prendre le temps que vous organisiez votre visite ou finalisiez le contrat.</Text>

//             <Text style={styles.reservationSectionTitle}>Choisissez la durée :</Text>
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
//               <Text style={styles.priceLabel}>Prix de la réservation :</Text>
//               <Text style={styles.priceValue}>{reservationPrice.toLocaleString()} FCFA</Text>
//             </View>

//             <TouchableOpacity style={styles.confirmReservationButton} onPress={initiateReservationPayment}>
//               <Text style={styles.confirmReservationButtonText}>Payer et réserver</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.cancelButton} onPress={() => setIsReservationModalVisible(false)}>
//               <Text style={styles.cancelButtonText}>Annuler</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Toast */}
//       {toastVisible && (
//         <View style={styles.toast}>
//           <Text style={styles.toastText}>{toastMessage}</Text>
//         </View>
//       )}

//       {/* Viewer plein \u00e9cran (react-native-image-viewing) */}
//       <ImageViewing
//         images={imagesForViewer}
//         imageIndex={viewerIndex}
//         visible={isViewerVisible}
//         onRequestClose={() => setIsViewerVisible(false)}
//         swipeToCloseEnabled
//         doubleTapToZoomEnabled
//         onImageIndexChange={(imagesIdx) => {
//           // Sync viewer index
//           setViewerIndex(imagesIdx);
//           // Convert to media index and sync FlatList + pagination
//           const mediaIdx = imagesIndexToMediaIndex(imagesIdx);
//           setActiveSlide(mediaIdx);
//           // scroll the underlying flatlist to match (animated true for smoothness)
//           flatListRef.current?.scrollToOffset({ offset: mediaIdx * width, animated: true });
//         }}
//       />
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

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: COLORS.white },
//   scrollContainer: { paddingBottom: 100 },
//   fixedHeader: { position: 'absolute', top: 0, left: 0, right: 0, height: 60, backgroundColor: COLORS.white, zIndex: 100, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingTop: Platform.OS === 'ios' ? 40 : 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
//   backButton: { padding: 8 },
//   shareButton: { padding: 8, marginLeft: 'auto' },
//   fixedHeaderTitle: { flex: 1, marginHorizontal: 10, fontSize: 16, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center' },

//   galleryContainer: { position: 'relative', backgroundColor: '#f5f5f5', overflow: 'hidden' },
//   galleryItem: { width: width, height: '100%', justifyContent: 'center', alignItems: 'center' },
//   media: { width: '100%', height: '100%', backgroundColor: '#e1e1e1' },
//   playOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
//   pagination: { position: 'absolute', bottom: 20, flexDirection: 'row', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
//   paginationDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 4 },
//   activeDot: { backgroundColor: COLORS.primary, width: 16 },
//   fullscreenButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 },

//   content: { backgroundColor: COLORS.white },
//   headerContainer: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
//   priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8 },
//   priceText: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
//   pricePeriod: { fontSize: 16, color: COLORS.gray, marginLeft: 4, marginBottom: 2 },
//   titleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
//   titleText: { fontSize: 20, fontWeight: '600', color: COLORS.darkGray, flex: 1, marginRight: 10 },
//   favoriteButton: { padding: 5 },
//   locationContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
//   locationText: { fontSize: 14, color: COLORS.gray, marginLeft: 4, flex: 1 },
//   dateContainer: { flexDirection: 'row', alignItems: 'center' },
//   timeText: { fontSize: 12, color: COLORS.gray, marginLeft: 4 },

//   sectionContainer: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
//   sectionTitle: { fontSize: 18, fontWeight: '600', color: COLORS.darkGray, marginBottom: 12 },
//   featuresGrid: { flexDirection: 'row', flexWrap: 'wrap' },
//   featureItem: { width: '50%', flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
//   featureText: { fontSize: 14, color: COLORS.gray, marginLeft: 8 },
//   amenitiesContainer: { flexDirection: 'row', flexWrap: 'wrap' },
//   amenityBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, marginRight: 8, marginBottom: 8 },
//   amenityText: { fontSize: 14, color: COLORS.gray, marginLeft: 6 },
//   descriptionText: { fontSize: 15, lineHeight: 22, color: COLORS.gray },

//   actionBar: { flexDirection: 'row', padding: 12, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: '#eee', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4 }, android: { elevation: 5 } }) },
//   actionButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 8, marginHorizontal: 5 },
//   reserveButton: { backgroundColor: '#FF6B6B', flex: 1.5 },
//   whatsappButton: { backgroundColor: '#25D366', flex: 1 },
//   contactButton: { backgroundColor: '#5F7A61', flex: 1 },
//   buttonText: { color: COLORS.white, fontWeight: 'bold', marginLeft: 8, fontSize: 16 },

//   toast: { position: 'absolute', bottom: 100, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10 },
//   toastText: { color: COLORS.white },

//   reservationModalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
//   reservationModalContent: { backgroundColor: COLORS.white, padding: SIZES.padding * 1.5, borderTopLeftRadius: SIZES.radius * 2, borderTopRightRadius: SIZES.radius * 2, alignItems: 'center' },
//   reservationModalTitle: { ...FONTS.h2, color: COLORS.primary, marginVertical: 10 },
//   reservationModalText: { ...FONTS.body4, textAlign: 'center', color: COLORS.gray, marginBottom: 20, lineHeight: 20 },
//   reservationSectionTitle: { ...FONTS.h4, color: COLORS.darkGray, marginBottom: 15 },
//   daysSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
//   daysButton: { padding: 10 },
//   daysValue: { ...FONTS.h2, color: COLORS.black, marginHorizontal: 30, width: 100, textAlign: 'center' },
//   priceInfo: { flexDirection: 'row', alignItems: 'flex-end', padding: 10, backgroundColor: '#f8f9fa', borderRadius: SIZES.radius, marginBottom: 5 },
//   priceLabel: { ...FONTS.body3, color: COLORS.darkGray, marginRight: 10 },
//   priceValue: { ...FONTS.h3, color: COLORS.primary, fontWeight: 'bold' },
//   priceDetail: { ...FONTS.body5, color: COLORS.gray, marginBottom: 20 },
//   confirmReservationButton: { backgroundColor: COLORS.primary, paddingVertical: 15, borderRadius: SIZES.radius, alignItems: 'center', width: '100%', marginBottom: 10 },
//   confirmReservationButtonText: { ...FONTS.h4, color: COLORS.white, fontWeight: 'bold' },
//   cancelButton: { padding: 10 },
//   cancelButtonText: { ...FONTS.body3, color: COLORS.gray },

//   errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white, padding: 20 },
//   errorText: { fontSize: 16, color: COLORS.error, textAlign: 'center', marginBottom: 20 },
//   retryButton: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5 },
//   retryButtonText: { color: COLORS.white, fontWeight: 'bold' },
// });

// export default PostDetailScreen;
// PostDetailScreen_expo-video.js
// Version : utilise expo-video (remplace expo-av) — compatible avec Expo SDK 52+
// Installer : npx expo install expo-video
// PostDetailScreen_full_expo-video.js
// Utilise expo-video (useVideoPlayer + VideoView)
// Installer : npx expo install expo-video

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
  // Linking,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import ImageViewing from 'react-native-image-viewing';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { doc, getDoc } from 'firebase/firestore';
import * as Linking from 'expo-linking';
// expo-video
import { useVideoPlayer, VideoView } from 'expo-video';

// Importations locales (conserve tes chemins)
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

export default function PostDetailScreen({ navigation }) {
  const route = useRoute();
  const { postId } = route.params;
  const pagePath = postId ? `PostDetail/${postId}` : 'details';
  const pageUrl = Linking.createURL(pagePath); // => exp://.../--/details/42 en dev, ou monapp://details/42 en build

  console.log('URL de la page :', pageUrl);

  // états
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

  // vidéo modal
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [videoModalSource, setVideoModalSource] = useState(null); // string url
  const [videoLoading, setVideoLoading] = useState(true);

  // refs & animation
  const flatListRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

  // header anim
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

  const { userData } = useContext(UserContext);

  // fetch post + favorite
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const postRef = doc(db, 'posts', postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const postData = {
            id: postSnap.id,
            isAvailable: true,
            ...postSnap.data(),
            isAvailable: postSnap.data().isAvailable !== undefined ? postSnap.data().isAvailable : true,
          };
          if (mounted) setPost(postData);

          if (postData.userId) {
            const userRef = doc(db, 'users', postData.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists() && mounted) setOwnerPhoneNumber(userSnap.data().phoneNumber || null);
          }
        } else {
          Alert.alert('Erreur', 'Annonce introuvable');
          navigation.goBack();
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        Alert.alert('Erreur', "Impossible de charger l'annonce");
        navigation.goBack();
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    const checkFavorite = async () => {
      try {
        if (userData?.uid) {
          const result = await isPostFavorite(userData.uid, postId);
          if (mounted) setIsFavorite(result);
        }
      } catch (err) {
        console.error('Erreur checkFavorite', err);
      }
    };
    checkFavorite();

    return () => { mounted = false; };
  }, [postId, userData?.uid, navigation]);

  // reservation price calc
  useEffect(() => {
    if (post?.price && reservationDays > 0) {
      const dailyRate = post.price / 30;
      const serviceFee = 500;
      const calculatedPrice = Math.round(dailyRate * reservationDays) + serviceFee;
      setReservationPrice(calculatedPrice);
    }
  }, [reservationDays, post]);

  // utils
  const isValidUrl = (url) => {
    try { new URL(url); return true; } catch { return false; }
  };

  const calculateTimeSince = useCallback((firestoreTimestamp) => {
    if (!firestoreTimestamp?.seconds) return 'Date invalide';
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

  // favorite animation + toggle
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
        Alert.alert('Connexion requise', 'Veuillez vous connecter pour ajouter aux favoris.');
      }
    } catch (err) {
      console.error('Erreur favori:', err);
    }
  };

  // mediaItems (images + videos)
  const mediaItems = post
    ? [
        ...(post.imageUrls?.filter(url => isValidUrl(url)).map(url => ({ type: 'image', url })) || []),
        ...(post.videoUrls?.filter(url => isValidUrl(url)).map(url => ({ type: 'video', url, thumbnailUrl: post.thumbnailUrls?.length ? post.thumbnailUrls.shift() : undefined })) || []),
      ]
    : [];

  const imagesForViewer = mediaItems.filter(m => m.type === 'image').map(m => ({ uri: m.url }));

  // index helpers
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

  const openImageFromMediaIndex = (mediaIndex) => {
    const imagesIdx = mediaIndexToImagesIndex(mediaIndex);
    setViewerIndex(imagesIdx);
    setIsViewerVisible(true);
    setActiveSlide(mediaIndex);
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: mediaIndex * width, animated: false });
    }, 50);
  };

  // ----------------- VIDEO (expo-video) -----------------
  // useVideoPlayer crée un player qui est automatiquement détruit proprement
  const player = useVideoPlayer(videoModalSource ?? null, (p) => {
    // Setup initial (optionnel) : on peut injeter config
    // ex: p.timeUpdateEventInterval = 0.25;
    p.timeUpdateEventInterval = 0; // par défaut 0 (pas d'events timeUpdate)
  });

  // Écoute des changements de status (via addListener)
  useEffect(() => {
    if (!player) return;
    const sub = player.addListener('statusChange', ({ status, error }) => {
      // status -> readyToPlay / loading / idle / error
      const isLoaded = status?.isLoaded ?? status?.loaded ?? false;
      setVideoLoading(!isLoaded);
      if (status?.state === 'error' || error) {
        console.error('Video player error', error || status);
        Alert.alert('Erreur vidéo', (error && error.message) || 'Impossible de lire la vidéo');
        // fermer modal si erreur bloquante
        // closeVideoModal(); // facultatif
      }
    });

    return () => {
      try { sub.remove(); } catch (e) { /* ignore */ }
    };
  }, [player]);

  // ouvrir modal vidéo + lancer lecture
  const openVideoModal = async (url, index) => {
    try {
      setVideoModalSource(url);
      setVideoModalVisible(true);
      setActiveSlide(index);
      setVideoLoading(true);
      // laisser le hook useVideoPlayer initialiser le player, puis lancer play
      // ajouter un petit délai pour être sûr que le player a remplacé la source
      setTimeout(() => {
        try { player?.play(); } catch (e) { /* ignore */ }
      }, 250);
    } catch (err) {
      console.error('Erreur openVideoModal', err);
      Alert.alert('Erreur', "Impossible d'ouvrir la vidéo");
    }
  };

  // fermer modal vidéo (pause + replaceAsync null pour libérer source)
  const closeVideoModal = async () => {
    try {
      try { await player?.pause?.(); } catch (e) { /* ignore */ }
      try { await player?.replaceAsync?.(null); } catch (e) { /* ignore */ }
    } catch (err) {
      console.error('Erreur lors de la fermeture du player', err);
    } finally {
      setVideoModalVisible(false);
      setVideoModalSource(null);
      setVideoLoading(true);
    }
  };

  // gallery render
  const renderGalleryItem = useCallback(({ item, index }) => {
    if (item.type === 'image') {
      return (
        <TapGestureHandler onActivated={() => openImageFromMediaIndex(index)}>
          <View style={styles.galleryItem}>
            <Image source={{ uri: item.url }} style={styles.media} resizeMode="cover" />
          </View>
        </TapGestureHandler>
      );
    }

    if (item.type === 'video') {
      return (
        <View style={styles.galleryItem}>
          {item.thumbnailUrl ? (
            <Image source={{ uri: item.thumbnailUrl }} style={styles.media} resizeMode="cover" />
          ) : (
            <View style={[styles.media, { backgroundColor: '#000' }]} />
          )}
          <TouchableOpacity style={styles.playOverlay} onPress={() => openVideoModal(item.url, index)} activeOpacity={0.8}>
            <Ionicons name="play-circle" size={64} color="white" />
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  }, [mediaItems, player]);

  const onGalleryScroll = (e) => {
    const slide = Math.round(e.nativeEvent.contentOffset.x / width);
    if (slide !== activeSlide) setActiveSlide(slide);
  };

  // partage / whatsapp / messagerie
  const generateClickableLink = (postId) => `[Voir l'annonce](montoitbj://annonce/${postId})`;

  const openWhatsApp = () => {
    if (!ownerPhoneNumber) { Alert.alert('Erreur', "Num\u00e9ro de t\u00e9l\u00e9phone non disponible"); return; }
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
    } catch (error) { console.error('Erreur de partage:', error); Alert.alert('Erreur', 'Impossible de partager'); }
  };

  // reservation/payment (comme avant)
  const openReservationModal = () => {
    if (!userData) {
      Alert.alert('Connexion requise', "Veuillez vous connecter pour r\u00e9server une chambre.");
      return;
    }
    if (!post.isAvailable || post.isReserved) {
      Alert.alert('Annonce non disponible', "Désolé, cette annonce a déjà été réservée.", [{ text: 'OK' }]);
      return;
    }
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

  const ActionButtons = () => (
    <View style={styles.actionBar}>
      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.reserveButton,
          (!post?.isAvailable || post?.isReserved) && styles.disabledButton
        ]}
        onPress={openReservationModal}
        disabled={!post?.isAvailable || post?.isReserved}
      >
        <Ionicons name="bookmark" size={20} color="white" />
        <Text style={styles.buttonText}>
          {post?.isAvailable && !post?.isReserved ? 'Réserver' : 'Déjà réservé'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.actionButton, styles.whatsappButton]} onPress={openWhatsApp}>
        <Ionicons name="logo-whatsapp" size={20} color="white" />
        <Text style={styles.buttonText}>WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.actionButton, styles.contactButton]} onPress={() => {
        if (!post?.userId) return Alert.alert('Erreur', "Propri\u00e9taire introuvable");
        if (post.userId === userData?.uid) return Alert.alert('Action impossible', "Vous ne pouvez pas vous envoyer un message");
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

  const getAnnouncementStatus = () => {
    if (post.isAvailable && !post.isReserved) return 'Annonce disponible';
    if (!post.isAvailable || post.isReserved) return 'Annonce déjà prise';
    return 'Statut inconnu';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Modal vidéo plein écran */}
      <Modal visible={videoModalVisible} supportedOrientations={['portrait', 'landscape']} onRequestClose={closeVideoModal}>
        <View style={styles.fullscreenVideoContainer}>
          {videoLoading && (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -18, marginTop: -18 }} />
          )}

          <VideoView
            player={player}
            style={styles.fullscreenVideo}
            allowsFullscreen
            allowsPictureInPicture
            nativeControls
            contentFit="contain"
          />

          <TouchableOpacity style={styles.closeFullscreenButton} onPress={closeVideoModal}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>

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

        <View style={styles.content}>
          <View style={[
            styles.statusBadge,
            post.isAvailable && !post.isReserved ? styles.availableBadge : styles.reservedBadge
          ]}>
            <Text style={styles.statusText}>{getAnnouncementStatus()}</Text>
          </View>

          <View style={styles.headerContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>{post.price?.toLocaleString()} FCFA</Text>
              {post.transactionType === 'rent' && (<Text style={styles.pricePeriod}>/mois</Text>)}
            </View>

            <View style={styles.titleRow}>
              <Text style={styles.titleText} numberOfLines={2}>{post.title}</Text>
              <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
                <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                  <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={28} color={isFavorite ? COLORS.primary : '#ccc'} />
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

      {/* Modal réservation */}
      <Modal transparent visible={isReservationModalVisible} animationType="slide" onRequestClose={() => setIsReservationModalVisible(false)}>
        <View style={styles.reservationModalOverlay}>
          <View style={styles.reservationModalContent}>
            <Ionicons name="shield-checkmark-outline" size={40} color={COLORS.primary} />
            <Text style={styles.reservationModalTitle}>Sécurisez cette Annonce !</Text>
            <Text style={styles.reservationModalText}>En réservant, vous bloquez l'annonce afin d'organiser la visite ou finaliser la transaction.</Text>

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

      {/* Viewer images */}
      <ImageViewing
        images={imagesForViewer}
        imageIndex={viewerIndex}
        visible={isViewerVisible}
        onRequestClose={() => setIsViewerVisible(false)}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
        onImageIndexChange={(imagesIdx) => {
          setViewerIndex(imagesIdx);
          const mediaIdx = imagesIndexToMediaIndex(imagesIdx);
          setActiveSlide(mediaIdx);
          flatListRef.current?.scrollToOffset({ offset: mediaIdx * width, animated: true });
        }}
      />
    </SafeAreaView>
  );
}

// helpers de rendu
const renderFeatureItem = (icon, text) => (
  <View style={styles.featureItem} key={text}>
    <MaterialIcons name={icon} size={20} color={COLORS.primary} />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const renderAmenity = (icon, text) => (
  <View style={styles.amenityBadge} key={text}>
    {(icon === 'water' || icon === 'flash') ? (
      <Ionicons name={icon} size={16} color={COLORS.primary} />
    ) : (
      <MaterialIcons name={icon} size={16} color={COLORS.primary} />
    )}
    <Text style={styles.amenityText}>{text}</Text>
  </View>
);

// styles (identiques à ta base, légèrement nettoyés)
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
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  pagination: { position: 'absolute', bottom: 20, flexDirection: 'row', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  paginationDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 4 },
  activeDot: { backgroundColor: COLORS.primary, width: 16 },
  fullscreenButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 },

  content: { backgroundColor: COLORS.white },
  statusBadge: {
    marginTop: 10,
    marginHorizontal: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  availableBadge: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
    borderWidth: 1,
  },
  reservedBadge: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
    borderWidth: 1,
  },
  statusText: { fontSize: 14, fontWeight: '600' },
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
  disabledButton: { backgroundColor: '#cccccc' },
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
  confirmReservationButton: { backgroundColor: COLORS.primary, paddingVertical: 15, borderRadius: SIZES.radius, alignItems: 'center', width: '100%', marginBottom: 10 },
  confirmReservationButtonText: { ...FONTS.h4, color: COLORS.white, fontWeight: 'bold' },
  cancelButton: { padding: 10 },
  cancelButtonText: { ...FONTS.body3, color: COLORS.gray },

  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white, padding: 20 },
  errorText: { fontSize: 16, color: COLORS.error, textAlign: 'center', marginBottom: 20 },
  retryButton: { backgroundColor: COLORS.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5 },
  retryButtonText: { color: COLORS.white, fontWeight: 'bold' },

  // vidéo fullscreen
  fullscreenVideoContainer: { flex: 1, backgroundColor: 'black', justifyContent: 'center' },
  fullscreenVideo: { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 },
  closeFullscreenButton: { position: 'absolute', top: 40, right: 20, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, padding: 8 },
});
