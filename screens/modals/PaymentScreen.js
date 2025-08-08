

// import React, { useEffect, useState, useCallback } from 'react';
// import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, BackHandler } from 'react-native';
// import * as WebBrowser from 'expo-web-browser';
// import * as Linking from 'expo-linking';

// const PaymentScreen = ({ route, navigation }) => {
//   const { paymentUrl } = route.params;
//   const [loading, setLoading] = useState(true);
//   const [status, setStatus] = useState(null); // success | failed | canceled
//   const [error, setError] = useState(null);
//   const [browserOpen, setBrowserOpen] = useState(false);

//   // Gestion du bouton retour Android
//   useEffect(() => {
//     const backAction = () => {
//       if (browserOpen) {
//         setStatus('canceled');
//         return true; // Bloque le retour par défaut
//       }
//       return false;
//     };

//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       backAction
//     );

//     return () => backHandler.remove();
//   }, [browserOpen]);

//   // Gestion des deep links
//   const handleDeepLink = useCallback(({ url }) => {
//     console.log('🔗 Deep link reçu:', url);
    
//     if (!url) return;

//     // 1. Extraire les paramètres
//     const parsedUrl = Linking.parse(url);
//     const path = parsedUrl.path || '';
//     const queryParams = parsedUrl.queryParams || {};

//     // 2. Vérifier si c'est notre URL de retour
//     if (path.includes('payment/return')) {
//       const { status: paymentStatus } = queryParams;
      
//       console.log(`📊 Statut paiement: ${paymentStatus}`);
      
//       // 3. Fermer le navigateur et mettre à jour l'état
//       WebBrowser.dismissBrowser();
//       setBrowserOpen(false);
      
//       if (paymentStatus === 'success') {
//         setStatus('success');
//       } else {
//         setStatus('failed');
//       }
//     }
//   }, []);

//   // Ouvrir le navigateur de paiement
//   const launchBrowser = async () => {
//     try {
//       // Validation de l'URL
//       if (!paymentUrl || typeof paymentUrl !== 'string' || !paymentUrl.startsWith('http')) {
//         throw new Error('URL de paiement invalide');
//       }

//       setLoading(true);
//       setBrowserOpen(true);
//       setStatus(null);
//       setError(null);
      
//       // Ajouter l'écouteur AVANT d'ouvrir le navigateur
//       const linkingSubscription = Linking.addEventListener('url', handleDeepLink);
      
//       // Ouvrir le navigateur
//       const result = await WebBrowser.openBrowserAsync(paymentUrl, {
//         // Options pour un meilleur UX
//         toolbarColor: '#2bb673',
//         controlsColor: 'white',
//         enableBarCollapsing: true,
//       });

//       // Si on arrive ici, le navigateur a été fermé manuellement
//       if (result.type === 'cancel') {
//         setStatus('canceled');
//       }

//       // Nettoyer
//       linkingSubscription.remove();
      
//     } catch (err) {
//       console.error('🚨 Erreur:', err);
//       setError(err.message || "Erreur lors de l'ouverture du navigateur");
//     } finally {
//       setLoading(false);
//       setBrowserOpen(false);
//     }
//   };

//   useEffect(() => {
//     launchBrowser();
    
//     return () => {
//       // Fermer le navigateur si l'écran est démonté
//       if (browserOpen) {
//         WebBrowser.dismissBrowser();
//       }
//     };
//   }, [paymentUrl]);

//   // Réessayer le paiement
//   const retryPayment = () => {
//     setStatus(null);
//     setError(null);
//     launchBrowser();
//   };

//   // Navigation après paiement
//   const handleNavigation = () => {
//     if (status === 'success') {
//       navigation.navigate('ReservationSuccess');
//     } else {
//       navigation.goBack();
//     }
//   };

//   // 💬 Affichage selon l'état
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

//   if (status) {
//     return (
//       <View style={styles.container}>
//         {status === 'success' ? (
//           <>
//             <Text style={styles.successText}>🎉 Paiement effectué avec succès !</Text>
//             <Text style={styles.infoText}>Votre réservation est confirmée</Text>
//           </>
//         ) : status === 'failed' ? (
//           <Text style={styles.errorText}>❌ Le paiement a échoué</Text>
//         ) : (
//           <Text style={styles.errorText}>❌ Paiement annulé</Text>
//         )}
        
//         <TouchableOpacity 
//           style={[
//             styles.actionButton, 
//             status === 'success' ? styles.successButton : styles.retryButton
//           ]} 
//           onPress={handleNavigation}
//         >
//           <Text style={styles.actionButtonText}>
//             {status === 'success' ? 'Voir ma réservation' : 'Réessayer'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <ActivityIndicator size="large" color="#2bb673" />
//       <Text style={styles.loadingText}>Ouverture de la page de paiement...</Text>
//       <Text style={styles.noteText}>
//         Si la page ne s'ouvre pas automatiquement, vérifiez votre connexion
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//     padding: 20,
//   },
//   loadingText: {
//     marginTop: 20,
//     fontSize: 16,
//     color: '#333',
//     fontFamily: 'InterMedium',
//   },
//   noteText: {
//     marginTop: 10,
//     fontSize: 14,
//     color: '#6c757d',
//     textAlign: 'center',
//     maxWidth: 300,
//   },
//   successText: {
//     fontSize: 20,
//     color: '#28a745',
//     textAlign: 'center',
//     marginBottom: 10,
//     fontFamily: 'InterSemiBold',
//   },
//   infoText: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 20,
//     fontFamily: 'InterRegular',
//   },
//   errorText: {
//     fontSize: 18,
//     color: '#dc3545',
//     textAlign: 'center',
//     marginBottom: 20,
//     fontFamily: 'InterSemiBold',
//   },
//   actionButton: {
//     paddingHorizontal: 25,
//     paddingVertical: 12,
//     borderRadius: 8,
//     minWidth: 200,
//     alignItems: 'center',
//   },
//   successButton: {
//     backgroundColor: '#28a745',
//   },
//   retryButton: {
//     backgroundColor: '#007bff',
//   },
//   actionButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontFamily: 'InterSemiBold',
//   },
// });

