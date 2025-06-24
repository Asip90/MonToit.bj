
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';

import { UserContext } from '../../../context/AuthContext';
import { db } from '../../../src/api/FirebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import useCloudinaryUpload from '../../../hook/uploadToCloudinary';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../../constants/Theme';

const EditProfileScreen = ({ route, navigation }) => {
  const { userData, setUserDataInContext } = useContext(UserContext);
  const { currentUserProfile } = route.params || {};

  // États avec valeurs par défaut plus robustes
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [newImageSelected, setNewImageSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    uploadImage: uploadProfilePicToCloudinary,
    isUploading: isImageUploading,
    uploadError: imageUploadError,
    resetUploadState: resetImageUploadState,
  } = useCloudinaryUpload();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (currentUserProfile) {
          // Initialisation des états avec les données existantes
          setName(currentUserProfile.name || '');
          setSurname(currentUserProfile.surname || '');
          setEmail(currentUserProfile.email || '');
          setPhoneNumber(currentUserProfile.phoneNumber || '');
          setProfileImageUri(currentUserProfile.photoURL || null);
        } else if (userData?.uid) {
          // Fallback: charger depuis Firestore si currentUserProfile n'est pas passé
          const userDocRef = doc(db, 'users', userData.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setName(data.name || '');
            setSurname(data.surname || '');
            setEmail(data.email || '');
            setPhoneNumber(data.phoneNumber || '');
            setProfileImageUri(data.photoURL || null);
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur:", error);
        Alert.alert("Erreur", "Impossible de charger les informations du profil");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [currentUserProfile, userData]);

  const handleChooseImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Refusée", "Accès à la galerie requis.");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!pickerResult.canceled && pickerResult.assets?.length > 0) {
      setNewImageSelected(pickerResult.assets[0].uri);
      setProfileImageUri(pickerResult.assets[0].uri);
      resetImageUploadState();
    }
  };

  const handleSaveChanges = async () => {
    if (!userData?.uid) {
      Alert.alert("Erreur", "Utilisateur non identifié.");
      return;
    }

    if (!name.trim() || !surname.trim()) {
      Alert.alert("Champs Requis", "Le nom et le prénom sont requis.");
      return;
    }

    setIsSaving(true);
    let newPhotoURL = profileImageUri;

    try {
      if (newImageSelected) {
        const cloudinaryUrl = await uploadProfilePicToCloudinary(newImageSelected);
        if (cloudinaryUrl) {
          newPhotoURL = cloudinaryUrl;
        } else {
          Alert.alert("Erreur Photo", `La nouvelle photo n'a pas pu être envoyée: ${imageUploadError || "Erreur inconnue"}`);
          setIsSaving(false);
          return;
        }
      }

      const updatedProfileData = {
        name: name.trim(),
        surname: surname.trim(),
        phoneNumber: phoneNumber.trim(),
        photoURL: newPhotoURL,
      };

      const userDocRef = doc(db, 'users', userData.uid);
      await updateDoc(userDocRef, updatedProfileData);

      if (setUserDataInContext) {
        const updatedUserForContext = { ...userData, ...updatedProfileData };
        setUserDataInContext(updatedUserForContext);
      }

      Alert.alert("Succès", "Votre profil a été mis à jour !");
      navigation.goBack();

    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la sauvegarde.");
    } finally {
      setIsSaving(false);
      setNewImageSelected(null);
      resetImageUploadState();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.content}>
        {/* Section Photo de Profil */}
        <View style={styles.imagePickerContainer}>
          <TouchableOpacity 
            onPress={handleChooseImage} 
            disabled={isSaving || isImageUploading}
            activeOpacity={0.7}
          >
            {profileImageUri ? (
              <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={SIZES.h1} color={COLORS.gray} />
                <Text style={styles.imagePlaceholderText}>Ajouter une photo</Text>
              </View>
            )}
            <View style={styles.editIconContainer}>
              <Ionicons name="pencil" size={SIZES.h4} color={COLORS.white} />
            </View>
          </TouchableOpacity>
          
          {isImageUploading && (
            <ActivityIndicator 
              size="small" 
              color={COLORS.primary} 
              style={{ marginTop: SIZES.padding / 2 }}
            />
          )}
          {imageUploadError && (
            <Text style={styles.errorTextSmall}>Erreur: {imageUploadError}</Text>
          )}
        </View>

        {/* Champs de Texte */}
        <Text style={styles.label}>Prénom</Text>
        <TextInput
          style={styles.input}
          value={surname}
          onChangeText={setSurname}
          placeholder="Votre prénom"
          editable={!isSaving}
          placeholderTextColor={COLORS.gray}
        />

        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Votre nom"
          editable={!isSaving}
          placeholderTextColor={COLORS.gray}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          value={email}
          placeholder="Votre email"
          editable={false}
          keyboardType="email-address"
          placeholderTextColor={COLORS.gray}
        />

        <Text style={styles.label}>Numéro de téléphone</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="+229 00 00 00 00"
          keyboardType="phone-pad"
          editable={!isSaving}
          placeholderTextColor={COLORS.gray}
        />

        {/* Bouton Enregistrer */}
        <TouchableOpacity
          style={[
            styles.saveButton, 
            (isSaving || isImageUploading) && styles.saveButtonDisabled
          ]}
          onPress={handleSaveChanges}
          disabled={isSaving || isImageUploading}
          activeOpacity={0.8}
        >
          {isSaving || isImageUploading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: SIZES.padding,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: SIZES.padding * 1.5,
    marginTop: SIZES.padding,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  imagePlaceholderText: {
    marginTop: SIZES.base,
    color: COLORS.gray,
    ...FONTS.body4,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: SIZES.base,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  label: {
    ...FONTS.body3,
    color: COLORS.black,
    marginBottom: SIZES.base,
    marginTop: SIZES.padding,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    paddingVertical: Platform.OS === 'ios' ? SIZES.base * 2 : SIZES.base * 1.5,
    ...FONTS.body3,
    borderWidth: 1,
    borderColor: COLORS.white,
    elevation: 2,
    shadowColor: COLORS.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputDisabled: {
    backgroundColor: COLORS.lightGray,
    color: COLORS.gray,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginTop: SIZES.padding * 2,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
  saveButtonText: {
    color: COLORS.white,
    ...FONTS.body3,
    fontWeight: 'bold',
  },
  errorTextSmall: {
    color: 'red',
    ...FONTS.body4,
    textAlign: 'center',
    marginTop: SIZES.base,
  }
});

export default EditProfileScreen;