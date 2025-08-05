// screens/ReservationConfirmation.js
import { useRoute, useNavigation } from '@react-navigation/native';
import { View, Text, Button } from 'react-native';

export default function ReservationConfirmation() {
  const { reservationId } = useRoute().params;
  const nav = useNavigation();

  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text>Réservation {reservationId} confirmée !</Text>
      <Button title="Accueil" onPress={() => nav.navigate('Home')} />
    </View>
  );
}
