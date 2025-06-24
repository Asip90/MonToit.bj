

// import React, { useState, useEffect, useContext, useRef } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   Button,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   Alert,
//   Modal, // Pour l'image en plein écran
//   Dimensions, // Pour la taille de l'image en plein écran
// } from 'react-native';

// import { db, app } from '../../src/api/FirebaseConfig'; // Assure-toi que 'app' est exporté si ton hook en a besoin directement (sinon, le hook peut l'importer)
// import {
//   collection,
//   addDoc,
//   onSnapshot,
//   query,
//   orderBy,
//   serverTimestamp,
//   setDoc,
//   doc,
// } from 'firebase/firestore';

// import { COLORS } from '../../constants/constants';
// import { UserContext } from '../../context/AuthContext';
// import useCloudinaryUpload from '../../hook/uploadToCloudinary'; // Ton hook
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import * as ImagePicker from 'expo-image-picker';

// const { width: screenWidth, height: screenHeight } = Dimensions.get('window'); // Pour la modal image

// const ChatScreen = ({ route }) => {
//   const { userData } = useContext(UserContext);
//   const { contactUid, contactUserName } = route.params;

//   const [message, setMessage] = useState('');
//   const [messagesList, setMessagesList] = useState([]);
//   const [chatId, setChatId] = useState(null);
//   const [selectedImageUris, setSelectedImageUris] = useState([]); // Tableau pour plusieurs images
//   const [isSendingCompleteMessage, setIsSendingCompleteMessage] = useState(false);

//   // Pour la modale d'image en plein écran
//   const [isImageModalVisible, setIsImageModalVisible] = useState(false);
//   const [selectedImageForModal, setSelectedImageForModal] = useState(null);

//   const flatListRef = useRef(null);

//   const {
//     uploadImage: envoyerImageVersCloudinary,
//     isUploading: envoiImageCloudinaryEnCours,
//     uploadError: erreurEnvoiImageCloudinary,
//     resetUploadState: reinitialiserEtatEnvoiCloudinary,
//   } = useCloudinaryUpload();

//   // Calcul du chatId
//   useEffect(() => {
//     if (userData?.uid && contactUid) {
//       const ids = [userData.uid, contactUid].sort();
//       const currentChatId = ids.join('_');
//       setChatId(currentChatId);
//       console.log('ChatScreen: ChatId initialisé:', currentChatId);
//     }
//   }, [userData, contactUid]);

//   // Écoute des messages Firestore
//   useEffect(() => {
//     if (!chatId) {
//       setMessagesList([]);
//       return;
//     }
//     const messagesCollectionRef = collection(db, 'chats', chatId, 'messages');
//     const q = query(messagesCollectionRef, orderBy('createdAt', 'asc'));
//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const fetchedMessages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setMessagesList(fetchedMessages);
//     }, (error) => {
//       console.error(`ChatScreen: Erreur écoute Firestore pour ${chatId}:`, error);
//       Alert.alert("Erreur", "Impossible de charger les messages.");
//     });
//     return () => unsubscribe();
//   }, [chatId]);

//   // Fonctions pour la modale d'image
//   const openImageModal = (imageUrl) => {
//     setSelectedImageForModal(imageUrl);
//     setIsImageModalVisible(true);
//   };
//   const closeImageModal = () => {
//     setIsImageModalVisible(false);
//     setSelectedImageForModal(null);
//   };

//   // Choisir une image (ajoutée à la liste selectedImageUris)
//   const pickImage = async () => {
//     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permissionResult.granted) {
//       Alert.alert("Permission Refusée", "Accès à la galerie requis.");
//       return;
//     }
//     const pickerResult = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: false, // Pas d'édition forcée
//       quality: 1, // Meilleure qualité (Cloudinary peut optimiser)
//     });
//     if (!pickerResult.canceled && pickerResult.assets?.length > 0) {
//       setSelectedImageUris(prevUris => [...prevUris, pickerResult.assets[0].uri]);
//       reinitialiserEtatEnvoiCloudinary();
//     }
//   };

//   // Envoyer le message (texte et/ou images)
//   const onSendMessage = async () => {
//     if (message.trim() === '' && selectedImageUris.length === 0) return;
//     if (!chatId || !userData?.uid) {
//       Alert.alert("Erreur", "Informations de discussion manquantes.");
//       return;
//     }

