// // File: FeedbackScreen.js work
// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// import { COLORS, SIZES, FONTS } from '../../constants/Theme';
// import { db } from '../../src/api/FirebaseConfig';
// import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import { UserContext } from '../../context/AuthContext';
// import { useContext } from 'react';
// const FeedbackScreen = () => {
//   const [rating, setRating] = useState(0);
//   const [feedback, setFeedback] = useState('');
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const {userData} = useContext(UserContext);
//   // Charger les avis existants
//   useEffect(() => {
//     const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const reviewsData = [];
//       querySnapshot.forEach((doc) => {
//         reviewsData.push({ id: doc.id, ...doc.data() });
//       });
//       setReviews(reviewsData);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const handleRating = (selectedRating) => {
//     setRating(selectedRating);
//   };

//   const handleSubmit = async () => {
//     if (rating === 0) {
//       Alert.alert('Note requise', 'Veuillez donner une note avant de soumettre votre feedback.');
//       return;
//     }
    
//     if (feedback.trim().length < 10) {
//       Alert.alert('Feedback trop court', 'Veuillez fournir un feedback plus détaillé (au moins 10 caractères).');
//       return;
//     }

//     if (!userData) {
//       Alert.alert('Non connecté', 'Vous devez être connecté pour soumettre un avis.');
//       return;
//     }

//     setSubmitting(true);
//     // if (!userData) {
//     try {
//       await addDoc(collection(db, "reviews"), {
//         userId: userData.uid,
//         userEmail: userData.email || 'Anonyme',
//         userName: userData.name || userData.surname|| 'Utilisateur',
//         rating,
//         feedback,
//         createdAt: new Date(),
//       });

//       setRating(0);
//       setFeedback('');
//       Alert.alert('Merci!', 'Votre avis a été enregistré avec succès.');
//     } catch (error) {
//       console.error("Erreur lors de l'ajout du review: ", error);
//       Alert.alert('Erreur', "Une erreur s'est produite lors de l'envoi de votre avis.");
//     } finally {
//       setSubmitting(false);
//     }
//   };
// //  else {
// //     Alert.alert('Non connecté', 'Vous devez être connecté pour soumettre un avis.');
// //     setSubmitting(false);
// //     }
    

//   // Composant d'étoile personnalisé
//   const Star = ({ filled, onPress }) => (
//     <TouchableOpacity onPress={onPress}>
//       <Text style={[styles.star, { color: filled ? COLORS.primary : COLORS.gray }]}>
//         {filled ? '★' : '☆'}
//       </Text>
//     </TouchableOpacity>
//   );

//   // Composant pour afficher une évaluation
//   const ReviewItem = ({ review }) => (
//     <View style={styles.reviewItem}>
//       <View style={styles.reviewHeader}>
//         <Text style={styles.reviewUser}>{review.userName}</Text>
//         <View style={styles.reviewStars}>
//           {[1, 2, 3, 4, 5].map((star) => (
//             <Text 
//               key={star} 
//               style={[styles.smallStar, { color: star <= review.rating ? COLORS.primary : COLORS.gray }]}
//             >
//               {star <= review.rating ? '★' : '☆'}
//             </Text>
//           ))}
//         </View>
//       </View>
//       <Text style={styles.reviewText}>{review.feedback}</Text>
//       <Text style={styles.reviewDate}>
//         {review.createdAt?.toDate?.()?.toLocaleDateString() || 'Date inconnue'}
//       </Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text style={styles.header}>Avis des utilisateurs</Text>
        
//         {loading ? (
//           <ActivityIndicator size="large" color={COLORS.primary} />
//         ) : reviews.length === 0 ? (
//           <Text style={styles.noReviews}>Aucun avis pour le moment. Soyez le premier à donner votre avis!</Text>
//         ) : (
//           <View style={styles.reviewsContainer}>
//             {reviews.map((review) => (
//               <ReviewItem key={review.id} review={review} />
//             ))}
//           </View>
//         )}

