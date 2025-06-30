

// import React, { useState, useEffect, useContext } from 'react';
// import { 
//   View, 
//   Text, 
//   Image, 
//   ScrollView, 
//   TouchableOpacity, 
//   StyleSheet, 
//   Dimensions, 
//   ActivityIndicator,
//   Modal,
//   SafeAreaView,
//   Alert,
//   TextInput
// } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { db } from '../../src/api/FirebaseConfig';
// import { doc, getDoc } from 'firebase/firestore';
// import { COLORS } from '../../constants/Colors';
// import ImageViewer from 'react-native-image-zoom-viewer';
// import * as Linking from 'expo-linking';
// // import { call } from 'react-native-phone-call';
// import * as PhoneCall from 'react-native-phone-call';
// import { UserContext } from '../../context/AuthContext';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { isPostFavorite, toggleFavorite } from '../../services/favorites';
// import { sendMessage, getConversation } from '../../services/messaging';

// const { width } = Dimensions.get('window');

// const PostDetailScreen = ({ navigation }) => {
//   const route = useRoute();
//   const { postId } = route.params;
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [imageViewerVisible, setImageViewerVisible] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [messageModalVisible, setMessageModalVisible] = useState(false);
//   const [messageContent, setMessageContent] = useState('');
//   const [conversation, setConversation] = useState([]);
//   const { userData } = useContext(UserContext);
//   const [ownerPhoneNumber, setOwnerPhoneNumber] = useState(null); // Nouvel état pour stocker le numéro de téléphone

//   useEffect(() => {
//     const checkFavorite = async () => {
//       const result = await isPostFavorite(userData.uid, postId);
//       setIsFavorite(result);
//     };
//     checkFavorite();
//   }, [postId, userData.uid]);

//   const handleToggleFavorite = async () => {
//     try {
//       const result = await toggleFavorite(userData.uid, postId);
//       setIsFavorite(result);
//     } catch (error) {
//       console.error("Erreur lors de l'ajout/retrait du favori:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchPostAndOwner = async () => {
//       try {
//         // 1. Récupérer le post
//         const postRef = doc(db, 'posts', postId);
//         const postSnap = await getDoc(postRef);
        
//         if (postSnap.exists()) {
//           const postData = { id: postSnap.id, ...postSnap.data() };
//           setPost(postData);

//           // 2. Récupérer les infos du propriétaire si le post a un userId
//           if (postData.userId) {
//             const userRef = doc(db, 'users', postData.userId);
//             const userSnap = await getDoc(userRef);
            
//             if (userSnap.exists()) {
//               const userData = userSnap.data();
//               setOwnerPhoneNumber(userData.phoneNumber); // Stocker le numéro de téléphone
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching post or owner:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPostAndOwner();
//   }, [postId]);

//   // Fonctions pour le contact
//   const handleWhatsAppPress = () => {
//     if (!ownerPhoneNumber) {
//       Alert.alert('Erreur', 'Numéro de téléphone non disponible');
//       return;
//     }

//     const message = `Bonjour, je suis intéressé par votre annonce "${post.title}"`;
//     const url = `https://wa.me/${ownerPhoneNumber}?text=${encodeURIComponent(message)}`;
    
//     Linking.openURL(url).catch(() => {
//       Alert.alert('Erreur', "WhatsApp n'est pas installé");
//     });
//   };

//   const handlePhonePress = () => {
//   if (!ownerPhoneNumber) {
//     Alert.alert('Erreur', 'Numéro de téléphone non disponible');
//     return;
//   }

//   Linking.openURL(`tel:${ownerPhoneNumber}`).catch(() => {
//     Alert.alert('Erreur', "Impossible de passer l'appel");
//   });
// };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//       </View>
//     );
//   }

//   if (!post) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Post non trouvé</Text>
//       </View>
//     );
//   }
// //   const goToMessenger = () => {
// //     console.log('Navigating to MessageStack with userId:', post.userId);
// //   //   navigation.navigate('MessageStack', {
// //   // screen: 'ChatScreen',
// //   // params: { userId: post.userId, postId: post.id,
// //   //     postTitle: post.title }
// //    if (!post?.userId) {
// //       Alert.alert('Erreur', 'Impossible de contacter le propriétaire');
// //       return;
// //     }
// //     console.log('Navigating to MessageStack with receiverId:', post);
// //    useEffect(() => {
// //   const fetchUserName = async () => {
// //     try {
// //       const userDocRef = doc(db, 'users', post.userId);
// //       const userSnap = await getDoc(userDocRef);
// //       const username = userSnap.exists() ? userSnap.data().userName : 'Utilisateur';

