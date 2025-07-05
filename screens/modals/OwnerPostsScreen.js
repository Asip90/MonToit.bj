import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { collection, query, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { db } from '../../src/api/FirebaseConfig';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SIZES } from '../../constants/Theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const PAGE_SIZE = 10;

const OwnerPostsScreen = () => {
  const navigation = useNavigation();
  const { ownerId, ownerName } = useRoute().params; // Ajoutez ownerName dans la navigation

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);

  const fetchPostsCount = useCallback(async () => {
    try {
      const q = query(
        collection(db, 'posts'),
        where('userId', '==', ownerId)
      );
      const snapshot = await getDocs(q);
      setTotalPosts(snapshot.size);
    } catch (err) {
      console.error('Erreur count posts:', err);
    }
  }, [ownerId]);

  const fetchPosts = useCallback(
    async (loadMore = false) => {
      if (loadMore && (loadingMore || reachedEnd)) return;

      loadMore ? setLoadingMore(true) : setLoading(true);
      try {
        let q = query(
          collection(db, 'posts'),
          where('userId', '==', ownerId),
          orderBy('createdAt', 'desc'),
          limit(PAGE_SIZE)
        );

        if (loadMore && lastDoc) {
          q = query(
            collection(db, 'posts'),
            where('userId', '==', ownerId),
            orderBy('createdAt', 'desc'),
            startAfter(lastDoc),
            limit(PAGE_SIZE)
          );
        }

        const snap = await getDocs(q);
        if (!snap.empty) {
          const fetched = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setPosts((prev) => (loadMore ? [...prev, ...fetched] : fetched));
          setLastDoc(snap.docs[snap.docs.length - 1]);
          if (fetched.length < PAGE_SIZE) setReachedEnd(true);
        } else if (!loadMore) {
          setPosts([]);
          setReachedEnd(true);
        } else {
          setReachedEnd(true);
        }
      } catch (err) {
        console.error('Erreur fetch posts propriétaire:', err);
      } finally {
        loadMore ? setLoadingMore(false) : setLoading(false);
      }
    },
    [ownerId, lastDoc, loadingMore, reachedEnd]
  );

  useEffect(() => {
    fetchPosts(false);
    fetchPostsCount();
  }, [ownerId]);

  const PostCard = ({ item }) => {
    const firstImage = item.imageUrls?.[0];
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
      >
        {firstImage ? (
          <Image 
            source={{ uri: firstImage }} 
            style={styles.thumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.thumbnail, styles.placeholder]}>
            <Ionicons name="image" size={32} color={COLORS.gray} />
          </View>
        )}

        <View style={styles.cardContent}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{item.price?.toLocaleString()} FCFA</Text>
            {item.transactionType === 'rent' && (
              <Text style={styles.pricePeriod}>/mois</Text>
            )}
          </View>
          
          <Text numberOfLines={1} style={styles.title}>
            {item.title}
          </Text>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={14} color={COLORS.gray} />
            <Text numberOfLines={1} style={styles.location}>
              {typeof item.location === 'string'
                ? item.location
                : item.location?.display_name || 'Localisation non spécifiée'}
            </Text>
          </View>
          
          <View style={styles.featuresContainer}>
            {item.bedrooms > 0 && (
              <View style={styles.featureBadge}>
                <MaterialIcons name="hotel" size={14} color={COLORS.primary} />
                <Text style={styles.featureText}>{item.bedrooms}</Text>
              </View>
            )}
            
            {item.bathrooms > 0 && (
              <View style={styles.featureBadge}>
                <MaterialIcons name="bathtub" size={14} color={COLORS.primary} />
                <Text style={styles.featureText}>{item.bathrooms}</Text>
              </View>
            )}
            
            {item.area > 0 && (
              <View style={styles.featureBadge}>
                <MaterialIcons name="straighten" size={14} color={COLORS.primary} />
                <Text style={styles.featureText}>{item.area} m²</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
      </TouchableOpacity>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Liste des Annonces</Text>
        <Text style={styles.headerSubtitle}>De {ownerName || 'Propriétaire'}</Text>
        <Text style={styles.countText}>{totalPosts} annonce{totalPosts > 1 ? 's' : ''}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <FlatList
        data={posts}
        renderItem={PostCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onEndReached={() => fetchPosts(true)}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator 
              size="small" 
              color={COLORS.primary} 
              style={styles.loadingMore} 
            />
          ) : reachedEnd ? (
            <Text style={styles.endText}>Vous avez vu toutes les annonces</Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="file-tray-outline" size={48} color={COLORS.gray} />
            <Text style={styles.emptyText}>Aucune annonce trouvée</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray2,
  },
  backButton: {
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginTop: 2,
  },
  countText: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 4,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white
  },
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.lightGray2,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray2,
  },
  cardContent: {
    padding: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  pricePeriod: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 4,
    marginBottom: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 13,
    color: COLORS.gray,
    marginLeft: 4,
    flex: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightPrimary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: COLORS.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 16,
    textAlign: 'center',
  },
  loadingMore: {
    marginVertical: 20,
  },
  endText: {
    textAlign: 'center',
    color: COLORS.gray,
    marginVertical: 20,
    fontSize: 14,
  },
});

export default OwnerPostsScreen;