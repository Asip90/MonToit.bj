import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput , ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/Theme';
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../src/api/FirebaseConfig';
import { useWindowDimensions } from 'react-native';

const RateOwnerScreen = ({ route , navigation }) => {
      const { height } = useWindowDimensions();

  const SHEET_HEIGHT = height * 0.6; // 60% en bas
  const MARGIN_TOP = height * 0.4;  // Décalage vers le bas

//   const containerHeight = height * 0.6; // 60% de la hauteur

  const { ownerId } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Erreur', 'Veuillez donner une note');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Erreur', 'Vous devez être connecté pour noter');
        return;
      }

      const reviewData = {
        ownerId,
        reviewerId: user.uid,
        reviewerName: user.name || 'Anonyme',
        rating,
        comment,
        createdAt: serverTimestamp()
      };

      // Ajouter l'avis dans la sous-collection
      const ownerRef = doc(db, 'users', ownerId);
      const reviewsRef = collection(ownerRef, 'reviews');
      await setDoc(doc(reviewsRef), reviewData);

      // Mettre à jour la note moyenne du propriétaire
      // (Cette partie nécessiterait une fonction Cloud Firestore pour calculer la moyenne)

      Alert.alert('Succès', 'Votre avis a été enregistré');
      navigation.goBack();
    } catch (error) {
      console.error('Erreur lors de la notation:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView  contentContainerStyle={[styles.container, {height: SHEET_HEIGHT,
      marginTop: MARGIN_TOP,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      elevation: 10,
shadowColor: '#000',
shadowOffset: { width: 0, height: -2 },
shadowOpacity: 0.2,
shadowRadius: 10,
      },]}
  showsVerticalScrollIndicator={false}>
      <Text style={[FONTS.h3, styles.title]}>Noter ce propriétaire</Text>
      
      {/* Étoiles de notation */}
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <MaterialIcons
              name={star <= rating ? 'star' : 'star-border'}
              size={40}
              color={COLORS.orange}
            />
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={[FONTS.body4, styles.ratingText]}>
        {rating > 0 ? `Vous avez donné ${rating} étoile${rating > 1 ? 's' : ''}` : 'Sélectionnez une note'}
      </Text>

      {/* Champ de commentaire */}
      <Text style={[FONTS.body4, styles.label]}>Commentaire (optionnel)</Text>
      <TextInput
        style={styles.commentInput}
        multiline
        numberOfLines={4}
        placeholder="Décrivez votre expérience avec ce propriétaire..."
        placeholderTextColor={COLORS.gray}
        value={comment}
        onChangeText={setComment}
      />

      {/* Bouton de soumission */}
      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={[FONTS.h4, styles.submitButtonText]}>Envoyer l'avis</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.padding,
  backgroundColor: COLORS.white,
  borderTopLeftRadius: SIZES.radius,
  borderTopRightRadius: SIZES.radius,
  overflow: 'hidden',
  },
  title: {
    color: COLORS.black,
    marginBottom: SIZES.padding,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: SIZES.padding,
  },
  ratingText: {
    textAlign: 'center',
    color: COLORS.gray,
    marginBottom: SIZES.padding,
  },
  label: {
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  commentInput: {
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    minHeight: 120,
    marginBottom: SIZES.padding,
    textAlignVertical: 'top',
    ...FONTS.body4,
    color: COLORS.black,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.white,
  },
});

export default RateOwnerScreen;