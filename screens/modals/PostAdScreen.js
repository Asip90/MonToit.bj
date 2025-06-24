
// import React, { useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
//   TouchableOpacity,
//   FlatList,
//   Keyboard,
//   StatusBar,
//   Dimensions,
  
// } from 'react-native';
// // import RNPickerSelect from 'react-native-picker-select';
// import { Picker } from '@react-native-picker/picker';
// import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import * as Location from 'expo-location';
// import { getAuth } from 'firebase/auth';
// import { db } from '../../src/api/FirebaseConfig';
// import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

// // Configuration Cloudinary
// const CLOUDINARY_CLOUD_NAME = "dfpxwlhu0";
// const UPLOAD_PRESET_NAME = "My_ROOMAPP_Media_file";
// const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

// const { width } = Dimensions.get('window');

// const COLORS = {
//   primary: '#27ae60',
//   primaryDark: '#2ecc71',
//   white: '#ffffff',
//   black: '#000000',
//   gray: '#95a5a6',
//   lightGray: '#ecf0f1',
//   darkGray: '#7f8c8d',
//   red: '#e74c3c'
// };

// const PostAdScreen = ({ navigation }) => {
//   // États du formulaire
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [price, setPrice] = useState('');
//   const [propertyType, setPropertyType] = useState('appartement');
//   const [bedrooms, setBedrooms] = useState('');
//   const [bathrooms, setBathrooms] = useState('');
//   const [location, setLocation] = useState('');
//   const [locationSuggestions, setLocationSuggestions] = useState([]);
//   const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  
//   // États pour les médias
//   const [images, setImages] = useState([]);
//   const [videos, setVideos] = useState([]);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [isUploading, setIsUploading] = useState(false);
  
//   // États pour les fonctionnalités
//   const [features, setFeatures] = useState({
//     furnished: false,
//     parking: false,
//     ac: false,
//     wifi: false,
//     security: false
//   });

//   const propertyTypes = [
//     { label: 'Appartement', value: 'appartement' },
//     { label: 'Maison', value: 'maison' },
//     { label: 'Terrain', value: 'terrain' },
//     { label: 'Commercial', value: 'commercial' },
//     { label: 'Chambre', value: 'chambre' },
//     { label: 'Studio', value: 'studio' }
//   ];

//   const handleMediaPick = async (type) => {
//     const isImage = type === 'image';
//     const maxSelection = isImage ? 8 - images.length : 1 - videos.length;

//     if (maxSelection <= 0) {
//       Alert.alert('Maximum atteint', `Vous ne pouvez ajouter que ${isImage ? '8 photos' : '1 vidéo'} maximum`);
//       return;
//     }

//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission requise', 'Nous avons besoin de la permission pour accéder à vos médias');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: isImage ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
//       quality: 0.8,
//       allowsMultipleSelection: isImage,
//       selectionLimit: maxSelection
//     });

//     if (!result.canceled && result.assets) {
//       if (isImage) {
//         setImages([...images, ...result.assets.map(asset => asset.uri)]);
//       } else {
//         setVideos([result.assets[0].uri]);
//       }
//     }
//   };

//   const removeMedia = (uri, type) => {
//     if (type === 'image') {
//       setImages(images.filter(img => img !== uri));
//     } else {
//       setVideos([]);
//     }
//   };

//   const uploadToCloudinary = async (uri, isVideo = false) => {
//     const formData = new FormData();
//     const filename = uri.split('/').pop();
//     const filetype = isVideo ? `video/${filename.split('.').pop()}` : `image/${filename.split('.').pop()}`;

//     formData.append('file', {
//       uri,
//       name: filename,
//       type: filetype,
//     });
//     formData.append('upload_preset', UPLOAD_PRESET_NAME);
//     formData.append('folder', isVideo ? 'videos' : 'images');

//     const response = await fetch(CLOUDINARY_UPLOAD_URL, {
//       method: 'POST',
//       body: formData,
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     const data = await response.json();
//     if (!response.ok) throw new Error(data.error?.message || 'Upload failed');
//     return data.secure_url;
//   };

//   const handleLocationSearch = async (text) => {
//     setLocation(text);
//     if (text.length > 2) {
//       setIsFetchingLocation(true);
//       try {
//         const response = await fetch(
//           `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&addressdetails=1&limit=5`,
//           { headers: { 'User-Agent': 'PropertyApp/1.0' } }
//         );
//         const data = await response.json();
//         setLocationSuggestions(data || []);
//       } catch (error) {
//         console.error("Location search error:", error);
//       } finally {
//         setIsFetchingLocation(false);
//       }
//     } else {
//       setLocationSuggestions([]);
//     }
//   };

