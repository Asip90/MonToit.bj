

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Alert,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import RNPickerSelect from 'react-native-picker-select';
import * as VideoThumbnails from 'expo-video-thumbnails';

import { COLORS, SIZES, FONTS } from '../../constants/Theme';
import { db } from '../../src/api/FirebaseConfig'; // Uniquement db, storage est retiré
import { doc, getDoc, updateDoc } from 'firebase/firestore';

// --- Début de la configuration et fonction Cloudinary ---
const CLOUDINARY_CLOUD_NAME = "dfpxwlhu0";
const UPLOAD_PRESET_NAME = "My_ROOMAPP_Media_file";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

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

  try {
    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
      // Il est important de ne PAS mettre 'Content-Type': 'multipart/form-data'
      // car fetch le configure automatiquement avec la bonne boundary.
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur Cloudinary:', errorData.error.message);
      throw new Error(`Échec de l'envoi sur Cloudinary: ${errorData.error.message}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Erreur lors de l'envoi à Cloudinary:", error);
    throw new Error("L'envoi du fichier a échoué. Vérifiez votre connexion.");
  }
};
// --- Fin de la configuration et fonction Cloudinary ---

const CATEGORIES = [
  { label: 'Chambre Simple', value: 'chambre' },
  { label: 'Studio', value: 'studio' },
  { label: 'Appartement', value: 'appartement' },
  { label: 'Maison', value: 'maison' },
  { label: 'Terrain', value: 'terrain' },
  { label: 'Commercial', value: 'commercial' },
];

const EditListingScreen = ({ route, navigation }) => {
  const { listingId } = route.params;
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [media, setMedia] = useState({
    images: [],
    videos: [] // Peut contenir des strings (URLs) ou des objets (nouveaux fichiers)
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    address: '',
    coordinates: null,
  });
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const docRef = doc(db, 'posts', listingId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            title: data.title || '',
            description: data.description || '',
            price: data.price ? data.price.toString() : '',
            category: data.category || '',
            location: data.location?.display_name || data.location || '',
            address: data.address || '',
            coordinates: data.coordinates || null,
          });
          setMedia({
            images: data.imageUrls || [],
            videos: data.videoUrls || []
          });
        } else {
          Alert.alert('Erreur', 'Annonce non trouvée');
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
        Alert.alert('Erreur', 'Impossible de charger l\'annonce.');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const pickMedia = async (type) => {
    if (type === 'image' && media.images.length >= 5) {
      Alert.alert('Maximum atteint', 'Vous ne pouvez ajouter que 5 images maximum.');
      return;
    }

    if (type === 'video' && media.videos.length >= 2) {
      Alert.alert('Maximum atteint', 'Vous ne pouvez ajouter que 2 vidéos maximum.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'image' 
        ? ImagePicker.MediaTypeOptions.Images 
        : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: type === 'image',
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      if (type === 'image') {
        setMedia(prev => ({
          ...prev,
          images: [...prev.images, asset.uri]
        }));
      } else {
        try {
          const { uri: thumbnailUri } = await VideoThumbnails.getThumbnailAsync(
            asset.uri,
            { time: 1000 }
          );
          setMedia(prev => ({
            ...prev,
            videos: [...prev.videos, { uri: asset.uri, thumbnail: thumbnailUri }]
          }));
        } catch (e) {
          console.error("Erreur de génération de miniature:", e);
          setMedia(prev => ({
            ...prev,
            videos: [...prev.videos, { uri: asset.uri, thumbnail: null }]
          }));
        }
      }
    }
  };

  const removeMedia = (type, index) => {
    if (type === 'image') {
      setMedia(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } else {
      setMedia(prev => ({
        ...prev,
        videos: prev.videos.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.price || !formData.category) {
      Alert.alert('Champs requis', 'Veuillez remplir le titre, le prix et la catégorie.');
      return;
    }

    setUpdating(true);
    try {
      // Gérer l'envoi des images
      const uploadImagePromises = media.images.map(imgUri => {
        // Si l'URI commence par 'http', c'est une URL existante, on la garde.
        if (imgUri.startsWith('http')) {
          return Promise.resolve(imgUri);
        }
        // Sinon, c'est un fichier local à envoyer.
        return uploadToCloudinary(imgUri, false);
      });

      // Gérer l'envoi des vidéos
      const uploadVideoPromises = media.videos.map(video => {
        // Si 'video' est une string, c'est une URL existante.
        if (typeof video === 'string') {
          return Promise.resolve(video);
        }
        // Sinon, c'est un objet { uri, thumbnail }, donc un nouveau fichier.
        return uploadToCloudinary(video.uri, true);
      });

      // Attendre que tous les envois soient terminés en parallèle
      const [imageUrls, videoUrls] = await Promise.all([
        Promise.all(uploadImagePromises),
        Promise.all(uploadVideoPromises),
      ]);

      // Mettre à jour le document dans Firestore
      const listingRef = doc(db, 'posts', listingId);
      await updateDoc(listingRef, {
        ...formData,
        price: parseInt(formData.price, 10), // Assurer que le prix est un nombre
        imageUrls,
        videoUrls,
        updatedAt: new Date(),
      });

      Alert.alert('Succès', 'Annonce mise à jour avec succès !');
      navigation.goBack();

    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      Alert.alert('Erreur', error.message || 'Une erreur est survenue lors de la mise à jour.');
    } finally {
      setUpdating(false);
    }
  };


  // --- Fonctions de localisation (inchangées) ---
  const handleLocationSearch = async (text) => {
    handleChange('location', text);
    if (text.length > 2) {
      setIsFetchingLocation(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&addressdetails=1&limit=5`);
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
        Alert.alert('Permission requise', 'Accès à la localisation refusé.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      const [address] = await Location.reverseGeocodeAsync(position.coords);
      if (address) {
        const formattedAddress = [address.streetNumber, address.street, address.city, address.country].filter(Boolean).join(', ');
        handleChange('location', formattedAddress);
        handleChange('coordinates', { latitude: position.coords.latitude, longitude: position.coords.longitude });
        setLocationSuggestions([]);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'obtenir la position.');
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handleSelectLocation = (item) => {
    handleChange('location', item.display_name);
    handleChange('coordinates', { latitude: parseFloat(item.lat), longitude: parseFloat(item.lon) });
    setLocationSuggestions([]);
  };
  
  // --- Fonctions de rendu (inchangées) ---
  const renderMediaItem = ({ item, index, type }) => {
    let sourceUri, isVideo;

    if (type === 'image') {
      sourceUri = item; // item est une string (URI/URL)
      isVideo = false;
    } else {
      // item peut être une string (URL existante) ou un objet (nouveau fichier)
      sourceUri = typeof item === 'string' ? item : item.thumbnail;
      isVideo = true;
    }

    return (
      <View style={styles.mediaContainer}>
        <Image 
            source={{ uri: sourceUri || 'https://via.placeholder.com/300' }} 
            style={styles.media} 
        />
        {isVideo && (
          <View style={styles.videoOverlay}>
            <FontAwesome name="play-circle" size={24} color="rgba(255,255,255,0.8)" />
          </View>
        )}
        <TouchableOpacity 
          style={styles.removeMediaButton}
          onPress={() => removeMedia(type, index)}
        >
          <Ionicons name="close" size={16} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    );
  };
  
  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier l'annonce</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Médias</Text>
        <Text style={styles.sectionSubtitle}>Jusqu'à 5 photos et 2 vidéos</Text>
        
        <Text style={styles.mediaSectionLabel}>Photos ({media.images.length}/5)</Text>
        <FlatList
          horizontal
          data={media.images}
          renderItem={({ item, index }) => renderMediaItem({ item, index, type: 'image' })}
          keyExtractor={(item, index) => `image-${index}-${item}`}
          contentContainerStyle={styles.mediaList}
          ListFooterComponent={
            media.images.length < 5 && (
              <TouchableOpacity style={styles.addMediaButton} onPress={() => pickMedia('image')}>
                <Ionicons name="camera" size={24} color={COLORS.primary} />
                <Text style={styles.addMediaText}>Ajouter</Text>
              </TouchableOpacity>
            )
          }
        />
        
        <Text style={styles.mediaSectionLabel}>Vidéos ({media.videos.length}/2)</Text>
        <FlatList
          horizontal
          data={media.videos}
          renderItem={({ item, index }) => renderMediaItem({ item, index, type: 'video' })}
          keyExtractor={(item, index) => `video-${index}-${typeof item === 'string' ? item : item.uri}`}
          contentContainerStyle={styles.mediaList}
          ListFooterComponent={
            media.videos.length < 2 && (
              <TouchableOpacity style={styles.addMediaButton} onPress={() => pickMedia('video')}>
                <Ionicons name="videocam" size={24} color={COLORS.primary} />
                <Text style={styles.addMediaText}>Ajouter</Text>
              </TouchableOpacity>
            )
          }
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Titre*</Text>
          <TextInput style={styles.input} value={formData.title} onChangeText={(text) => handleChange('title', text)} placeholder="Titre de l'annonce" />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, styles.multilineInput]} value={formData.description} onChangeText={(text) => handleChange('description', text)} placeholder="Décrivez votre bien..." multiline />
        </View>
        
        <View style={styles.inputRow}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Prix (FCFA)*</Text>
            <TextInput style={styles.input} value={formData.price} onChangeText={(text) => handleChange('price', text)} placeholder="Prix" keyboardType="numeric" />
          </View>
          
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>Catégorie*</Text>
            <View style={styles.pickerContainer}>
              <RNPickerSelect onValueChange={(value) => handleChange('category', value)} items={CATEGORIES} value={formData.category} placeholder={{ label: 'Sélectionnez...', value: null }} style={pickerSelectStyles} />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Localisation</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Adresse</Text>
          <TextInput style={styles.input} value={formData.address} onChangeText={(text) => handleChange('address', text)} placeholder="Adresse détaillée" />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.locationHeader}>
            <Text style={styles.label}>Ville / Quartier*</Text>
            <TouchableOpacity style={styles.currentLocationButton} onPress={handleCurrentLocation}>
              <MaterialIcons name="my-location" size={16} color={COLORS.primary} />
              <Text style={styles.currentLocationText}>Ma position</Text>
            </TouchableOpacity>
          </View>
          <TextInput style={styles.input} value={formData.location} onChangeText={handleLocationSearch} placeholder="Rechercher une ville, quartier..." />
          {isFetchingLocation && <View style={styles.locationLoading}><ActivityIndicator size="small" color={COLORS.primary} /></View>}
          {locationSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {locationSuggestions.map((item, index) => (
                <TouchableOpacity key={`loc-${index}`} style={styles.suggestionItem} onPress={() => handleSelectLocation(item)}>
                  <MaterialIcons name="location-on" size={16} color={COLORS.gray} />
                  <Text style={styles.suggestionText} numberOfLines={1}>{item.display_name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={updating}>
        {updating ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.submitButtonText}>Mettre à jour</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

// --- Styles (inchangés) ---
const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.lightGray },
  container: { flex: 1, backgroundColor: COLORS.lightGray, paddingHorizontal: SIZES.padding },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: SIZES.padding, },
  headerTitle: { ...FONTS.h3, fontWeight: 'bold' },
  section: { backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: SIZES.padding, marginBottom: SIZES.padding, },
  sectionTitle: { ...FONTS.h4, fontWeight: 'bold', marginBottom: 5 },
  sectionSubtitle: { ...FONTS.body4, color: COLORS.gray, marginBottom: 15 },
  mediaSectionLabel: { ...FONTS.body3, fontWeight: '600', color: COLORS.darkgray, marginTop: 10, marginBottom: 5 },
  mediaList: { paddingVertical: 10 },
  addMediaButton: { width: 100, height: 100, borderRadius: SIZES.radius, backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.gray, borderStyle: 'dashed' },
  addMediaText: { ...FONTS.body5, color: COLORS.primary, marginTop: 5 },
  mediaContainer: { marginRight: 10, position: 'relative' },
  media: { width: 100, height: 100, borderRadius: SIZES.radius },
  removeMediaButton: { position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', },
  videoOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', },
  inputContainer: { marginBottom: 15 },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { ...FONTS.body3, color: COLORS.darkgray, marginBottom: 8, fontWeight: '500' },
  input: { height: 50, borderColor: COLORS.border, borderWidth: 1, borderRadius: SIZES.radius, paddingHorizontal: 15, backgroundColor: COLORS.lightGray, ...FONTS.body3 },
  multilineInput: { height: 100, textAlignVertical: 'top', paddingTop: 15 },
  pickerContainer: { borderColor: COLORS.border, borderWidth: 1, borderRadius: SIZES.radius, backgroundColor: COLORS.lightGray, justifyContent: 'center', height: 50 },
  locationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  currentLocationButton: { flexDirection: 'row', alignItems: 'center', padding: 5 },
  currentLocationText: { ...FONTS.body4, color: COLORS.primary, marginLeft: 5 },
  locationLoading: { position: 'absolute', right: 15, top: 45 },
  suggestionsContainer: { backgroundColor: COLORS.white, borderRadius: SIZES.radius, marginTop: 5, borderWidth: 1, borderColor: COLORS.border },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: COLORS.border, },
  suggestionText: { ...FONTS.body4, marginLeft: 10, flexShrink: 1 },
  submitButton: { backgroundColor: COLORS.primary, padding: 15, borderRadius: SIZES.radius, alignItems: 'center', marginVertical: 20, },
  submitButtonText: { ...FONTS.h4, color: COLORS.white, fontWeight: 'bold' },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default EditListingScreen;