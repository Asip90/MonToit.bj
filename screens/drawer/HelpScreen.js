import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/Theme';

const HelpsScreen = () => {
  const helpTopics = [
    {
      title: "Comment publier une annonce?",
      content: "Pour publier une annonce, allez dans l'onglet 'Publier' et remplissez le formulaire avec les détails de votre propriété."
    },
    {
      title: "Comment contacter un propriétaire?",
      content: "Cliquez sur le bouton 'Contacter' dans la page de détails de l'annonce pour envoyer un message au propriétaire."
    },
    {
      title: "Comment filtrer les recherches?",
      content: "Utilisez les filtres disponibles dans la page de recherche pour affiner vos résultats selon vos critères."
    },
    {
      title: "Problème de connexion",
      content: "Si vous avez des problèmes de connexion, vérifiez votre mot de passe ou utilisez l'option 'Mot de passe oublié'."
    },
  ];

  const contactSupport = () => {
    Linking.openURL('mailto:admin@thebestchoice.space?subject=Aide%20sur%20MonToit.bj');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Aide & Support</Text>
        
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Questions fréquentes</Text>
          {helpTopics.map((topic, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={styles.faqQuestion}>{topic.title}</Text>
              <Text style={styles.faqAnswer}>{topic.content}</Text>
            </View>
          ))}
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contactez-nous</Text>
          <Text style={styles.contactText}>
            Vous ne trouvez pas réponse à votre question? Notre équipe support est disponible pour vous aider.
          </Text>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={contactSupport}
          >
            <Text style={styles.contactButtonText}>Contacter le support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    padding: SIZES.padding,
  },
  header: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.primary,
    marginBottom: SIZES.base,
  },
  faqSection: {
    marginBottom: SIZES.padding * 2,
  },
  faqItem: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
  },
  faqQuestion: {
    ...FONTS.h4,
    color: COLORS.black,
    marginBottom: SIZES.base / 2,
  },
  faqAnswer: {
    ...FONTS.body4,
    color: COLORS.gray,
  },
  contactSection: {
    marginBottom: SIZES.padding,
  },
  contactText: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: SIZES.padding,
  },
  contactButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
  },
  contactButtonText: {
    ...FONTS.body3,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default HelpsScreen;