//   const handleCurrentLocation = async () => {
//     setIsFetchingLocation(true);
//     try {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission requise', 'Nous avons besoin de la permission pour accéder à votre position');
//         return;
//       }

//       const position = await Location.getCurrentPositionAsync({});
//       const address = await Location.reverseGeocodeAsync(position.coords);
      
//       if (address.length > 0) {
//         const formattedAddress = [
//           address[0].streetNumber,
//           address[0].street,
//           address[0].city,
//           address[0].region,
//           address[0].country
//         ].filter(Boolean).join(', ');

//         setLocation(formattedAddress);
//         setLocationSuggestions([]);
//       }
//     } catch (error) {
//       Alert.alert('Erreur', 'Impossible d\'obtenir votre position actuelle');
//     } finally {
//       setIsFetchingLocation(false);
//     }
//   };

//   const toggleFeature = (feature) => {
//     setFeatures({
//       ...features,
//       [feature]: !features[feature]
//     });
//   };

//   const handleSubmit = async () => {
//     if (!title || !propertyType || !location || images.length < 3) {
//       Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires et ajouter au moins 3 photos');
//       return;
//     }

//     setIsUploading(true);
//     setUploadProgress(0);

//     try {
//       // Upload des médias vers Cloudinary
//       const uploadedImages = [];
//       const uploadedVideos = [];

//       // Upload des images
//       for (let i = 0; i < images.length; i++) {
//         const url = await uploadToCloudinary(images[i]);
//         uploadedImages.push(url);
//         setUploadProgress(Math.round(((i + 1) / (images.length + videos.length)) * 50));
//       }

//       // Upload des vidéos
//       for (let i = 0; i < videos.length; i++) {
//         const url = await uploadToCloudinary(videos[i], true);
//         uploadedVideos.push(url);
//         setUploadProgress(50 + Math.round(((i + 1) / videos.length) * 50));
//       }

//       // Préparation des données pour Firestore
//       const auth = getAuth();
//       const user = auth.currentUser;

//       const postData = {
//         title,
//         description,
//         price: price ? parseFloat(price) : null,
//         propertyType,
//         bedrooms: bedrooms ? parseInt(bedrooms) : null,
//         bathrooms: bathrooms ? parseInt(bathrooms) : null,
//         location,
//         features,
//         imageUrls: uploadedImages,
//         videoUrls: uploadedVideos,
//         createdAt: serverTimestamp(),
//         userId: user.uid,
//         userEmail: user.email,
//         username: user.displayName,
//         status: 'active'
//       };

//       // Envoi à Firestore
//       const docRef = await addDoc(collection(db, 'posts'), postData);
//       console.log('Document written with ID: ', docRef.id);

//       Alert.alert('Succès', 'Votre annonce a été publiée avec succès');
//       navigation.goBack();
//     } catch (error) {
//       console.error('Erreur de publication:', error);
//       Alert.alert('Erreur', 'Une erreur est survenue lors de la publication: ' + error.message);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor={COLORS.primaryDark} barStyle="light-content" />
      
//       <ScrollView showsHorizontalScrollIndicator ='false' contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="arrow-back" size={24} color={COLORS.white} />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Nouvelle annonce</Text>
//           <View style={{ width: 24 }} />
//         </View>

//         <View style={styles.formContainer}>
//           <Text style={styles.sectionTitle}>Informations de base</Text>
          
//           <TextInput
//             style={styles.input}
//             placeholder="Titre de l'annonce*"
//             value={title}
//             onChangeText={setTitle}
//           />

//           <TextInput
//             style={[styles.input, styles.textArea]}
//             placeholder="Description détaillée..."
//             multiline
//             numberOfLines={4}
//             value={description}
//             onChangeText={setDescription}
//           />

//           <View style={styles.row}>
//             <View style={[styles.inputContainer, { width: '48%' }]}>
//               <Text style={styles.label}>Type de propriété*</Text>
//               <View style={styles.pickerContainer}>
//                 <Picker
//                   selectedValue={propertyType}
//                   onValueChange={(itemValue) => setPropertyType(itemValue)}
//                   style={styles.picker}
//                 >
//                   {propertyTypes.map((type) => (
//                     <Picker.Item key={type.value} label={type.label} value={type.value} />
//                   ))}
//                 </Picker>
//               </View>
//             </View>

