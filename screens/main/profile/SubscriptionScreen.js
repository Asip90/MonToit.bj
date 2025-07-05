// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
// import { COLORS, SIZES, FONTS } from '../../../constants/Theme';
// import SubscriptionCard from '../../../components/SubscriptionCard'; // Nous créerons ce composant ensuite

// const SubscriptionScreen = ({ navigation }) => {
//   const [selectedPlan, setSelectedPlan] = useState(null);

//   const subscriptionPlans = [
//     {
//       id: 'free',
//       title: 'Formule Gratuite - Starter',
//       price: '0 FCFA / mois',
//       duration: '',
//       features: [
//         '2 annonces gratuites / mois',
//         'Jusqu\'à 3 photos par annonce',
//         'Affichage pendant 15 jours',
//         'Accès à la messagerie interne',
//         'Affichage standard'
//       ],
//       limitations: [
//         'Pas de vidéos',
//         'Pas de badge',
//         'Pas de statistiques',
//         'Affichage en bas de liste'
//       ],
//       color: COLORS.primary,
//       icon: 'star-outline'
//     },
//     {
//       id: 'premium',
//       title: 'Formule Premium - Professionnel léger',
//       prices: [
//         '2 500 FCFA / mois',
//         '6 000 FCFA / 3 mois',
//         '20 000 FCFA / an'
//       ],
//       features: [
//         '10 annonces actives simultanément',
//         'Jusqu\'à 8 photos par annonce',
//         '1 vidéo par annonce',
//         'Affichage pendant 30 jours',
//         'Affichage prioritaire',
//         'Statistiques de vues',
//         'Badge PREMIUM',
//         'Support prioritaire standard'
//       ],
//       color: COLORS.orange,
//       icon: 'rocket'
//     },
//     {
//       id: 'vip',
//       title: 'Formule VIP ÉLITE - Pro Agent / Agence',
//       prices: [
//         '10 000 FCFA / mois',
//         '25 000 FCFA / 3 mois',
//         '80 000 FCFA / an'
//       ],
//       features: [
//         'Annonces illimitées',
//         'Photos illimitées',
//         'Jusqu\'à 10 vidéos par annonce',
//         'Affichage pendant 90 jours renouvelable',
//         'Annonces toujours en haut des résultats',
//         'Badge VIP ÉLITE',
//         'Statistiques avancées',
//         'Conseils pour optimiser ses annonces',
//         '2 campagnes promotionnelles gratuites / mois',
//         'Support client prioritaire personnalisé'
//       ],
//       color: COLORS.secondary,
//       icon: 'crown'
//     },
//     {
//       id: 'single',
//       title: 'Paiement à l\'unité',
//       price: '1 000 FCFA / annonce',
//       features: [
//         '1 annonce pendant 30 jours',
//         'Jusqu\'à 3 photos',
//         'Pas de vidéo',
//         'Affichage standard'
//       ],
//       color: COLORS.gray,
//       icon: 'cash'
//     }
//   ];

//   const handleSelectPlan = (planId) => {
//     setSelectedPlan(planId);
//     // Ici vous pourriez naviguer vers l'écran de paiement
//     // navigation.navigate('Payment', { plan: planId });
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={[FONTS.h2, styles.header]}>🔐 Nos Formules d'Abonnement</Text>
//       <Text style={[FONTS.body4, styles.subtitle]}>
//         Choisissez votre formule, maximisez vos chances de louer rapidement
//       </Text>

//       {subscriptionPlans.map((plan) => (
//         <SubscriptionCard
//           key={plan.id}
//           plan={plan}
//           isSelected={selectedPlan === plan.id}
//           onSelect={() => handleSelectPlan(plan.id)}
//         />
//       ))}

//       <View style={styles.infoBox}>
//         <MaterialIcons name="info" size={24} color={COLORS.primary} />
//         <Text style={[FONTS.body4, styles.infoText]}>
//           Tous les abonnements sont renouvelables automatiquement et peuvent être annulés à tout moment.
//         </Text>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: SIZES.padding,
//     backgroundColor: COLORS.lightGray,
//   },
//   header: {
//     color: COLORS.black,
//     marginBottom: SIZES.base,
//     textAlign: 'center',
//   },
//   subtitle: {
//     color: COLORS.gray,
//     marginBottom: SIZES.padding,
//     textAlign: 'center',
//   },
//   infoBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//     borderRadius: SIZES.radius,
//     padding: SIZES.base,
//     marginTop: SIZES.padding,
//   },
//   infoText: {
//     flex: 1,
//     marginLeft: SIZES.base,
//     color: COLORS.gray,
//   },
// });

// export default SubscriptionScreen;

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../../constants/Theme';
import { LinearGradient } from 'expo-linear-gradient';