//     setIsSendingCompleteMessage(true);
//     let uploadedImageUrlsForFirestore = [];

//     try {
//       if (selectedImageUris.length > 0) {
//         for (const uri of selectedImageUris) {
//           const cloudinaryUrl = await envoyerImageVersCloudinary(uri);
//           if (cloudinaryUrl) {
//             uploadedImageUrlsForFirestore.push(cloudinaryUrl);
//           } else {
//             Alert.alert("Erreur Image", `Une image n'a pas pu être envoyée: ${erreurEnvoiImageCloudinary || "Inconnue"}`);
//             setIsSendingCompleteMessage(false);
//             return;
//           }
//         }
//       }

//       const messagesCollectionRef = collection(db, 'chats', chatId, 'messages');
//       const messageData = {
//         text: message.trim(),
//         createdAt: serverTimestamp(),
//         userId: userData.uid,
//         userName: userData.userName || userData.email || 'Utilisateur',
//       };
//       if (uploadedImageUrlsForFirestore.length > 0) {
//         messageData.imageUrls = uploadedImageUrlsForFirestore; // Tableau d'URLs
//       }

//       await addDoc(messagesCollectionRef, messageData);

//       const chatDocRef = doc(db, 'chats', chatId);
//       let lastMessageTextPreview = message.trim();
//       if (!lastMessageTextPreview && uploadedImageUrlsForFirestore.length > 0) {
//         lastMessageTextPreview = uploadedImageUrlsForFirestore.length > 1 ? `📷 ${uploadedImageUrlsForFirestore.length} Images` : "📷 Image";
//       }
//       await setDoc(chatDocRef, {
//         participants: [userData.uid, contactUid].sort(),
//         participantNames: {
//           [userData.uid]: userData.userName || userData.email || 'Moi',
//           [contactUid]: contactUserName || 'Contact',
//         },
//         lastMessageText: lastMessageTextPreview,
//         lastMessageTimestamp: serverTimestamp(),
//         lastMessageSenderId: userData.uid,
//       }, { merge: true });

//       setMessage('');
//       setSelectedImageUris([]);
//       reinitialiserEtatEnvoiCloudinary();
//     } catch (error) {
//       console.error('ChatScreen: Erreur globale dans onSendMessage:', error);
//       Alert.alert("Erreur", "L'envoi du message a échoué.");
//     } finally {
//       setIsSendingCompleteMessage(false);
//     }
//   };

//   // Affichage de chaque message
//   const renderMessageItem = ({ item }) => {
//     const isMyMessage = item.userId === userData.uid;
//     return (
//       <View style={[styles.bulleMessageBase, isMyMessage ? styles.bulleMessageMoi : styles.bulleMessageAutre]}>
//         {!isMyMessage && item.userName && <Text style={styles.nomDansBulle}>{item.userName}</Text>}
//         {item.imageUrls && item.imageUrls.length > 0 && (
//           <View style={styles.messageImagesContainer}>
//             {item.imageUrls.map((imageUrl, index) => (
//               <TouchableOpacity key={`${item.id}-img-${index}`} onPress={() => openImageModal(imageUrl)}>
//                 <Image source={{ uri: imageUrl }} style={styles.imageDansMessage} />
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}
//         {item.text && item.text.trim() !== '' && (
//           <Text style={[styles.texteMessage, { color: isMyMessage ? 'white' : 'black' }, (item.imageUrls?.length > 0) && { marginTop: 8 }]}>
//             {item.text}
//           </Text>
//         )}
//         {item.createdAt?.toDate && (
//           <Text style={[styles.heureMessage, { color: isMyMessage ? COLORS.lightBlue : COLORS.darkGray }]}>
//             {new Date(item.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//           </Text>
//         )}
//       </View>
//     );
//   };

