import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Image, 
  StatusBar,
  TouchableOpacity 
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/Theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Logo/Image Section */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../assets/icon.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Text Section */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Bienvenue sur MonToit.bj</Text>
        <Text style={styles.subtitle}>
          Trouvez la maison de vos rêves parmi des milliers d'annonces vérifiées
        </Text>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => navigation.navigate('LogIn')}
        >
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.signupButton]}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={[styles.buttonText, {color: COLORS.primary}]}>
            Créer un compte
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding * 2,
  },
  imageContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding * 2,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SIZES.base,
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flex: 0.2,
    width: '100%',
    justifyContent: 'flex-end',
  },
  button: {
    height: 50,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.radius,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
  },
  signupButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  buttonText: {
    ...FONTS.h3,
    color: COLORS.white,
  },
});