// export default PaymentScreen;

// import React, { useEffect, useState, useRef } from 'react';
// import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, BackHandler } from 'react-native';
// import * as WebBrowser from 'expo-web-browser';
// import * as Linking from 'expo-linking';

// const PaymentScreen = ({ route, navigation }) => {
//   const { paymentUrl, reservationId } = route.params;
//   const [status, setStatus] = useState(null);
//   const [error, setError] = useState(null);
//   const [isBrowserOpen, setIsBrowserOpen] = useState(false);
//   const isMounted = useRef(true);

//   // Gestion du bouton retour Android
//   useEffect(() => {
//     const backAction = () => {
//       if (isBrowserOpen) {
//         handlePaymentResult('canceled');
//         return true;
//       }
//       return false;
//     };

//     const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
//     return () => backHandler.remove();
//   }, [isBrowserOpen]);

//   // Gestion du cycle de vie du composant
//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//       if (isBrowserOpen) {
//         WebBrowser.dismissBrowser();
//       }
//     };
//   }, []);

//   // Traitement du résultat du paiement
//   const handlePaymentResult = (resultStatus) => {
//     if (!isMounted.current) return;
    
//     WebBrowser.dismissBrowser();
//     setIsBrowserOpen(false);
//     setStatus(resultStatus);
    
//     // Journalisation pour le débogage
//     console.log(`Payment result: ${resultStatus} for reservation: ${reservationId}`);
//   };

//   // Gestion des deep links
//   useEffect(() => {
//     const handleDeepLink = ({ url }) => {
//       console.log('🔗 Deep link reçu:', url);
      
//       if (!url) return;

//       try {
//         const parsed = Linking.parse(url);
//         const path = parsed.path || '';
//         const params = parsed.queryParams || {};

//         if (path.includes('payment/return')) {
//           const paymentStatus = params.status || 'failed';
//           handlePaymentResult(paymentStatus);
//         }
//       } catch (error) {
//         console.error('Erreur de parsing du deep link:', error);
//         handlePaymentResult('failed');
//       }
//     };

//     const subscription = Linking.addEventListener('url', handleDeepLink);
//     return () => subscription.remove();
//   }, []);

//   // Ouvrir le navigateur de paiement
//   const launchPaymentBrowser = async () => {
//     try {
//       // Validation de l'URL
//       if (!paymentUrl || !paymentUrl.startsWith('https')) {
//         throw new Error('URL de paiement invalide ou non sécurisée');
//       }

//       setIsBrowserOpen(true);
//       setStatus(null);
//       setError(null);

//       const result = await WebBrowser.openBrowserAsync(paymentUrl, {
//         toolbarColor: '#2bb673',
//         controlsColor: 'white',
//         enableBarCollapsing: true,
//         presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
//       });

//       // Si l'utilisateur ferme manuellement le navigateur
//       if (result.type === 'cancel' && isMounted.current) {
//         handlePaymentResult('canceled');
//       }
//     } catch (err) {
//       console.error('🚨 Erreur d\'ouverture du navigateur:', err);
//       setError(err.message || "Erreur lors de l'ouverture du navigateur");
//       setIsBrowserOpen(false);
//     }
//   };

//   // Lancer le paiement au montage
//   useEffect(() => {
//     launchPaymentBrowser();
//   }, []);

//   // Réessayer le paiement
//   const retryPayment = () => {
//     launchPaymentBrowser();
//   };

//   // Navigation après paiement
//   const handleNavigation = () => {
//     if (status === 'success') {
//       navigation.navigate('ReservationSuccess', { 
//         reservationId,
//         paymentStatus: status 
//       });
//     } else {
//       navigation.navigate('ReservationDetails', { 
//         reservationId,
//         paymentStatus: status 
//       });
//     }
//   };