//   // --- JSX ---
//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardAvoiding}
//         // keyboardVerticalOffset est important pour que le clavier ne recouvre pas l'input
//         // La valeur exacte peut dépendre de la présence d'un header de navigation ou d'un TabBar.
//         // Si tu as un header standard de React Navigation, il est souvent autour de 60-90.
//         // Si tu n'as PAS de header DANS CET ÉCRAN (géré par un navigateur parent),
//         // tu peux mettre une valeur plus petite ou 0. Teste pour trouver la bonne valeur.
//         keyboardVerticalOffset={Platform.OS === 'ios' ? (route.params.headerHeight || 90) : 0}
//         // 'headerHeight' pourrait être passé en paramètre par le navigateur si tu as une hauteur de header dynamique.
//       >
//         <View style={styles.conteneurPrincipal}>
//           {/* Tu peux décommenter ceci si tu veux un header DANS cet écran,
//               sinon React Navigation gère l'en-tête avec `contactUserName` */}
//           {/* <View style={styles.headerInterneEcran}>
//             <Text style={styles.headerInterneEcranTitle}>{contactUserName || 'Discussion'}</Text>
//           </View> */}

//           {selectedImageUris.length > 0 && (
//             <View style={styles.previewMultipleContainer}>
//               <FlatList
//                 data={selectedImageUris}
//                 horizontal
//                 keyExtractor={(uri, index) => `preview-${index}-${uri}`}
//                 renderItem={({ item: uri, index }) => (
//                   <View style={styles.previewImageItemContainer}>
//                     <Image source={{ uri }} style={styles.previewImageSingle} />
//                     <TouchableOpacity
//                       onPress={() => setSelectedImageUris(prevUris => prevUris.filter((_, i) => i !== index))}
//                       style={styles.previewCancelButtonIndividual}
//                       disabled={isSendingCompleteMessage || envoiImageCloudinaryEnCours}
//                     >
//                       <Ionicons name="close-circle" size={26} color={COLORS.red} />
//                     </TouchableOpacity>
//                   </View>
//                 )}
//                 showsHorizontalScrollIndicator={false}
//               />
//             </View>
//           )}

//           {(isSendingCompleteMessage || envoiImageCloudinaryEnCours) && (
//             <ActivityIndicator size="small" color={COLORS.blue} style={styles.activityIndicatorGlobal} />
//           )}
//           {erreurEnvoiImageCloudinary && !envoiImageCloudinaryEnCours && (
//             <Text style={styles.errorText}>Erreur image: {erreurEnvoiImageCloudinary}</Text>
//           )}

//           <FlatList
//             ref={flatListRef}
//             data={messagesList}
//             keyExtractor={(item) => item.id}
//             renderItem={renderMessageItem}
//             style={styles.messagesList}
//             contentContainerStyle={styles.messagesListContent}
//             ListEmptyComponent={
//               !chatId ? <ActivityIndicator color={COLORS.blue} style={{marginTop: 50}}/> :
//               <Text style={styles.emptyChatText}>Soyez le premier à envoyer un message !</Text>
//             }
//             onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })} // false pour éviter sauts
//             onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
//           />

//           <View style={styles.inputContainer}>
//             <TouchableOpacity onPress={pickImage} style={styles.attachButton} disabled={isSendingCompleteMessage || envoiImageCloudinaryEnCours}>
//               <Ionicons name="images-outline" size={28} color={COLORS.blue} />
//             </TouchableOpacity>
//             <TextInput
//               style={styles.textInput}
//               placeholder="Votre message..."
//               value={message}
//               onChangeText={setMessage}
//               multiline
//               editable={!isSendingCompleteMessage && !envoiImageCloudinaryEnCours}
//             />
//             <TouchableOpacity 
//               style={[styles.sendButton, (isSendingCompleteMessage || envoiImageCloudinaryEnCours || (message.trim() === '' && selectedImageUris.length === 0)) && styles.sendButtonDisabled]}
//               onPress={onSendMessage}
//               disabled={isSendingCompleteMessage || envoiImageCloudinaryEnCours || (message.trim() === '' && selectedImageUris.length === 0)}
//             >
//                 <Ionicons name="send" size={24} color={COLORS.white} />
//             </TouchableOpacity>
//             {/* Ou utilise un <Button /> si tu préfères */}
//             {/* <Button
//               title="Envoyer"
//               onPress={onSendMessage}
//               disabled={isSendingCompleteMessage || envoiImageCloudinaryEnCours || (message.trim() === '' && selectedImageUris.length === 0)}
//               color={COLORS.blue}
//             /> */}
//           </View>
//         </View>
//       </KeyboardAvoidingView>

