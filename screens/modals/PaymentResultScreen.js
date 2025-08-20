import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
  primary: '#2bb673',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  boost: '#ff6b35',
  light: '#f8f9fa',
  dark: '#333',
  grey: '#6c757d',
  white: '#ffffff',
};

const PaymentResultScreen = ({ route }) => {
  const navigation = useNavigation();
  const {
    status,
    transactionType = 'reservation',
    reservationId,
    boostId,
    boostDuration,
    errorMessage
  } = route.params;

  // Identifiant de la transaction
  const transactionId = transactionType === 'boost' ? boostId : reservationId;

  // Navigation vers les écrans de succès
  const navigateToSuccess = () => {
    if (transactionType === 'boost') {
      navigation.replace('BoostSuccess', { 
        boostId, 
        boostDuration 
      });
    } else {
      navigation.replace('ReservationSuccess', { reservationId });
    }
  };

  // Réessayer le paiement
  const retryPayment = () => {
    navigation.goBack(); // Retour à l'écran de paiement
  };

  // Retour à l'accueil
  const goToHome = () => {
    navigation.navigate('Home');
  };

  // Configuration de l'affichage selon le statut
  let iconName, iconColor, title, message, primaryAction, primaryText, showSecondary;

  switch (status) {
    case 'success':
      iconName = transactionType === 'boost' ? 'rocket-outline' : 'checkmark-circle-outline';
      iconColor = transactionType === 'boost' ? COLORS.boost : COLORS.success;
      title = transactionType === 'boost' ? 'Boost Réussi !' : 'Paiement Réussi !';
      message = transactionType === 'boost'
        ? `Votre annonce a été boostée pour ${boostDuration} jours.`
        : `Votre réservation #${transactionId} est confirmée.`;
      primaryAction = navigateToSuccess;
      primaryText = transactionType === 'boost' ? 'Voir mon annonce' : 'Voir ma réservation';
      showSecondary = false;
      break;

    case 'failed':
      iconName = 'close-circle-outline';
      iconColor = COLORS.danger;
      title = transactionType === 'boost' ? 'Échec du Boost' : 'Échec du Paiement';
      message = transactionType === 'boost'
        ? "Le boost n'a pas pu être appliqué. Veuillez réessayer."
        : 'La transaction a échoué. Veuillez réessayer.';
      primaryAction = retryPayment;
      primaryText = 'Réessayer';
      showSecondary = true;
      break;

    case 'error':
      iconName = 'alert-circle-outline';
      iconColor = COLORS.danger;
      title = 'Erreur Technique';
      message = errorMessage || "Une erreur s'est produite lors du traitement.";
      primaryAction = retryPayment;
      primaryText = 'Réessayer';
      showSecondary = true;
      break;

    case 'canceled':
    default:
      iconName = 'stop-circle-outline';
      iconColor = COLORS.warning;
      title = 'Transaction Annulée';
      message = 'Vous avez interrompu le processus de paiement.';
      primaryAction = retryPayment;
      primaryText = 'Réessayer';
      showSecondary = true;
      break;
  }

  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={80} color={iconColor} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      
      <TouchableOpacity 
        style={[
          styles.button, 
          styles.primaryButton,
          transactionType === 'boost' && styles.boostButton
        ]} 
        onPress={primaryAction}
      >
        <Text style={styles.buttonText}>{primaryText}</Text>
      </TouchableOpacity>
      
      {showSecondary && (
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={goToHome}
        >
          <Text style={[styles.buttonText, styles.secondaryText]}>Retour à l'accueil</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginVertical: 16,
  },
  message: {
    fontSize: 16,
    color: COLORS.grey,
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 300,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  boostButton: {
    backgroundColor: COLORS.boost,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryText: {
    color: COLORS.primary,
  },
});

export default PaymentResultScreen;