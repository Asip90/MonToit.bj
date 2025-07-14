// utils/poiUtils.js
export const getPOIType = (tags) => {
  return tags?.amenity || tags?.shop || tags?.building || 'lieu';
};

// utils/poiUtils.js
export const calculateDistance = (postCoords, poi) => {
  // Vérification des données d'entrée
  if (!postCoords?.lat || !postCoords?.lon || !poi?.lat || !poi?.lon) {
    console.warn('Coordonnées manquantes', { postCoords, poi });
    return '?';
  }

  // Conversion en nombres (au cas où c'est des strings)
  const lat1 = typeof postCoords.lat === 'string' ? parseFloat(postCoords.lat) : postCoords.lat;
  const lon1 = typeof postCoords.lon === 'string' ? parseFloat(postCoords.lon) : postCoords.lon;
  const lat2 = typeof poi.lat === 'string' ? parseFloat(poi.lat) : poi.lat;
  const lon2 = typeof poi.lon === 'string' ? parseFloat(poi.lon) : poi.lon;

  // Formule Haversine
  const R = 6371e3; // Rayon de la Terre en mètres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // Distance en mètres arrondie
};

export const getIconName = (type) => {
  const icons = {
    police: 'shield',
    school: 'school',
    pharmacy: 'medical-bag',
    supermarket: 'cart',
    hospital: 'hospital'
  };
  return icons[type] || 'map-marker';
};