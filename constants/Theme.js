
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


// //Palette de couleurs recommandée :
// Couleur principale (Primary)

// #4F6F52 (Vert profond apaisant)

// Alternative : #3A5A40 (Vert forestier plus foncé)

// Couleur secondaire (Secondary)

// #739072 (Vert doux et naturel)

// Pour les accents : #86A789 (Vert pastel)

// Arrière-plan (Background)

// #F8F8F8 (Gris très clair)

// Variante : #F0F3F0 (Gris vert très pâle)

// Textes

// #2C3E2C (Noir verdâtre pour un contraste doux)

// Secondaire : #5A6D5A (Gris vert)

// Éléments d'interface

// #ECE8DD (Beige clair pour les cartes)

// #D2D8C7 (Vert grisâtre pour les séparateurs)

// Feedback utilisateur

// Succès : #4F6F52 (même que primary)

// Erreur : #C47A7A (Rouge adouci)

// Avertissement : #D4B483 (Jaune terreux)

// Pourquoi cette palette ?
// Confort oculaire :

// Les tons verts naturels sont les plus reposants pour les yeux

// Évite les contrastes brutaux (pas de noir pur #000)

// Réduit la lumière bleue émise par l'écran

// Associations psychologiques :

// Vert = confiance, croissance, nature (idéal pour l'immobilier)

// Neutres chauds = approche humaine et accueillante

// Accessibilité :

// Ratio de contraste AA/AAA respecté

// Distinction maintenue pour les daltoniens

// Application concrète :
// jsx
// const colors = {
//   primary: '#4F6F52',
//   primaryLight: '#86A789',
//   background: '#F8F8F8',
//   card: '#FFFFFF',
//   text: '#2C3E2C',
//   textSecondary: '#5A6D5A',
//   border: '#D2D8C7',
//   error: '#C47A7A',
//   success: '#4F6F52',
//   warning: '#D4B483',
//   placeholder: '#A3B5A3'
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: colors.background,
//   },
//   button: {
//     backgroundColor: colors.primary,
//   },
//   text: {
//     color: colors.text,
//   },
//   input: {
//     borderColor: colors.border,
//   }
// });
// Alternatives selon l'ambiance :
// Style "Luxe moderne" :

// Primaire : #5D774E (Vert profond)

// Secondaire : #C4B6A0 (Taupe)

// Fond : #FAF9F5

// Style "Minimaliste urbain" :

// Primaire : #556B5D (Vert grisé)

// Accent : #8A9B6E (Vert clair)

// Fond : #F5F5F5

// Style "Chaleureux bohème" :

// Primaire : #6B8E6E (Vert sage)

// Secondaire : #D4C8A3 (Beige doré)

// Fond : #FFFDF7

// Ces palettes maintiennent toutes un excellent confort visuel tout en créant des identités visuelles distinctes pour votre application.Cette implémentation respecte parfaitement le style typographique de Zameen tout en conservant votre architecture existante.

export const COLORS = {
 
  primary:'#4a6fa5',//#5D774E',//'rgb(53, 171, 85)',//vertdoux//'rgb(53, 171, 85)',//#4a6fa5',//'#03305F',//#4a6fa5',//#27AE60',//'#2DCC70',       // Vert Zameen caractéristique
  secondary: '#27AE60',     // Vert légèrement plus foncé
  white: '#FAF9F5',//'#FFFFFF',
  gray: '#7F8C8D',          // Texte gris
  lightGray: '#F5F5F5',     // Fond gris clair
  lightGray2: '#F5F5F5',
  black: '#2C3E50',         // Texte noir
  red:'rgb(255, 4, 0)',//'#ff9500',       // Orange pour les boutons
  orange:'#ff9500',
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

// export const SKELETON_COLORS = {
//    background: '#F8FAFC',  // Fond très clair
//   base: '#DDEEE2',       // Gris vert doux
//   highlight: '#EEF6F0',
// };
// export const SKELETON_COLORS = {
//   background: '#F8FAFC',
//   base: '#C6E6D4',       // Vert pastel plus soutenu
//   highlight: '#E2F3EB',  // Vert très clair
// };

export const SKELETON_COLORS = {
  background: '#F5F5F5',      // Gris clair (déjà présent dans COLORS.lightGray)
  base: '#E0EDE4',           // Vert très pâle (dérivé de votre primary 'rgb(53, 171, 85)')
  highlight: '#F0F7F2',      // Vert blanc cassé (contraste doux mais visible)
};