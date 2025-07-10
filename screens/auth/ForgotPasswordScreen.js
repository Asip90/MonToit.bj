import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  SafeAreaView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../src/api/FirebaseConfig';
import { COLORS } from '../../constants/Theme';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const emailInputRef = useRef(null);

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Champ Requis', 'Veuillez entrer votre email');
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Email envoyé',
        `Un lien de réinitialisation a été envoyé à ${email}. Vérifiez votre boîte mail (et vos spams)`,
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    } catch (error) {
      handleResetError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetError = (error) => {
    let message = 'Une erreur est survenue';
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'Aucun compte associé à cet email';
        break;
      case 'auth/invalid-email':
        message = 'Format d\'email invalide';
        break;
      case 'auth/network-request-failed':
        message = 'Problème de connexion. Vérifiez votre réseau';
        break;
    }
    Alert.alert('Erreur', message);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header cohérent avec la page de login */}
          <View style={styles.header}>
            <Image 
              source={require('../../assets/icon.png')} 
              style={styles.logo}
            />
            <Text style={styles.title}>Réinitialisation du mot de passe</Text>
            <Text style={styles.subtitle}>
              Entrez votre email pour recevoir le lien de réinitialisation
            </Text>
          </View>

          {/* Formulaire simplifié */}
          <View style={styles.form}>
            {/* Champ Email unique */}
            <View style={styles.inputGroup}>
              <Ionicons name="mail-outline" size={20} color={COLORS.gray} style={styles.icon} />
              <TextInput
                ref={emailInputRef}
                style={styles.input}
                placeholder="Votre email enregistré"
                placeholderTextColor={COLORS.gray}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="send"
                onSubmitEditing={handleResetPassword}
              />
            </View>

            {/* Bouton d'envoi */}
            <TouchableOpacity
              style={[styles.resetButton, isLoading && styles.buttonDisabled]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.resetButtonText}>ENVOYER LE LIEN</Text>
              )}
            </TouchableOpacity>

            {/* Solution alternative pour utilisateurs béninois */}
            <View style={styles.alternativeHelp}>
              <Text style={styles.helpText}>
                Vous ne recevez pas l'email ? 
              </Text>
              <TouchableOpacity onPress={() => Alert.alert(
                'Assistance',
                'Contactez notre support au +229 XX XX XX XX ou via WhatsApp'
              )}>
                <Text style={styles.helpLink}>Obtenir de l'aide</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Lien retour vers login */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={18} color={COLORS.primary} />
              <Text style={styles.backText}>Retour à la connexion</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Styles cohérents avec LoginScreen (à adapter selon votre fichier Theme.js)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: 30,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 25,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: COLORS.text,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  resetButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  alternativeHelp: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  helpText: {
    color: COLORS.gray,
    fontSize: 14,
  },
  helpLink: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 5,
  },
  footer: {
    marginTop: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: COLORS.primary,
    fontWeight: '500',
    marginLeft: 5,
  },
});

export default ForgotPasswordScreen;