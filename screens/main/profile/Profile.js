
import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { UserContext } from '../../../context/AuthContext';
import { db } from '../../../src/api/FirebaseConfig';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { COLORS, SIZES, FONTS } from '../../../constants/Theme';

const ProfileScreen = ({ navigation }) => {
  const { userData } = useContext(UserContext);
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      if (!userData?.uid) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // Charger le profil utilisateur
      const userDoc = await getDoc(doc(db, 'users', userData.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      } else {
        setUserProfile({
          email: userData.email || '',
          name: userData.displayName || '',
          photoURL: userData.photoURL || null
        });
      }

      // Charger les posts de l'utilisateur (seulement 3 pour l'aperçu)
      const postsQuery = query(
        collection(db, 'posts'),
        where('userId', '==', userData.uid),
        orderBy('createdAt', 'desc')
      );
      const postsSnapshot = await getDocs(postsQuery);
      setUserPosts(postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Charger le nombre de favoris
      const favoritesQuery = query(
        collection(db, 'users', userData.uid, 'favorites')
      );
      const favoritesSnapshot = await getDocs(favoritesQuery);
      setFavoritesCount(favoritesSnapshot.size);
    } catch (error) {
      console.error("Erreur de chargement:", error);
      Alert.alert("Erreur", "Impossible de charger les données");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      loadData();
    }
  }, [userData, loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const renderPostItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.postItem}
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
    >
      <Image 
        source={{ uri: item.imageUrls?.[0] || 'https://via.placeholder.com/150' }} 
        style={styles.postImage}
      />
      <View style={styles.postInfo}>
        <Text style={styles.postTitle} numberOfLines={1}>{item.title || 'Sans titre'}</Text>
        <View style={styles.postMeta}>
          <Text style={styles.postPrice}>{item.price ? `${item.price} FCFA` : 'Prix sur demande'}</Text>
          <View style={styles.postLocation}>
            <Ionicons name="location-outline" size={14} color={COLORS.gray} />
            <Text style={styles.locationText}>{item.location || 'Localisation non précisée'}</Text>
          </View>
        </View>
        <Text style={styles.postDate}>
          {item.createdAt?.toDate ? new Date(item.createdAt.toDate()).toLocaleDateString() : ''}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (!userData) {
    return (
      <View style={styles.authContainer}>
        <Image 
          source={require('../../../assets/icon.png')} 
          style={styles.logo}
        />
        <Text style={styles.authText}>Connectez-vous pour gérer vos propriétés</Text>
        <TouchableOpacity 
          style={styles.authButton}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.authButtonText}>Connexion / Inscription</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const { logoutUser } = useContext(UserContext);

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Se Déconnecter",
          onPress: async () => {
            if (logoutUser && typeof logoutUser === 'function') {
              const success = await logoutUser();
              if (!success) {
                Alert.alert("Erreur", "La déconnexion a échoué");
              }
            }
          },
          style: "destructive",
        },
      ]
    );
  };

 

  const profileData = userProfile || {
    email: userData.email || '',
    name: userData.displayName || userData.email?.split('@')[0] || 'Utilisateur',
    photoURL: userData.photoURL || null,
    phone: ''
  };

  return (
    <ScrollView
    showsVerticalScrollIndicator={false}
      style={styles.container}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
        />
      }
    >
      {/* Header Zameen-like */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon Profil</Text>
      </View>

      {/* Section profil */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={profileData.photoURL ? 
              { uri: profileData.photoURL } : 
              require('../../../assets/images/default-profile.jpg')}
            style={styles.avatar}
          />
        </View>

        <Text style={styles.userName}>{profileData.name}</Text>
        
        <View style={styles.profileActions}>
          <TouchableOpacity 
            style={styles.profileActionButton}
            onPress={() => navigation.navigate('EditProfile', { profileData })}
          >
            <Ionicons name="pencil-outline" size={18} color={COLORS.primary} />
            <Text style={styles.profileActionText}>Modifier</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.profileActionButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={18} color={COLORS.primary} />
            <Text style={styles.profileActionText}>Paramètres</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Statistiques Zameen-like */}
      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statItem}>
          <View style={styles.statIconCircle}>
            <FontAwesome name="home" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.statValue}>{userPosts.length}</Text>
          <Text style={styles.statLabel}>Annonces</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.statItem}
          onPress={() => navigation.navigate('Favorites')}
        >
          <View style={styles.statIconCircle}>
            <AntDesign name="heart" size={18} color={COLORS.primary} />
          </View>
          <Text style={styles.statValue}>{favoritesCount}</Text>
          <Text style={styles.statLabel}>Favoris</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statItem}>
          <View style={styles.statIconCircle}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={COLORS.primary} />
          </View>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Messages</Text>
        </TouchableOpacity>
      </View>

      {/* Section Mes Annonces */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mes Annonces</Text>
          {userPosts.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('MyProperties')}>
              <Text style={styles.seeAll}>Tout voir</Text>
            </TouchableOpacity>
          )}
        </View>

        {userPosts.length > 0 ? (
          <FlatList
            data={userPosts.slice(0, 3)} // Seulement 3 éléments comme dans Zameen
            renderItem={renderPostItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.postsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Image 
              source={require('../../../assets/adaptive-icon.png')} 
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>Vous n'avez pas encore d'annonces</Text>
            <Text style={styles.emptySubtext}>Publiez votre première propriété</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('PostAd')}
            >
              <Text style={styles.addButtonText}>+ Publier une annonce</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Autres options du menu comme dans Zameen */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.black} />
          <Text style={styles.menuText}>Notifications</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.gray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="wallet-outline" size={22} color={COLORS.black} />
          <Text style={styles.menuText}>Abonnements</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.gray} />
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={22} color={COLORS.black} />
          <Text style={styles.menuText}>Aide & Support</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.gray} />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
          <Ionicons name='log-out' size={22} color={COLORS.error || '#e74c3c'} />
          <Text style={styles.logoutText }>Deconnexion</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color={COLORS.gray} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.white,
    textAlign: 'center',
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
    backgroundColor: COLORS.white,
  },
  logo: {
    width: 120,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  authText: {
    ...FONTS.body3,
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.black,
  },
  authButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 4,
    elevation: 2,
  },
  authButtonText: {
    color: COLORS.white,
    ...FONTS.h4,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    marginBottom: 10,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  userName: {
    ...FONTS.h2,
    marginBottom: 15,
    color: COLORS.black,
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  profileActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 20,
  },
  profileActionText: {
    marginLeft: 5,
    color: COLORS.primary,
    ...FONTS.body4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: COLORS.white,
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
    width: '30%',
  },
  statIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    ...FONTS.h3,
    color: COLORS.black,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  statLabel: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  section: {
    backgroundColor: COLORS.white,
    marginBottom: 10,
    paddingVertical: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.black,
    fontWeight: 'bold',
  },
  seeAll: {
    ...FONTS.body4,
    color: COLORS.primary,
  },
  postsList: {
    paddingBottom: 5,
  },
  postItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  postImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 12,
  },
  postInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  postTitle: {
    ...FONTS.body3,
    color: COLORS.black,
    marginBottom: 5,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  postPrice: {
    ...FONTS.body4,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginRight: 15,
  },
  postLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginLeft: 3,
  },
  postDate: {
    ...FONTS.body4,
    color: COLORS.gray,
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 15,
    opacity: 0.7,
  },
  emptyText: {
    ...FONTS.h4,
    color: COLORS.black,
    marginBottom: 5,
  },
  emptySubtext: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 4,
  },
  addButtonText: {
    color: COLORS.white,
    ...FONTS.h4,
    fontWeight: 'bold',
  },
  menuSection: {
    backgroundColor: COLORS.white,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  menuText: {
    ...FONTS.body3,
    color: COLORS.black,
    flex: 1,
    marginLeft: 15,
  },
  logoutText: {
    ...FONTS.body3,
    color: COLORS.error || '#e74c3c',
    flex: 1,
    marginLeft: 15,
    fontWeight: '500',
    marginLeft: SIZES.base,
  },
});

export default ProfileScreen;