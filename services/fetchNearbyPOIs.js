// utils/poiService.js
export const fetchNearbyPOIs = async (lat, lng) => {
  try {
    const categories = [
      'amenity=police',
      'amenity=school',
      'amenity=pharmacy',
      'shop=supermarket',
      'amenity=hospital'
    ];

    const radius = 1000; // 1km
    const query = `[out:json];
      (
        ${categories.map(cat => `node[${cat}](around:${radius},${lat},${lng});`).join('\n')}
      );
      out body;`;

    const response = await fetch(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
    );

    const data = await response.json();
    return data.elements || [];
    
  } catch (error) {
    console.error('Erreur POI:', error);
    return [];
  }
};