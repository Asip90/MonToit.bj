// import React, { useRef, useEffect, useState } from 'react';
// import { View, Image, StyleSheet, PixelRatio, Platform, NativeModules } from 'react-native';
// import Canvas from 'react-native-canvas';

// const SecureWatermarkedImage = ({ source, watermarkImage }) => {
//   const canvasRef = useRef(null);
//   const [imageUri, setImageUri] = useState(null);
//   const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

//   useEffect(() => {
//     if (!canvasRef.current) return;

//     const loadImage = async () => {
//       try {
//         // 1. Création du canvas
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');
        
//         // 2. Chargement de l'image originale
//         const img = new Image(canvas);
//         img.src = source.uri;
//         await img.load();

//         // 3. Définir les dimensions
//         const width = img.width;
//         const height = img.height;
//         setDimensions({ width, height });
//         canvas.width = width;
//         canvas.height = height;

//         // 4. Dessiner l'image originale
//         ctx.drawImage(img, 0, 0, width, height);

//         // 5. Charger et dessiner le filigrane
//         const watermark = new Image(canvas);
//         watermark.src = Image.resolveAssetSource(watermarkImage).uri;
//         await watermark.load();

//         // 6. Appliquer le filigrane en motif répété
//         const pattern = ctx.createPattern(watermark, 'repeat');
//         ctx.fillStyle = pattern;
//         ctx.globalAlpha = 0.5;
//         ctx.fillRect(0, 0, width, height);

//         // 7. Convertir en URI
//         const resultUri = await canvas.toDataURL();
//         setImageUri(resultUri);

//       } catch (error) {
//         console.error("Erreur de traitement:", error);
//         // Fallback simple si le canvas échoue
//         setImageUri(source.uri);
//       }
//     };

//     loadImage();
//   }, [source, watermarkImage]);

//   // Technique de dissuasion supplémentaire
//   const [touches, setTouches] = useState(0);
//   const handleTouch = () => {
//     setTouches(prev => prev + 1);
//     if (touches > 3) {
//       // Effacer l'image si trop de tentatives
//       setImageUri(null);
//     }
//   };

//   return (
//     <View style={[styles.container, dimensions]} onTouchStart={handleTouch}>
//       {imageUri ? (
//         <>
//           <Image 
//             source={{ uri: imageUri }} 
//             style={styles.image}
//             onError={() => setImageUri(source.uri)} // Fallback
//           />
//           {/* Couche de protection invisible */}
//           <View style={styles.protectionOverlay} />
//         </>
//       ) : (
//         <View style={styles.blockedView}>
//           <Text style={styles.blockedText}>Accès non autorisé</Text>
//         </View>
//       )}
//       <Canvas ref={canvasRef} style={styles.hiddenCanvas} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },
//   hiddenCanvas: {
//     position: 'absolute',
//     width: 0,
//     height: 0,
//     opacity: 0,
//   },
//   protectionOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'transparent',
//   },
//   blockedView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//   },
//   blockedText: {
//     color: 'red',
//     fontWeight: 'bold',
//   },
// });

// export default SecureWatermarkedImage;

import React, { useRef, useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

const SecureWatermarkedImage = ({ source, watermarkSource, style }) => {
  const [finalUri, setFinalUri] = useState(source.uri);

  return (
    <View style={[styles.container, style]}>
      {/* Image principale */}
      <Image 
        source={source} 
        style={styles.image}
      />
      
      {/* Couche de filigrane */}
      <Image
        source={watermarkSource}
        style={styles.watermark}
        resizeMode="repeat"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  watermark: {
    position: 'absolute',
    width: '200%',  // Plus grand pour couvrir toute l'image
    height: '200%',
    opacity: 0.5,
    left: -50,
    top: -50,
  },
});

export default SecureWatermarkedImage;