// //       navigation.navigate('MessageStack', {
// //         screen: 'ChatScreen',
// //         params: {
// //           receiverId: post.userId,
// //           receiverName: username,
// //           postId: post.id,
// //           postTitle: post.title
// //         }
// //       });
// //     } catch (error) {
// //       console.error("Erreur lors de la récupération de l'utilisateur :", error);
// //     }
// //   };

// //   fetchUserName(); // ⬅️ appel de la fonction async

// // }, []);


// //     // const message = `Bonjour ${receiverName}, je suis intéressé par votre annonce "${post.title}"`;
// //     // const message = `Bonjour, je suis intéressé par votre annonce "${post
// //     // navigation.navigate('MessageStack', { 
// //     //   screen: 'ChatScreen',
// //     //   // userId: post.userId, // ID du propriétaire du post
// //     //   params: {receiverId: post.userId,
// //     //   receiverName : post.username ,// ID du propriétaire du post
// //     //   postId: post.id,
// //     //   postTitle: post.title}
// //     // });
// //   navigation.navigate('MessageStack', {
// //   screen: 'ChatScreen',
// //   params: {
// //     receiverId: post.userId,
// //     receiverName: username, // ✅ maintenant non nul
// //     postId: post.id,
// //     postTitle: post.title
// //   }
// // });



// //   };
  
//   // --- FONCTION CORRIGÉE ---
//   // Gère la navigation vers l'écran de chat
// //   const goToMessenger = async () => {
// //     // Vérification de sécurité
// //     if (!post?.userId) {
// //       Alert.alert("Erreur", "Impossible de contacter le propriétaire de l'annonce.");
// //       return;
// //     }
// //     if (post.userId === userData?.uid) {
// //       Alert.alert("Action impossible", "Vous ne pouvez pas vous envoyer un message à vous-même.");
// //       return;
// //     }
// // console.log('Navigating to MessageStack with receiverId:', post.userId);
// //     try {
// //       // 1. Récupérer le nom de l'utilisateur à qui on veut parler
// //       const userDocRef = doc(db, 'users', post.userId);
// //       const userSnap = await getDoc(userDocRef);
// //      console.log('userSnap', userSnap);
// //       const receiverName = userSnap.exists() ? userSnap.data().userName : 'Vendeur';
// // console.log('receiverName', receiverName);
// //       // 2. Naviguer vers l'écran de chat avec les bons paramètres
// //       navigation.navigate('MessageStack', {
// //         screen: 'ChatScreen',
// //         params: {
// //           receiverId: post.userId,           // L'ID de la personne à qui parler
// //           receiverName,  // Le nom à afficher dans le header
// //         },
// //       });

// //     } catch (error) {
// //       console.error("Erreur lors de la préparation de la messagerie :", error);
// //       Alert.alert("Erreur", "Une erreur est survenue. Veuillez réessayer.");
// //     }
// //   };
// const goToMessenger = async () => {
//   // Vérification de sécurité
//   if (!post?.userId) {
//     Alert.alert("Erreur", "Impossible de contacter le propriétaire de l'annonce.");
//     return;
//   }
  
//   if (post.userId === userData?.uid) {
//     Alert.alert("Action impossible", "Vous ne pouvez pas vous envoyer un message à vous-même.");
//     return;
//   }

//   try {
//     // 1. Récupérer le nom de l'utilisateur à qui on veut parler
//     const userDocRef = doc(db, 'users', post.userId);
//     const userSnap = await getDoc(userDocRef);
    
//     if (!userSnap.exists()) {
//       Alert.alert("Erreur", "Utilisateur non trouvé");
//       return;
//     }

//     const userData = userSnap.data();
//     console.log('userData', userData);
//     const receiverName = userData.name || userData.surame || 'Vendeur';

//     // 2. Naviguer vers l'écran de chat avec les bons paramètres
//     navigation.navigate('MessageStack', {
//       screen: 'ChatScreen',
//       params: {
//         receiverId: post.userId,     // L'ID de la personne à qui parler
//         receiverName,                // Le nom à afficher dans le header
//         postId: post.id,             // ID de l'annonce (optionnel)
//         postTitle: post.title        // Titre de l'annonce (optionnel)
//       },
//     });