//   // Affichage conditionnel
//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={retryPayment}>
//           <Text style={styles.retryText}>Réessayer le paiement</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.backButton} 
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={styles.backButtonText}>Retour</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (status) {
//     return (
//       <View style={styles.container}>
//         {status === 'success' ? (
//           <>
//             <Text style={styles.successText}>🎉 Paiement réussi !</Text>
//             <Text style={styles.infoText}>Votre réservation #${reservationId} est confirmée</Text>
//           </>
//         ) : status === 'failed' ? (
//           <>
//             <Text style={styles.errorText}>❌ Échec du paiement</Text>
//             <Text style={styles.infoText}>Veuillez réessayer ou utiliser un autre moyen de paiement</Text>
//           </>
//         ) : (
//           <>
//             <Text style={styles.warningText}>⏸ Paiement annulé</Text>
//             <Text style={styles.infoText}>Vous avez annulé le processus de paiement</Text>
//           </>
//         )}
        
//         <TouchableOpacity 
//           style={styles.actionButton} 
//           onPress={handleNavigation}
//         >
//           <Text style={styles.actionButtonText}>
//             {status === 'success' 
//               ? 'Voir ma réservation' 
//               : 'Réessayer le paiement'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <ActivityIndicator size="large" color="#2bb673" />
//       <Text style={styles.loadingText}>Connexion au système de paiement...</Text>
      
//       <View style={styles.tipsContainer}>
//         <Text style={styles.tipText}>💡 Conseils :</Text>
//         <Text style={styles.tip}>• Gardez l'application ouverte pendant le paiement</Text>
//         <Text style={styles.tip}>• Vérifiez votre connexion internet</Text>
//         <Text style={styles.tip}>• Ne quittez pas la page de paiement</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//     padding: 20,
//   },
//   loadingText: {
//     marginTop: 20,
//     fontSize: 16,
//     color: '#333',
//     fontFamily: 'InterMedium',
//   },
//   successText: {
//     fontSize: 22,
//     color: '#28a745',
//     textAlign: 'center',
//     marginBottom: 10,
//     fontFamily: 'InterSemiBold',
//   },
//   errorText: {
//     fontSize: 20,
//     color: '#dc3545',
//     textAlign: 'center',
//     marginBottom: 10,
//     fontFamily: 'InterSemiBold',
//   },
//   warningText: {
//     fontSize: 20,
//     color: '#ffc107',
//     textAlign: 'center',
//     marginBottom: 10,
//     fontFamily: 'InterSemiBold',
//   },
//   infoText: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 30,
//     fontFamily: 'InterRegular',
//     textAlign: 'center',
//     maxWidth: 300,
//   },
//   actionButton: {
//     paddingHorizontal: 25,
//     paddingVertical: 15,
//     borderRadius: 8,
//     backgroundColor: '#2bb673',
//     minWidth: 250,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   actionButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontFamily: 'InterSemiBold',
//   },
//   retryButton: {
//     padding: 15,
//     backgroundColor: '#007bff',
//     borderRadius: 8,
//     marginTop: 20,
//   },
//   retryText: {
//     color: 'white',
//     fontSize: 16,
//     fontFamily: 'InterSemiBold',
//   },
//   backButton: {
//     marginTop: 15,
//     padding: 10,
//   },
//   backButtonText: {
//     color: '#6c757d',
//     fontSize: 14,
//     fontFamily: 'InterRegular',
//   },
//   tipsContainer: {
//     marginTop: 40,
//     padding: 15,
//     backgroundColor: '#e9f5e9',
//     borderRadius: 10,
//     maxWidth: 320,
//   },
//   tipText: {
//     fontFamily: 'InterSemiBold',
//     color: '#28a745',
//     marginBottom: 5,
//   },
//   tip: {
//     fontFamily: 'InterRegular',
//     color: '#333',
//     marginVertical: 3,
//   },
// });

// export default PaymentScreen;

// import React, { useEffect, useState, useRef } from 'react';
// import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, BackHandler } from 'react-native';
// import * as WebBrowser from 'expo-web-browser';
// import * as Linking from 'expo-linking';

// const PaymentScreen = ({ route, navigation }) => {
//   console.log('[PaymentScreen] Rendu initial');
//   const { paymentUrl, reservationId } = route.params;
//   console.log(`[PaymentScreen] Paramètres reçus - paymentUrl: ${paymentUrl}, reservationId: ${reservationId}`);
  
//   const [status, setStatus] = useState(null);
//   const [error, setError] = useState(null);
//   const [isBrowserOpen, setIsBrowserOpen] = useState(false);
//   const isMounted = useRef(true);
//   const deepLinkSubscription = useRef(null);

//   // Gestion du bouton retour Android
//   useEffect(() => {
//     console.log('[PaymentScreen] Configuration du bouton retour Android');
    
//     const backAction = () => {
//       console.log('[PaymentScreen] Bouton retour pressé');
//       if (isBrowserOpen) {
//         console.log('[PaymentScreen] Navigateur ouvert -> annulation du paiement');
//         handlePaymentResult('canceled');
//         return true;
//       }
//       return false;
//     };

//     const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
//     return () => {
//       console.log('[PaymentScreen] Nettoyage du gestionnaire de retour');
//       backHandler.remove();
//     };
//   }, [isBrowserOpen]);

//   // Gestion du cycle de vie du composant
//   useEffect(() => {
//     console.log('[PaymentScreen] Configuration du cycle de vie');
    
//     return () => {
//       console.log('[PaymentScreen] Démonstration du composant');
//       isMounted.current = false;
//       if (isBrowserOpen) {
//         console.log('[PaymentScreen] Fermeture du navigateur car composant démonté');
//         WebBrowser.dismissBrowser();
//       }
//       if (deepLinkSubscription.current) {
//         console.log('[PaymentScreen] Suppression de l\'abonnement aux deep links');
//         deepLinkSubscription.current.remove();
//       }
//     };
//   }, []);

//   // Traitement du résultat du paiement
//   const handlePaymentResult = (resultStatus) => {
//     console.log(`[PaymentScreen] Traitement du résultat: ${resultStatus}`);
    
//     if (!isMounted.current) {
//       console.warn('[PaymentScreen] Composant démonté - traitement annulé');
//       return;
//     }
    
//     // Fermer le navigateur
//     try {
//       console.log('[PaymentScreen] Tentative de fermeture du navigateur');
//       WebBrowser.dismissBrowser();
//     } catch (dismissError) {
//       console.warn('[PaymentScreen] Erreur lors de la fermeture du navigateur:', dismissError);
//     }
    
//     setIsBrowserOpen(false);
//     setStatus(resultStatus);
    
//     console.log(`[PaymentScreen] Statut mis à jour: ${resultStatus}`);
//   };

//   // Gestion des deep links
//   useEffect(() => {
//     console.log('[PaymentScreen] Configuration de l\'écouteur de deep links');
    
//     const handleDeepLink = ({ url }) => {
//       console.log('[PaymentScreen] 🔗 Deep link reçu:', url);
      
//       if (!url) {
//         console.warn('[PaymentScreen] Deep link sans URL');
//         return;
//       }

//       try {
//         const parsed = Linking.parse(url);
//         console.log('[PaymentScreen] Deep link parsé:', JSON.stringify(parsed, null, 2));
        
//         const path = parsed.path || '';
//         const params = parsed.queryParams || {};

//         if (path.includes('payment/return')) {
//           const paymentStatus = params.status || 'failed';
//           console.log(`[PaymentScreen] 📊 Statut paiement détecté: ${paymentStatus}`);
//           handlePaymentResult(paymentStatus);
//         } else {
//           console.warn('[PaymentScreen] Deep link non lié au paiement - chemin non reconnu');
//         }
//       } catch (error) {
//         console.error('[PaymentScreen] Erreur de parsing du deep link:', error);
//         handlePaymentResult('failed');
//       }
//     };

//     // Ajouter l'écouteur
//     console.log('[PaymentScreen] Ajout de l\'écouteur de deep link');
//     deepLinkSubscription.current = Linking.addEventListener('url', handleDeepLink);
    
//     return () => {
//       if (deepLinkSubscription.current) {
//         console.log('[PaymentScreen] Suppression de l\'écouteur de deep link');
//         deepLinkSubscription.current.remove();
//       }
//     };
//   }, []);

//   // Ouvrir le navigateur de paiement
//   const launchPaymentBrowser = async () => {
//     console.log('[PaymentScreen] Lancement du navigateur de paiement');
    
//     try {
//       // Validation de l'URL
//       if (!paymentUrl || !paymentUrl.startsWith('https')) {
//         const errorMsg = 'URL de paiement invalide ou non sécurisée';
//         console.error(`[PaymentScreen] ${errorMsg}: ${paymentUrl}`);
//         throw new Error(errorMsg);
//       }

//       console.log(`[PaymentScreen] Ouverture du navigateur avec URL: ${paymentUrl}`);
//       setIsBrowserOpen(true);
//       setStatus(null);
//       setError(null);

//       const result = await WebBrowser.openBrowserAsync(paymentUrl, {
//         toolbarColor: '#2bb673',
//         controlsColor: 'white',
//         enableBarCollapsing: true,
//         presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
//       });

//       console.log('[PaymentScreen] Résultat du navigateur:', JSON.stringify(result, null, 2));

//       // Si l'utilisateur ferme manuellement le navigateur
//       if (result.type === 'cancel' && isMounted.current) {
//         console.log('[PaymentScreen] Navigateur fermé manuellement par l\'utilisateur');
//         handlePaymentResult('canceled');
//       } else if (isMounted.current) {
//         console.warn('[PaymentScreen] Navigateur fermé sans détection de deep link');
//         handlePaymentResult('unknown');
//       }
//     } catch (err) {
//       console.error('[PaymentScreen] 🚨 Erreur d\'ouverture du navigateur:', err);
//       setError(err.message || "Erreur lors de l'ouverture du navigateur");
//       setIsBrowserOpen(false);
//     }
//   };

//   // Lancer le paiement au montage
//   useEffect(() => {
//     console.log('[PaymentScreen] Effet de montage - lancement du paiement');
//     launchPaymentBrowser();
//   }, []);

//   // Réessayer le paiement
//   const retryPayment = () => {
//     console.log('[PaymentScreen] Tentative de réessai du paiement');
//     launchPaymentBrowser();
//   };

//   // Navigation après paiement
//   const handleNavigation = () => {
//     console.log(`[PaymentScreen] Navigation après paiement - statut: ${status}`);
//     if (status === 'success') {
//       navigation.navigate('ReservationSuccess', { 
//         reservationId,
//         paymentStatus: status 
//       });
//     } else {
//       navigation.navigate('ReservationDetails', { 
//         reservationId,
//         paymentStatus: status 
//       });
//     }
//   };

//   // Affichage conditionnel
//   console.log(`[PaymentScreen] Rendu - statut: ${status}, erreur: ${error}, chargement: ${!status && !error}`);

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={retryPayment}>
//           <Text style={styles.retryText}>Réessayer le paiement</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.backButton} 
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={styles.backButtonText}>Retour</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (status) {
//     return (
//       <View style={styles.container}>
//         {status === 'success' ? (
//           <>
//             <Text style={styles.successText}>🎉 Paiement réussi !</Text>
//             <Text style={styles.infoText}>Votre réservation #${reservationId} est confirmée</Text>
//           </>
//         ) : status === 'failed' ? (
//           <>
//             <Text style={styles.errorText}>❌ Échec du paiement</Text>
//             <Text style={styles.infoText}>Veuillez réessayer ou utiliser un autre moyen de paiement</Text>
//           </>
//         ) : status === 'canceled' ? (
//           <>
//             <Text style={styles.warningText}>⏸ Paiement annulé</Text>
//             <Text style={styles.infoText}>Vous avez annulé le processus de paiement</Text>
//           </>
//         ) : (
//           <>
//             <Text style={styles.warningText}>❓ Statut inconnu</Text>
//             <Text style={styles.infoText}>Le résultat du paiement n'a pas pu être déterminé</Text>
//           </>
//         )}
        
//         <TouchableOpacity 
//           style={styles.actionButton} 
//           onPress={handleNavigation}
//         >
//           <Text style={styles.actionButtonText}>
//             {status === 'success' 
//               ? 'Voir ma réservation' 
//               : 'Réessayer le paiement'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <ActivityIndicator size="large" color="#2bb673" />
//       <Text style={styles.loadingText}>Connexion au système de paiement...</Text>
      
//       <View style={styles.tipsContainer}>
//         <Text style={styles.tipText}>💡 Conseils :</Text>
//         <Text style={styles.tip}>• Gardez l'application ouverte pendant le paiement</Text>
//         <Text style={styles.tip}>• Vérifiez votre connexion internet</Text>
//         <Text style={styles.tip}>• Ne quittez pas la page de paiement</Text>
//         <Text style={styles.tip}>• Patientez pendant la redirection</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//     padding: 20,
//   },
//   loadingText: {
//     marginTop: 20,
//     fontSize: 16,
//     color: '#333',
//     fontFamily: 'InterMedium',
//   },
//   successText: {
//     fontSize: 22,
//     color: '#28a745',
//     textAlign: 'center',
//     marginBottom: 10,
//     fontFamily: 'InterSemiBold',
//   },
//   errorText: {
//     fontSize: 20,
//     color: '#dc3545',
//     textAlign: 'center',
//     marginBottom: 10,
//     fontFamily: 'InterSemiBold',
//   },
//   warningText: {
//     fontSize: 20,
//     color: '#ffc107',
//     textAlign: 'center',
//     marginBottom: 10,
//     fontFamily: 'InterSemiBold',
//   },
//   infoText: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 30,
//     fontFamily: 'InterRegular',
//     textAlign: 'center',
//     maxWidth: 300,
//   },
//   actionButton: {
//     paddingHorizontal: 25,
//     paddingVertical: 15,
//     borderRadius: 8,
//     backgroundColor: '#2bb673',
//     minWidth: 250,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   actionButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontFamily: 'InterSemiBold',
//   },
//   retryButton: {
//     padding: 15,
//     backgroundColor: '#007bff',
//     borderRadius: 8,
//     marginTop: 20,
//   },
//   retryText: {
//     color: 'white',
//     fontSize: 16,
//     fontFamily: 'InterSemiBold',
//   },
//   backButton: {
//     marginTop: 15,
//     padding: 10,
//   },
//   backButtonText: {
//     color: '#6c757d',
//     fontSize: 14,
//     fontFamily: 'InterRegular',
//   },
//   tipsContainer: {
//     marginTop: 40,
//     padding: 15,
//     backgroundColor: '#e9f5e9',
//     borderRadius: 10,
//     maxWidth: 320,
//   },
//   tipText: {
//     fontFamily: 'InterSemiBold',
//     color: '#28a745',
//     marginBottom: 5,
//   },
//   tip: {
//     fontFamily: 'InterRegular',
//     color: '#333',
//     marginVertical: 3,
//   },
// });

// export default PaymentScreen;

// import React, { useEffect, useState, useRef } from 'react';
// import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, BackHandler } from 'react-native';
// import * as WebBrowser from 'expo-web-browser';
// import * as Linking from 'expo-linking';

// const PaymentScreen = ({ route, navigation }) => {
//   console.log('[PaymentScreen] Rendu initial');
//   const { paymentUrl, reservationId } = route.params;
//   console.log(`[PaymentScreen] Paramètres reçus - paymentUrl: ${paymentUrl}, reservationId: ${reservationId}`);
  
//   // Stocker l'URL de paiement pour les réessais
//   const paymentUrlRef = useRef(paymentUrl);
//   const [status, setStatus] = useState(null);
//   const [error, setError] = useState(null);
//   const [isBrowserOpen, setIsBrowserOpen] = useState(false);
//   const isMounted = useRef(true);
//   const deepLinkSubscription = useRef(null);

//   // Gestion du bouton retour Android
//   useEffect(() => {
//     console.log('[PaymentScreen] Configuration du bouton retour Android');
    
//     const backAction = () => {
//       console.log('[PaymentScreen] Bouton retour pressé');
//       if (isBrowserOpen) {
//         console.log('[PaymentScreen] Navigateur ouvert -> annulation du paiement');
//         handlePaymentResult('canceled');
//         return true;
//       }
//       return false;
//     };

//     const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
//     return () => {
//       console.log('[PaymentScreen] Nettoyage du gestionnaire de retour');
//       backHandler.remove();
//     };
//   }, [isBrowserOpen]);

//   // Gestion du cycle de vie du composant
//   useEffect(() => {
//     console.log('[PaymentScreen] Configuration du cycle de vie');
    
//     return () => {
//       console.log('[PaymentScreen] Démonstration du composant');
//       isMounted.current = false;
//       if (isBrowserOpen) {
//         console.log('[PaymentScreen] Fermeture du navigateur car composant démonté');
//         WebBrowser.dismissBrowser();
//       }
//       if (deepLinkSubscription.current) {
//         console.log('[PaymentScreen] Suppression de l\'abonnement aux deep links');
//         deepLinkSubscription.current.remove();
//       }
//     };
//   }, []);

//   // Traitement du résultat du paiement
//   const handlePaymentResult = (resultStatus) => {
//     console.log(`[PaymentScreen] Traitement du résultat: ${resultStatus}`);
    
//     if (!isMounted.current) {
//       console.warn('[PaymentScreen] Composant démonté - traitement annulé');
//       return;
//     }
    
//     // Fermer le navigateur
//     try {
//       console.log('[PaymentScreen] Tentative de fermeture du navigateur');
//       WebBrowser.dismissBrowser();
//     } catch (dismissError) {
//       console.warn('[PaymentScreen] Erreur lors de la fermeture du navigateur:', dismissError);
//     }
    
//     setIsBrowserOpen(false);
//     setStatus(resultStatus);
    
//     console.log(`[PaymentScreen] Statut mis à jour: ${resultStatus}`);
//   };

//   // Gestion des deep links
//   useEffect(() => {
//     console.log('[PaymentScreen] Configuration de l\'écouteur de deep links');
    
//     const handleDeepLink = ({ url }) => {
//       console.log('[PaymentScreen] 🔗 Deep link reçu:', url);
      
//       if (!url) {
//         console.warn('[PaymentScreen] Deep link sans URL');
//         return;
//       }

//       try {
//         const parsed = Linking.parse(url);
//         console.log('[PaymentScreen] Deep link parsé:', JSON.stringify(parsed, null, 2));
        
//         const path = parsed.path || '';
//         const params = parsed.queryParams || {};

//         if (path.includes('payment/return')) {
//           const paymentStatus = params.status || 'failed';
//           console.log(`[PaymentScreen] 📊 Statut paiement détecté: ${paymentStatus}`);
//           handlePaymentResult(paymentStatus);
//         } else {
//           console.warn('[PaymentScreen] Deep link non lié au paiement - chemin non reconnu');
//         }
//       } catch (error) {
//         console.error('[PaymentScreen] Erreur de parsing du deep link:', error);
//         handlePaymentResult('failed');
//       }
//     };

//     // Ajouter l'écouteur
//     console.log('[PaymentScreen] Ajout de l\'écouteur de deep link');
//     deepLinkSubscription.current = Linking.addEventListener('url', handleDeepLink);
    
//     return () => {
//       if (deepLinkSubscription.current) {
//         console.log('[PaymentScreen] Suppression de l\'écouteur de deep link');
//         deepLinkSubscription.current.remove();
//       }
//     };
//   }, []);

//   // Ouvrir le navigateur de paiement
//   const launchPaymentBrowser = async () => {
//     console.log('[PaymentScreen] Lancement du navigateur de paiement');
//     console.log(`[PaymentScreen] URL utilisée: ${paymentUrlRef.current}`);
    
//     try {
//       // Validation de l'URL
//       if (!paymentUrlRef.current || !paymentUrlRef.current.startsWith('https')) {
//         const errorMsg = 'URL de paiement invalide ou non sécurisée';
//         console.error(`[PaymentScreen] ${errorMsg}: ${paymentUrlRef.current}`);
//         throw new Error(errorMsg);
//       }

//       console.log(`[PaymentScreen] Ouverture du navigateur avec URL: ${paymentUrlRef.current}`);
//       setIsBrowserOpen(true);
//       setStatus(null);
//       setError(null);

//       const result = await WebBrowser.openBrowserAsync(paymentUrlRef.current, {
//         toolbarColor: '#2bb673',
//         controlsColor: 'white',
//         enableBarCollapsing: true,
//         presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
//       });

//       console.log('[PaymentScreen] Résultat du navigateur:', JSON.stringify(result, null, 2));

//       // Si l'utilisateur ferme manuellement le navigateur
//       if (result.type === 'cancel' && isMounted.current) {
//         console.log('[PaymentScreen] Navigateur fermé manuellement par l\'utilisateur');
//         handlePaymentResult('canceled');
//       } else if (isMounted.current) {
//         console.warn('[PaymentScreen] Navigateur fermé sans détection de deep link');
//         handlePaymentResult('unknown');
//       }
//     } catch (err) {
//       console.error('[PaymentScreen] 🚨 Erreur d\'ouverture du navigateur:', err);
//       setError(err.message || "Erreur lors de l'ouverture du navigateur");
//       setIsBrowserOpen(false);
//     }
//   };

//   // Lancer le paiement au montage
//   useEffect(() => {
//     console.log('[PaymentScreen] Effet de montage - lancement du paiement');
//     launchPaymentBrowser();
//   }, []);

//   // Réessayer le paiement
//   const retryPayment = () => {
//     console.log('[PaymentScreen] Tentative de réessai du paiement');
//     launchPaymentBrowser();
//   };

//   // Navigation après paiement
//   const handleNavigation = () => {
//     console.log(`[PaymentScreen] Navigation après paiement - statut: ${status}`);
//     if (status === 'success') {
//       navigation.navigate('ReservationSuccess', { 
//         reservationId,
//         paymentStatus: status 
//       });
//     } else {
//       // Navigation vers l'écran de test au lieu de ReservationDetails
//       navigation.navigate('TestScreen', { 
//         reservationId,
//         paymentStatus: status,
//         paymentUrl: paymentUrlRef.current // Passer l'URL pour le test
//       });
//     }
//   };

//   // Affichage conditionnel
//   console.log(`[PaymentScreen] Rendu - statut: ${status}, erreur: ${error}, chargement: ${!status && !error}`);

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={retryPayment}>
//           <Text style={styles.retryText}>Réessayer le paiement</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.backButton} 
//           onPress={() => navigation.navigate('TestScreen')}
//         >
//           <Text style={styles.backButtonText}>Aller à l'écran de test</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (status) {
//     return (
//       <View style={styles.container}>
//         {status === 'success' ? (
//           <>
//             <Text style={styles.successText}>🎉 Paiement réussi !</Text>
//             <Text style={styles.infoText}>Votre réservation #${reservationId} est confirmée</Text>
//           </>
//         ) : status === 'failed' ? (
//           <>
//             <Text style={styles.errorText}>❌ Échec du paiement</Text>
//             <Text style={styles.infoText}>Veuillez réessayer ou utiliser un autre moyen de paiement</Text>
//           </>
//         ) : status === 'canceled' ? (
//           <>
//             <Text style={styles.warningText}>⏸ Paiement annulé</Text>
//             <Text style={styles.infoText}>Vous avez annulé le processus de paiement</Text>
//           </>
//         ) : (
//           <>
//             <Text style={styles.warningText}>❓ Statut inconnu</Text>
//             <Text style={styles.infoText}>Le résultat du paiement n'a pas pu être déterminé</Text>
//           </>
//         )}
        
//         <TouchableOpacity 
//           style={styles.actionButton} 
//           onPress={handleNavigation}
//         >
//           <Text style={styles.actionButtonText}>
//             {status === 'success' 
//               ? 'Voir ma réservation' 
//               : 'Réessayer le paiement'}
//           </Text>
//         </TouchableOpacity>
        
//         {/* Bouton supplémentaire pour l'écran de test */}
//         {status !== 'success' && (
//           <TouchableOpacity 
//             style={styles.testButton} 
//             onPress={() => navigation.navigate('TestScreen')}
//           >
//             <Text style={styles.testButtonText}>Ouvrir l'écran de test</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <ActivityIndicator size="large" color="#2bb673" />
//       <Text style={styles.loadingText}>Connexion au système de paiement...</Text>
      
//       <View style={styles.tipsContainer}>
//         <Text style={styles.tipText}>💡 Conseils :</Text>
//         <Text style={styles.tip}>• Gardez l'application ouverte pendant le paiement</Text>
//         <Text style={styles.tip}>• Vérifiez votre connexion internet</Text>
//         <Text style={styles.tip}>• Ne quittez pas la page de paiement</Text>
//         <Text style={styles.tip}>• Patientez pendant la redirection</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa',
//     padding: 20,
//   },
//   loadingText: {
//     marginTop: 20,
//     fontSize: 16,
//     color: '#333',
//     fontFamily: 'InterMedium',
//   },
//   successText: {
//     fontSize: 22,
//     color: '#28a745',
//     textAlign: 'center',
//     marginBottom: 10,
//     fontFamily: 'InterSemiBold',
//   },
//   errorText: {
//     fontSize: 20,
//     color: '#dc3545',
//     textAlign: 'center',
//     marginBottom: 10,
//     fontFamily: 'InterSemiBold',
//   },
//   warningText: {
//     fontSize: 20,
//     color: '#ffc107',
//     textAlign: 'center',
//     marginBottom: 10,
//     fontFamily: 'InterSemiBold',
//   },
//   infoText: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 30,
//     fontFamily: 'InterRegular',
//     textAlign: 'center',
//     maxWidth: 300,
//   },
//   actionButton: {
//     paddingHorizontal: 25,
//     paddingVertical: 15,
//     borderRadius: 8,
//     backgroundColor: '#2bb673',
//     minWidth: 250,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   actionButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontFamily: 'InterSemiBold',
//   },
//   retryButton: {
//     padding: 15,
//     backgroundColor: '#007bff',
//     borderRadius: 8,
//     marginTop: 20,
//   },
//   retryText: {
//     color: 'white',
//     fontSize: 16,
//     fontFamily: 'InterSemiBold',
//   },
//   backButton: {
//     marginTop: 15,
//     padding: 10,
//   },
//   backButtonText: {
//     color: '#6c757d',
//     fontSize: 14,
//     fontFamily: 'InterRegular',
//   },
//   testButton: {
//     marginTop: 15,
//     padding: 12,
//     backgroundColor: '#6c757d',
//     borderRadius: 8,
//   },
//   testButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontFamily: 'InterRegular',
//   },
//   tipsContainer: {
//     marginTop: 40,
//     padding: 15,
//     backgroundColor: '#e9f5e9',
//     borderRadius: 10,
//     maxWidth: 320,
//   },
//   tipText: {
//     fontFamily: 'InterSemiBold',
//     color: '#28a745',
//     marginBottom: 5,
//   },
//   tip: {
//     fontFamily: 'InterRegular',
//     color: '#333',
//     marginVertical: 3,
//   },
// });

// export default PaymentScreen;

// import React, { useEffect, useState, useRef } from 'react';
// import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, BackHandler } from 'react-native';
// import * as WebBrowser from 'expo-web-browser';
// import * as Linking from 'expo-linking';
// import { Ionicons } from '@expo/vector-icons'; // Pour les icônes

// // --- CONSTANTES DE COULEURS ET DE STYLE ---
// const COLORS = {
//   primary: '#2bb673',
//   success: '#28a745',
//   danger: '#dc3545',
//   warning: '#ffc107',
//   light: '#f8f9fa',
//   dark: '#333',
//   grey: '#6c757d',
//   white: '#ffffff',
// };

// const PaymentScreen = ({ route, navigation }) => {
//   const { paymentUrl, reservationId } = route.params;

//   // --- ÉTATS ET RÉFÉRENCES ---
//   const [status, setStatus] = useState(null); // 'success', 'failed', 'canceled', 'unknown'
//   const [error, setError] = useState(null);
//   const [isBrowserOpen, setIsBrowserOpen] = useState(false);

//   const isMounted = useRef(true);
//   const deepLinkSubscription = useRef(null);

//   // --- GESTION DU CYCLE DE VIE ET DES ÉVÉNEMENTS ---

//   // Gère le démontage du composant
//   useEffect(() => {
//     isMounted.current = true;
//     return () => {
//       isMounted.current = false;
//       if (deepLinkSubscription.current) {
//         deepLinkSubscription.current.remove();
//       }
//       // Assure la fermeture du navigateur si le composant est démonté
//       if (isBrowserOpen) {
//         WebBrowser.dismissBrowser();
//       }
//     };
//   }, []);
  
//   // Gère le bouton retour d'Android
//   useEffect(() => {
//     const handleBackPress = () => {
//       if (isBrowserOpen) {
//         // Si le navigateur est ouvert, le retour arrière est interprété comme une annulation
//         handlePaymentResult('canceled');
//         return true; // Empêche l'action par défaut (fermer l'app)
//       }
//       // Sinon, permet le comportement normal du retour
//       return false;
//     };

//     const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
//     return () => backHandler.remove();
//   }, [isBrowserOpen]);


//   // Ouvre le navigateur de paiement une seule fois au montage
//   useEffect(() => {
//     launchPaymentBrowser();
//   }, []);

//   // Écoute les deep links pour obtenir le résultat du paiement
//   useEffect(() => {
//     const handleDeepLink = ({ url }) => {
//       if (!url) return;
      
//       try {
//         const { path, queryParams } = Linking.parse(url);
//         // Vérifie si le deep link correspond au chemin de retour de paiement
//         if (path?.includes('payment/return')) {
//           const paymentStatus = queryParams?.status || 'failed'; // 'success' ou 'failed'
//           handlePaymentResult(paymentStatus);
//         }
//       } catch (err) {
//         console.error('Erreur de traitement du deep link:', err);
//         handlePaymentResult('failed');
//       }
//     };

//     deepLinkSubscription.current = Linking.addEventListener('url', handleDeepLink);
    
//     return () => {
//       if (deepLinkSubscription.current) {
//         deepLinkSubscription.current.remove();
//       }
//     };
//   }, []);

//   // --- FONCTIONS PRINCIPALES ---

//   /**
//    * Ouvre le navigateur web pour que l'utilisateur puisse procéder au paiement.
//    */
//   const launchPaymentBrowser = async () => {
//     setError(null);
//     setStatus(null);
    
//     try {
//       if (!paymentUrl || !paymentUrl.startsWith('https')) {
//         throw new Error("URL de paiement invalide ou non sécurisée.");
//       }

//       setIsBrowserOpen(true);
//       const result = await WebBrowser.openBrowserAsync(paymentUrl);

//       // Si l'utilisateur ferme le navigateur manuellement (result.type === 'cancel')
//       if (result.type === 'cancel' && isMounted.current) {
//         handlePaymentResult('canceled');
//       }

//     } catch (err) {
//       if (isMounted.current) {
//         setError(err.message || "Impossible d'ouvrir la page de paiement.");
//         setIsBrowserOpen(false);
//       }
//     }
//   };
  
//   /**
//    * Traite le résultat du paiement reçu via deep link ou annulation.
//    */
//   const handlePaymentResult = (resultStatus) => {
//     // Ferme le navigateur et met à jour l'état uniquement si le composant est monté
//     if (isMounted.current) {
//       WebBrowser.dismissBrowser();
//       setIsBrowserOpen(false);
//       setStatus(resultStatus);
//     }
//   };
  
//   // --- FONCTIONS DE NAVIGATION ---
  
//   const navigateToSuccess = () => {
//     navigation.replace('ReservationSuccess', { reservationId });
//   };

//   const retryPayment = () => {
//     launchPaymentBrowser();
//   };
  
//   const goBack = () => {
//     navigation.goBack();
//   };
  
//   // --- RENDU DU COMPOSANT ---

//   // Cas 1 : Erreur technique (ex: URL invalide)
//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Ionicons name="alert-circle-outline" size={80} color={COLORS.danger} />
//         <Text style={styles.title}>Erreur</Text>
//         <Text style={styles.message}>{error}</Text>
//         <TouchableOpacity style={styles.buttonPrimary} onPress={retryPayment}>
//           <Text style={styles.buttonText}>Réessayer</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.buttonSecondary} onPress={goBack}>
//           <Text style={styles.buttonTextSecondary}>Retour</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // Cas 2 : Résultat du paiement reçu
//   if (status) {
//     let iconName, iconColor, title, message, primaryAction, primaryActionText, showSecondaryAction;

//     switch (status) {
//       case 'success':
//         iconName = 'checkmark-circle-outline';
//         iconColor = COLORS.success;
//         title = 'Paiement Réussi !';
//         message = `Votre réservation #${reservationId} est confirmée.`;
//         primaryAction = navigateToSuccess;
//         primaryActionText = 'Voir ma réservation';
//         showSecondaryAction = false;
//         break;
//       case 'failed':
//         iconName = 'close-circle-outline';
//         iconColor = COLORS.danger;
//         title = 'Échec du Paiement';
//         message = 'La transaction n\'a pas pu être finalisée. Veuillez réessayer.';
//         primaryAction = retryPayment;
//         primaryActionText = 'Réessayer le paiement';
//         showSecondaryAction = true;
//         break;
//       case 'canceled':
//       default: // inclut 'unknown' et 'canceled'
//         iconName = 'stop-circle-outline';
//         iconColor = COLORS.warning;
//         title = 'Paiement Annulé';
//         message = 'Vous avez interrompu le processus de paiement.';
//         primaryAction = retryPayment;
//         primaryActionText = 'Réessayer';
//         showSecondaryAction = true;
//         break;
//     }

//     return (
//       <View style={styles.container}>
//         <Ionicons name={iconName} size={80} color={iconColor} />
//         <Text style={styles.title}>{title}</Text>
//         <Text style={styles.message}>{message}</Text>
//         <TouchableOpacity style={styles.buttonPrimary} onPress={primaryAction}>
//           <Text style={styles.buttonText}>{primaryActionText}</Text>
//         </TouchableOpacity>
//         {showSecondaryAction && (
//           <TouchableOpacity style={styles.buttonSecondary} onPress={goBack}>
//             <Text style={styles.buttonTextSecondary}>Retour</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   }

//   // Cas 3 : Chargement initial
//   return (
//     <View style={styles.container}>
//       <ActivityIndicator size="large" color={COLORS.primary} />
//       <Text style={styles.loadingText}>Redirection vers la page de paiement...</Text>
//       <View style={styles.tipsContainer}>
//         <Text style={styles.tipTitle}>💡 Conseils</Text>
//         <Text style={styles.tip}>• Restez sur cette page pendant le processus.</Text>
//         <Text style={styles.tip}>• Assurez-vous d'avoir une bonne connexion internet.</Text>
//       </View>
//     </View>
//   );
// };

// // --- STYLES ---
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: COLORS.light,
//     padding: 24,
//   },
//   loadingText: {
//     marginTop: 20,
//     fontSize: 16,
//     color: COLORS.dark,
//     textAlign: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: COLORS.dark,
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   message: {
//     fontSize: 16,
//     color: COLORS.grey,
//     textAlign: 'center',
//     marginBottom: 32,
//     maxWidth: 300,
//   },
//   buttonPrimary: {
//     backgroundColor: COLORS.primary,
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     width: '100%',
//     alignItems: 'center',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   buttonText: {
//     color: COLORS.white,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   buttonSecondary: {
//     marginTop: 16,
//     paddingVertical: 14,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     width: '100%',
//     alignItems: 'center',
//   },
//   buttonTextSecondary: {
//     color: COLORS.primary,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   tipsContainer: {
//     position: 'absolute',
//     bottom: 30,
//     padding: 15,
//     backgroundColor: '#e9f5e9',
//     borderRadius: 10,
//     width: '90%',
//   },
//   tipTitle: {
//     fontWeight: 'bold',
//     color: COLORS.primary,
//     marginBottom: 5,
//   },
//   tip: {
//     color: COLORS.dark,
//     marginVertical: 2,
//   },
// });

// export default PaymentScreen;

import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

const COLORS = {
  primary: '#2bb673',
  light: '#f8f9fa',
  dark: '#333',
};

const PaymentScreen = ({ route, navigation }) => {
  const { 
    paymentUrl, 
    transactionType = 'reservation',
    reservationId, 
    boostId,
    boostDuration 
  } = route.params;

  const isMounted = useRef(true);
  const deepLinkSubscription = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    
    const handleDeepLink = ({ url }) => {
      if (!url) return;
      
      try {
        const { queryParams } = Linking.parse(url);
        const status = queryParams?.status || 'failed';
        
        navigation.replace('PaymentResult', {
          status,
          transactionType,
          reservationId: queryParams?.reservationId || reservationId,
          boostId: queryParams?.boostId || boostId,
          boostDuration: queryParams?.boostDuration || boostDuration
        });
      } catch (err) {
        navigation.replace('PaymentResult', {
          status: 'failed',
          transactionType,
          reservationId,
          boostId,
          boostDuration
        });
      }
    };

    deepLinkSubscription.current = Linking.addEventListener('url', handleDeepLink);
    
    // Ouvrir le navigateur de paiement
    const launchPayment = async () => {
      try {
        if (!paymentUrl?.startsWith('https')) {
          throw new Error("URL de paiement invalide");
        }
        
        await WebBrowser.openBrowserAsync(paymentUrl);
      } catch (error) {
        navigation.replace('PaymentResult', {
          status: 'error',
          errorMessage: error.message,
          transactionType,
          reservationId,
          boostId,
          boostDuration
        });
      }
    };

    launchPayment();

    return () => {
      isMounted.current = false;
      deepLinkSubscription.current?.remove();
      WebBrowser.dismissBrowser();
    };
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>
        {transactionType === 'boost' 
          ? "Activation du boost en cours..." 
          : "Connexion au service de paiement..."
        }
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: COLORS.dark,
  },
});

export default PaymentScreen;