//       {/* Modale pour afficher l'image en plein écran */}
//       <Modal
//         visible={isImageModalVisible}
//         transparent={true}
//         onRequestClose={closeImageModal}
//         animationType="fade"
//       >
//         <View style={styles.imageModalContainer}>
//           <TouchableOpacity style={styles.imageModalCloseButton} onPress={closeImageModal}>
//             <Ionicons name="close-circle" size={40} color={COLORS.white} style={styles.closeButtonIconShadow} />
//           </TouchableOpacity>
//           {selectedImageForModal && (
//             <Image
//               source={{ uri: selectedImageForModal }}
//               style={styles.imageModalContent}
//               resizeMode="contain"
//             />
//           )}
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// // --- STYLES ---
// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: COLORS.white },
//   keyboardAvoiding: { flex: 1 },
//   conteneurPrincipal: { flex: 1, flexDirection: 'column' },
//   // headerInterneEcran: { padding: 15, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray, backgroundColor: COLORS.white, alignItems: 'center' },
//   // headerInterneEcranTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.black },
//   previewMultipleContainer: {
//     paddingVertical: 8,
//     paddingLeft: 10, // Pour aligner avec le padding de messagesList
//     backgroundColor: COLORS.extraLightGray, // Un fond très léger
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.lightGray,
//   },
//   previewImageItemContainer: { marginRight: 8, position: 'relative' },
//   previewImageSingle: { width: 70, height: 70, borderRadius: 8, backgroundColor: COLORS.mediumGray },
//   previewCancelButtonIndividual: {
//     position: 'absolute',
//     top: -8, right: -8,
//     backgroundColor: COLORS.white, borderRadius: 13, // Pour faire un cercle blanc autour de l'icône
//     padding: 1, // Léger padding pour l'ombre si besoin
//   },
//   activityIndicatorGlobal: { paddingVertical: 8 },
//   errorText: { color: COLORS.red, textAlign: 'center', padding: 5, fontSize: 13 },
//   messagesList: { flex: 1, paddingHorizontal: 10 },
//   messagesListContent: { paddingTop: 10, paddingBottom: 5 }, // paddingTop pour espacer du header/preview
//   emptyChatText: { textAlign: 'center', marginTop: 50, color: COLORS.darkGray, fontSize: 15 },
//   bulleMessageBase: { maxWidth: '75%', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginVertical: 4 },
//   bulleMessageMoi: { backgroundColor: COLORS.blue, alignSelf: 'flex-end', borderBottomRightRadius: 6 },
//   bulleMessageAutre: { backgroundColor: COLORS.lightGray, alignSelf: 'flex-start', borderBottomLeftRadius: 6 },
//   nomDansBulle: { fontSize: 12, fontWeight: '600', color: COLORS.darkGray, marginBottom: 3 },
//   messageImagesContainer: { flexDirection: 'column', marginTop: 5 }, // Change en 'column' si tu veux les images l'une sous l'autre dans la bulle
//   imageDansMessage: { width: screenWidth * 0.55, height: screenWidth * 0.45, borderRadius: 12, marginVertical: 3, backgroundColor: COLORS.mediumGray, resizeMode: 'cover' },
//   texteMessage: { fontSize: 15, lineHeight: 21 },
//   heureMessage: { fontSize: 10, alignSelf: 'flex-end', marginTop: 4, opacity: 0.7 },
//   inputContainer: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 8, paddingVertical: 8, borderTopWidth: 1, borderTopColor: COLORS.lightGray, backgroundColor: COLORS.white },
//   attachButton: { paddingHorizontal: 8, paddingVertical: 8, marginBottom: Platform.OS === 'ios' ? 0 : 3 }, // Ajustement pour Android
//   textInput: {
//     flex: 1,
//     minHeight: 42, maxHeight: 120,
//     backgroundColor: COLORS.extraLightGray, borderRadius: 21,
//     paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10,
//     fontSize: 16, lineHeight: 20,
//     marginHorizontal: 8,
//   },
//   sendButton: {
//     backgroundColor: COLORS.blue,
//     borderRadius: 21, // Même que le textInput
//     padding: 10, // Ajuste pour que la hauteur soit similaire au textInput
//     height: 42, // Similaire à minHeight du textInput
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   sendButtonDisabled: {
//       backgroundColor: COLORS.mediumGray,
//   },
//   // Styles pour la Modale Image
//   imageModalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
//   imageModalCloseButton: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 20, right: 15, zIndex: 1 },
//   closeButtonIconShadow: { // Ajoute une petite ombre pour la visibilité sur l'image
//     textShadowColor: 'rgba(0, 0, 0, 0.5)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 2,
//   },
//   imageModalContent: { width: screenWidth, height: screenHeight * 0.7, /* resizeMode="contain" est sur l'Image */ },
// });

// export default ChatScreen;

// import React, { useState, useEffect, useContext, useRef } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   Alert,
//   Modal,
//   Dimensions,
// } from 'react-native';

// import { db } from '../../src/api/FirebaseConfig';
// import {
//   collection,
//   addDoc,
//   onSnapshot,
//   query,
//   orderBy,
//   serverTimestamp,
//   setDoc,
//   doc,
// } from 'firebase/firestore';

// import { COLORS } from '../../constants/constants'; // Assurez-vous que vos couleurs sont bien définies ici
// import { UserContext } from '../../context/AuthContext';
// import useCloudinaryUpload from '../../hook/uploadToCloudinary';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import * as ImagePicker from 'expo-image-picker';

// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// // --- NOUVEAUTÉ : Fonctions utilitaires pour les dates ---

// // Vérifie si deux dates sont le même jour
// const isSameDay = (date1, date2) => {
//   if (!date1 || !date2) return false;
//   return (
//     date1.getFullYear() === date2.getFullYear() &&
//     date1.getMonth() === date2.getMonth() &&
//     date1.getDate() === date2.getDate()
//   );
// };

// // Formate la date pour les séparateurs ("AUJOURD'HUI", "HIER", etc.)
// const formatDateSeparator = (date) => {
//   const now = new Date();
//   const yesterday = new Date(now);
//   yesterday.setDate(now.getDate() - 1);

//   if (isSameDay(date, now)) return 'AUJOURD\'HUI';
//   if (isSameDay(date, yesterday)) return 'HIER';

//   return date.toLocaleDateString('fr-FR', {
//     weekday: 'long',
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   }).toUpperCase();
// };