//   } catch (error) {
//     console.error("Erreur lors de la préparation de la messagerie :", error);
//     Alert.alert("Erreur", "Une erreur est survenue. Veuillez réessayer.");
//   }
// };
// const imagesForViewer = post.imageUrls?.map(img => ({ url: img })) || [];
//  const closeImage = () => {
//     setImageViewerVisible(false);
//   };
//     const openImage = (index) => {
//     setCurrentImageIndex(index);
//     setImageViewerVisible(true);
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView style={styles.container}>
//         {/* Gallery Slider */}
//         <ScrollView 
//           horizontal 
//           pagingEnabled 
//           showsHorizontalScrollIndicator={false}
//           style={styles.imageSlider}
//         >
//           {post.imageUrls?.map((img, index) => (
//             <TouchableOpacity 
//               key={index} 
//               activeOpacity={0.9}
//               onPress={() => openImage(index)}
//             >
//               <Image source={{ uri: img }} style={styles.mainImage} />
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         {/* Price and Basic Info */}
//         <View style={styles.header}>
//           <Text style={styles.price}>{post.price} FCFA</Text>
//           <Text style={styles.title}>{post.title}</Text>
//           <View style={styles.locationContainer}>
//             <Icon name="map-marker" size={16} color="#666" />
//             <Text style={styles.location}>
//               {typeof post.location === 'string' 
//                 ? post.location 
//                 : post.location?.display_name || 'Localisation non disponible'}
//             </Text>
//           </View>
//         </View>

//         {/* Features */}
//         {post.features && post.features.length > 0 && (
//           <View style={styles.featuresContainer}>
//             {post.features.map((feature, index) => (
//               <View key={index} style={styles.featureItem}>
//                 <Icon name={feature.icon} size={24} color={COLORS.primary} />
//                 <Text style={styles.featureText}>{feature.value}</Text>
//               </View>
//             ))}
//           </View>
//         )}

//         {/* Description */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Description</Text>
//           <Text style={styles.description}>{post.description}</Text>
//         </View>

//         {/* Action Buttons */}
//         <View style={styles.actionButtons}>
//           <TouchableOpacity onPress={handleToggleFavorite} style={styles.iconButton}>
//             <Ionicons 
//               name={isFavorite ? "heart" : "heart-outline"} 
//               size={28} 
//               color={isFavorite ? COLORS.primary : COLORS.gray} 
//             />
//           </TouchableOpacity>

//           <TouchableOpacity onPress={goToMessenger} style={styles.iconButton}>
//             <Ionicons name="chatbubble" size={28} color={COLORS.primary} />
//           </TouchableOpacity>

//           <TouchableOpacity onPress={handleWhatsAppPress} style={styles.iconButton}>
//             <Ionicons name="logo-whatsapp" size={28} color="#25D366" />
//           </TouchableOpacity>

//           <TouchableOpacity onPress={handlePhonePress} style={styles.iconButton}>
//             <Ionicons name="call" size={28} color={COLORS.primary} />
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* Message Modal */}
//       {/* <Modal
//         visible={messageModalVisible}
//         animationType="slide"
//         onRequestClose={() => setMessageModalVisible(false)}
//       >
//         <SafeAreaView style={styles.modalContainer}>
//           <View style={styles.modalHeader}>
//             <TouchableOpacity onPress={() => setMessageModalVisible(false)}>
//               <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
//             </TouchableOpacity>
//             <Text style={styles.modalTitle}>Envoyer un message</Text>
//           </View>

//           <ScrollView style={styles.messagesContainer}>
//             {conversation.map((msg) => (
//               <View 
//                 key={msg.id} 
//                 style={[
//                   styles.messageBubble,
//                   msg.senderId === userData.uid 
//                     ? styles.sentMessage 
//                     : styles.receivedMessage
//                 ]}
//               >
//                 <Text style={styles.messageText}>{msg.content}</Text>
//                 <Text style={styles.messageTime}>
//                   {new Date(msg.timestamp?.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </Text>
//               </View>
//             ))}
//           </ScrollView>

//           <View style={styles.messageInputContainer}>
//             <TextInput
//               style={styles.messageInput}
//               placeholder="Tapez votre message..."
//               value={messageContent}
//               onChangeText={setMessageContent}
//               multiline
//             />
//             <TouchableOpacity 
//               style={styles.sendButton}
//               onPress={handleSendMessage}
//               disabled={!messageContent.trim()}
//             >
//               <Ionicons 
//                 name="send" 
//                 size={24} 
//                 color={messageContent.trim() ? COLORS.primary : COLORS.gray} 
//               />
//             </TouchableOpacity>
//           </View>
//         </SafeAreaView>
//       </Modal> */}

//       {/* Image Viewer Modal */}
//       <Modal
//         visible={imageViewerVisible}
//         transparent={true}
//         onRequestClose={closeImage}
//       >
//         <SafeAreaView style={styles.imageModalContainer}>
//           <TouchableOpacity 
//             style={styles.closeButton}
//             onPress={closeImage}
//           >
//             <Icon name="close" size={30} color="white" />
//           </TouchableOpacity>
          
