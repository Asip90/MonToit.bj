


import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  // KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { db } from '../../../src/api/FirebaseConfig';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
  doc,
} from 'firebase/firestore';
import { UserContext } from '../../../context/AuthContext';
import useCloudinaryUpload from '../../../hook/uploadToCloudinary';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SIZES, FONTS } from '../../../constants/Theme'; // Import depuis theme.js
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { KeyboardController, KeyboardAvoidingView } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
// import KeyboardAvoidingView from 'react-native-keyboard-controller';
// import { KeyboardController  } from 'react-native-keyboard-controller';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// --- Fonctions utilitaires pour les dates ---
const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const formatDateSeparator = (date) => {
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, now)) return "AUJOURD'HUI";
  if (isSameDay(date, yesterday)) return 'HIER';

  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).toUpperCase();
};

const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  const now = new Date();
  const diffSeconds = (now.getTime() - date.getTime()) / 1000;

  if (diffSeconds < 60) return "À l'instant";
  if (diffSeconds < 3600) return `Il y a ${Math.floor(diffSeconds / 60)} min`;
  
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

// --- Composant optimisé pour chaque message ---
const MessageItem = React.memo(({ item, index, messagesList, isMyMessage, onImagePress }) => {
  let showDateSeparator = false;
  if (index === 0) {
    showDateSeparator = true;
  } else {
    const prevMessage = messagesList[index - 1];
    if (item.createdAt && prevMessage.createdAt) {
      if (!isSameDay(item.createdAt.toDate(), prevMessage.createdAt.toDate())) {
        showDateSeparator = true;
      }
    }
  }

  return (
    <View>
      {showDateSeparator && item.createdAt && (
        <View style={styles.dateSeparatorContainer}>
          <Text style={styles.dateSeparatorText}>
            {formatDateSeparator(item.createdAt.toDate())}
          </Text>
        </View>
      )}
      <View style={[styles.bulleMessageBase, isMyMessage ? styles.bulleMessageMoi : styles.bulleMessageAutre]}>
        {!isMyMessage && item.userName && <Text style={styles.nomDansBulle}>{item.userName}</Text>}
        {item.imageUrls && item.imageUrls.length > 0 && (
          <View style={styles.messageImagesContainer}>
            {item.imageUrls.map((imageUrl, imgIndex) => (
              <TouchableOpacity key={`${item.id}-img-${imgIndex}`} onPress={() => onImagePress(imageUrl)}>
                <Image source={{ uri: imageUrl }} style={styles.imageDansMessage} />
              </TouchableOpacity>
            ))}
          </View>
        )}
        {item.text?.trim() !== '' && (
          <Text style={[styles.texteMessage, { color: isMyMessage ? COLORS.white : COLORS.black }, (item.imageUrls?.length > 0) && { marginTop: 8 }]}>
            {item.text}
          </Text>
        )}
        <Text style={[styles.heureMessage, { color: isMyMessage ? COLORS.lightGray : COLORS.gray }]}>
          {formatMessageTime(item.createdAt)}
        </Text>
      </View>
    </View>
  );
});

