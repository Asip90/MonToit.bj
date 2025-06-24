// hooks/useCloudinaryUpload.js
import { useState } from 'react';
// import {CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET}from '../src/api/CloudinaryConfig'
// Tes infos Cloudinary (idéalement, elles viendraient de variables d'environnement ou d'une config)
const CLOUDINARY_CLOUD_NAME = "dfpxwlhu0"
const CLOUDINARY_UPLOAD_PRESET  =  "My_ROOMAPP_Media_file"
const useCloudinaryUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const uploadImage = async (uri) => {
    if (!uri) {
      setUploadError("Aucun URI d'image fourni.");
      return null;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadedImageUrl(null);

    const formData = new FormData();
    let filename = uri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    formData.append('file', { uri: uri, name: filename, type });
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    console.log("useCloudinaryUpload: Préparation de l'envoi à Cloudinary...");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const data = await response.json();
      console.log("useCloudinaryUpload: Réponse de Cloudinary:", data);

      if (response.ok && data.secure_url) {
        setUploadedImageUrl(data.secure_url);
        setIsUploading(false);
        return data.secure_url; // Retourne l'URL directement en cas de succès
      } else {
        const errorMsg = data.error?.message || "Erreur lors de l'envoi à Cloudinary.";
        console.error("useCloudinaryUpload: Erreur Cloudinary:", errorMsg, data);
        setUploadError(errorMsg);
        setIsUploading(false);
        return null; // Retourne null en cas d'erreur
      }
    } catch (error) {
      console.error("useCloudinaryUpload: Erreur pendant l'envoi:", error);
      setUploadError(error.message || "Une erreur réseau est survenue.");
      setIsUploading(false);
      return null; // Retourne null en cas d'erreur
    }
  };

  // Le hook retourne la fonction pour envoyer, et les états utiles
  return {
    uploadImage,        // La fonction à appeler pour envoyer une image
    isUploading,        // Pour savoir si un envoi est en cours
    uploadError,        // Pour afficher un message d'erreur si besoin
    uploadedImageUrl,   // L'URL de la dernière image envoyée avec succès (peut être utile)
    resetUploadState: () => { // Pour réinitialiser l'état si besoin après un envoi
        setIsUploading(false);
        setUploadError(null);
        setUploadedImageUrl(null);
    }
  };
};

export default useCloudinaryUpload;