// // Formate l'heure dans la bulle de message (style Messenger)
// const formatMessageTime = (timestamp) => {
//   if (!timestamp) return '';
//   const date = timestamp.toDate();
//   const now = new Date();
//   const diffSeconds = (now.getTime() - date.getTime()) / 1000;

//   if (diffSeconds < 60) return "À l'instant";
//   if (diffSeconds < 3600) return `Il y a ${Math.floor(diffSeconds / 60)} min`;
  
//   // Pour aujourd'hui, hier, etc., on veut juste l'heure.
//   return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
// };


// const ChatScreen = ({ route }) => {
//   const { userData } = useContext(UserContext);
//   const { contactUid, contactUserName } = route.params;

//   const [message, setMessage] = useState('');
//   const [messagesList, setMessagesList] = useState([]);
//   const [chatId, setChatId] = useState(null);
//   const [selectedImageUris, setSelectedImageUris] = useState([]);
//   const [isSendingCompleteMessage, setIsSendingCompleteMessage] = useState(false);

//   const [isImageModalVisible, setIsImageModalVisible] = useState(false);
//   const [selectedImageForModal, setSelectedImageForModal] = useState(null);

//   const flatListRef = useRef(null);

//   const {
//     uploadImage: envoyerImageVersCloudinary,
//     isUploading: envoiImageCloudinaryEnCours,
//     uploadError: erreurEnvoiImageCloudinary,
//     resetUploadState: reinitialiserEtatEnvoiCloudinary,
//   } = useCloudinaryUpload();

//   useEffect(() => {
//     if (userData?.uid && contactUid) {
//       const ids = [userData.uid, contactUid].sort();
//       setChatId(ids.join('_'));
//     }
//   }, [userData, contactUid]);