//         <Text style={[styles.header, { marginTop: SIZES.padding }]}>Donnez votre avis</Text>
        
//         <View style={styles.ratingSection}>
//           <Text style={styles.sectionTitle}>Notez votre expérience</Text>
//           <View style={styles.starsContainer}>
//             {[1, 2, 3, 4, 5].map((star) => (
//               <Star 
//                 key={star} 
//                 filled={star <= rating} 
//                 onPress={() => handleRating(star)} 
//               />
//             ))}
//           </View>
//           <Text style={styles.ratingText}>
//             {rating > 0 ? `Vous avez noté ${rating} étoile${rating > 1 ? 's' : ''}` : 'Sélectionnez une note'}
//           </Text>
//         </View>

//         <View style={styles.feedbackSection}>
//           <Text style={styles.sectionTitle}>Votre feedback</Text>
//           <TextInput
//             style={styles.feedbackInput}
//             multiline
//             numberOfLines={5}
//             placeholder="Dites-nous ce que vous aimez ou ce que nous pourrions améliorer..."
//             placeholderTextColor={COLORS.gray}
//             value={feedback}
//             onChangeText={setFeedback}
//           />
//         </View>

//         <TouchableOpacity 
//           style={[styles.submitButton, submitting && styles.disabledButton]}
//           onPress={handleSubmit}
//           disabled={submitting}
//         >
//           {submitting ? (
//             <ActivityIndicator color={COLORS.white} />
//           ) : (
//             <Text style={styles.submitButtonText}>Envoyer mon avis</Text>
//           )}
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.lightGray,
//   },
//   scrollContainer: {
//     padding: SIZES.padding,
//     paddingBottom: SIZES.padding * 2,
//   },
//   header: {
//     ...FONTS.h2,
//     color: COLORS.primary,
//     marginBottom: SIZES.padding,
//     textAlign: 'center',
//   },
//   noReviews: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//     textAlign: 'center',
//     marginVertical: SIZES.padding,
//   },
//   reviewsContainer: {
//     marginBottom: SIZES.padding,
//   },
//   reviewItem: {
//     backgroundColor: COLORS.white,
//     borderRadius: SIZES.radius,
//     padding: SIZES.padding,
//     marginBottom: SIZES.base,
//   },
//   reviewHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: SIZES.base,
//   },
//   reviewUser: {
//     ...FONTS.body3,
//     fontWeight: 'bold',
//     color: COLORS.black,
//   },
//   reviewStars: {
//     flexDirection: 'row',
//   },
//   smallStar: {
//     fontSize: 16,
//     marginLeft: 2,
//   },
//   reviewText: {
//     ...FONTS.body4,
//     color: COLORS.black,
//     marginBottom: SIZES.base,
//   },
//   reviewDate: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//     fontSize: 12,
//     textAlign: 'right',
//   },
//   sectionTitle: {
//     ...FONTS.h4,
//     color: COLORS.black,
//     marginBottom: SIZES.base,
//   },
//   ratingSection: {
//     backgroundColor: COLORS.white,
//     borderRadius: SIZES.radius,
//     padding: SIZES.padding,
//     marginBottom: SIZES.padding,
//     alignItems: 'center',
//   },
//   starsContainer: {
//     flexDirection: 'row',
//     marginBottom: SIZES.base,
//   },
//   star: {
//     fontSize: 40,
//     marginHorizontal: 5,
//   },
//   ratingText: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//   },
//   feedbackSection: {
//     backgroundColor: COLORS.white,
//     borderRadius: SIZES.radius,
//     padding: SIZES.padding,
//     marginBottom: SIZES.padding,
//   },
//   feedbackInput: {
//     ...FONTS.body4,
//     color: COLORS.black,
//     height: 120,
//     textAlignVertical: 'top',
//   },
//   submitButton: {
//     backgroundColor: COLORS.primary,
//     borderRadius: SIZES.radius,
//     padding: SIZES.padding,
//     alignItems: 'center',
//   },
//   disabledButton: {
//     backgroundColor: COLORS.gray,
//   },
//   submitButtonText: {
//     ...FONTS.body3,
//     color: COLORS.white,
//     fontWeight: 'bold',
//   },
// });

