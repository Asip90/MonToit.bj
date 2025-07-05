// // import React from 'react';
// // import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// // import { MaterialIcons } from '@expo/vector-icons';
// // import { COLORS, SIZES, FONTS } from '../constants/Theme';

// // const SubscriptionCard = ({ plan, isSelected, onSelect }) => {
// //   return (
// //     <TouchableOpacity
// //       style={[
// //         styles.card,
// //         { borderColor: plan.color },
// //         isSelected && { backgroundColor: `${plan.color}20` }
// //       ]}
// //       onPress={onSelect}
// //     >
// //       <View style={styles.cardHeader}>
// //         <MaterialIcons name={plan.icon} size={24} color={plan.color} />
// //         <Text style={[FONTS.h4, styles.cardTitle, { color: plan.color }]}>
// //           titre du plan . 
// //         </Text>
// //       </View>

// //       <View style={styles.priceContainer}>
// //         {plan.prices ? (
// //           plan.prices.map((price, index) => (
// //             <Text key={index} style={[FONTS.body3, styles.priceText]}>
// //               {price}
// //             </Text>
// //           ))
// //         ) : (
// //           <Text style={[FONTS.body3, styles.priceText]}>{plan.price}</Text>
// //         )}
// //       </View>

// //       <View style={styles.featuresContainer}>
// //         <Text style={[FONTS.body4, styles.sectionTitle]}>✅ Avantages :</Text>
// //         {plan.features.map((feature, index) => (
// //           <View key={index} style={styles.featureItem}>
// //             <Text style={[FONTS.body4, styles.featureText]}>{feature}</Text>
// //           </View>
// //         ))}
// //       </View>

// //       {plan.limitations && (
// //         <View style={styles.limitationsContainer}>
// //           <Text style={[FONTS.body4, styles.sectionTitle]}>⛔ Limitations :</Text>
// //           {plan.limitations.map((limitation, index) => (
// //             <View key={index} style={styles.featureItem}>
// //               <Text style={[FONTS.body4, styles.limitationText]}>{limitation}</Text>
// //             </View>
// //           ))}
// //         </View>
// //       )}

// //       <TouchableOpacity
// //         style={[styles.selectButton, { backgroundColor: plan.color }]}
// //         onPress={onSelect}
// //       >
// //         <Text style={[FONTS.body4, styles.buttonText]}>
// //           {isSelected ? 'Sélectionné' : 'Choisir cette formule'}
// //         </Text>
// //       </TouchableOpacity>
// //     </TouchableOpacity>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   card: {
// //     backgroundColor: COLORS.white,
// //     borderRadius: SIZES.radius,
// //     padding: SIZES.padding,
// //     marginBottom: SIZES.padding,
// //     borderWidth: 2,
// //   },
// //   cardHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: SIZES.base,
// //   },
// //   cardTitle: {
// //     marginLeft: SIZES.base,
// //     fontWeight: 'bold',
// //   },
// //   priceContainer: {
// //     marginBottom: SIZES.base,
// //   },
// //   priceText: {
// //     color: COLORS.black,
// //     fontWeight: 'bold',
// //   },
// //   featuresContainer: {
// //     marginBottom: SIZES.base,
// //   },
// //   limitationsContainer: {
// //     marginBottom: SIZES.base,
// //   },
// //   sectionTitle: {
// //     fontWeight: 'bold',
// //     marginBottom: SIZES.base / 2,
// //     color: COLORS.black,
// //   },
// //   featureItem: {
// //     flexDirection: 'row',
// //     marginBottom: SIZES.base / 2,
// //   },
// //   featureText: {
// //     color: COLORS.black,
// //   },
// //   limitationText: {
// //     color: COLORS.gray,
// //   },
// //   selectButton: {
// //     borderRadius: SIZES.radius,
// //     padding: SIZES.base,
// //     alignItems: 'center',
// //     marginTop: SIZES.base,
// //   },
// //   buttonText: {
// //     color: COLORS.white,
// //     fontWeight: 'bold',
// //   },
// // });

// // export default SubscriptionCard;
// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
// import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
// import { COLORS, SIZES, FONTS } from '../constants/Theme';

// const { width } = Dimensions.get('window');