//   useEffect(() => {
//     if (!chatId) {
//       setMessagesList([]);
//       return;
//     }
//     const messagesCollectionRef = collection(db, 'chats', chatId, 'messages');
//     const q = query(messagesCollectionRef, orderBy('createdAt', 'asc'));
//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const fetchedMessages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setMessagesList(fetchedMessages);
//     }, (error) => {
//       console.error(`ChatScreen: Erreur écoute Firestore pour ${chatId}:`, error);
//       Alert.alert("Erreur", "Impossible de charger les messages.");
//     });
//     return () => unsubscribe();
//   }, [chatId]);

//   // --- NOUVEAUTÉ : Défilement automatique fiable ---
//   useEffect(() => {
//     if (messagesList.length > 0) {
//       // Un léger délai assure que l'UI a le temps de se mettre à jour avant le défilement
//       const timer = setTimeout(() => {
//         flatListRef.current?.scrollToEnd({ animated: true });
//       }, 100);
//       return () => clearTimeout(timer);
//     }
//   }, [messagesList]); // Se déclenche à chaque mise à jour de la liste


//   const openImageModal = (imageUrl) => {
//     setSelectedImageForModal(imageUrl);
//     setIsImageModalVisible(true);
//   };
//   const closeImageModal = () => {
//     setIsImageModalVisible(false);
//     setSelectedImageForModal(null);
//   };

//   const pickImage = async () => {
//     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permissionResult.granted) {
//       Alert.alert("Permission Refusée", "Accès à la galerie requis.");
//       return;
//     }
//     const pickerResult = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });
//     if (!pickerResult.canceled && pickerResult.assets?.length > 0) {
//       setSelectedImageUris(prevUris => [...prevUris, pickerResult.assets[0].uri]);
//       reinitialiserEtatEnvoiCloudinary();
//     }
//   };

//   const onSendMessage = async () => {
//     if (message.trim() === '' && selectedImageUris.length === 0) return;
//     if (!chatId || !userData?.uid) {
//       Alert.alert("Erreur", "Informations de discussion manquantes.");
//       return;
//     }

//     setIsSendingCompleteMessage(true);
//     let uploadedImageUrlsForFirestore = [];

//     try {
//       if (selectedImageUris.length > 0) {
//         for (const uri of selectedImageUris) {
//           const cloudinaryUrl = await envoyerImageVersCloudinary(uri);
//           if (cloudinaryUrl) {
//             uploadedImageUrlsForFirestore.push(cloudinaryUrl);
//           } else {
//             throw new Error(`Une image n'a pas pu être envoyée: ${erreurEnvoiImageCloudinary || "Inconnue"}`);
//           }
//         }
//       }

//       const messagesCollectionRef = collection(db, 'chats', chatId, 'messages');
//       const messageData = {
//         text: message.trim(),
//         createdAt: serverTimestamp(),
//         userId: userData.uid,
//         userName: userData.userName || userData.email || 'Utilisateur',
//       };
//       if (uploadedImageUrlsForFirestore.length > 0) {
//         messageData.imageUrls = uploadedImageUrlsForFirestore;
//       }

//       await addDoc(messagesCollectionRef, messageData);

//       const chatDocRef = doc(db, 'chats', chatId);
//       let lastMessageTextPreview = message.trim();
//       if (!lastMessageTextPreview && uploadedImageUrlsForFirestore.length > 0) {
//         lastMessageTextPreview = uploadedImageUrlsForFirestore.length > 1 ? `📷 ${uploadedImageUrlsForFirestore.length} Images` : "📷 Image";
//       }
//       await setDoc(chatDocRef, {
//         participants: [userData.uid, contactUid].sort(),
//         participantNames: {
//           [userData.uid]: userData.userName || userData.email || 'Moi',
//           [contactUid]: contactUserName || 'Contact',
//         },
//         lastMessageText: lastMessageTextPreview,
//         lastMessageTimestamp: serverTimestamp(),
//         lastMessageSenderId: userData.uid,
//       }, { merge: true });

//       setMessage('');
//       setSelectedImageUris([]);
//       reinitialiserEtatEnvoiCloudinary();
//     } catch (error) {
//       console.error('ChatScreen: Erreur globale dans onSendMessage:', error);
//       Alert.alert("Erreur", "L'envoi du message a échoué.");
//     } finally {
//       setIsSendingCompleteMessage(false);
//     }
//   };
  
