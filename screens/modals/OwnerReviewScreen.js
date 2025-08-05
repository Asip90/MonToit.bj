import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../constants/Theme';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../src/api/FirebaseConfig';
import { doc } from 'firebase/firestore';

const OwnerReviewsScreen = ({ route }) => {
  const { ownerId } = route.params;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const ownerRef = doc(db, 'users', ownerId);
        const reviewsRef = collection(ownerRef, 'reviews');
        const q = query(reviewsRef, orderBy('createdAt', 'desc'));
        
        const querySnapshot = await getDocs(q);
        const reviewsData = [];
        let totalRating = 0;

        querySnapshot.forEach((doc) => {
          const review = doc.data();
          reviewsData.push(review);
          totalRating += review.rating;
        });

        setReviews(reviewsData);
        setAverageRating(reviewsData.length > 0 ? totalRating / reviewsData.length : 0);
      } catch (error) {
        console.error('Erreur lors du chargement des avis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [ownerId]);

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Image 
          source={require('../../assets/images/default-profile.jpg')} 
          style={styles.reviewerImage}
        />
        <View style={styles.reviewerInfo}>
          <Text style={[FONTS.body3, styles.reviewerName]}>{item.reviewerName}</Text>
          <View style={styles.reviewRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <MaterialIcons
                key={star}
                name={star <= item.rating ? 'star' : 'star-border'}
                size={16}
                color={COLORS.orange}
              />
            ))}
          </View>
        </View>
      </View>
      {item.comment && (
        <Text style={[FONTS.body4, styles.reviewComment]}>{item.comment}</Text>
      )}
      <Text style={[FONTS.body4, styles.reviewDate]}>
        {item.createdAt?.toDate().toLocaleDateString() || 'Date inconnue'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* En-tête avec note moyenne */}
      <View style={styles.header}>
        <Text style={[FONTS.h3, styles.averageRating]}>
          {averageRating.toFixed(1)}
        </Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <MaterialIcons
              key={star}
              name={star <= Math.round(averageRating) ? 'star' : 'star-border'}
              size={24}
              color={COLORS.orange}
            />
          ))}
        </View>
        <Text style={[FONTS.body4, styles.reviewsCount]}>
          {reviews.length} avis
        </Text>
      </View>

      {/* Liste des avis */}
      <FlatList
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[FONTS.body4, styles.noReviews]}>
            Aucun avis pour ce propriétaire
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: SIZES.padding,
    // borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  averageRating: {
    fontSize: 36,
    color: COLORS.black,
  },
  starsContainer: {
    flexDirection: 'row',
    marginVertical: SIZES.base,
  },
  reviewsCount: {
    color: COLORS.gray,
  },
  listContent: {
    padding: SIZES.padding,
  },
  reviewItem: {
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SIZES.base,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    color: COLORS.black,
    fontWeight: 'bold',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  reviewDate: {
    color: COLORS.gray,
    fontSize: 12,
  },
  noReviews: {
    textAlign: 'center',
    color: COLORS.gray,
    marginTop: SIZES.padding,
  },
});

export default OwnerReviewsScreen;