// export default FeedbackScreen;

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Modal, FlatList } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/Theme';
import { db } from '../../src/api/FirebaseConfig';
import { collection, addDoc, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { UserContext } from '../../context/AuthContext';
import { KeyboardAvoidingView, Platform } from 'react-native';
const FeedbackScreen = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(5);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [allReviews, setAllReviews] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const { userData } = useContext(UserContext);

  // Charger les premiers avis
  useEffect(() => {
    const fetchInitialReviews = async () => {
      try {
        const q = query(
          collection(db, "reviews"), 
          orderBy("createdAt", "desc"), 
          limit(5)
        );
        
        const querySnapshot = await getDocs(q);
        const reviewsData = [];
        querySnapshot.forEach((doc) => {
          reviewsData.push({ id: doc.id, ...doc.data() });
        });
        
        setReviews(reviewsData);
        setAllReviews(reviewsData);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      } catch (error) {
        console.error("Error fetching reviews: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialReviews();
  }, []);

  // Charger plus d'avis pour le scroll infini
  const loadMoreReviews = useCallback(async () => {
    if (!lastVisible || loadingMore) return;
    
    setLoadingMore(true);
    try {
      const nextQ = query(
        collection(db, "reviews"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(5)
      );

      const nextSnapshot = await getDocs(nextQ);
      const newReviews = [];
      nextSnapshot.forEach((doc) => {
        newReviews.push({ id: doc.id, ...doc.data() });
      });

      if (newReviews.length > 0) {
        setAllReviews(prev => [...prev, ...newReviews]);
        setLastVisible(nextSnapshot.docs[nextSnapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error("Error loading more reviews: ", error);
    } finally {
      setLoadingMore(false);
    }
  }, [lastVisible, loadingMore]);

  // Gérer le scroll pour le chargement infini
  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const paddingToBottom = 20;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      loadMoreReviews();
    }
  };

  const handleRating = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Note requise', 'Veuillez donner une note avant de soumettre votre feedback.');
      return;
    }
    
    if (feedback.trim().length < 10) {
      Alert.alert('Feedback trop court', 'Veuillez fournir un feedback plus détaillé (au moins 10 caractères).');
      return;
    }

    if (!userData) {
      Alert.alert('Non connecté', 'Vous devez être connecté pour soumettre un avis.');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "reviews"), {
        userId: userData.uid,
        userEmail: userData.email || 'Anonyme',
        userName: userData.name || userData.surname || 'Utilisateur',
        rating,
        feedback,
        createdAt: new Date(),
      });

      setRating(0);
      setFeedback('');
      Alert.alert('Merci!', 'Votre avis a été enregistré avec succès.');
    } catch (error) {
      console.error("Erreur lors de l'ajout du review: ", error);
      Alert.alert('Erreur', "Une erreur s'est produite lors de l'envoi de votre avis.");
    } finally {
      setSubmitting(false);
    }
  };

  // Composant d'étoile personnalisé
  const Star = ({ filled, onPress, size = 40 }) => (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.star, { 
        color: filled ? COLORS.primary : COLORS.gray,
        fontSize: size 
      }]}>
        {filled ? '★' : '☆'}
      </Text>
    </TouchableOpacity>
  );

  // Composant pour afficher une évaluation
  const ReviewItem = ({ review }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewUser}>{review.userName}</Text>
        <View style={styles.reviewStars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              filled={star <= review.rating} 
              size={16}
            />
          ))}
        </View>
      </View>
      <Text style={styles.reviewText}>{review.feedback}</Text>
      <Text style={styles.reviewDate}>
        {review.createdAt?.toDate?.()?.toLocaleDateString() || 'Date inconnue'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        onScroll={showAllReviews ? null : handleScroll}
        scrollEventThrottle={400}
      >
        <Text style={styles.header}>Avis des utilisateurs</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : reviews.length === 0 ? (
          <Text style={styles.noReviews}>Aucun avis pour le moment. Soyez le premier à donner votre avis!</Text>
        ) : (
          <>
            <View style={styles.reviewsContainer}>
              {reviews.slice(0, visibleReviews).map((review) => (
                <ReviewItem key={review.id} review={review} />
              ))}
            </View>

            {reviews.length > visibleReviews && (
              <TouchableOpacity 
                style={styles.seeMoreButton}
                onPress={() => setShowAllReviews(true)}
              >
                <Text style={styles.seeMoreText}>Voir plus d'avis</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <Text style={[styles.header, { marginTop: SIZES.padding }]}>Donnez votre avis</Text>
        
        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>Notez votre expérience</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                filled={star <= rating} 
                onPress={() => handleRating(star)} 
              />
            ))}
          </View>
          <Text style={styles.ratingText}>
            {rating > 0 ? `Vous avez noté ${rating} étoile${rating > 1 ? 's' : ''}` : 'Sélectionnez une note'}
          </Text>
        </View>
         <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.feedbackSection}>
          <Text style={styles.sectionTitle}>Votre feedback</Text>
          <TextInput
            style={styles.feedbackInput}
            multiline
            numberOfLines={5}
            placeholder="Dites-nous ce que vous aimez ou ce que nous pourrions améliorer..."
            placeholderTextColor={COLORS.gray}
            value={feedback}
            onChangeText={setFeedback}
          />
        </View>
        </KeyboardAvoidingView>

        <TouchableOpacity 
          style={[styles.submitButton, submitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.submitButtonText}>Envoyer mon avis</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Modal pour tous les avis */}
      <Modal
        visible={showAllReviews}
        animationType="slide"
        onRequestClose={() => setShowAllReviews(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tous les avis</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowAllReviews(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={allReviews}
            renderItem={({ item }) => <ReviewItem review={item} />}
            keyExtractor={item => item.id}
            onEndReached={loadMoreReviews}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? <ActivityIndicator size="small" color={COLORS.primary} /> : null
            }
            contentContainerStyle={styles.modalContent}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  scrollContainer: {
    padding: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  header: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: SIZES.padding,
    textAlign: 'center',
  },
  noReviews: {
    ...FONTS.body4,
    color: COLORS.gray,
    textAlign: 'center',
    marginVertical: SIZES.padding,
  },
  reviewsContainer: {
    marginBottom: SIZES.padding,
  },
  reviewItem: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  reviewUser: {
    ...FONTS.body3,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  reviewStars: {
    flexDirection: 'row',
  },
  reviewText: {
    ...FONTS.body4,
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  reviewDate: {
    ...FONTS.body4,
    color: COLORS.gray,
    fontSize: 12,
    textAlign: 'right',
  },
  seeMoreButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.base,
    alignItems: 'center',
    marginVertical: SIZES.base,
  },
  seeMoreText: {
    ...FONTS.body4,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  ratingSection: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.base,
  },
  star: {
    marginHorizontal: 5,
  },
  ratingText: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  feedbackSection: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  feedbackInput: {
    ...FONTS.body4,
    color: COLORS.black,
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
  },
  submitButtonText: {
    ...FONTS.body3,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  // Styles pour la modal
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.primary,
  },
  modalTitle: {
    ...FONTS.h2,
    color: COLORS.white,
  },
  closeButton: {
    padding: SIZES.base,
  },
  closeButtonText: {
    ...FONTS.h1,
    color: COLORS.white,
  },
  modalContent: {
    padding: SIZES.padding,
  },
});

export default FeedbackScreen;