//           <ImageViewer
//             imageUrls={imagesForViewer}
//             index={currentImageIndex}
//             enableSwipeDown
//             onSwipeDown={closeImage}
//             backgroundColor="rgba(0,0,0,0.9)"
//             renderIndicator={() => null}
//           />
//         </SafeAreaView>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   container: {
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//   },
//   imageSlider: {
//     height: 250,
//   },
//   mainImage: {
//     width: width,
//     height: 250,
//     resizeMode: 'cover',
//   },
//   header: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   price: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: COLORS.primary,
//     marginBottom: 5,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 5,
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   location: {
//     color: '#666',
//     marginLeft: 5,
//   },
//   featuresContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   featureItem: {
//     width: '50%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   featureText: {
//     marginLeft: 10,
//     fontSize: 14,
//   },
//   section: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 10,
//   },
//   description: {
//     fontSize: 14,
//     lineHeight: 20,
//     color: '#444',
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     padding: 16,
//     justifyContent: 'space-around',
//   },
//   iconButton: {
//     padding: 10,
//     borderRadius: 50,
//     backgroundColor: '#f5f5f5',
//     width: 50,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   // Styles pour la messagerie
//   modalContainer: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginLeft: 15,
//   },
//   messagesContainer: {
//     flex: 1,
//     padding: 15,
//   },
//   messageBubble: {
//     maxWidth: '80%',
//     padding: 12,
//     borderRadius: 15,
//     marginBottom: 10,
//   },
//   sentMessage: {
//     alignSelf: 'flex-end',
//     backgroundColor: COLORS.primary,
//   },
//   receivedMessage: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#f1f1f1',
//   },
//   messageText: {
//     fontSize: 16,
//     color: '#fff',
//   },
//   receivedMessageText: {
//     color: '#000',
//   },
//   messageTime: {
//     fontSize: 12,
//     color: 'rgba(255,255,255,0.7)',
//     marginTop: 5,
//     textAlign: 'right',
//   },
//   receivedMessageTime: {
//     color: 'rgba(0,0,0,0.5)',
//   },
//   messageInputContainer: {
//     flexDirection: 'row',
//     padding: 15,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//     alignItems: 'center',
//   },
//   messageInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 25,
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     maxHeight: 100,
//   },
//   sendButton: {
//     marginLeft: 10,
//     padding: 10,
//   },
//   imageModalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.9)',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     zIndex: 1,
//     padding: 10,
//   },
// });

// export default PostDetailScreen;

// import React, { useState, useEffect, useContext } from 'react';
// import { 
//   View, 
//   Text, 
//   Image, 
//   ScrollView, 
//   TouchableOpacity, 
//   StyleSheet, 
//   Dimensions, 
//   ActivityIndicator,
//   Modal,
//   SafeAreaView,
//   Alert
// } from 'react-native';
// import { useRoute } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { db } from '../../src/api/FirebaseConfig';
// import { doc, getDoc } from 'firebase/firestore';
// import { COLORS } from '../../constants/Colors';
// import ImageViewer from 'react-native-image-zoom-viewer';
// import * as Linking from 'expo-linking';
// // import Video from 'react-native-video';
// import { UserContext } from '../../context/AuthContext';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { isPostFavorite, toggleFavorite } from '../../services/favorites';
// import { Video } from 'expo-av';
// const { width } = Dimensions.get('window');

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
//   const [paused, setPaused] = useState(true); // Pour contrôler la lecture des vidéos

//   useEffect(() => {
//     const checkFavorite = async () => {
//       const result = await isPostFavorite(userData.uid, postId);
//       setIsFavorite(result);
//     };
//     checkFavorite();
//   }, [postId, userData.uid]);

//   const handleToggleFavorite = async () => {
//     try {
//       const result = await toggleFavorite(userData.uid, postId);
//       setIsFavorite(result);
//     } catch (error) {
//       console.error("Erreur lors de l'ajout/retrait du favori:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchPostAndOwner = async () => {
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
//               const userData = userSnap.data();
//               setOwnerPhoneNumber(userData.phoneNumber);
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching post or owner:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPostAndOwner();
//   }, [postId]);

//   const handleWhatsAppPress = () => {
//     if (!ownerPhoneNumber) {
//       Alert.alert('Erreur', 'Numéro de téléphone non disponible');
//       return;
//     }

//     const message = `Bonjour, je suis intéressé par votre annonce "${post.title}"`;
//     const url = `https://wa.me/${ownerPhoneNumber}?text=${encodeURIComponent(message)}`;
    
//     Linking.openURL(url).catch(() => {
//       Alert.alert('Erreur', "WhatsApp n'est pas installé");
//     });
//   };

//   const handlePhonePress = () => {
//     if (!ownerPhoneNumber) {
//       Alert.alert('Erreur', 'Numéro de téléphone non disponible');
//       return;
//     }

//     Linking.openURL(`tel:${ownerPhoneNumber}`).catch(() => {
//       Alert.alert('Erreur', "Impossible de passer l'appel");
//     });
//   };

//   const goToMessenger = async () => {
//     if (!post?.userId) {
//       Alert.alert("Erreur", "Impossible de contacter le propriétaire de l'annonce.");
//       return;
//     }
    
//     if (post.userId === userData?.uid) {
//       Alert.alert("Action impossible", "Vous ne pouvez pas vous envoyer un message à vous-même.");
//       return;
//     }

//     try {
//       const userDocRef = doc(db, 'users', post.userId);
//       const userSnap = await getDoc(userDocRef);
      
//       if (!userSnap.exists()) {
//         Alert.alert("Erreur", "Utilisateur non trouvé");
//         return;
//       }

//       const userData = userSnap.data();
//       const receiverName = userData.name || userData.surname || 'Vendeur';

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
//       console.error("Erreur lors de la préparation de la messagerie :", error);
//       Alert.alert("Erreur", "Une erreur est survenue. Veuillez réessayer.");
//     }
//   };

//   const openImage = (index) => {
//     setCurrentImageIndex(index);
//     setImageViewerVisible(true);
//   };

//   const closeImage = () => {
//     setImageViewerVisible(false);
//   };

//   const [shouldPlay, setShouldPlay] = useState(false);  // Remplace `paused`

// const toggleVideoPlayback = () => {
//   setShouldPlay(!shouldPlay);
// };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//       </View>
//     );
//   }

//   if (!post) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>Post non trouvé</Text>
//       </View>
//     );
//   }

//   // Combiner images et vidéos pour le slider
//   const mediaItems = [
//   ...(post.imageUrls?.map(url => ({ type: 'image', url })) || []),
//   ...(post.videoUrls?.map(url => ({ type: 'video', url })) || [])
// ];

//   // Préparer les données pour l'image viewer (uniquement les images)
//   const imagesForViewer = post.imageUrls?.map(img => ({ url: img })) || [];

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView style={styles.container}>
//         {/* Gallery Slider */}
//         <ScrollView 
//           horizontal 
//           pagingEnabled 
//           showsHorizontalScrollIndicator={false}
//           style={styles.imageSlider}
//         >
//           {mediaItems.map((media, index) => (
//             <TouchableOpacity 
//               key={index} 
//               activeOpacity={0.9}
//               onPress={() => media.type === 'image' ? openImage(index) : toggleVideoPlayback()}
//               style={styles.mediaContainer}
//             >
//               {media.type === 'image' ? (
//                 <Image source={{ uri: media.url }} style={styles.mainImage} />
//               ) : (
//                 <View style={styles.videoContainer}>
//                   <Video
//                       source={{ uri: media.url }}
//                       style={styles.video}
//                       shouldPlay={!paused}  // Remplace `paused` (inversé)
//                       resizeMode="cover"
//                       isLooping
//                       useNativeControls  // Affiche les contrôles natifs (play/pause, etc.)
//                     />
//                                       {paused && (
//                     <View style={styles.playButton}>
//                       <Icon name="play-circle" size={50} color="rgba(255,255,255,0.8)" />
//                     </View>
//                   )}
//                 </View>
//               )}
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         {/* Price and Basic Info */}
//         <View style={styles.header}>
//           <Text style={styles.price}>{post.price} FCFA</Text>
//           <Text style={styles.title}>{post.title}</Text>
//           <View style={styles.locationContainer}>
//             <Icon name="map-marker" size={16} color="#666" />
//             <Text style={styles.location}>
//               {typeof post.location === 'string' 
//                 ? post.location 
//                 : post.location?.display_name || 'Localisation non disponible'}
//             </Text>
//           </View>
//         </View>

//         {/* Features */}
//         {post.features && post.features.length > 0 && (
//           <View style={styles.featuresContainer}>
//             {post.features.map((feature, index) => (
//               <View key={index} style={styles.featureItem}>
//                 <Icon name={feature.icon} size={24} color={COLORS.primary} />
//                 <Text style={styles.featureText}>{feature.value}</Text>
//               </View>
//             ))}
//           </View>
//         )}

//         {/* Description */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Description</Text>
//           <Text style={styles.description}>{post.description}</Text>
//         </View>

//         {/* Action Buttons */}
//         <View style={styles.actionButtons}>
//           <TouchableOpacity onPress={handleToggleFavorite} style={styles.iconButton}>
//             <Ionicons 
//               name={isFavorite ? "heart" : "heart-outline"} 
//               size={28} 
//               color={isFavorite ? COLORS.primary : COLORS.gray} 
//             />
//           </TouchableOpacity>

//           <TouchableOpacity onPress={goToMessenger} style={styles.iconButton}>
//             <Ionicons name="chatbubble" size={28} color={COLORS.primary} />
//           </TouchableOpacity>

//           <TouchableOpacity onPress={handleWhatsAppPress} style={styles.iconButton}>
//             <Ionicons name="logo-whatsapp" size={28} color="#25D366" />
//           </TouchableOpacity>

//           <TouchableOpacity onPress={handlePhonePress} style={styles.iconButton}>
//             <Ionicons name="call" size={28} color={COLORS.primary} />
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* Image Viewer Modal */}
//       <Modal
//         visible={imageViewerVisible}
//         transparent={true}
//         onRequestClose={closeImage}
//       >
//         <SafeAreaView style={styles.imageModalContainer}>
//           <TouchableOpacity 
//             style={styles.closeButton}
//             onPress={closeImage}
//           >
//             <Icon name="close" size={30} color="white" />
//           </TouchableOpacity>
          
