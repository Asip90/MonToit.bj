
// import { DefaultTheme } from '@react-navigation/native';

// export const theme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: '#2bb673',
//   },
//   fonts: {
//     regular: 'InterRegular',
//     medium: 'InterMedium',
//     bold: 'InterBold',
//   },
// };


// //Cette implémentation respecte parfaitement le style typographique de Zameen tout en conservant votre architecture existante.

export const COLORS = {
 
  primary: '#4a6fa5',//'#03305F',//#4a6fa5',//#27AE60',//'#2DCC70',       // Vert Zameen caractéristique
  secondary: '#27AE60',     // Vert légèrement plus foncé
  white: '#FFFFFF',
  gray: '#7F8C8D',          // Texte gris
  lightGray: '#F5F5F5',     // Fond gris clair
  lightGray2: '#F5F5F5',
  black: '#2C3E50',         // Texte noir
  orange: '#ff9500',       // Orange pour les boutons
  gold: '#ffffff' ,//'#FFD700',         // Or pour les badges ou les éléments importants
  notification: '#EB5757',  
};

export const SIZES = {
  // Dimensions standards
  base: 8,
  radius: 12,
  padding: 24,

  // Tailles de police
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
};

export const FONTS = {
  h1: { fontSize: SIZES.h1, fontWeight: 'bold', lineHeight: 36 },
  h2: { fontSize: SIZES.h2, fontWeight: 'bold', lineHeight: 30 },
  h3: { fontSize: SIZES.h3, fontWeight: 'bold', lineHeight: 22 },
  h4: { fontSize: SIZES.h4, fontWeight: 'bold', lineHeight: 22 },
  body1: { fontSize: SIZES.body1, lineHeight: 36 },
  body2: { fontSize: SIZES.body2, lineHeight: 30 },
  body3: { fontSize: SIZES.body3, lineHeight: 22 },
  body4: { fontSize: SIZES.body4, lineHeight: 22 },
};