// const SubscriptionCard = ({ plan, isSelected, onSelect }) => {
//   return (
//     <TouchableOpacity
//       style={[
//         styles.card,
//         { 
//           borderColor: isSelected ? plan.color : COLORS.lightGray2,
//           shadowColor: isSelected ? plan.color : '#000',
//         }
//       ]}
//       onPress={onSelect}
//       activeOpacity={0.8}
//     >
//       {/* Header avec icône et titre */}
//       <View style={styles.cardHeader}>
//         <View style={[styles.iconContainer, { backgroundColor: `${plan.color}20` }]}>
//           <MaterialCommunityIcons name='certificate'
//         </View>
//         <Text style={[styles.cardTitle, { color: plan.color }]}>
//           {plan.title}
//         </Text>
//       </View>

//       {/* Prix */}
//       <View style={styles.priceContainer}>
//         {plan.prices ? (
//           plan.prices.map((price, index) => (
//             <Text key={index} style={styles.priceText}>
//               {price}
//             </Text>
//           ))
//         ) : (
//           <Text style={styles.priceText}>{plan.price}</Text>
//         )}
//       </View>

//       <View style={styles.divider} />

//       {/* Section Avantages */}
//       <View style={styles.sectionContainer}>
//         <Text style={styles.sectionTitle}>Avantages inclus</Text>
//         <View style={styles.featuresGrid}>
//           {plan.features.map((feature, index) => (
//             <View key={index} style={styles.featureItem}>
//               <MaterialIcons 
//                 name="check-circle" 
//                 size={16} 
//                 color={plan.color} 
//                 style={styles.featureIcon} 
//               />
//               <Text style={styles.featureText}>{feature}</Text>
//             </View>
//           ))}
//         </View>
//       </View>

//       {/* Section Limitations (si elles existent) */}
//       {plan.limitations && (
//         <View style={styles.sectionContainer}>
//           <Text style={[styles.sectionTitle, { color: COLORS.error }]}>Limitations</Text>
//           <View style={styles.featuresGrid}>
//             {plan.limitations.map((limitation, index) => (
//               <View key={index} style={styles.featureItem}>
//                 <MaterialIcons 
//                   name="warning" 
//                   size={16} 
//                   color={COLORS.error} 
//                   style={styles.featureIcon} 
//                 />
//                 <Text style={styles.limitationText}>{limitation}</Text>
//               </View>
//             ))}
//           </View>
//         </View>
//       )}

//       {/* Bouton de sélection */}
//       <TouchableOpacity
//         style={[
//           styles.selectButton, 
//           { 
//             backgroundColor: isSelected ? plan.color : COLORS.white,
//             borderColor: plan.color
//           }
//         ]}
//         onPress={onSelect}
//       >
//         <Text style={[
//           styles.buttonText,
//           { color: isSelected ? COLORS.white : plan.color }
//         ]}>
//           {isSelected ? 'Sélectionné ✓' : 'Choisir cette formule'}
//         </Text>
//       </TouchableOpacity>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: COLORS.white,
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 20,
//     borderWidth: 2,
//     width: width - 40,
//     alignSelf: 'center',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   cardTitle: {
//     ...FONTS.h4,
//     fontWeight: '700',
//     fontSize: 20,
//   },
//   priceContainer: {
//     marginBottom: 16,
//   },
//   priceText: {
//     ...FONTS.h3,
//     color: COLORS.black,
//     fontWeight: '700',
//     fontSize: 24,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: COLORS.lightGray,
//     marginVertical: 12,
//   },
//   sectionContainer: {
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     ...FONTS.body3,
//     fontWeight: '600',
//     marginBottom: 8,
//     color: COLORS.black,
//   },
//   featuresGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   featureItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '50%',
//     marginBottom: 8,
//   },
//   featureIcon: {
//     marginRight: 6,
//   },
//   featureText: {
//     ...FONTS.body4,
//     color: COLORS.darkGray,
//     flexShrink: 1,
//   },
//   limitationText: {
//     ...FONTS.body4,
//     color: COLORS.gray,
//     flexShrink: 1,
//   },
//   selectButton: {
//     borderRadius: 12,
//     paddingVertical: 14,
//     borderWidth: 2,
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   buttonText: {
//     ...FONTS.body3,
//     fontWeight: '600',
//   },
// });

// export default SubscriptionCard;