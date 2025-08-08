// LinkingConfig.js
import * as Linking from 'expo-linking';


const config = {
  screens: {
    // Configuration existante pour le paiement
    Payment: {
      path: 'payment/return/:reservationId',
      parse: { reservationId: (id) => id },
    },
    
    // Nouvelle configuration pour les annonces
    PostDetail: {
      path: 'PostDetail/:postId',
    },}
};

// Génère le préfixe dev (Expo Go / tunnel / LAN)
const devPrefix = Linking.createURL('/');

export default {
  prefixes: [
    'montoitbj://',  // Custom scheme (prod)
    'https://montoitbj.com', // Domaine futur (à ajouter dès que disponible)
    devPrefix,       // URL dev Expo Go
  ],
  config,
};