// LinkingConfiguration.js
import * as Linking from 'expo-linking';

export default {
  prefixes: ['montoitbj://'],
  config: {
    screens: {
      PaymentResult: 'payment/return/:postId', // screen à afficher après retour
    },
  },
};