//             <View style={[styles.inputContainer, { width: '48%' }]}>
//               <Text style={styles.label}>Prix (FCFA)</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="0"
//                 keyboardType="numeric"
//                 value={price}
//                 onChangeText={setPrice}
//               />
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View style={[styles.inputContainer, { width: '30%' }]}>
//               <Text style={styles.label}>Chambres</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="-"
//                 keyboardType="numeric"
//                 value={bedrooms}
//                 onChangeText={setBedrooms}
//               />
//             </View>

//             <View style={[styles.inputContainer, { width: '30%' }]}>
//               <Text style={styles.label}>Salles de bain</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="-"
//                 keyboardType="numeric"
//                 value={bathrooms}
//                 onChangeText={setBathrooms}
//               />
//             </View>
//           </View>

//           <Text style={styles.sectionTitle}>Localisation</Text>
//           <View style={styles.locationContainer}>
//             <TextInput
//               style={[styles.input, { flex: 1 }]}
//               placeholder="Adresse*"
//               value={location}
//               onChangeText={handleLocationSearch}
//             />
//             <TouchableOpacity 
//               style={styles.locationButton}
//               onPress={handleCurrentLocation}
//             >
//               <MaterialIcons name="my-location" size={20} color={COLORS.white} />
//             </TouchableOpacity>
//           </View>

//           {isFetchingLocation && (
//             <ActivityIndicator size="small" color={COLORS.primary} style={styles.loadingIndicator} />
//           )}

//           {locationSuggestions.length > 0 && (
//             <View style={styles.suggestionsContainer}>
//               <FlatList
//                 data={locationSuggestions}
//                 keyExtractor={(item) => item.place_id.toString()}
//                 renderItem={({ item }) => (
//                   <TouchableOpacity
//                     style={styles.suggestionItem}
//                     onPress={() => {
//                       setLocation(item.display_name);
//                       setLocationSuggestions([]);
//                       Keyboard.dismiss();
//                     }}
//                   >
//                     <Text style={styles.suggestionText}>{item.display_name}</Text>
//                   </TouchableOpacity>
//                 )}
//               />
//             </View>
//           )}

//           <Text style={styles.sectionTitle}>Fonctionnalités</Text>
//           <View style={styles.featuresContainer}>
//             {Object.keys(features).map((feature) => (
//               <TouchableOpacity
//                 key={feature}
//                 style={[styles.featureButton, features[feature] && styles.featureButtonActive]}
//                 onPress={() => toggleFeature(feature)}
//               >
//                 <Text style={[styles.featureText, features[feature] && styles.featureTextActive]}>
//                   {feature === 'ac' ? 'Climatisation' : 
//                    feature === 'furnished' ? 'Meublé' : 
//                    feature.charAt(0).toUpperCase() + feature.slice(1)}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>

//           <Text style={styles.sectionTitle}>Photos ({images.length}/8)*</Text>
//           <Text style={styles.photoSubtitle}>Ajoutez au moins 3 photos de bonne qualité</Text>

//           <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
//             {images.map((uri, index) => (
//               <View key={`img-${index}`} style={styles.imageWrapper}>
//                 <Image source={{ uri }} style={styles.image} />
//                 <TouchableOpacity 
//                   style={styles.deleteImageButton}
//                   onPress={() => removeMedia(uri, 'image')}
//                 >
//                   <Ionicons name="close-circle" size={24} color={COLORS.red} />
//                 </TouchableOpacity>
//               </View>
//             ))}
//             {images.length < 8 && (
//               <TouchableOpacity 
//                 style={styles.addImageButton} 
//                 onPress={() => handleMediaPick('image')}
//               >
//                 <Ionicons name="camera" size={32} color={COLORS.primary} />
//                 <Text style={styles.addImageText}>Ajouter</Text>
//               </TouchableOpacity>
//             )}
//           </ScrollView>

//           <Text style={styles.sectionTitle}>Vidéo (optionnelle)</Text>

