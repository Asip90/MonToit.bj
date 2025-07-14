import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../constants/Theme'; // Assurez-vous que le chemin est correct
const ReservationConfirmationScreen = ({ navigation }) => {
  const route = useRoute();
  const { reservationDetails } = route.params;

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={80} color="#4CAF50" style={styles.icon} />
      <Text style={styles.title}>Réservation confirmée!</Text>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Propriété: {reservationDetails.propertyTitle}</Text>
        <Text style={styles.detailText}>Type: {reservationDetails.visitType === 'virtual' ? 'Visite virtuelle' : 'Visite sur place'}</Text>
        <Text style={styles.detailText}>Date: {new Date(reservationDetails.date).toLocaleString()}</Text>
        <Text style={styles.detailText}>Prix: {reservationDetails.price.toLocaleString()} FCFA</Text>
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })} // Naviguer vers l'écran d'accueil
      >
        <Text style={styles.buttonText}>Retour à l'accueil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  icon: {
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center'
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default ReservationConfirmationScreen;