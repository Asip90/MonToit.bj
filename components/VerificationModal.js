import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  ActivityIndicator 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../../constants/Theme';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../src/api/FirebaseConfig';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';

const VerificationModal = ({ visible, onClose, userId, onSubmissionSuccess }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 2],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage || !userId) return;

    setUploading(true);
    
    try {
      // Upload de l'image
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const storageRef = ref(storage, `verifications/${userId}/${Date.now()}_idCard.jpg`);
      
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Enregistrement dans Firestore
      await addDoc(collection(db, 'verificationRequests'), {
        userId,
        idCardUrl: downloadURL,
        status: 'pending',
        createdAt: new Date(),
      });

      // Mettre à jour le statut de l'utilisateur
      await setDoc(doc(db, 'users', userId), {
        verificationStatus: 'en_attente'
      }, { merge: true });

      onSubmissionSuccess();
      onClose();
      Alert.alert("Succès", "Votre demande a été soumise avec succès");

    } catch (error) {
      console.error("Erreur de soumission:", error);
      Alert.alert("Erreur", "Une erreur s'est produite lors de la soumission");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Vérification d'identité</Text>
          
          <Text style={styles.modalText}>
            Veuillez uploader une photo claire de l'une de ces pièces :
          </Text>
          
          <Text style={styles.idTypes}>
            • Carte d'identité • Passeport • Certificat d'identification (CIP)
          </Text>

          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.idCardImage} />
          ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Ionicons name="cloud-upload-outline" size={50} color={COLORS.primary} />
              <Text style={styles.uploadButtonText}>Sélectionner une pièce d'identité</Text>
            </TouchableOpacity>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onClose}
              disabled={uploading}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit}
              disabled={!selectedImage || uploading}
            >
              {uploading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>Soumettre</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    ...FONTS.h3,
    marginBottom: 15,
    color: COLORS.black,
  },
  modalText: {
    ...FONTS.body4,
    textAlign: 'center',
    marginBottom: 10,
  },
  idTypes: {
    ...FONTS.body4,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  idCardImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'contain',
    backgroundColor: COLORS.lightGray,
  },
  uploadButton: {
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  uploadButtonText: {
    ...FONTS.body4,
    color: COLORS.primary,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: COLORS.gray,
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  submitButtonText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default VerificationModal;