//           <View style={styles.videoContainer}>
//             {videos.length > 0 ? (
//               <View style={styles.videoWrapper}>
//                 <View style={styles.videoPlaceholder}>
//                   <Ionicons name="videocam" size={48} color={COLORS.primary} />
//                   <Text style={styles.videoText}>Vidéo sélectionnée</Text>
//                 </View>
//                 <TouchableOpacity 
//                   style={styles.deleteVideoButton}
//                   onPress={() => removeMedia(videos[0], 'video')}
//                 >
//                   <Ionicons name="close-circle" size={24} color={COLORS.red} />
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <TouchableOpacity 
//                 style={styles.addVideoButton} 
//                 onPress={() => handleMediaPick('video')}
//               >
//                 <Ionicons name="videocam" size={32} color={COLORS.primary} />
//                 <Text style={styles.addVideoText}>Ajouter une vidéo</Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           {isUploading && (
//             <View style={styles.progressContainer}>
//               <Text style={styles.progressText}>Publication en cours... {uploadProgress}%</Text>
//               <View style={styles.progressBar}>
//                 <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
//               </View>
//             </View>
//           )}

//           <TouchableOpacity 
//             style={styles.submitButton}
//             onPress={handleSubmit}
//             disabled={isUploading}
//           >
//             {isUploading ? (
//               <ActivityIndicator color={COLORS.white} />
//             ) : (
//               <>
//                 <MaterialIcons name="save" size={20} color={COLORS.white} />
//                 <Text style={styles.submitButtonText}>Publier l'annonce</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.lightGray,
//   },
//   scrollContainer: {
//     paddingBottom: 30,
//   },
//   header: {
//     backgroundColor: COLORS.primary,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 16,
//     elevation: 2,
//   },
//   headerTitle: {
//     color: COLORS.white,
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   formContainer: {
//     padding: 16,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: COLORS.black,
//     marginBottom: 12,
//     marginTop: 8,
//   },
//   photoSubtitle: {
//     fontSize: 14,
//     color: COLORS.darkGray,
//     marginBottom: 12,
//   },
//   input: {
//     backgroundColor: COLORS.white,
//     borderWidth: 1,
//     borderColor: COLORS.gray,
//     borderRadius: 8,
//     padding: 14,
//     fontSize: 16,
//     color: COLORS.black,
//     marginBottom: 16,
//   },
//   textArea: {
//     height: 120,
//     textAlignVertical: 'top',
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     color: COLORS.darkGray,
//     marginBottom: 8,
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: COLORS.gray,
//     borderRadius: 8,
//     backgroundColor: COLORS.white,
//     overflow: 'hidden',
//   },
//   picker: {
//     height: 50,
//     color: COLORS.black,
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   locationButton: {
//     padding: 12,
//     marginLeft: 8,
//     backgroundColor: COLORS.primary,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingIndicator: {
//     marginVertical: 8,
//   },
//   suggestionsContainer: {
//     maxHeight: 150,
//     borderWidth: 1,
//     borderColor: COLORS.gray,
//     borderRadius: 8,
//     backgroundColor: COLORS.white,
//     marginBottom: 16,
//   },
//   suggestionItem: {
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.lightGray,
//   },
//   suggestionText: {
//     fontSize: 14,
//     color: COLORS.black,
//   },
//   featuresContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 16,
//   },
//   featureButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: COLORS.gray,
//     marginRight: 8,
//     marginBottom: 8,
//     backgroundColor: COLORS.white,
//   },
//   featureButtonActive: {
//     backgroundColor: COLORS.primary,
//     borderColor: COLORS.primary,
//   },
//   featureText: {
//     fontSize: 14,
//     color: COLORS.black,
//   },
//   featureTextActive: {
//     color: COLORS.white,
//   },
//   imagesContainer: {
//     marginBottom: 16,
//   },
//   imageWrapper: {
//     width: 120,
//     height: 120,
//     borderRadius: 8,
//     marginRight: 8,
//     position: 'relative',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 8,
//   },
//   deleteImageButton: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//   },
//   addImageButton: {
//     width: 120,
//     height: 120,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderStyle: 'dashed',
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//   },
//   addImageText: {
//     marginTop: 8,
//     color: COLORS.primary,
//     fontSize: 14,
//   },
//   videoContainer: {
//     marginBottom: 16,
//   },
//   videoWrapper: {
//     width: '100%',
//     height: 180,
//     borderRadius: 8,
//     backgroundColor: COLORS.lightGray,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   videoPlaceholder: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   videoText: {
//     marginTop: 8,
//     color: COLORS.darkGray,
//   },
//   deleteVideoButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     backgroundColor: COLORS.white,
//     borderRadius: 12,
//   },
//   addVideoButton: {
//     width: '100%',
//     height: 60,
//     borderWidth: 1,
//     borderColor: COLORS.primary,
//     borderStyle: 'dashed',
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//     flexDirection: 'row',
//   },
//   addVideoText: {
//     marginLeft: 8,
//     color: COLORS.primary,
//     fontSize: 16,
//   },
//   progressContainer: {
//     marginBottom: 16,
//   },
//   progressText: {
//     fontSize: 14,
//     color: COLORS.darkGray,
//     marginBottom: 4,
//     textAlign: 'center',
//   },
//   progressBar: {
//     height: 6,
//     backgroundColor: COLORS.lightGray,
//     borderRadius: 3,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: COLORS.primary,
//   },
//   submitButton: {
//     backgroundColor: COLORS.primary,
//     borderRadius: 8,
//     padding: 16,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   submitButtonText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
// });

// export default PostAdScreen;


import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Keyboard,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { getAuth } from 'firebase/auth';
import { db } from '../../src/api/FirebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { COLORS, SIZES, FONTS } from '../../constants/Theme';

const { width } = Dimensions.get('window');

const CLOUDINARY_CLOUD_NAME = "dfpxwlhu0";
const UPLOAD_PRESET_NAME = "My_ROOMAPP_Media_file";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

const PostAdScreen = ({ navigation }) => {
  // États du formulaire
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [propertyType, setPropertyType] = useState('appartement');
  const [transactionType, setTransactionType] = useState('buy');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [location, setLocation] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  
  // États pour les médias
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // États pour les fonctionnalités
  const [features, setFeatures] = useState({
    furnished: false,
    parking: false,
    ac: false,
    wifi: false,
    security: false
  });

  const propertyTypes = [
    { label: 'Appartement', value: 'appartement' },
    { label: 'Maison', value: 'maison' },
    { label: 'Terrain', value: 'terrain' },
    { label: 'Commercial', value: 'commercial' },
    { label: 'Chambre', value: 'chambre' },
    { label: 'Studio', value: 'studio' }
  ];

  const transactionTypes = [
    { label: 'À acheter', value: 'buy' },
    { label: 'À louer', value: 'rent' }
  ];

  
const handleMediaPick = async (type) => {
  const isImage = type === 'image';
  const maxSelection = isImage ? 8 - images.length : 3 - videos.length;

  if (maxSelection <= 0) {
    Alert.alert('Maximum atteint', `Vous ne pouvez ajouter que ${isImage ? '8 photos' : '3 vidéos'} maximum`);
    return;
  }
  // Demande de permission pour accéder à la galerie


    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Nous avons besoin de la permission pour accéder à vos médias');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: isImage ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
      allowsMultipleSelection: isImage,
      selectionLimit: maxSelection
    });

    if (!result.canceled && result.assets) {
    if (isImage) {
      setImages([...images, ...result.assets.map(asset => asset.uri)]);
    } else {
      setVideos([...videos, ...result.assets.map(asset => asset.uri)]);
    }
  }
};
  const removeMedia = (uri, type) => {
  if (type === 'image') {
    setImages(images.filter(img => img !== uri));
  } else {
    setVideos(videos.filter(vid => vid !== uri));
  }
};
  // const uploadToCloudinary = async (uri, isVideo = false) => {
  //   const formData = new FormData();
  //   const filename = uri.split('/').pop();
  //   const filetype = isVideo ? `video/${filename.split('.').pop()}` : `image/${filename.split('.').pop()}`;

  //   formData.append('file', {
  //     uri,
  //     name: filename,
  //     type: filetype,
  //   });
  //   formData.append('upload_preset', UPLOAD_PRESET_NAME);
  //   formData.append('folder', isVideo ? 'videos' : 'images');

  //   const response = await fetch(CLOUDINARY_UPLOAD_URL, {
  //     method: 'POST',
  //     body: formData,
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   });

  //   const data = await response.json();
  //   if (!response.ok) throw new Error(data.error?.message || 'Upload failed');
  //   return data.secure_url;
  // };
