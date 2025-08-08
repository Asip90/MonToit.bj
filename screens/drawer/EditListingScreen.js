import React, { useState, useEffect } from 'react';
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
import { db } from '../../src/api/FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { COLORS, SIZES, FONTS } from '../../constants/Theme';

const { width } = Dimensions.get('window');

const CLOUDINARY_CLOUD_NAME = "dfpxwlhu0";
const UPLOAD_PRESET_NAME = "My_ROOMAPP_Media_file";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

const EditListingScreen = ({ route, navigation }) => {
  const { listingId } = route.params;

  // --- ÉTAT ---
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // État unifié pour les données du formulaire, incluant tous les champs de PostAdScreen
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    virtualVisitePrice: '',
    physicalVistePrice: '',
    propertyType: 'appartement',
    transactionType: 'buy',
    bedrooms: '',
    livingRoom: '',
    bathrooms: '',
    location: '',
    coordinates: null, // Pour stocker lat/lon
    features: {
      water: false,
      electricity: false,
      furnished: false,
      parking: false,
      ac: false,
      wifi: false,
      security: false,
    },
  });

  // États séparés pour les médias pour s'aligner sur la logique de PostAdScreen
  const [images, setImages] = useState([]); // Contient les URI
  const [videos, setVideos] = useState([]); // Contient les URI

  // États pour la localisation
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  // --- CONSTANTES ---
  const propertyTypes = [
    { label: 'Appartement', value: 'appartement' },
    { label: 'Maison', value: 'maison' },
    { label: 'Terrain', value: 'terrain' },
    { label: 'Commercial', value: 'commercial' },
    { label: 'Chambre', value: 'chambre' },
    { label: 'Studio', value: 'studio' }
  ];

  const transactionTypes = [
    { label: 'À louer', value: 'rent' },
    { label: 'À Vendre', value: 'buy' },
  ];

  // --- FONCTIONS ---

  // Gère les changements dans l'objet formData
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Chargement des données initiales de l'annonce
  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) {
        Alert.alert('Erreur', 'ID de l\'annonce manquant.');
        navigation.goBack();
        return;
      }
      try {
        const docRef = doc(db, 'posts', listingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            title: data.title || '',
            description: data.description || '',
            price: data.price?.toString() || '',
            virtualVisitePrice: data.virtualVisitePrice?.toString() || '',
            physicalVistePrice: data.physicalVistePrice?.toString() || '',
            propertyType: data.propertyType || 'appartement',
            transactionType: data.transactionType || 'buy',
            bedrooms: data.bedrooms?.toString() || '',
            livingRoom: data.livingRoom?.toString() || '',
            bathrooms: data.bathrooms?.toString() || '',
            location: data.location || '',
            coordinates: data.coordinates || null,
            features: data.features || {},
          });
          setImages(data.imageUrls || []);
          setVideos(data.videoUrls || []);
        } else {
          Alert.alert('Erreur', 'Annonce non trouvée.');
          navigation.goBack();
        }
      } catch (error) {
        console.error("Erreur de chargement de l'annonce:", error);
        Alert.alert('Erreur', 'Impossible de charger les données de l\'annonce.');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);

  // Harmonisé avec PostAdScreen
  const handleMediaPick = async (type) => {
    const isImage = type === 'image';
    const maxSelection = isImage ? 8 - images.length : 3 - videos.length;

    if (maxSelection <= 0) {
      Alert.alert('Maximum atteint', `Vous pouvez ajouter que ${isImage ? '8 photos' : '3 vidéos'} maximum.`);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Permission d\'accès à la galerie requise.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: isImage ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
      allowsMultipleSelection: isImage,
      selectionLimit: maxSelection,
    });

    if (!result.canceled && result.assets) {
      const uris = result.assets.map(asset => asset.uri);
      if (isImage) {
        setImages(prev => [...prev, ...uris]);
      } else {
        setVideos(prev => [...prev, ...uris]);
      }
    }
  };

  // Harmonisé avec PostAdScreen
  const removeMedia = (uri, type) => {
    if (type === 'image') {
      setImages(images.filter(img => img !== uri));
    } else {
      setVideos(videos.filter(vid => vid !== uri));
    }
  };
  
  // Fonction d'upload (identique)
  const uploadToCloudinary = async (uri, isVideo = false) => {
      const formData = new FormData();
      const filename = uri.split('/').pop();
      const filetype = isVideo ? `video/${filename.split('.').pop()}` : `image/${filename.split('.').pop()}`;

      formData.append('file', { uri, name: filename, type: filetype });
      formData.append('upload_preset', UPLOAD_PRESET_NAME);
      formData.append('folder', isVideo ? 'videos' : 'images');

      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Échec de l'envoi: ${errorData.error?.message || 'Erreur inconnue'}`);
      }
      return (await response.json()).secure_url;
  };

  // LOGIQUE DE LOCALISATION HARMONISÉE
  const handleLocationSearch = async (text) => {
    handleChange('location', text);
    if (text.length > 2) {
      setIsFetchingLocation(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&addressdetails=1&limit=5&countrycodes=bj`, // Limité au Bénin pour la pertinence
          { headers: { 'User-Agent': 'RoomApp/1.0' } }
        );
        setLocationSuggestions((await response.json()) || []);
      } catch (error) {
        console.error("Erreur de recherche d'adresse:", error);
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
        Alert.alert('Permission requise', 'Permission de localisation refusée.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      const [address] = await Location.reverseGeocodeAsync(position.coords);
      if (address) {
        const formattedAddress = [address.street, address.city, address.region, address.country].filter(Boolean).join(', ');
        handleChange('location', formattedAddress);
        handleChange('coordinates', { latitude: position.coords.latitude, longitude: position.coords.longitude });
        setLocationSuggestions([]);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de récupérer la position.');
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handleSelectLocation = (item) => {
    handleChange('location', item.display_name);
    handleChange('coordinates', { latitude: parseFloat(item.lat), longitude: parseFloat(item.lon) });
    setLocationSuggestions([]);
    Keyboard.dismiss();
  };

  const toggleFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: { ...prev.features, [feature]: !prev.features[feature] }
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.location || images.length < 3) {
      Alert.alert('Champs requis', 'Veuillez renseigner le titre, la localisation et ajouter au moins 3 photos.');
      return;
    }

    setUpdating(true);
    try {
      // Filtrer les nouveaux médias à uploader
      const newImages = images.filter(uri => !uri.startsWith('http'));
      const newVideos = videos.filter(uri => !uri.startsWith('http'));

      // Uploader uniquement les nouveaux médias
      const uploadImagePromises = newImages.map(uri => uploadToCloudinary(uri, false));
      const uploadVideoPromises = newVideos.map(uri => uploadToCloudinary(uri, true));

      const newUploadedImageUrls = await Promise.all(uploadImagePromises);
      const newUploadedVideoUrls = await Promise.all(uploadVideoPromises);

      // Combiner les anciennes et les nouvelles URLs
      const finalImageUrls = [...images.filter(uri => uri.startsWith('http')), ...newUploadedImageUrls];
      const finalVideoUrls = [...videos.filter(uri => uri.startsWith('http')), ...newUploadedVideoUrls];

      // Préparer les données pour la mise à jour
      const dataToUpdate = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        virtualVisitePrice: formData.virtualVisitePrice ? parseFloat(formData.virtualVisitePrice) : null,
        physicalVistePrice: formData.physicalVistePrice ? parseFloat(formData.physicalVistePrice) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms, 10) : null,
        livingRoom: formData.livingRoom ? parseInt(formData.livingRoom, 10) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms, 10) : null,
        imageUrls: finalImageUrls,
        videoUrls: finalVideoUrls,
        updatedAt: new Date(),
      };

      // Mise à jour du document dans Firestore
      await updateDoc(doc(db, 'posts', listingId), dataToUpdate);

      Alert.alert('Succès', 'Annonce mise à jour avec succès !');
      navigation.goBack();
    } catch (error) {
      console.error('Erreur de mise à jour:', error);
      Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de la mise à jour.');
    } finally {
      setUpdating(false);
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // --- RENDER ---
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={SIZES.h3} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={[FONTS.h3, { color: COLORS.white }]}>Modifier l'annonce</Text>
        <View style={{ width: SIZES.h3 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          {/* --- Reprise de la structure de PostAdScreen --- */}
          <Text style={[FONTS.h4, styles.sectionTitle]}>Informations de base</Text>
          <TextInput style={styles.input} placeholder="Titre de l'annonce*" value={formData.title} onChangeText={(text) => handleChange('title', text)} />
          <TextInput style={[styles.input, styles.textArea]} placeholder="Description détaillée..." multiline value={formData.description} onChangeText={(text) => handleChange('description', text)} />

          <View style={styles.row}>
            {/* ... Autres champs comme dans PostAdScreen */}
          </View>

          {/* Localisation (copié/collé et adapté de PostAdScreen) */}
          <Text style={[FONTS.h4, styles.sectionTitle]}>Localisation</Text>
          <View style={styles.locationContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Adresse*"
              value={formData.location}
              onChangeText={handleLocationSearch}
            />
            <TouchableOpacity style={styles.locationButton} onPress={handleCurrentLocation}>
              <MaterialIcons name="my-location" size={SIZES.h4} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          {isFetchingLocation && <ActivityIndicator size="small" color={COLORS.primary} style={styles.loadingIndicator} />}
          {locationSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={locationSuggestions}
                keyExtractor={(item) => item.place_id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelectLocation(item)}>
                    <Text style={[FONTS.body4, styles.suggestionText]}>{item.display_name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Caractéristiques (copié/collé et adapté de PostAdScreen) */}
          <Text style={[FONTS.h4, styles.sectionTitle]}>Caractéristiques</Text>
          <View style={styles.featuresContainer}>
            {Object.keys(formData.features).map((feature) => (
              <TouchableOpacity
                key={feature}
                style={[styles.featureButton, formData.features[feature] && styles.featureButtonActive]}
                onPress={() => toggleFeature(feature)}
              >
                <Text style={[FONTS.body4, styles.featureText, formData.features[feature] && styles.featureTextActive]}>
                  {feature.charAt(0).toUpperCase() + feature.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Médias (copié/collé et adapté de PostAdScreen) */}
          <Text style={[FONTS.h4, styles.sectionTitle]}>Photos ({images.length}/8)*</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
            {images.map((uri, index) => (
              <View key={`img-${index}`} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.image} />
                <TouchableOpacity style={styles.deleteImageButton} onPress={() => removeMedia(uri, 'image')}>
                  <Ionicons name="close-circle" size={SIZES.h3} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 8 && (
              <TouchableOpacity style={styles.addImageButton} onPress={() => handleMediaPick('image')}>
                <Ionicons name="camera" size={SIZES.h2} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </ScrollView>

          <Text style={[FONTS.h4, styles.sectionTitle]}>Vidéos ({videos.length}/3)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
            {videos.map((uri, index) => (
              <View key={`vid-${index}`} style={styles.videoWrapper}>
                  <Ionicons name="videocam" size={SIZES.h1} color={COLORS.primary} />
                  <TouchableOpacity style={styles.deleteVideoButton} onPress={() => removeMedia(uri, 'video')}>
                      <Ionicons name="close-circle" size={SIZES.h3} color={COLORS.white} />
                  </TouchableOpacity>
              </View>
            ))}
            {videos.length < 3 && (
                <TouchableOpacity style={styles.addVideoButton} onPress={() => handleMediaPick('video')}>
                    <Ionicons name="videocam" size={SIZES.h3} color={COLORS.primary} />
                </TouchableOpacity>
            )}
          </ScrollView>


          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={updating}>
            {updating ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={[FONTS.h4, styles.submitButtonText]}>Mettre à jour l'annonce</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// J'utilise les styles de PostAdScreen pour la cohérence visuelle
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
  flexWrap: 'wrap',
    flexDirection: 'row', 
    // justifyContent: 'space-between',
    marginBottom: SIZES.base,
  },
  inputContainer: {
    marginBottom: SIZES.base,
    marginRight:6
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

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray
  },
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
    ...FONTS.h4
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
    maxHeight: SIZES.padding * 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
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
    top: -5,
    right: -5,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  deleteVideoButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: SIZES.radius,
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
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.base,
  },
  submitButtonText: {
    color: COLORS.white,
    ...FONTS.h4,
  },
});

export default EditListingScreen;
// const UPLOAD_PRESET_NAME = "My_ROOMAPP_Media_file";
// const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

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

//   try {
//     const response = await fetch(CLOUDINARY_UPLOAD_URL, {
//       method: 'POST',
//       body: formData,
//       // Il est important de ne PAS mettre 'Content-Type': 'multipart/form-data'
//       // car fetch le configure automatiquement avec la bonne boundary.
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('Erreur Cloudinary:', errorData.error.message);
//       throw new Error(`Échec de l'envoi sur Cloudinary: ${errorData.error.message}`);
//     }

//     const data = await response.json();
//     return data.secure_url;
//   } catch (error) {
//     console.error("Erreur lors de l'envoi à Cloudinary:", error);
//     throw new Error("L'envoi du fichier a échoué. Vérifiez votre connexion.");
//   }
// };
// // --- Fin de la configuration et fonction Cloudinary ---

// const CATEGORIES = [
//   { label: 'Chambre ', value: 'chambre' },
//   { label: 'Studio', value: 'studio' },
//   { label: 'Appartement', value: 'appartement' },
//   { label: 'Maison', value: 'maison' },
//   { label: 'Terrain', value: 'terrain' },
//   { label: 'Commercial', value: 'commercial' },
// ];


//   const { listingId } = route.params;
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);
//   const [media, setMedia] = useState({
//     images: [],
//     videos: [] // Peut contenir des strings (URLs) ou des objets (nouveaux fichiers)
//   });
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     price: '',
//     category: '',
//     location: '',
//     address: '',
//     virtualVisitePrice: '',
//     physicalVistePrice: '',
//     coordinates: null,
//   });
//   const [locationSuggestions, setLocationSuggestions] = useState([]);
//   const [isFetchingLocation, setIsFetchingLocation] = useState(false);

//   useEffect(() => {
//     const fetchListing = async () => {
//       try {
//         const docRef = doc(db, 'posts', listingId);
//         const docSnap = await getDoc(docRef);
        
//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           setFormData({
//             title: data.title || '',
//             description: data.description || '',
//             price: data.price ? data.price.toString() : '',
//             virtualVisitePrice: data.virtualVisitePrice ? data.virtualVisitePrice.toString() : '',
//             physicalVistePrice: data.physicalVistePrice ? data.physicalVistePrice.toString() : '',
//             category: data.category || '',
//             location: data.location?.display_name || data.location || '',
//             address: data.address || '',
//             coordinates: data.coordinates || null,
//           });
//           setMedia({
//             images: data.imageUrls || [],
//             videos: data.videoUrls || []
//           });
//         } else {
//           Alert.alert('Erreur', 'Annonce non trouvée');
//           navigation.goBack();
//         }
//       } catch (error) {
//         console.error("Error fetching listing:", error);
//         Alert.alert('Erreur', 'Impossible de charger l\'annonce.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchListing();
//   }, [listingId]);

//   const handleChange = (name, value) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const pickMedia = async (type) => {
//     if (type === 'image' && media.images.length >= 5) {
//       Alert.alert('Maximum atteint', 'Vous ne pouvez ajouter que 5 images maximum.');
//       return;
//     }

//     if (type === 'video' && media.videos.length >= 2) {
//       Alert.alert('Maximum atteint', 'Vous ne pouvez ajouter que 2 vidéos maximum.');
//       return;
//     }

//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: type === 'image' 
//         ? ImagePicker.MediaTypeOptions.Images 
//         : ImagePicker.MediaTypeOptions.Videos,
//       allowsEditing: type === 'image',
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const asset = result.assets[0];
//       if (type === 'image') {
//         setMedia(prev => ({
//           ...prev,
//           images: [...prev.images, asset.uri]
//         }));
//       } else {
//         try {
//           const { uri: thumbnailUri } = await VideoThumbnails.getThumbnailAsync(
//             asset.uri,
//             { time: 1000 }
//           );
//           setMedia(prev => ({
//             ...prev,
//             videos: [...prev.videos, { uri: asset.uri, thumbnail: thumbnailUri }]
//           }));
//         } catch (e) {
//           console.error("Erreur de génération de miniature:", e);
//           setMedia(prev => ({
//             ...prev,
//             videos: [...prev.videos, { uri: asset.uri, thumbnail: null }]
//           }));
//         }
//       }
//     }
//   };

//   const removeMedia = (type, index) => {
//     if (type === 'image') {
//       setMedia(prev => ({
//         ...prev,
//         images: prev.images.filter((_, i) => i !== index)
//       }));
//     } else {
//       setMedia(prev => ({
//         ...prev,
//         videos: prev.videos.filter((_, i) => i !== index)
//       }));
//     }
//   };

//   const handleSubmit = async () => {
//     if (!formData.title || !formData.price || !formData.category) {
//       Alert.alert('Champs requis', 'Veuillez remplir le titre, le prix et la catégorie.');
//       return;
//     }

//     setUpdating(true);
//     try {
//       // Gérer l'envoi des images
//       const uploadImagePromises = media.images.map(imgUri => {
//         // Si l'URI commence par 'http', c'est une URL existante, on la garde.
//         if (imgUri.startsWith('http')) {
//           return Promise.resolve(imgUri);
//         }
//         // Sinon, c'est un fichier local à envoyer.
//         return uploadToCloudinary(imgUri, false);
//       });

//       // Gérer l'envoi des vidéos
//       const uploadVideoPromises = media.videos.map(video => {
//         // Si 'video' est une string, c'est une URL existante.
//         if (typeof video === 'string') {
//           return Promise.resolve(video);
//         }
//         // Sinon, c'est un objet { uri, thumbnail }, donc un nouveau fichier.
//         return uploadToCloudinary(video.uri, true);
//       });

//       // Attendre que tous les envois soient terminés en parallèle
//       const [imageUrls, videoUrls] = await Promise.all([
//         Promise.all(uploadImagePromises),
//         Promise.all(uploadVideoPromises),
//       ]);

//       // Mettre à jour le document dans Firestore
//       const listingRef = doc(db, 'posts', listingId);
//       await updateDoc(listingRef, {
//         ...formData,
//         price: parseInt(formData.price, 10), // Assurer que le prix est un nombre
//         imageUrls,
//         videoUrls,
//         updatedAt: new Date(),
//       });

//       Alert.alert('Succès', 'Annonce mise à jour avec succès !');
//       navigation.goBack();

//     } catch (error) {
//       console.error("Erreur lors de la mise à jour:", error);
//       Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de la mise à jour.');
//     } finally {
//       setUpdating(false);
//     }
//   };


//   // --- Fonctions de localisation (inchangées) ---
//   // const handleLocationSearch = async (text) => {
//   //   handleChange('location', text);
//   //   if (text.length > 2) {
//   //     setIsFetchingLocation(true);
//   //     try {
//   //       const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&addressdetails=1&limit=5`);
//   //       const data = await response.json();
//   //       setLocationSuggestions(data || []);
//   //     } catch (error) {
//   //       console.error("Location search error:", error);
//   //     } finally {
//   //       setIsFetchingLocation(false);
//   //     }
//   //   } else {
//   //     setLocationSuggestions([]);
//   //   }
//   // };

//   // const handleCurrentLocation = async () => {
//   //   setIsFetchingLocation(true);
//   //   try {
//   //     let { status } = await Location.requestForegroundPermissionsAsync();
//   //     if (status !== 'granted') {
//   //       Alert.alert('Permission requise', 'Accès à la localisation refusé.');
//   //       return;
//   //     }
//   //     const position = await Location.getCurrentPositionAsync({});
//   //     const [address] = await Location.reverseGeocodeAsync(position.coords);
//   //     if (address) {
//   //       const formattedAddress = [address.streetNumber, address.street, address.city, address.country].filter(Boolean).join(', ');
//   //       handleChange('location', formattedAddress);
//   //       handleChange('coordinates', { latitude: position.coords.latitude, longitude: position.coords.longitude });
//   //       setLocationSuggestions([]);
//   //     }
//   //   } catch (error) {
//   //     Alert.alert('Erreur', 'Impossible d\'obtenir la position.');
//   //   } finally {
//   //     setIsFetchingLocation(false);
//   //   }
//   // };
// // 


//   const handleSelectLocation = (item) => {
//     handleChange('location', item.display_name);
//     handleChange('coordinates', { latitude: parseFloat(item.lat), longitude: parseFloat(item.lon) });
//     setLocationSuggestions([]);
//   };
  
//   // --- Fonctions de rendu (inchangées) ---
//   const renderMediaItem = ({ item, index, type }) => {
//     let sourceUri, isVideo;

//     if (type === 'image') {
//       sourceUri = item; // item est une string (URI/URL)
//       isVideo = false;
//     } else {
//       // item peut être une string (URL existante) ou un objet (nouveau fichier)
//       sourceUri = typeof item === 'string' ? item : item.thumbnail;
//       isVideo = true;
//     }

//     return (
//       <View style={styles.mediaContainer}>
//         <Image 
//             source={{ uri: sourceUri || 'https://via.placeholder.com/300' }} 
//             style={styles.media} 
//         />
//         {isVideo && (
//           <View style={styles.videoOverlay}>
//             <FontAwesome name="play-circle" size={24} color="rgba(255,255,255,0.8)" />
//           </View>
//         )}
//         <TouchableOpacity 
//           style={styles.removeMediaButton}
//           onPress={() => removeMedia(type, index)}
//         >
//           <Ionicons name="close" size={16} color={COLORS.white} />
//         </TouchableOpacity>
//       </View>
//     );
//   };
  
//   if (loading) {
//     return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
//   }
//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#1E293B" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Modifier l'annonce</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
//         {/* Section Médias */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Médias</Text>
//           <Text style={styles.sectionSubtitle}>Ajoutez des photos et vidéos de qualité</Text>
          
//           <View style={styles.mediaSection}>
//             <Text style={styles.mediaSectionLabel}>Photos ({media.images.length}/5)</Text>
//             <FlatList
//               horizontal
//               data={media.images}
//               renderItem={({ item, index }) => renderMediaItem({ item, index, type: 'image' })}
//               keyExtractor={(item, index) => `image-${index}-${item}`}
//               contentContainerStyle={styles.mediaList}
//               ListFooterComponent={
//                 media.images.length < 5 && (
//                   <TouchableOpacity style={styles.addMediaButton} onPress={() => pickMedia('image')}>
//                     <Ionicons name="camera" size={24} color="#3B82F6" />
//                     <Text style={styles.addMediaText}>Ajouter</Text>
//                   </TouchableOpacity>
//                 )
//               }
//             />
//           </View>
          
//           <View style={styles.mediaSection}>
//             <Text style={styles.mediaSectionLabel}>Vidéos ({media.videos.length}/2)</Text>
//             <FlatList
//               horizontal
//               data={media.videos}
//               renderItem={({ item, index }) => renderMediaItem({ item, index, type: 'video' })}
//               keyExtractor={(item, index) => `video-${index}-${typeof item === 'string' ? item : item.uri}`}
//               contentContainerStyle={styles.mediaList}
//               ListFooterComponent={
//                 media.videos.length < 2 && (
//                   <TouchableOpacity style={styles.addMediaButton} onPress={() => pickMedia('video')}>
//                     <Ionicons name="videocam" size={24} color="#3B82F6" />
//                     <Text style={styles.addMediaText}>Ajouter</Text>
//                   </TouchableOpacity>
//                 )
//               }
//             />
//           </View>
//         </View>

//         {/* Section Informations */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Informations</Text>
          
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//               Titre <Text style={styles.requiredLabel}>*</Text>
//             </Text>
//             <TextInput 
//               style={styles.input} 
//               value={formData.title} 
//               onChangeText={(text) => handleChange('title', text)} 
//               placeholder="Ex: Magnifique studio meublé au cœur de la ville"
//             />
//           </View>
          
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Description</Text>
//             <TextInput 
//               style={[styles.input, styles.multilineInput]} 
//               value={formData.description} 
//               onChangeText={(text) => handleChange('description', text)} 
//               placeholder="Décrivez en détail votre bien..."
//               multiline 
//             />
//           </View>
          
//           <View style={styles.inputRow}>
//             <View style={[styles.inputColumn, styles.inputContainer]}>
//               <Text style={styles.label}>
//                 Prix (FCFA) <Text style={styles.requiredLabel}>*</Text>
//               </Text>
//               <TextInput 
//                 style={styles.input} 
//                 value={formData.price} 
//                 onChangeText={(text) => handleChange('price', text)} 
//                 placeholder="Ex: 150000" 
//                 keyboardType="numeric" 
//               />
//             </View>

//             <View style={[styles.inputColumn, styles.lastInputColumn, styles.inputContainer]}>
//               <Text style={styles.label}>
//                 Catégorie <Text style={styles.requiredLabel}>*</Text>
//               </Text>
//               <View style={styles.pickerContainer}>
//                 <RNPickerSelect 
//                   onValueChange={(value) => handleChange('category', value)} 
//                   items={CATEGORIES} 
//                   value={formData.category} 
//                   placeholder={{ label: 'Sélectionnez...', value: null }} 
//                   style={pickerSelectStyles} 
//                 />
//               </View>
//             </View>
//           </View>

//           <View style={styles.inputRow}>
//             <View style={[styles.inputColumn, styles.inputContainer]}>
//               <Text style={styles.label}>Visite virtuelle (FCFA)</Text>
//               <TextInput 
//                 style={styles.input} 
//                 value={formData.virtualVisitePrice} 
//                 onChangeText={(text) => handleChange('virtualVisitePrice', text)} 
//                 placeholder="Ex: 5000" 
//                 keyboardType="numeric" 
//               />
//             </View>

//             <View style={[styles.inputColumn, styles.lastInputColumn, styles.inputContainer]}>
//               <Text style={styles.label}>Visite physique (FCFA)</Text>
//               <TextInput 
//                 style={styles.input} 
//                 value={formData.physicalVistePrice} 
//                 onChangeText={(text) => handleChange('physicalVistePrice', text)} 
//                 placeholder="Ex: 10000" 
//                 keyboardType="numeric" 
//               />
//             </View>
//           </View>
//         </View>

//         {/* Section Localisation */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Localisation</Text>
          
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Adresse complète</Text>
//             <TextInput 
//               style={styles.input} 
//               value={formData.address} 
//               onChangeText={(text) => handleChange('address', text)} 
//               placeholder="Ex: 123 Rue de la Paix, Immeuble Liberté"
//             />
//           </View>
          
//           <View style={styles.inputContainer}>
//             <View style={styles.locationHeader}>
//               <Text style={styles.label}>
//                 Ville/Quartier <Text style={styles.requiredLabel}>*</Text>
//               </Text>
//               <TouchableOpacity style={styles.currentLocationButton} onPress={handleCurrentLocation}>
//                 <MaterialIcons name="my-location" size={16} color="#3B82F6" />
//                 <Text style={styles.currentLocationText}>Ma position</Text>
//               </TouchableOpacity>
//             </View>
//             <TextInput 
//               style={styles.input} 
//               value={formData.location} 
//               onChangeText={handleLocationSearch} 
//               placeholder="Ex: Cotonou, Akpakpa"
//             />
//             {isFetchingLocation && (
//               <ActivityIndicator 
//                 size="small" 
//                 color="#3B82F6" 
//                 style={{ position: 'absolute', right: 16, top: 44 }}
//               />
//             )}
//             {locationSuggestions.length > 0 && (
//               <View style={styles.suggestionsContainer}>
//                 {locationSuggestions.map((item, index) => (
//                   <TouchableOpacity 
//                     key={`loc-${index}`} 
//                     style={styles.suggestionItem} 
//                     onPress={() => handleSelectLocation(item)}
//                   >
//                     <MaterialIcons name="location-on" size={16} color="#64748B" />
//                     <Text style={styles.suggestionText} numberOfLines={1}>
//                       {item.display_name}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//           </View>
//         </View>

//         <TouchableOpacity 
//           style={styles.submitButton} 
//           onPress={handleSubmit} 
//           disabled={updating}
//         >
//           {updating ? (
//             <ActivityIndicator color="#FFFFFF" />
//           ) : (
//             <Text style={styles.submitButtonText}>Mettre à jour l'annonce</Text>
//           )}
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// };

// export default EditListingScreen;