const SubscriptionScreen = ({ navigation }) => {
  const [currentPlan] = useState('free'); // À remplacer par la valeur réelle du plan utilisateur
  const [selectedPlan, setSelectedPlan] = useState(null);

  const subscriptionPlans = [
    {
      id: 'free',
      title: 'Starter (Gratuit)',
      price: '0 FCFA/mois',
      features: [
        { icon: 'format-list-numbered', text: '2 annonces/mois gratuites' },
        { icon: 'image', text: '3 photos/annonce' },
        { icon: 'clock', text: '15 jours de visibilité' },
        { icon: 'email', text: 'Messagerie incluse' },
        { icon: 'cash', text: 'À partir de la 3ème annonce: 1 000 FCFA/annonce' }
      ],
      color: ['#4CAF50', '#8BC34A'],
      icon: 'rocket-launch'
    },
    {
      id: 'premium',
      title: 'Premium',
      prices: [
        { duration: '1 mois', price: '2 500 FCFA' },
        { duration: '3 mois', price: '6 000 FCFA', popular: true },
        { duration: '1 an', price: '20 000 FCFA', discount: 'Économisez 30%' }
      ],
      features: [
        { icon: 'home', text: '10 annonces simultanées' },
        { icon: 'image', text: '8 photos/annonce' },
        { icon: 'video', text: '1 vidéo/annonce' },
        { icon: 'trending-up', text: 'Statistiques de vues' },
        { icon: 'certificate', text: 'Badge Premium' }
      ],
      color: ['#2196F3', '#03A9F4'],
      icon: 'crown'
    },
    {
      id: 'vip',
      title: 'VIP Élite',
      prices: [
        { duration: '1 mois', price: '10 000 FCFA' },
        { duration: '3 mois', price: '25 000 FCFA' },
        { duration: '1 an', price: '80 000 FCFA', discount: 'Économisez 35%' }
      ],
      features: [
        { icon: 'infinity', text: 'Annonces illimitées' },
        { icon: 'image', text: 'Photos illimitées' },
        { icon: 'video', text: '10 vidéos/annonce' },
        { icon: 'view-dashboard-edit-outline', text: 'Statistiques avancées' },
        { icon: 'whatsapp', text: 'Support WhatsApp prioritaire' }
      ],
      color: ['#9C27B0', '#E91E63'],
      icon: 'diamond'
    }
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Abonnements</Text>
        <Text style={styles.headerSubtitle}>Choisissez la formule qui vous convient</Text>
      </View>

      {/* Plan actuel */}
      <View style={styles.currentPlanContainer}>
        <Text style={styles.sectionTitle}>VOTRE PLAN ACTUEL</Text>
        <LinearGradient 
          colors={['#4CAF50', '#8BC34A']} 
          style={styles.currentPlanCard}
          start={{x: 0, y: 0}} end={{x: 1, y: 0}}
        >
          <View style={styles.planHeader}>
            <MaterialCommunityIcons name="rocket-launch" size={24} color="white" />
            <Text style={styles.planTitle}>Starter (Gratuit)</Text>
          </View>
          <Text style={styles.planStatus}>Actif</Text>
          
          <View style={styles.planFeatures}>
            {subscriptionPlans[0].features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <MaterialCommunityIcons name={feature.icon} size={16} color="white" />
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </View>

      {/* Plans disponibles */}
      <View style={styles.availablePlans}>
        <Text style={styles.sectionTitle}>PLANS DISPONIBLES</Text>
        
        {subscriptionPlans.filter(plan => plan.id !== 'free').map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            <LinearGradient 
              colors={plan.color} 
              style={styles.planHeader}
              start={{x: 0, y: 0}} end={{x: 1, y: 0}}
            >
              <MaterialCommunityIcons name={plan.icon} size={24} color="white" />
              <Text style={styles.planTitle}>{plan.title}</Text>
            </LinearGradient>

            <View style={styles.priceOptions}>
              {plan.prices.map((option, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.priceOption,
                    option.popular && styles.popularOption
                  ]}
                  onPress={() => navigation.navigate('Payment', { plan: plan.id, option })}
                >
                  {option.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>POPULAIRE</Text>
                    </View>
                  )}
                  <Text style={styles.priceDuration}>{option.duration}</Text>
                  <Text style={styles.priceAmount}>{option.price}</Text>
                  {option.discount && (
                    <Text style={styles.priceDiscount}>{option.discount}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.planFeatures}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <MaterialCommunityIcons name={feature.icon} size={16} color={COLORS.primary} />
                  <Text style={styles.featureText}>{feature.text}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={() => navigation.navigate('Payment', { plan: plan.id })}
            >
              <Text style={styles.upgradeButtonText}>Passer à {plan.title}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Option paiement à l'unité */}
      <View style={styles.payPerListing}>
        <Text style={styles.sectionTitle}>OPTION SANS ABONNEMENT</Text>
        <View style={styles.payPerCard}>
          <View style={styles.payPerHeader}>
            <MaterialIcons name="attach-money" size={24} color={COLORS.orange} />
            <Text style={styles.payPerTitle}>Paiement par annonce</Text>
          </View>
          <Text style={styles.payPerPrice}>1 000 FCFA par annonce</Text>
          
          <View style={styles.planFeatures}>
            <View style={styles.featureItem}>
              <MaterialIcons name="check" size={16} color={COLORS.primary} />
              <Text style={styles.featureText}>1 annonce valide 30 jours</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="check" size={16} color={COLORS.primary} />
              <Text style={styles.featureText}>Jusqu'à 3 photos</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialIcons name="close" size={16} color={COLORS.gray} />
              <Text style={styles.featureTextDisabled}>Pas de vidéo</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.payPerButton}
            onPress={() => navigation.navigate('Payment', { plan: 'single' })}
          >
            <Text style={styles.payPerButtonText}>Publier une annonce</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.padding,
    backgroundColor: '#f9f9f9',
    paddingBottom: 40
  },
  header: {
    marginBottom: SIZES.padding,
    alignItems: 'center'
  },
  headerTitle: {
    ...FONTS.h1,
    color: COLORS.black,
    fontWeight: 'bold'
  },
  headerSubtitle: {
    ...FONTS.body3,
    color: COLORS.gray
  },
  sectionTitle: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginBottom: SIZES.base,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  currentPlanContainer: {
    marginBottom: SIZES.padding * 2
  },
  currentPlanCard: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    elevation: 2
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
    justifyContent: 'center',
    padding: 5

  },
  planTitle: {
    ...FONTS.h3,
    color: 'white',
    marginLeft: SIZES.base,
    fontWeight: 'bold'
  },
  planStatus: {
    ...FONTS.body4,
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: SIZES.base,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: SIZES.base
  },
  planFeatures: {
    // marginTop: SIZES.base,
    // padding: 20
    marginLeft: 20
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base / 2
  },
  featureText: {
    ...FONTS.body4,
    color: 'white',
    marginLeft: SIZES.base / 2
  },
  availablePlans: {
    marginBottom: SIZES.padding * 2
  },
  planCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    elevation: 2,
    overflow: 'hidden',
    // padding: 5 
  },
  
  priceOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    marginHorizontal: -SIZES.base / 2,
  },
  priceOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.base / 2,
    position: 'relative',
    minHeight: 100,
  },
  priceContent: {
    alignItems: 'center',
  },
  priceDuration: {
    ...FONTS.body4,
    color: COLORS.gray,
    textAlign: 'center',
  },
  priceAmount: {
    ...FONTS.h4,
    color: COLORS.black,
    fontWeight: 'bold',
    marginVertical: 2,
    textAlign: 'center',
  },
  priceDiscount: {
    ...FONTS.body4,
    fontSize: 10,
    color: COLORS.primary,
    textAlign: 'center',
  },


  popularOption: {
    borderColor: COLORS.primary,
    backgroundColor: '#f0f8ff'
  },
  popularBadge: {
    position: 'absolute',
    top: -15,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.base,
    paddingVertical: 2,
    borderRadius: 10
  },
  popularBadgeText: {
    ...FONTS.body4,
    fontSize: 7,
    color: 'white',
    fontWeight: 'bold'
  },
  // priceDuration: {
  //   ...FONTS.body4,
  //   color: COLORS.gray
  // },
  // priceAmount: {
  //   ...FONTS.h4,
  //   color: COLORS.black,
  //   fontWeight: 'bold',
  //   marginVertical: 2
  // },
  // priceDiscount: {
  //   ...FONTS.body4,
  //   fontSize: 10,
  //   color: COLORS.primary
  // },
  featureText: {
    ...FONTS.body4,
    color: COLORS.black,
    marginLeft: SIZES.base / 2
  },
  upgradeButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.base,
    margin: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center'
  },
  upgradeButtonText: {
    ...FONTS.body3,
    color: 'white',
    fontWeight: 'bold'
  },
  payPerListing: {
    marginBottom: SIZES.padding
  },
  payPerCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    elevation: 2
  },
  payPerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base
  },
  payPerTitle: {
    ...FONTS.h3,
    color: COLORS.black,
    marginLeft: SIZES.base,
    fontWeight: 'bold'
  },
  payPerPrice: {
    ...FONTS.h4,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: SIZES.base
  },
  featureTextDisabled: {
    ...FONTS.body4,
    color: COLORS.gray,
    marginLeft: SIZES.base / 2
  },
  payPerButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: SIZES.base,
    marginTop: SIZES.base,
    borderRadius: SIZES.radius,
    alignItems: 'center'
  },
  payPerButtonText: {
    ...FONTS.body3,
    color: COLORS.primary,
    fontWeight: 'bold'
  }
});

export default SubscriptionScreen;