//   // --- MODIFIÉ : renderItem pour gérer les dates intelligentes ---
//   const renderMessageItem = ({ item, index }) => {
//     const isMyMessage = item.userId === userData.uid;

//     let showDateSeparator = false;
//     // Si c'est le premier message, ou si le jour est différent du message précédent
//     if (index === 0) {
//       showDateSeparator = true;
//     } else {
//       const prevMessage = messagesList[index - 1];
//       if (item.createdAt && prevMessage.createdAt) {
//         const currentDate = item.createdAt.toDate();
//         const prevDate = prevMessage.createdAt.toDate();
//         if (!isSameDay(currentDate, prevDate)) {
//           showDateSeparator = true;
//         }
//       }
//     }
    
//     return (
//       <View>
//         {showDateSeparator && item.createdAt && (
//           <View style={styles.dateSeparatorContainer}>
//             <Text style={styles.dateSeparatorText}>
//               {formatDateSeparator(item.createdAt.toDate())}
//             </Text>
//           </View>
//         )}
//         <View style={[styles.bulleMessageBase, isMyMessage ? styles.bulleMessageMoi : styles.bulleMessageAutre]}>
//           {!isMyMessage && item.userName && <Text style={styles.nomDansBulle}>{item.userName}</Text>}
//           {item.imageUrls && item.imageUrls.length > 0 && (
//             <View style={styles.messageImagesContainer}>
//               {item.imageUrls.map((imageUrl, imgIndex) => (
//                 <TouchableOpacity key={`${item.id}-img-${imgIndex}`} onPress={() => openImageModal(imageUrl)}>
//                   <Image source={{ uri: imageUrl }} style={styles.imageDansMessage} />
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}
//           {item.text?.trim() !== '' && (
//             <Text style={[styles.texteMessage, { color: isMyMessage ? 'white' : 'black' }, (item.imageUrls?.length > 0) && { marginTop: 8 }]}>
//               {item.text}
//             </Text>
//           )}
//           <Text style={[styles.heureMessage, { color: isMyMessage ? COLORS.lightBlue : COLORS.darkGray }]}>
//             {formatMessageTime(item.createdAt)}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardAvoiding}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//       >
//         <View style={styles.conteneurPrincipal}>
          
//           {selectedImageUris.length > 0 && (
//             <View style={styles.previewMultipleContainer}>
//               <FlatList
//                 data={selectedImageUris}
//                 horizontal
//                 keyExtractor={(uri, index) => `preview-${index}-${uri}`}
//                 renderItem={({ item: uri, index }) => (
//                   <View style={styles.previewImageItemContainer}>
//                     <Image source={{ uri }} style={styles.previewImageSingle} />
//                     <TouchableOpacity
//                       onPress={() => setSelectedImageUris(prevUris => prevUris.filter((_, i) => i !== index))}
//                       style={styles.previewCancelButtonIndividual}
//                       disabled={isSendingCompleteMessage || envoiImageCloudinaryEnCours}
//                     >
//                       <Ionicons name="close-circle" size={26} color={COLORS.red} />
//                     </TouchableOpacity>
//                   </View>
//                 )}
//                 showsHorizontalScrollIndicator={false}
//               />
//             </View>
//           )}

//           {(isSendingCompleteMessage || envoiImageCloudinaryEnCours) && (
//             <ActivityIndicator size="small" color={COLORS.blue} style={styles.activityIndicatorGlobal} />
//           )}
          
//           <FlatList
//             ref={flatListRef}
//             data={messagesList}
//             keyExtractor={(item) => item.id}
//             renderItem={renderMessageItem}
//             style={styles.messagesList}
//             contentContainerStyle={styles.messagesListContent}
//             ListEmptyComponent={
//               !chatId ? <ActivityIndicator color={COLORS.blue} style={{marginTop: 50}}/> :
//               <Text style={styles.emptyChatText}>Soyez le premier à envoyer un message !</Text>
//             }
//             // onContentSizeChange et onLayout ne sont plus nécessaires pour le scroll, mais ne gênent pas
//           />

