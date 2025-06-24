// hooks/useCloudinaryVideoUpload.js (Très similaire à useCloudinaryUpload.js)
import { useState } from 'react';

const CLOUDINARY_CLOUD_NAME = "TON_CLOUD_NAME_ICI";
const CLOUDINARY_UPLOAD_PRESET_VIDEO = "TON_UPLOAD_PRESET_POUR_VIDEO_ICI"; // TU DOIS CRÉER UN NOUVEAU PRESET POUR LES VIDÉOS
                                                                       // ou utiliser le même si tu l'as configuré pour accepter les vidéos.
                                                                       // C'est mieux d'avoir un preset dédié pour les vidéos.

const useCloudinaryVideoUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  // ... (autres états si besoin)

  const uploadVideo = async (uri) => {
    setIsUploading(true);
    setUploadError(null);
    const formData = new FormData();
    let filename = uri.split('/').pop();
    // Pour le type, on peut être plus générique ou essayer de le deviner.
    // Cloudinary est assez bon pour détecter le type de fichier.
    let type = 'video/mp4'; // Ou un type plus générique si tu ne sais pas
    const match = /\.(\w+)$/.exec(filename);
    if (match) type = `video/${match[1]}`;


    formData.append('file', { uri: uri, name: filename, type: type });
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET_VIDEO);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`, // Notez '/video/upload'
        { method: 'POST', body: formData, headers: { /* ... */ } }
      );
      const data = await response.json();
      if (response.ok && data.secure_url) {
        setIsUploading(false);
        return data.secure_url;
      } else {
        setUploadError(data.error?.message || "Erreur upload vidéo Cloudinary");
        setIsUploading(false);
        return null;
      }
    } catch (error) {
      setUploadError(error.message || "Erreur réseau upload vidéo.");
      setIsUploading(false);
      return null;
    }
  };

  return { uploadVideo, isUploading, uploadError, /* resetState si besoin */ };
};

export default useCloudinaryVideoUpload;