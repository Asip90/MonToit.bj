import React, { useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Image, 
  StatusBar,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { COLORS, SIZES, FONTS } from '../../constants/Theme';

const { height } = Dimensions.get('window');

// Création d'un composant de bouton animé pour la réutilisabilité
const AnimatedButton = ({ style, textStyle, onPress, text, delay }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) }));
  }, [delay, opacity, translateY]);

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity style={style} onPress={onPress} activeOpacity={0.8}>
        <Text style={textStyle}>{text}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};


export default function WelcomeScreen({ navigation }) {

  // Création des valeurs partagées pour les animations
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const titleTranslateY = useSharedValue(30);
  const subtitleTranslateY = useSharedValue(30);

  // Séquence d'animation au chargement de l'écran
  useEffect(() => {
    const animationConfig = { duration: 700, easing: Easing.bezier(0.25, 0.1, 0.25, 1) };
    
    // Animation du logo (fade in + scale)
    logoOpacity.value = withTiming(1, animationConfig);
    logoScale.value = withTiming(1, animationConfig);

    // Animation du titre (slide up + fade in)
    titleTranslateY.value = withDelay(200, withTiming(0, animationConfig));
    
    // Animation du sous-titre (slide up + fade in)
    subtitleTranslateY.value = withDelay(400, withTiming(0, animationConfig));

  }, [logoOpacity, logoScale, titleTranslateY, subtitleTranslateY]);

  // Styles animés
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textContainerAnimatedStyle = useAnimatedStyle(() => ({
    // Opacité gérée directement sur les textes pour un meilleur effet
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleTranslateY.value === 0 ? 1 : 0, // Apparaît seulement à la fin
  }));
  
  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleTranslateY.value === 0 ? 1 : 0, // Apparaît seulement à la fin
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  // Fonctions de navigation avec useCallback pour la performance
  const handleLogin = useCallback(() => navigation.navigate('LogIn'), [navigation]);
  const handleSignup = useCallback(() => navigation.navigate('SignUp'), [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Forme décorative en arrière-plan */}
      <View style={styles.backgroundShape} />

      {/* Section Logo/Image animée */}
      <View style={styles.imageContainer}>
        <Animated.View style={logoAnimatedStyle}>
          <Image 
            source={require('../../assets/icon.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      {/* Section Texte animée */}
      <Animated.View style={[styles.textContainer, textContainerAnimatedStyle]}>
          <Animated.Text style={[styles.title, titleAnimatedStyle]}>
            Bienvenue sur MonToit.bj
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, subtitleAnimatedStyle]}>
            Trouvez la maison de vos rêves parmi des milliers d'annonces vérifiées.
          </Animated.Text>
      </Animated.View>

      {/* Section Boutons animée */}
      <View style={styles.buttonContainer}>
        <AnimatedButton
          style={[styles.button, styles.loginButton]}
          textStyle={styles.buttonText}
          onPress={handleLogin}
          text="Se connecter"
          delay={600}
        />
        <AnimatedButton
          style={[styles.button, styles.signupButton]}
          textStyle={[styles.buttonText, {color: COLORS.primary}]}
          onPress={handleSignup}
          text="Créer un compte"
          delay={800}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'space-around', // Distribue l'espace de manière plus harmonieuse
    paddingHorizontal: SIZES.padding * 1.5,
    paddingBottom: SIZES.padding * 2,
  },
  backgroundShape: {
    position: 'absolute',
    top: -height * 0.15,
    right: -height * 0.15,
    width: height * 0.5,
    height: height * 0.5,
    borderRadius: height * 0.25,
    backgroundColor: COLORS.lightPrimary, // Une couleur très claire de votre thème
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: SIZES.padding * 2,
  },
  image: {
    width: SIZES.width * 0.5,
    height: SIZES.width * 0.5,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SIZES.radius,
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    height: 55,
    borderRadius: SIZES.radius * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.radius,
    // Ombre subtile pour un effet de relief
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
  },
  signupButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  buttonText: {
    ...FONTS.h4,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});