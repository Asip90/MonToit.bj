import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/Theme';

const SettingScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const settingsOptions = [
    {
      title: "Compte",
      options: [
        { label: "Modifier le profil", icon: "person" },
        { label: "Changer le mot de passe", icon: "lock" },
      ]
    },
    {
      title: "Préférences",
      options: [
        { 
          label: "Notifications", 
          icon: "notifications",
          rightComponent: (
            <Switch
              value={notificationsEnabled}
              onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
              thumbColor={COLORS.white}
              trackColor={{ false: COLORS.gray, true: COLORS.primary }}
            />
          )
        },
        { 
          label: "Mode sombre", 
          icon: "moon",
          rightComponent: (
            <Switch
              value={darkModeEnabled}
              onValueChange={() => setDarkModeEnabled(!darkModeEnabled)}
              thumbColor={COLORS.white}
              trackColor={{ false: COLORS.gray, true: COLORS.primary }}
            />
          )
        },
      ]
    },
    {
      title: "Plus",
      options: [
        { label: "Aide & Support", icon: "help" },
        { label: "À propos de MonToit.bj", icon: "information" },
        { label: "Déconnexion", icon: "logout", color: COLORS.primary },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView
       showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>Paramètres</Text>
        
        {settingsOptions.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.options.map((option, optionIndex) => (
                <TouchableOpacity 
                  key={optionIndex} 
                  style={styles.option}
                  onPress={() => console.log(option.label)}
                >
                  <View style={styles.optionLeft}>
                    {/* Ici vous pourriez ajouter une icône avec react-native-vector-icons */}
                    <Text style={[styles.optionText, { color: option.color || COLORS.black }]}>
                      {option.label}
                    </Text>
                  </View>
                  {option.rightComponent && (
                    <View style={styles.optionRight}>
                      {option.rightComponent}
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
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
  section: {
    marginBottom: SIZES.padding * 1.5,
  },
  sectionTitle: {
    ...FONTS.h4,
    color: COLORS.gray,
    marginBottom: SIZES.base,
  },
  sectionContent: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    ...FONTS.body3,
    marginLeft: SIZES.base,
  },
  optionRight: {
    // Style pour les composants à droite (comme les switches)
  },
});

export default SettingScreen;