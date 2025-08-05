
// import React, { useEffect, useState, useCallback } from 'react';
// import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
// import * as WebBrowser from 'expo-web-browser';
// import * as Linking from 'expo-linking';

// const PaymentScreen = ({ route, navigation }) => {
//   const { paymentUrl } = route.params;
//   const [loading, setLoading] = useState(true);
//   const [status, setStatus] = useState(null); // success | failed | null
//   const [error, setError] = useState(null);

//   const handleDeepLink = useCallback(({ url }) => {
//     console.log('🔗 URL de retour :', url);

//     if (url.includes('payment/return')) {
//       WebBrowser.dismissBrowser();
//       const { status: statusFromUrl } = Linking.parse(url).queryParams;

//       if (statusFromUrl === 'success') {
//         setStatus('success');
//       } else {
//         setStatus('failed');
//       }
//     }
//   }, []);

//   const launchBrowser = async () => {
//     try {
//       setLoading(true);
//       await WebBrowser.openBrowserAsync(paymentUrl);
//     } catch (err) {
//       console.error('Erreur WebBrowser:', err);
//       setError("Impossible d'ouvrir la page de paiement");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!paymentUrl || typeof paymentUrl !== 'string') {
//       setError('URL de paiement invalide.');
//       setLoading(false);
//       return;
//     }

//     const subscription = Linking.addEventListener('url', handleDeepLink);
//     launchBrowser();

//     return () => {
//       subscription.remove();
//       WebBrowser.dismissBrowser();
//     };
//   }, [paymentUrl]);

//   const retryPayment = () => {
//     setStatus(null);
//     setError(null);
//     setLoading(true);
//     launchBrowser();
//   };

//   // 💬 Affichage selon l’état
//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={retryPayment}>
//           <Text style={styles.retryText}>Réessayer</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (status === 'success') {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.successText}>🎉 Paiement effectué avec succès !</Text>
//         <TouchableOpacity style={styles.okButton} onPress={() => navigation.goBack()}>
//           <Text style={styles.okText}>OK</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (status === 'failed') {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>❌ Le paiement a échoué ou a été annulé.</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={retryPayment}>
//           <Text style={styles.retryText}>Réessayer</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // Par défaut : chargement
//   return (
//     <View style={styles.container}>
//       {loading && (
//         <>
//           <ActivityIndicator size="large" color="#0000ff" />
//           <Text style={styles.loadingText}>Chargement de la page de paiement...</Text>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     padding: 20,
//   },
//   loadingText: {
//     marginTop: 20,
//     fontSize: 16,
//     color: '#333',
//   },
//   successText: {
//     fontSize: 20,
//     color: 'green',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   errorText: {
//     fontSize: 18,
//     color: 'red',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   retryButton: {
//     backgroundColor: '#007bff',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   retryText: {
//     color: 'white',
//     fontSize: 16,
//   },
//   okButton: {
//     backgroundColor: 'green',
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   okText: {
//     color: 'white',
//     fontSize: 16,
//   },
// });

// export default PaymentScreen;


import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, BackHandler } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

const PaymentScreen = ({ route, navigation }) => {
  const { paymentUrl } = route.params;
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null); // success | failed | canceled
  const [error, setError] = useState(null);
  const [browserOpen, setBrowserOpen] = useState(false);

  // Gestion du bouton retour Android
  useEffect(() => {
    const backAction = () => {
      if (browserOpen) {
        setStatus('canceled');
        return true; // Bloque le retour par défaut
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [browserOpen]);

  // Gestion des deep links
  const handleDeepLink = useCallback(({ url }) => {
    console.log('🔗 Deep link reçu:', url);
    
    if (!url) return;

    // 1. Extraire les paramètres
    const parsedUrl = Linking.parse(url);
    const path = parsedUrl.path || '';
    const queryParams = parsedUrl.queryParams || {};

    // 2. Vérifier si c'est notre URL de retour
    if (path.includes('payment/return')) {
      const { status: paymentStatus } = queryParams;
      
      console.log(`📊 Statut paiement: ${paymentStatus}`);
      
      // 3. Fermer le navigateur et mettre à jour l'état
      WebBrowser.dismissBrowser();
      setBrowserOpen(false);
      
      if (paymentStatus === 'success') {
        setStatus('success');
      } else {
        setStatus('failed');
      }
    }
  }, []);

  // Ouvrir le navigateur de paiement
  const launchBrowser = async () => {
    try {
      // Validation de l'URL
      if (!paymentUrl || typeof paymentUrl !== 'string' || !paymentUrl.startsWith('http')) {
        throw new Error('URL de paiement invalide');
      }

      setLoading(true);
      setBrowserOpen(true);
      setStatus(null);
      setError(null);
      
      // Ajouter l'écouteur AVANT d'ouvrir le navigateur
      const linkingSubscription = Linking.addEventListener('url', handleDeepLink);
      
      // Ouvrir le navigateur
      const result = await WebBrowser.openBrowserAsync(paymentUrl, {
        // Options pour un meilleur UX
        toolbarColor: '#2bb673',
        controlsColor: 'white',
        enableBarCollapsing: true,
      });

      // Si on arrive ici, le navigateur a été fermé manuellement
      if (result.type === 'cancel') {
        setStatus('canceled');
      }

      // Nettoyer
      linkingSubscription.remove();
      
    } catch (err) {
      console.error('🚨 Erreur:', err);
      setError(err.message || "Erreur lors de l'ouverture du navigateur");
    } finally {
      setLoading(false);
      setBrowserOpen(false);
    }
  };

  useEffect(() => {
    launchBrowser();
    
    return () => {
      // Fermer le navigateur si l'écran est démonté
      if (browserOpen) {
        WebBrowser.dismissBrowser();
      }
    };
  }, [paymentUrl]);

  // Réessayer le paiement
  const retryPayment = () => {
    setStatus(null);
    setError(null);
    launchBrowser();
  };

  // Navigation après paiement
  const handleNavigation = () => {
    if (status === 'success') {
      navigation.navigate('ReservationSuccess');
    } else {
      navigation.goBack();
    }
  };

  // 💬 Affichage selon l'état
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={retryPayment}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (status) {
    return (
      <View style={styles.container}>
        {status === 'success' ? (
          <>
            <Text style={styles.successText}>🎉 Paiement effectué avec succès !</Text>
            <Text style={styles.infoText}>Votre réservation est confirmée</Text>
          </>
        ) : status === 'failed' ? (
          <Text style={styles.errorText}>❌ Le paiement a échoué</Text>
        ) : (
          <Text style={styles.errorText}>❌ Paiement annulé</Text>
        )}
        
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            status === 'success' ? styles.successButton : styles.retryButton
          ]} 
          onPress={handleNavigation}
        >
          <Text style={styles.actionButtonText}>
            {status === 'success' ? 'Voir ma réservation' : 'Réessayer'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2bb673" />
      <Text style={styles.loadingText}>Ouverture de la page de paiement...</Text>
      <Text style={styles.noteText}>
        Si la page ne s'ouvre pas automatiquement, vérifiez votre connexion
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
    fontFamily: 'InterMedium',
  },
  noteText: {
    marginTop: 10,
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    maxWidth: 300,
  },
  successText: {
    fontSize: 20,
    color: '#28a745',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'InterSemiBold',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    fontFamily: 'InterRegular',
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'InterSemiBold',
  },
  actionButton: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: '#28a745',
  },
  retryButton: {
    backgroundColor: '#007bff',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'InterSemiBold',
  },
});

export default PaymentScreen;