//           <ImageViewer
//             imageUrls={imagesForViewer}
//             index={currentImageIndex}
//             enableSwipeDown
//             onSwipeDown={closeImage}
//             backgroundColor="rgba(0,0,0,0.9)"
//             renderIndicator={() => null}
//           />
//         </SafeAreaView>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   container: {
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//   },
//   imageSlider: {
//     height: 250,
//   },
//   mediaContainer: {
//     width: width,
//     height: 250,
//     position: 'relative',
//   },
//   mainImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   videoContainer: {
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'black',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   video: {
//     width: '100%',
//     height: '100%',
//   },
//   playButton: {
//     position: 'absolute',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   price: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: COLORS.primary,
//     marginBottom: 5,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 5,
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   location: {
//     color: '#666',
//     marginLeft: 5,
//   },
//   featuresContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   featureItem: {
//     width: '50%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   featureText: {
//     marginLeft: 10,
//     fontSize: 14,
//   },
//   section: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 10,
//   },
//   description: {
//     fontSize: 14,
//     lineHeight: 20,
//     color: '#444',
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     padding: 16,
//     justifyContent: 'space-around',
//   },
//   iconButton: {
//     padding: 10,
//     borderRadius: 50,
//     backgroundColor: '#f5f5f5',
//     width: 50,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imageModalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.9)',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     zIndex: 1,
//     padding: 10,
//   },
// });

// export default PostDetailScreen;

import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  ActivityIndicator,
  Modal,
  SafeAreaView,
  Alert
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { db } from '../../src/api/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { COLORS, SIZES, FONTS } from '../../constants/Theme'; // Modifié pour utiliser le thème
import GallerySwiper from 'react-native-gallery-swiper';
import * as Linking from 'expo-linking';
import { UserContext } from '../../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { isPostFavorite, toggleFavorite } from '../../services/favorites';
import { Video } from 'expo-av';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';



const { width } = Dimensions.get('window');

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
  const [paused, setPaused] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  // Fonction pour calculer le temps écoulé depuis la création du post
  const calculateTimeSince = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = now - postDate;
    
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) return `${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} j`;
    
    const months = Math.floor(days / 30);
    return `${months} mois`;
  };

  useEffect(() => {
    const checkFavorite = async () => {
      if (userData?.uid) {
        const result = await isPostFavorite(userData.uid, postId);
        setIsFavorite(result);
      }
    };
    checkFavorite();
  }, [postId, userData?.uid]);

  const handleToggleFavorite = async () => {
    try {
      if (userData?.uid) {
        const result = await toggleFavorite(userData.uid, postId);
        setIsFavorite(result);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout/retrait du favori:", error);
    }
  };

  useEffect(() => {
    const fetchPostAndOwner = async () => {
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
              const userData = userSnap.data();
              setOwnerPhoneNumber(userData.phoneNumber);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching post or owner:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndOwner();
  }, [postId]);

  const handleWhatsAppPress = () => {
    if (!ownerPhoneNumber) {
      Alert.alert('Erreur', 'Numéro de téléphone non disponible');
      return;
    }

    const message = `Bonjour, je suis intéressé par votre annonce "${post.title}"`;
    const url = `https://wa.me/${ownerPhoneNumber}?text=${encodeURIComponent(message)}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Erreur', "WhatsApp n'est pas installé");
    });
  };

  const handlePhonePress = () => {
    if (!ownerPhoneNumber) {
      Alert.alert('Erreur', 'Numéro de téléphone non disponible');
      return;
    }

    Linking.openURL(`tel:${ownerPhoneNumber}`).catch(() => {
      Alert.alert('Erreur', "Impossible de passer l'appel");
    });
  };

  const goToMessenger = async () => {
    if (!post?.userId) {
      Alert.alert("Erreur", "Impossible de contacter le propriétaire de l'annonce.");
      return;
    }
    
    if (post.userId === userData?.uid) {
      Alert.alert("Action impossible", "Vous ne pouvez pas vous envoyer un message à vous-même.");
      return;
    }

    try {
      const userDocRef = doc(db, 'users', post.userId);
      const userSnap = await getDoc(userDocRef);
      
      if (!userSnap.exists()) {
        Alert.alert("Erreur", "Utilisateur non trouvé");
        return;
      }

      const userData = userSnap.data();
      const receiverName = userData.name || userData.surname || 'Vendeur';

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
      console.error("Erreur lors de la préparation de la messagerie :", error);
      Alert.alert("Erreur", "Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const openImage = (index) => {
    setCurrentImageIndex(index);
    setImageViewerVisible(true);
  };

  const closeImage = () => {
    setImageViewerVisible(false);
  };

  const toggleVideoPlayback = () => {
    setPaused(!paused);
  };

  const onScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slide !== activeSlide) {
      setActiveSlide(slide);
      setPaused(true); // Pause video when sliding
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Post non trouvé</Text>
      </View>
    );
  }

  // Combiner images et vidéos pour le slider
 const mediaItems = [
  ...(post.imageUrls?.map(url => ({ type: 'image', url })) || []),
  ...(post.videoUrls?.map(url => ({ type: 'video', url })) || [])
];


  // Préparer les données pour l'image viewer (uniquement les images)
  const imagesForViewer = post.imageUrls?.map(img => ({ url: img })) || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Gallery Slider avec indicateur */}
        <View style={styles.carouselContainer}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            style={styles.imageSlider}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {mediaItems.map((media, index) => (
              <TouchableOpacity 
                key={index} 
                activeOpacity={0.9}
                onPress={() => media.type === 'image' ? openImage(index) : toggleVideoPlayback()}
                style={styles.mediaContainer}
              >
                {media.type === 'image' ? (
                  <Image source={{ uri: media.url }} style={styles.mainImage} />
                ) : (
                  <View style={styles.videoContainer}>
                    {/* <Video
                      source={{ uri: media.url }}
                      style={styles.video}
                      shouldPlay={!paused && index === activeSlide}
                      resizeMode="cover"
                      isLooping
                      useNativeControls={false}
                    /> */}
                    <Video
                      source={{ uri: media.url }}
                      style={styles.video}
                      shouldPlay={!paused && index === activeSlide}
                      resizeMode="cover"
                      isLooping
                      useNativeControls={false}
                    />

                    {paused && (
                      <View style={styles.playButton}>
                        <Icon name="play-circle" size={50} color="rgba(255,255,255,0.8)" />
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Indicateur de slide */}
          {mediaItems.length > 1 && (
            <View style={styles.pagination}>
              {mediaItems.map((_, idx) => (
                <View 
                  key={idx} 
                  style={[
                    styles.paginationDot, 
                    idx === activeSlide ? styles.paginationDotActive : null
                  ]} 
                />
              ))}
            </View>
          )}
          
          {/* Compteur de médias */}
          <View style={styles.mediaCounter}>
            <Text style={styles.mediaCounterText}>
              {`${activeSlide + 1}/${mediaItems.length}`}
            </Text>
          </View>
        </View>

        {/* En-tête avec prix et informations */}
        <View style={styles.header}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{post.price?.toLocaleString()} FCFA</Text>
            {post.transactionType === 'rent' && (
              <Text style={styles.pricePeriod}>/mois</Text>
            )}
          </View>
          
          <View style={styles.titleRow}>
            <Text style={styles.title}>{post.title}</Text>
            <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? COLORS.primary : COLORS.gray} 
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={16} color={COLORS.gray} />
            <Text style={styles.location}>
              {typeof post.location === 'string' 
                ? post.location 
                : post.location?.display_name || 'Localisation non disponible'}
            </Text>
          </View>
          
          {post.createdAt && (
            <Text style={styles.postDate}>
              <MaterialIcons name="access-time" size={12} color={COLORS.gray} />
              {` Publié il y a ${calculateTimeSince(post.createdAt)}`}
            </Text>
          )}
        </View>

        {/* Caractéristiques principales */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Caractéristiques</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <MaterialIcons name="hotel" size={24} color={COLORS.primary} />
              <Text style={styles.featureLabel}>Chambres</Text>
              <Text style={styles.featureValue}>{post.bedrooms || 'N/A'}</Text>
            </View>
            
            <View style={styles.featureItem}>
              <MaterialIcons name="bathtub" size={24} color={COLORS.primary} />
              <Text style={styles.featureLabel}>Salles de bain</Text>
              <Text style={styles.featureValue}>{post.bathrooms || 'N/A'}</Text>
            </View>
            
            <View style={styles.featureItem}>
              <MaterialIcons name="straighten" size={24} color={COLORS.primary} />
              <Text style={styles.featureLabel}>Superficie</Text>
              <Text style={styles.featureValue}>{post.area || 'N/A'} m²</Text>
            </View>
            
            {post.features?.furnished && (
              <View style={styles.featureItem}>
                <MaterialIcons name="weekend" size={24} color={COLORS.primary} />
                <Text style={styles.featureLabel}>Meublé</Text>
                <Text style={styles.featureValue}>Oui</Text>
              </View>
            )}
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{post.description || 'Aucune description fournie'}</Text>
        </View>

        {/* Équipements */}
        {post.features && (
          <View style={styles.amenitiesSection}>
            <Text style={styles.sectionTitle}>Équipements</Text>
            <View style={styles.amenitiesContainer}>
              {post.features.ac && (
                <View style={styles.amenityItem}>
                  <MaterialIcons name="ac-unit" size={20} color={COLORS.primary} />
                  <Text style={styles.amenityText}>Climatisation</Text>
                </View>
              )}
              
              {post.features.parking && (
                <View style={styles.amenityItem}>
                  <MaterialIcons name="local-parking" size={20} color={COLORS.primary} />
                  <Text style={styles.amenityText}>Parking</Text>
                </View>
              )}
              
              {post.features.security && (
                <View style={styles.amenityItem}>
                  <MaterialIcons name="security" size={20} color={COLORS.primary} />
                  <Text style={styles.amenityText}>Sécurité</Text>
                </View>
              )}
              
              {post.features.wifi && (
                <View style={styles.amenityItem}>
                  <MaterialIcons name="wifi" size={20} color={COLORS.primary} />
                  <Text style={styles.amenityText}>Wi-Fi</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Boutons d'action */}
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={goToMessenger} style={styles.actionButton}>
            <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleWhatsAppPress} style={[styles.actionButton, styles.whatsappButton]}>
            <Ionicons name="logo-whatsapp" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>WhatsApp</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handlePhonePress} style={[styles.actionButton, styles.callButton]}>
            <Ionicons name="call" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Appeler</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Image Viewer Modal */}
       <Modal
        visible={imageViewerVisible}
        transparent={true}
        onRequestClose={closeImage}
      >
        <SafeAreaView style={styles.imageModalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={closeImage}
          >
            <Icon name="close" size={30} color="white" />
          </TouchableOpacity>
          
         <GallerySwiper
            images={imagesForViewer} // Array of { uri: 'https://...' }
            initialIndex={currentImageIndex}
            onSwipeToClose={closeImage}
            style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
          />
        </SafeAreaView>
      </Modal>


</SafeAreaView>
   
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  errorText: {
    ...FONTS.body3,
    color: COLORS.error,
  },
  carouselContainer: {
    height: 300,
    position: 'relative',
  },
  imageSlider: {
    height: '100%',
  },
  mediaContainer: {
    width: width,
    height: '100%',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    position: 'absolute',
    bottom: 15,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    margin: 5,
    opacity: 0.5,
  },
  paginationDotActive: {
    opacity: 1,
    width: 12,
  },
  mediaCounter: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  mediaCounterText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  header: {
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: SIZES.base,
  },
  price: {
    ...FONTS.h2,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  pricePeriod: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginLeft: SIZES.base,
    marginBottom: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.black,
    flex: 1,
  },
  favoriteButton: {
    padding: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  location: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginLeft: 5,
  },
  postDate: {
    ...FONTS.body4,
    color: COLORS.gray,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuresSection: {
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.black,
    marginBottom: SIZES.padding,
    fontWeight: 'bold',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  featureLabel: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginLeft: 10,
    flex: 1,
  },
  featureValue: {
    ...FONTS.body3,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  descriptionSection: {
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  description: {
    ...FONTS.body4,
    color: COLORS.black,
    lineHeight: 22,
  },
  amenitiesSection: {
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: SIZES.base,
  },
  amenityText: {
    ...FONTS.body4,
    color: COLORS.black,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
    marginHorizontal: 5,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  callButton: {
    backgroundColor: '#2ECC71',
  },
  actionButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  closeButton: {
    position: 'absolute',
    top: SIZES.padding,
    right: SIZES.padding,
    zIndex: 1,
    padding: 10,
  },
});

export default PostDetailScreen;