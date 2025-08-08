// ListingCard.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  Dimensions
} from 'react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { COLORS } from '../constants/Theme';
import SecureWatermarkedImage from './SecureWatermarkedImage';

const ListingCard = ({ 
  item, 
  navigation, 
  onToggleFavorite, 
  isVisible,
  cardWidth = 200,
  imageHeight = 150
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = item.imageUrls || [];
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  // Animation fluide pour le changement d'image
  const animateImageChange = (newIndex) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentImageIndex(newIndex);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  // Défilement automatique uniquement si la carte est visible
  useEffect(() => {
    if (isVisible && images.length > 1) {
      timerRef.current = setInterval(() => {
        animateImageChange((currentImageIndex + 1) % images.length);
      }, 3000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isVisible, images.length, currentImageIndex]);

  const handleImagePress = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    navigation.navigate('PostDetail', { postId: item.id });
  };

  return (
    <TouchableOpacity 
      style={[styles.listingCard, { width: cardWidth }]}
      activeOpacity={0.8}
      onPress={handleImagePress}
    >
      <View style={[styles.imageContainer, { height: imageHeight }]}>
        {images.length > 0 ? (
          <>
            <Animated.View style={[styles.imageWrapper, { opacity: fadeAnim }]}>
              <SecureWatermarkedImage
                source={{ uri: images[currentImageIndex] }}
                style={styles.listingImage}
                contentFit="cover"
                transition={300}
              />
            </Animated.View>
            
            {/* Indicateurs de position */}
            {images.length > 1 && (
              <View style={styles.dotsContainer}>
                {images.map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (timerRef.current) clearInterval(timerRef.current);
                      animateImageChange(index);
                    }}
                  >
                    <View 
                      style={[
                        styles.dot, 
                        index === currentImageIndex && styles.activeDot
                      ]} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        ) : (
          <View style={styles.placeholderImage}>
            <AntDesign name="picture" size={40} color={COLORS.lightGray} />
          </View>
        )}
        
        {item.isBoosted && (
          <View style={styles.boostedBadge}>
            <Text style={styles.boostedText}>Boosté</Text>
          </View>
        )}
        
        {onToggleFavorite && (
          <TouchableOpacity 
            onPress={() => onToggleFavorite(item.id)} 
            style={styles.favoriteButton}
          >
            <AntDesign 
              name={item.isFavorite ? "heart" : "hearto"} 
              size={20} 
              color={item.isFavorite ? COLORS.gold : COLORS.white} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Détails de l'annonce */}
      <View style={styles.listingInfo}>
        <Text style={styles.listingPrice}>{item.price?.toLocaleString()} FCFA</Text>
        <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
        
        {item.bedrooms && item.bathrooms && item.area && (
          <View style={styles.featuresContainer}>
            {item.bedrooms && (
              <View style={styles.featureItem}>
                <MaterialIcons name="hotel" size={14} color={COLORS.darkgray} />
                <Text style={styles.featureText}>{item.bedrooms}</Text>
              </View>
            )}
            {item.bathrooms && (
              <View style={styles.featureItem}>
                <MaterialIcons name="bathtub" size={14} color={COLORS.darkgray} />
                <Text style={styles.featureText}>{item.bathrooms}</Text>
              </View>
            )}
            {item.area && (
              <View style={styles.featureItem}>
                <MaterialIcons name="straighten" size={14} color={COLORS.darkgray} />
                <Text style={styles.featureText}>{item.area}m²</Text>
              </View>
            )}
          </View>
        )}
        
        <View style={styles.boostedLocation}>
          <MaterialIcons name="location-on" size={14} color={COLORS.primary} />
          <Text style={styles.boostedLocationText} numberOfLines={1}>
            {typeof item.location === 'string' ? item.location : item.location?.display_name || 'Localisation non précisée'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listingCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
    elevation: 2,
    height: 'auto',
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
  },
  listingImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.lightGray2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.white,
    width: 10,
    height: 10,
  },
  boostedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  boostedText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listingInfo: {
    padding: 8,
  },
  listingPrice: {
    fontWeight: 'bold',
    color: COLORS.primary,
    fontSize: 14,
  },
  listingTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginBottom: 4,
  },
  featuresContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  featureText: {
    fontSize: 12,
    color: COLORS.darkgray,
    marginLeft: 4,
  },
  boostedLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boostedLocationText: {
    fontSize: 12,
    color: COLORS.darkgray,
    marginLeft: 4,
    flexShrink: 1,
  },
});

export default ListingCard;