// // utils/locationUtils.js
// export const getCoordinates = async (location) => {
//     console.log("getCoordinates called with location:", location);
//   // Cas 1: Location est un objet avec lat/lon (nouveau format)
//   if (typeof location === 'object' && location.lat && location.lon) {
//     return {
//       lat: parseFloat(location.lat),
//       lon: parseFloat(location.lon)
//     };
//   }
  
//   // Cas 2: Location est une string (ancien format) - géocodage nécessaire
//   if (typeof location === 'string') {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
//       );
//       const data = await response.json();
      
//       if (data.length > 0) {
//         // Mise à jour dans Firestore pour migration future
//         await updatePostLocationInFirestore(postId, data[0]);
        
//         return {
//           lat: parseFloat(data[0].lat),
//           lon: parseFloat(data[0].lon)
//         };
//       }
//     } catch (error) {
//       console.error("Erreur géocodage:", error);
//     }
//   }
  
//   return null;
// };

// // Fonction pour migrer vers le nouveau format
// const updatePostLocationInFirestore = async (postId, locationData) => {
//   try {
//     await firestore().collection('posts').doc(postId).update({
//       location: {
//         address: {
//           city: locationData.address?.city,
//           country: locationData.address?.country,
//         },
//         lat: locationData.lat,
//         lon: locationData.lon,
//         display_name: locationData.display_name
//       }
//     });
//   } catch (error) {
//     console.log("Migration silencieuse échouée", error);
//   }
// };
// utils/locationUtils.js
export const getCoordinates = async (location) => {
  console.log("Début getCoordinates avec:", location);

  // 1. Vérifier si on a déjà des coordonnées
  if (location?.lat && location?.lon) {
    console.log("Coordonnées existantes trouvées");
    return {
      lat: parseFloat(location.lat),
      lon: parseFloat(location.lon)
    };
  }

  // 2. Géocodage pour les strings
  if (typeof location === 'string') {
    console.log("Tentative de géocodage pour:", location);
    
    try {
      // Version robuste avec timeout et headers
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'MonToit.bj/1.0 (contact@montoit.bj)',
            'Accept-Language': 'fr'
          },
          signal: controller.signal
        }
      );

      clearTimeout(timeout);

      // Vérification cruciale du content-type
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        console.error("Réponse non-JSON:", text.substring(0, 100));
        throw new Error("Réponse serveur invalide");
      }

      const data = await response.json();
    //   console.log("Données Nominatim reçues:", data);

      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          addressDetails: data[0].address
        };
      }
    } catch (error) {
      console.error("Échec géocodage:", error.message);
      // Fallback avec OpenCage
      return await fallbackGeocoding(location);
    }
  }

  console.log("Aucun format de localisation reconnu");
  return null;
};

// Fallback avec OpenCageData
const fallbackGeocoding = async (query) => {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=VOTRE_CLE_OPENCAGE&language=fr&limit=1`
    );
    
    const data = await response.json();
    if (data.results?.length > 0) {
      return {
        lat: data.results[0].geometry.lat,
        lon: data.results[0].geometry.lng,
        addressDetails: data.results[0].components
      };
    }
  } catch (error) {
    console.error("Échec fallback geocoding:", error);
  }
  return null;
};