const uploadToCloudinary = async (uri, isVideo = false) => {
  const formData = new FormData();
  const filename = uri.split('/').pop();
  const filetype = isVideo ? `video/${filename.split('.').pop()}` : `image/${filename.split('.').pop()}`;

  formData.append('file', {
    uri,
    name: filename,
    type: filetype,
  });
  formData.append('upload_preset', UPLOAD_PRESET_NAME);
  formData.append('folder', isVideo ? 'videos' : 'images');

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
    // NE PAS METTRE Content-Type, fetch s'en charge
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('Erreur Cloudinary:', text);
    throw new Error('Upload failed');
  }

  const data = await response.json();
  return data.secure_url;
};

  const handleLocationSearch = async (text) => {
    setLocation(text);
    if (text.length > 2) {
      setIsFetchingLocation(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&addressdetails=1&limit=5`,
          { headers: { 'User-Agent': 'PropertyApp/1.0' } }
        );
        const data = await response.json();
        setLocationSuggestions(data || []);
      } catch (error) {
        console.error("Location search error:", error);
      } finally {
        setIsFetchingLocation(false);
      }
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleCurrentLocation = async () => {
    setIsFetchingLocation(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'Nous avons besoin de la permission pour accéder à votre position');
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync(position.coords);
      
      if (address.length > 0) {
        const formattedAddress = [
          address[0].streetNumber,
          address[0].street,
          address[0].city,
          address[0].region,
          address[0].country
        ].filter(Boolean).join(', ');

        setLocation(formattedAddress);
        setLocationSuggestions([]);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'obtenir votre position actuelle');
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const toggleFeature = (feature) => {
    setFeatures({
      ...features,
      [feature]: !features[feature]
    });
  };

  const handleSubmit = async () => {
    if (!title || !propertyType || !location || images.length < 3) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires et ajouter au moins 3 photos');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload des médias vers Cloudinary
      const uploadedImages = [];
      const uploadedVideos = [];

      // Upload des images
      for (let i = 0; i < images.length; i++) {
        const url = await uploadToCloudinary(images[i]);
        uploadedImages.push(url);
        setUploadProgress(Math.round(((i + 1) / (images.length + videos.length)) * 50));
      }

      // Upload des vidéos
      for (let i = 0; i < videos.length; i++) {
        const url = await uploadToCloudinary(videos[i], true);
        uploadedVideos.push(url);
        setUploadProgress(50 + Math.round(((i + 1) / videos.length) * 50));
      }

      // Préparation des données pour Firestore
      const auth = getAuth();
      const user = auth.currentUser;

      const postData = {
        title,
        description,
        price: price ? parseFloat(price) : null,
        propertyType,
        transactionType,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        location,
        features,
        imageUrls: uploadedImages,
        videoUrls: uploadedVideos,
        createdAt: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email,
        username: user.displayName,
        status: 'active'
      };

      // Envoi à Firestore
      const docRef = await addDoc(collection(db, 'posts'), postData);
      console.log('Document written with ID: ', docRef.id);

      Alert.alert('Succès', 'Votre annonce a été publiée avec succès');
      navigation.goBack();
    } catch (error) {
      console.error('Erreur de publication:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la publication: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={SIZES.h3} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={[FONTS.h3, { color: COLORS.white }]}>Nouvelle annonce</Text>
          <View style={{ width: SIZES.h3 }} />
        </View>

        <View style={styles.formContainer}>
          {/* Section Titre et Description */}
          <Text style={[FONTS.h4, styles.sectionTitle]}>Informations de base</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Titre de l'annonce*"
            placeholderTextColor={COLORS.gray}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description détaillée..."
            placeholderTextColor={COLORS.gray}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />

          {/* Section Type et Prix */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, { width: '48%' }]}>
              <Text style={[FONTS.body4, styles.label]}>Type de propriété*</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={propertyType}
                  onValueChange={setPropertyType}
                  style={styles.picker}
                >
                  {propertyTypes.map((type) => (
                    <Picker.Item key={type.value} label={type.label} value={type.value} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={[styles.inputContainer, { width: '48%' }]}>
              <Text style={[FONTS.body4, styles.label]}>Prix (FCFA)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={COLORS.gray}
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>
          </View>

          {/* Section Transaction */}
          <View style={styles.inputContainer}>
            <Text style={[FONTS.body4, styles.label]}>Type de transaction*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={transactionType}
                onValueChange={setTransactionType}
                style={styles.picker}
              >
                {transactionTypes.map((type) => (
                  <Picker.Item key={type.value} label={type.label} value={type.value} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Section Chambres et Salles de bain */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, { width: '30%' }]}>
              <Text style={[FONTS.body4, styles.label]}>Chambres</Text>
              <TextInput
                style={styles.input}
                placeholder="-"
                placeholderTextColor={COLORS.gray}
                keyboardType="numeric"
                value={bedrooms}
                onChangeText={setBedrooms}
              />
            </View>

            <View style={[styles.inputContainer, { width: '30%' }]}>
              <Text style={[FONTS.body4, styles.label]}>Salles de bain</Text>
              <TextInput
                style={styles.input}
                placeholder="-"
                placeholderTextColor={COLORS.gray}
                keyboardType="numeric"
                value={bathrooms}
                onChangeText={setBathrooms}
              />
            </View>
          </View>

          {/* Section Localisation */}
          <Text style={[FONTS.h4, styles.sectionTitle]}>Localisation</Text>
          <View style={styles.locationContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Adresse*"
              placeholderTextColor={COLORS.gray}
              value={location}
              onChangeText={handleLocationSearch}
            />
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={handleCurrentLocation}
            >
              <MaterialIcons name="my-location" size={SIZES.h4} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {isFetchingLocation && (
            <ActivityIndicator size="small" color={COLORS.primary} style={styles.loadingIndicator} />
          )}

          {locationSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={locationSuggestions}
                keyExtractor={(item) => item.place_id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => {
                      setLocation(item.display_name);
                      setLocationSuggestions([]);
                      Keyboard.dismiss();
                    }}
                  >
                    <Text style={[FONTS.body4, styles.suggestionText]}>{item.display_name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Section Fonctionnalités */}
          <Text style={[FONTS.h4, styles.sectionTitle]}>Fonctionnalités</Text>
          <View style={styles.featuresContainer}>
            {Object.keys(features).map((feature) => (
              <TouchableOpacity
                key={feature}
                style={[
                  styles.featureButton, 
                  features[feature] && styles.featureButtonActive
                ]}
                onPress={() => toggleFeature(feature)}
              >
                <Text style={[
                  FONTS.body4, 
                  styles.featureText,
                  features[feature] && styles.featureTextActive
                ]}>
                  {feature === 'ac' ? 'Climatisation' : 
                   feature === 'furnished' ? 'Meublé' : 
                   feature.charAt(0).toUpperCase() + feature.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Section Photos */}
          <Text style={[FONTS.h4, styles.sectionTitle]}>Photos ({images.length}/8)*</Text>
          <Text style={[FONTS.body4, styles.photoSubtitle]}>
            Ajoutez au moins 3 photos de bonne qualité
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
            {images.map((uri, index) => (
              <View key={`img-${index}`} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity 
                  style={styles.deleteImageButton}
                  onPress={() => removeMedia(uri, 'image')}
                >
                  <Ionicons name="close-circle" size={SIZES.h3} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 8 && (
              <TouchableOpacity 
                style={styles.addImageButton} 
                onPress={() => handleMediaPick('image')}
              >
                <Ionicons name="camera" size={SIZES.h2} color={COLORS.primary} />
                <Text style={[FONTS.body4, styles.addImageText]}>Ajouter</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          {/* Section Vidéo */}
          {/* <Text style={[FONTS.h4, styles.sectionTitle]}>Vidéo (optionnelle)</Text>
          <View style={styles.videoContainer}>
            {videos.length > 0 ? (
              <View style={styles.videoWrapper}>
                <View style={styles.videoPlaceholder}>
                  <Ionicons name="videocam" size={SIZES.h1} color={COLORS.primary} />
                  <Text style={[FONTS.body4, styles.videoText]}>Vidéo sélectionnée</Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteVideoButton}
                  onPress={() => removeMedia(videos[0], 'video')}
                >
                  <Ionicons name="close-circle" size={SIZES.h3} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addVideoButton} 
                onPress={() => handleMediaPick('video')}
              >
                <Ionicons name="videocam" size={SIZES.h3} color={COLORS.primary} />
                <Text style={[FONTS.body4, styles.addVideoText]}>Ajouter une vidéo</Text>
              </TouchableOpacity>
            )}
          </View> */}
                  {/* Section Vidéo */}
        <Text style={[FONTS.h4, styles.sectionTitle]}>Vidéos ({videos.length}/3)</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
          {videos.map((uri, index) => (
            <View key={`vid-${index}`} style={styles.videoWrapper}>
              <View style={styles.videoPlaceholder}>
                <Ionicons name="videocam" size={SIZES.h1} color={COLORS.primary} />
                <Text style={[FONTS.body4, styles.videoText]}>Vidéo {index + 1}</Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteVideoButton}
                onPress={() => removeMedia(uri, 'video')}
              >
                <Ionicons name="close-circle" size={SIZES.h3} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          ))}
          {videos.length < 3 && (
            <TouchableOpacity 
              style={styles.addVideoButton} 
              onPress={() => handleMediaPick('video')}
            >
              <Ionicons name="videocam" size={SIZES.h3} color={COLORS.primary} />
              <Text style={[FONTS.body4, styles.addVideoText]}>Ajouter une vidéo</Text>
            </TouchableOpacity>
          )}
          </ScrollView>
          {/* Barre de progression */}
          {isUploading && (
            <View style={styles.progressContainer}>
              <Text style={[FONTS.body4, styles.progressText]}>
                Publication en cours... {uploadProgress}%
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
              </View>
            </View>
          )}

          {/* Bouton de soumission */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <MaterialIcons name="save" size={SIZES.h4} color={COLORS.white} />
                <Text style={[FONTS.h4, styles.submitButtonText]}>Publier l'annonce</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  scrollContainer: {
    paddingBottom: SIZES.padding,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    elevation: 2,
  },
  formContainer: {
    padding: SIZES.padding,
  },
  sectionTitle: {
    color: COLORS.black,
    marginBottom: SIZES.base,
    marginTop: SIZES.base,
  },
  photoSubtitle: {
    color: COLORS.gray,
    marginBottom: SIZES.base,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    ...FONTS.body4,
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  textArea: {
    height: SIZES.padding * 5,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.base,
  },
  inputContainer: {
    marginBottom: SIZES.base,
  },
  label: {
    color: COLORS.gray,
    marginBottom: SIZES.base / 2,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  picker: {
    height: SIZES.padding * 2,
    color: COLORS.black,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  locationButton: {
    padding: SIZES.base,
    marginLeft: SIZES.base,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    marginVertical: SIZES.base,
  },
  suggestionsContainer: {
    maxHeight: SIZES.padding * 6,
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
    marginBottom: SIZES.base,
  },
  suggestionItem: {
    padding: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  suggestionText: {
    color: COLORS.black,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SIZES.base,
  },
  featureButton: {
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius * 2,
    borderWidth: 1,
    borderColor: COLORS.gray,
    marginRight: SIZES.base,
    marginBottom: SIZES.base,
    backgroundColor: COLORS.white,
  },
  featureButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  featureText: {
    color: COLORS.black,
  },
  featureTextActive: {
    color: COLORS.white,
  },
  imagesContainer: {
    marginBottom: SIZES.base,
  },
  imageWrapper: {
    width: SIZES.padding * 5,
    height: SIZES.padding * 5,
    borderRadius: SIZES.radius,
    marginRight: SIZES.base,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: SIZES.radius,
  },
  deleteImageButton: {
    position: 'absolute',
    top: SIZES.base / 2,
    right: SIZES.base / 2,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
  },
  addImageButton: {
    width: SIZES.padding * 5,
    height: SIZES.padding * 5,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  addImageText: {
    marginTop: SIZES.base,
    color: COLORS.primary,
  },
  videoContainer: {
    marginBottom: SIZES.base,
  },
  videoWrapper: {
    width: '100%',
    height: SIZES.padding * 7,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  videoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    marginTop: SIZES.base,
    color: COLORS.gray,
  },
  deleteVideoButton: {
    position: 'absolute',
    top: SIZES.base,
    right: SIZES.base,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
  },
  videoWrapper: {
  width: SIZES.padding * 5,
  height: SIZES.padding * 5,
  borderRadius: SIZES.radius,
  marginRight: SIZES.base,
  backgroundColor: COLORS.lightGray,
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
},
addVideoButton: {
  width: SIZES.padding * 5,
  height: SIZES.padding * 5,
  borderWidth: 1,
  borderColor: COLORS.primary,
  borderStyle: 'dashed',
  borderRadius: SIZES.radius,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: COLORS.white,
},
  addVideoButton: {
    width: '100%',
    height: SIZES.padding * 2,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    flexDirection: 'row',
  },
  addVideoText: {
    marginLeft: SIZES.base,
    color: COLORS.primary,
  },
  progressContainer: {
    marginBottom: SIZES.base,
  },
  progressText: {
    color: COLORS.gray,
    marginBottom: SIZES.base / 2,
    textAlign: 'center',
  },
  progressBar: {
    height: SIZES.base / 2,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius / 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.base,
  },
  submitButtonText: {
    color: COLORS.white,
    marginLeft: SIZES.base,
  },
});

export default PostAdScreen;