const ChatScreen = () => {
  const headerHeight = useHeaderHeight();
  const { userData } = useContext(UserContext);
  const route = useRoute();
  const navigation = useNavigation();
  const { receiverId, receiverName, postId, postTitle } = route.params || {};
  
  useLayoutEffect(() => {
    navigation.setOptions({
      title: receiverName || 'Chat',
      headerStyle: {
        backgroundColor: COLORS.primary,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: {
        ...FONTS.h3,
      },
    });
  }, [navigation, receiverName]);

  const [message, setMessage] = useState('');
  const [messagesList, setMessagesList] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [selectedImageUris, setSelectedImageUris] = useState([]);
  const [isSendingCompleteMessage, setIsSendingCompleteMessage] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImageForModal, setSelectedImageForModal] = useState(null);

  const flatListRef = useRef(null);
  const { uploadImage, isUploading, uploadError, resetUploadState } = useCloudinaryUpload();

  useEffect(() => {
    if (userData?.uid && receiverId) {
      const ids = [userData.uid, receiverId].sort();
      setChatId(ids.join('_'));
    }
  }, [userData, receiverId]);

  useEffect(() => {
    if (!chatId) {
      setMessagesList([]);
      return;
    }
    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessagesList(fetched);
    }, (err) => {
      console.error(err);
      Alert.alert("Erreur", "Impossible de charger les messages.");
    });
    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    if (messagesList.length > 0) {
      const timer = setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      return () => clearTimeout(timer);
    }
  }, [messagesList.length]);

  const openImageModal = useCallback((imageUrl) => {
    setSelectedImageForModal(imageUrl);
    setIsImageModalVisible(true);
  }, []);

  const closeImageModal = useCallback(() => {
    setIsImageModalVisible(false);
    setSelectedImageForModal(null);
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Refusée", "Accès à la galerie requis.");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!pickerResult.canceled && pickerResult.assets?.length > 0) {
      setSelectedImageUris(prevUris => [...prevUris, pickerResult.assets[0].uri]);
      resetUploadState();
    }
  };

  const onSendMessage = async () => {
    if ((message.trim() === '' && selectedImageUris.length === 0) || !chatId || !userData?.uid) return;
    
    setIsSendingCompleteMessage(true);
    let uploadedImageUrlsForFirestore = [];

    try {
      if (selectedImageUris.length > 0) {
        for (const uri of selectedImageUris) {
          const cloudinaryUrl = await uploadImage(uri);
          if (cloudinaryUrl) {
            uploadedImageUrlsForFirestore.push(cloudinaryUrl);
          } else {
            throw new Error(uploadError || "Erreur d'envoi d'image inconnue");
          }
        }
      }

      const messagesCollectionRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesCollectionRef, {
        text: message.trim(),
        createdAt: serverTimestamp(),
        userId: userData.uid,
        userName: userData.name || 'Utilisateur',
        ...(uploadedImageUrlsForFirestore.length > 0 && { imageUrls: uploadedImageUrlsForFirestore }),
      });

      const chatDocRef = doc(db, 'chats', chatId);
      let lastMessageTextPreview = message.trim() || (uploadedImageUrlsForFirestore.length > 1 ? `📷 ${uploadedImageUrlsForFirestore.length} Images` : "📷 Image");
      await setDoc(chatDocRef, {
        lastMessageText: lastMessageTextPreview,
        lastMessageTimestamp: serverTimestamp(),
        lastMessageSenderId: userData.uid,
        participants: [userData.uid, receiverId].sort(),
        participantNames: { 
          [userData.uid]: userData.name || 'Moi', 
          [receiverId]: receiverName || 'Contact' 
        },
        ...(postId && { postId }),
        ...(postTitle && { postTitle }),
      }, { merge: true });

      setMessage('');
      setSelectedImageUris([]);
      resetUploadState();
    } catch (error) {
      console.error('Erreur dans onSendMessage:', error);
      Alert.alert("Erreur", "L'envoi du message a échoué.");
    } finally {
      setIsSendingCompleteMessage(false);
    }
  };

  const renderMessageItem = useCallback(({ item, index }) => (
    <MessageItem
      item={item}
      index={index}
      messagesList={messagesList}
      isMyMessage={item.userId === userData.uid}
      onImagePress={openImageModal}
    />
  ), [messagesList, userData?.uid, openImageModal]);

  return (
    
      // <KeyboardController>
      // <KeyboardAvoidingView
      //   behavior="padding"
      //   keyboardVerticalOffset={headerHeight}
      //   style={{ flex: 1 }}
      // >
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>

        <SafeAreaView style={styles.safeArea}>
        <View style={styles.conteneurPrincipal}>
          {selectedImageUris.length > 0 && (
            <View style={styles.previewMultipleContainer}>
              <FlatList
                data={selectedImageUris}
                horizontal
                keyExtractor={(uri, index) => `preview-${index}-${uri}`}
                renderItem={({ item: uri, index }) => (
                  <View style={styles.previewImageItemContainer}>
                    <Image source={{ uri }} style={styles.previewImageSingle} />
                    <TouchableOpacity
                      onPress={() => setSelectedImageUris(prevUris => prevUris.filter((_, i) => i !== index))}
                      style={styles.previewCancelButtonIndividual}
                      disabled={isSendingCompleteMessage || isUploading}
                    >
                      <Ionicons name="close-circle" size={26} color={COLORS.notification} />
                    </TouchableOpacity>
                  </View>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}

          {(isSendingCompleteMessage || isUploading) && (
            <ActivityIndicator size="small" color={COLORS.primary} style={styles.activityIndicatorGlobal} />
          )}

          <FlatList
            ref={flatListRef}
            data={messagesList}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesListContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={15}
            maxToRenderPerBatch={10}
            windowSize={21}
            ListEmptyComponent={
              !chatId ? <ActivityIndicator color={COLORS.primary} style={{ marginTop: 50 }} /> :
              <Text style={styles.emptyChatText}>Soyez le premier à envoyer un message !</Text>
            }
          />

          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.attachButton} disabled={isSendingCompleteMessage || isUploading}>
              <Ionicons name="images-outline" size={28} color={COLORS.primary} />
            </TouchableOpacity>
            {/* hdh */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>

            <TextInput
              style={styles.textInput}
              placeholder="Votre message..."
              value={message}
              onChangeText={setMessage}
              multiline
              editable={!isSendingCompleteMessage && !isUploading}
              placeholderTextColor={COLORS.gray}
            />
           
            </KeyboardAvoidingView>
            
            <TouchableOpacity
              style={[styles.sendButton, (isSendingCompleteMessage || isUploading || (message.trim() === '' && selectedImageUris.length === 0)) && styles.sendButtonDisabled]}
              onPress={onSendMessage}
              disabled={isSendingCompleteMessage || isUploading || (message.trim() === '' && selectedImageUris.length === 0)}
            >
              <Ionicons name="send" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      

      <Modal
        visible={isImageModalVisible}
        transparent={true}
        onRequestClose={closeImageModal}
        animationType="fade"
      >
        <View style={styles.imageModalContainer}>
          <TouchableOpacity style={styles.imageModalCloseButton} onPress={closeImageModal}>
            <Ionicons name="close-circle" size={40} color={COLORS.white} style={styles.closeButtonIconShadow} />
          </TouchableOpacity>
          {selectedImageForModal && (
            <Image source={{ uri: selectedImageForModal }} style={styles.imageModalContent} resizeMode="contain" />
          )}
        </View>
      </Modal>
      
    </SafeAreaView>
    {/* // </KeyboardAvoidingView> */}
    {/* // </KeyboardController> */}
     </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: COLORS.white 
  },
  keyboardAvoiding: { 
    flex: 1 
  },
  conteneurPrincipal: { 
    flex: 1, 
    flexDirection: 'column' 
  },
  previewMultipleContainer: { 
    paddingVertical: SIZES.base, 
    paddingLeft: SIZES.base, 
    backgroundColor: COLORS.lightGray, 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.gray 
  },
  previewImageItemContainer: { 
    marginRight: SIZES.base, 
    position: 'relative' 
  },
  previewImageSingle: { 
    width: 70, 
    height: 70, 
    borderRadius: SIZES.radius, 
    backgroundColor: COLORS.gray 
  },
  previewCancelButtonIndividual: { 
    position: 'absolute', 
    top: -8, 
    right: -8, 
    backgroundColor: COLORS.white, 
    borderRadius: 13 
  },
  activityIndicatorGlobal: { 
    paddingVertical: SIZES.base 
  },
  messagesList: { 
    flex: 1, 
    paddingHorizontal: SIZES.base 
  },
  messagesListContent: { 
    paddingTop: SIZES.base, 
    paddingBottom: SIZES.base 
  },
  emptyChatText: { 
    textAlign: 'center', 
    marginTop: 50, 
    color: COLORS.gray, 
    ...FONTS.body4 
  },
  bulleMessageBase: { 
    maxWidth: '75%', 
    paddingHorizontal: SIZES.base * 1.5, 
    paddingVertical: SIZES.base, 
    borderRadius: SIZES.radius * 1.5, 
    marginVertical: SIZES.base / 2 
  },
  bulleMessageMoi: { 
    backgroundColor: COLORS.primary, 
    alignSelf: 'flex-end', 
    borderBottomRightRadius: SIZES.base 
  },
  bulleMessageAutre: { 
    backgroundColor: COLORS.lightGray, 
    alignSelf: 'flex-start', 
    borderBottomLeftRadius: SIZES.base 
  },
  nomDansBulle: { 
    ...FONTS.body4, 
    fontWeight: '600', 
    color: COLORS.gray, 
    marginBottom: SIZES.base / 2 
  },
  messageImagesContainer: { 
    flexDirection: 'column', 
    marginTop: SIZES.base 
  },
  imageDansMessage: { 
    width: screenWidth * 0.55, 
    height: screenWidth * 0.45, 
    borderRadius: SIZES.radius, 
    marginVertical: SIZES.base / 2, 
    backgroundColor: COLORS.gray 
  },
  texteMessage: { 
    ...FONTS.body3, 
    lineHeight: 21 
  },
  heureMessage: { 
    ...FONTS.body4, 
    fontSize: 11, 
    alignSelf: 'flex-end', 
    marginTop: SIZES.base / 2 
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    paddingHorizontal: SIZES.base, 
    paddingVertical: SIZES.base, 
    borderTopWidth: 1, 
    borderTopColor: COLORS.lightGray, 
    backgroundColor: COLORS.white 
  },
  attachButton: { 
    paddingHorizontal: SIZES.base, 
    paddingVertical: SIZES.base, 
    marginBottom: Platform.OS === 'ios' ? 0 : SIZES.base / 2 
  },
  textInput: { 
    flex: 1, 
    minHeight: 42, 
    maxHeight: 120, 
    backgroundColor: COLORS.lightGray, 
    borderRadius: 21, 
    paddingHorizontal: SIZES.base * 2, 
    paddingTop: SIZES.base * 1.25, 
    paddingBottom: SIZES.base * 1.25, 
    ...FONTS.body3, 
    lineHeight: 20, 
    marginHorizontal: SIZES.base 
  },
  sendButton: { 
    backgroundColor: COLORS.primary, 
    borderRadius: 21, 
    width: 42, 
    height: 42, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  sendButtonDisabled: { 
    backgroundColor: COLORS.gray 
  },
  dateSeparatorContainer: { 
    alignItems: 'center', 
    marginVertical: SIZES.base * 2 
  },
  dateSeparatorText: { 
    backgroundColor: COLORS.gray, 
    color: COLORS.white, 
    ...FONTS.body4, 
    fontWeight: 'bold', 
    paddingHorizontal: SIZES.base * 1.5, 
    paddingVertical: SIZES.base / 2, 
    borderRadius: SIZES.radius 
  },
  imageModalContainer: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.9)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  imageModalCloseButton: { 
    position: 'absolute', 
    top: Platform.OS === 'ios' ? 50 : 20, 
    right: 15, 
    zIndex: 1 
  },
  closeButtonIconShadow: { 
    textShadowColor: 'rgba(0, 0, 0, 0.5)', 
    textShadowOffset: { width: 0, height: 1 }, 
    textShadowRadius: 2 
  },
  imageModalContent: { 
    width: screenWidth, 
    height: screenHeight * 0.7 
  },
});

export default ChatScreen;