//           <View style={styles.inputContainer}>
//             <TouchableOpacity onPress={pickImage} style={styles.attachButton} disabled={isSendingCompleteMessage || envoiImageCloudinaryEnCours}>
//               <Ionicons name="images-outline" size={28} color={COLORS.blue} />
//             </TouchableOpacity>
//             <TextInput
//               style={styles.textInput}
//               placeholder="Votre message..."
//               value={message}
//               onChangeText={setMessage}
//               multiline
//               editable={!isSendingCompleteMessage && !envoiImageCloudinaryEnCours}
//             />
//             <TouchableOpacity 
//               style={[styles.sendButton, (isSendingCompleteMessage || envoiImageCloudinaryEnCours || (message.trim() === '' && selectedImageUris.length === 0)) && styles.sendButtonDisabled]}
//               onPress={onSendMessage}
//               disabled={isSendingCompleteMessage || envoiImageCloudinaryEnCours || (message.trim() === '' && selectedImageUris.length === 0)}
//             >
//                 <Ionicons name="send" size={24} color={COLORS.white} />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </KeyboardAvoidingView>
      
//       <Modal visible={isImageModalVisible} /* ... Modale d'image inchangée ... */ />
//     </SafeAreaView>
//   );
// };

// // --- STYLES (avec ajout pour le séparateur de date) ---
// const styles = StyleSheet.create({
//   // ... (tous vos styles existants)
//   safeArea: { flex: 1, backgroundColor: COLORS.white },
//   keyboardAvoiding: { flex: 1 },
//   conteneurPrincipal: { flex: 1, flexDirection: 'column' },
//   messagesList: { flex: 1, paddingHorizontal: 10 },
//   messagesListContent: { paddingTop: 10, paddingBottom: 5 },
//   emptyChatText: { textAlign: 'center', marginTop: 50, color: COLORS.darkGray, fontSize: 15 },
//   bulleMessageBase: { maxWidth: '75%', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginVertical: 4 },
//   bulleMessageMoi: { backgroundColor: COLORS.blue, alignSelf: 'flex-end', borderBottomRightRadius: 6 },
//   bulleMessageAutre: { backgroundColor: COLORS.lightGray, alignSelf: 'flex-start', borderBottomLeftRadius: 6 },
//   nomDansBulle: { fontSize: 12, fontWeight: '600', color: COLORS.darkGray, marginBottom: 3 },
//   messageImagesContainer: { flexDirection: 'column', marginTop: 5 },
//   imageDansMessage: { width: screenWidth * 0.55, height: screenWidth * 0.45, borderRadius: 12, marginVertical: 3, backgroundColor: COLORS.mediumGray, resizeMode: 'cover' },
//   texteMessage: { fontSize: 15, lineHeight: 21 },
//   heureMessage: { fontSize: 11, alignSelf: 'flex-end', marginTop: 4, opacity: 0.9 }, // Taille et opacité ajustées
//   inputContainer: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 8, paddingVertical: 8, borderTopWidth: 1, borderTopColor: COLORS.lightGray, backgroundColor: COLORS.white },
//   attachButton: { paddingHorizontal: 8, paddingVertical: 8, marginBottom: Platform.OS === 'ios' ? 0 : 3 },
//   textInput: {
//     flex: 1,
//     minHeight: 42, maxHeight: 120,
//     backgroundColor: COLORS.extraLightGray, borderRadius: 21,
//     paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10,
//     fontSize: 16, lineHeight: 20,
//     marginHorizontal: 8,
//   },
//   sendButton: {
//     backgroundColor: COLORS.blue,
//     borderRadius: 21,
//     width: 42, height: 42, // Pour un cercle parfait
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   sendButtonDisabled: {
//       backgroundColor: COLORS.mediumGray,
//   },
  
//   // --- NOUVEAUTÉ : Style pour le séparateur de date ---
//   dateSeparatorContainer: {
//     alignItems: 'center',
//     marginVertical: 15,
//   },
//   dateSeparatorText: {
//     backgroundColor: COLORS.mediumGray, // Un fond neutre
//     color: COLORS.white,
//     fontSize: 12,
//     fontWeight: 'bold',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 12,
//     overflow: 'hidden', // Pour que le borderRadius s'applique bien sur iOS
//   },

//   // ... (le reste de vos styles pour la preview, modale, etc.)
// });

// export default ChatScreen;

// screens/ChatScreen.js