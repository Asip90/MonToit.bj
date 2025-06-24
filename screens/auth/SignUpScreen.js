// // screens/chat/ChatScreen.js
// import React, { useState, useCallback, useEffect, useContext } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
// import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
// import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc } from 'firebase/firestore';
// import { db } from '../../src/api/FirebaseConfig'; // VÉRIFIEZ CE NOM
// import { UserContext } from '../../context/AuthContext';
// import { Ionicons } from '@expo/vector-icons';
// import { COLORS } from '../../constants/constants';

// const ChatScreen = ({ route, navigation }) => {
//   const { recipientId, recipientName } = route.params;
//   const { userData, userLoading } = useContext(UserContext);

//   const [messages, setMessages] = useState([]);
//   const [chatLoading, setChatLoading] = useState(true);

//   // useEffect pour mettre à jour le titre de la navigation
//   useEffect(() => {
//     let isMounted = true;
//     if (!recipientId) {
//       if (isMounted) navigation.setOptions({ title: "Chat" });
//       return;
//     }

//     const fetchRecipientProfile = async () => {
//       try {
//         const userDoc = await getDoc(doc(db, "users", recipientId));
//         if (isMounted) {
//           if (userDoc.exists()) {
//             const recipientData = userDoc.data();
//             navigation.setOptions({
//               title: recipientData.name || recipientData.surname || recipientName || "Chat"
//             });
//           } else {
//             console.warn(`Profil du destinataire non trouvé pour ID: ${recipientId}`);
//             navigation.setOptions({ title: recipientName || "Chat" });
//           }
//         }
//       } catch (error) {
//         console.error("Erreur lors de la récupération du profil du destinataire:", error);
//         if (isMounted) {
//           navigation.setOptions({ title: recipientName || "Chat" });
//         }
//       }
//     };
//     fetchRecipientProfile();
//     return () => { isMounted = false; };
//   }, [recipientId, recipientName, navigation]); // navigation est acceptable ici car setOptions est son but principal

//   // useEffect pour charger et écouter les messages du chat
//   useEffect(() => {
//     // Attendre que les données utilisateur soient chargées
//     if (userLoading) return;

//     // Vérifier l'authentification de l'utilisateur
//     if (!userData?.uid) {
//       setChatLoading(false);
//       Alert.alert("Connexion requise", "Veuillez vous connecter pour accéder à la messagerie.");
//       if (navigation.canGoBack()) navigation.goBack();
//       return;
//     }

//     // Vérifier la présence de recipientId
//     if (!recipientId) {
//       setChatLoading(false);
//       Alert.alert("Erreur", "Destinataire non spécifié pour le chat.");
//       if (navigation.canGoBack()) navigation.goBack();
//       return;
//     }

//     // Générer l'ID du chat à l'intérieur du useEffect
//     const currentChatId = [userData.uid, recipientId].sort().join('_');
//     // console.log("Tentative de chargement du chat avec ID:", currentChatId); // Pour débogage

//     setChatLoading(true); // Commencer le chargement des messages pour ce chat

//     const messagesRef = collection(db, 'chats', currentChatId, 'messages');
//     const q = query(messagesRef, orderBy('createdAt', 'desc'));

//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       // console.log(`Messages reçus pour ${currentChatId}:`, querySnapshot.docs.length); // Pour débogage
//       const fetchedMessages = querySnapshot.docs.map(doc => {
//         const firebaseData = doc.data();
//         return {
//           _id: doc.id,
//           text: firebaseData.text || '',
//           createdAt: firebaseData.createdAt ? firebaseData.createdAt.toDate() : new Date(),
//           user: {
//             _id: firebaseData.user?._id || null,
//             name: firebaseData.user?.name || 'Utilisateur',
//             avatar: firebaseData.user?.avatar || null,
//           }
//         };
//       });
//       setMessages(fetchedMessages);
//       setChatLoading(false);
//     }, (error) => {
//       console.error(`Erreur de chargement des messages pour ${currentChatId}:`, error);
//       Alert.alert("Erreur", "Impossible de charger les messages.");
//       setChatLoading(false);
//     });

//     return () => {
//       // console.log(`Désabonnement du chat ${currentChatId}`); // Pour débogage
//       unsubscribe();
//     };
//     // Les dépendances sont maintenant userData.uid et recipientId (implicitement via currentChatId)
//     // userLoading est aussi une dépendance pour contrôler le flux.
//     // navigation n'est plus une dépendance directe pour éviter les boucles si on l'utilise seulement pour goBack.
//   }, [userLoading, userData?.uid, recipientId, navigation]); // J'ai gardé navigation car goBack est important. Si ça cause encore des soucis, on peut le sortir.

//   // Fonction pour envoyer un message
//   const onSend = useCallback((newMessages = []) => {
//     // Recalculer chatId ici car les dépendances de useCallback pourraient ne pas être à jour si userData change.
//     // Ou, mieux, s'assurer que userData est stable et que getChatId dans les dépendances de onSend est suffisant.
//     // Pour plus de sécurité, recalculons-le :
//     if (!userData?.uid || !recipientId) {
//         Alert.alert("Erreur d'envoi", "Informations utilisateur ou destinataire manquantes.");
//         return;
//     }
//     const chatId = [userData.uid, recipientId].sort().join('_');

//     if (!chatId || !newMessages.length) {
//       Alert.alert("Erreur d'envoi", "Impossible d'envoyer le message. Informations manquantes ou incorrectes.");
//       return;
//     }

//     const message = newMessages[0];
//     addDoc(collection(db, 'chats', chatId, 'messages'), {
//       text: message.text,
//       createdAt: serverTimestamp(),
//       user: {
//         _id: userData.uid,
//         name: userData.name || userData.surname || "Moi",
//         avatar: userData.photoURL || null,
//       }
//     }).catch(err => {
//       console.error("Erreur lors de l'envoi du message :", err);
//       Alert.alert("Erreur", "Votre message n'a pas pu être envoyé.");
//     });
//   }, [userData, recipientId]); // Dépendances: userData (pour uid, name, photoURL) et recipientId

//   // --- Logique de rendu ---
//   if (userLoading) {
//     return <ActivityIndicator size="large" color={COLORS.blue} style={styles.centered} />;
//   }

//   if (!userData?.uid) {
//     return (
//       <View style={styles.centered}>
//         <Text>Veuillez vous connecter pour accéder à la messagerie.</Text>
//       </View>
//     );
//   }

//   if (!recipientId) {
//       return (
//           <View style={styles.centered}>
//               <Text>Information du destinataire manquante.</Text>
//           </View>
//       );
//   }

//   if (chatLoading && messages.length === 0) {
//     return <ActivityIndicator size="large" color={COLORS.blue} style={styles.centered} />;
//   }

//   return (
//     <GiftedChat
//       messages={messages}
//       onSend={onSend}
//       user={{ _id: userData.uid }}
//       placeholder="Écrivez votre message..."
//       renderUsernameOnMessage
//       renderBubble={props => (
//         <Bubble
//           {...props}
//           wrapperStyle={{
//             right: { backgroundColor: COLORS.blue },
//             left: { backgroundColor: '#E5E5EA' },
//           }}
//           textStyle={{
//             right: { color: '#fff' },
//             left: { color: '#000' },
//           }}
//         />
//       )}
//       renderSend={props => (
//         <Send {...props} containerStyle={{ justifyContent: 'center' }}>
//           <View style={{ marginRight: 10, marginBottom: 5 }}>
//             <Ionicons name="send" size={28} color={COLORS.blue} />
//           </View>
//         </Send>
//       )}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   }
// });

// export default ChatScreen;

// screens/auth/SignUpScreen.js
// import React, { useState, useContext } from 'react'; // Ajout de useContext
// import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
// // import { styles } from './style'; // Si tu as des styles communs, sinon on définit des styles locaux
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; // Pour créer un utilisateur et mettre à jour son profil
// import { auth, db } from '../../src/api/FirebaseConfig'; // Ton instance d'auth et de db
// import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; // Pour enregistrer l'utilisateur dans Firestore
// import { COLORS } from '../../constants/constants';
// // import { AuthContext } from '../../context/AuthContext'; // Tu pourrais l'utiliser pour mettre à jour le contexte après inscription

// const SignUpScreen = () => {
//   const navigation = useNavigation();
//   // const { setUserDataInContext } = useContext(AuthContext); // Si tu veux mettre à jour le contexte

//   // Nouveaux états pour les champs d'inscription
//   const [userName, setUserName] = useState(''); // Ou nom/prénom séparés si tu préfères
//   // const [name, setName] = useState('');
//   // const [surname, setSurname] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSignUp = async () => {
//     // Validations
//     if (!userName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
//       Alert.alert('Champs Requis', 'Veuillez remplir tous les champs marqués d\'un astérisque.');
//       return;
//     }
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       Alert.alert('Email Invalide', 'Veuillez entrer une adresse email valide.');
//       return;
//     }
//     if (password.length < 6) {
//       Alert.alert('Mot de Passe Trop Court', 'Le mot de passe doit contenir au moins 6 caractères.');
//       return;
//     }
//     if (password !== confirmPassword) {
//       Alert.alert('Mots de Passe Différents', 'Le mot de passe et sa confirmation ne correspondent pas.');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // 1. Créer l'utilisateur avec Firebase Authentication
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       console.log('Utilisateur créé (Auth):', user.uid);

//       // 2. Mettre à jour le profil Firebase Auth (optionnel, mais bien pour displayName)
//       await updateProfile(user, {
//         displayName: userName, // Ou une combinaison de name/surname
//         // photoURL: "URL_IMAGE_PAR_DEFAUT_SI_BESOIN"
//       });
//       console.log('Profil Firebase Auth mis à jour avec displayName:', userName);

//       // 3. Enregistrer les informations de l'utilisateur dans Firestore
//       const userDocRef = doc(db, 'users', user.uid); // Crée une référence avec l'UID de l'utilisateur
//       const userDataToSave = {
//         uid: user.uid,
//         email: user.email,
//         userName: userName.trim(), // Ou name et surname séparés
//         // name: name.trim(),
//         // surname: surname.trim(),
//         photoURL: user.photoURL || null, // L'URL de base si Firebase Auth en a une, sinon null
//         createdAt: serverTimestamp(), // Date de création
//         // Ajoute d'autres champs par défaut si besoin (ex: phoneNumber: '')
//       };
//       await setDoc(userDocRef, userDataToSave);
//       console.log('Données utilisateur enregistrées dans Firestore:', userDataToSave);

//       // 4. Mettre à jour le contexte (si tu as une fonction pour ça)
//       // if (setUserDataInContext) {
//       //   setUserDataInContext(userDataToSave);
//       // }

//       setIsLoading(false);
//       Alert.alert('Inscription Réussie !', `Bienvenue ${userName} ! Vous pouvez maintenant vous connecter.`);
//       navigation.replace('LogIn'); // Redirige vers l'écran de connexion après inscription

//     } catch (error) {
//       setIsLoading(false);
//       console.error("Erreur d'inscription:", error.code, error.message);
//       if (error.code === 'auth/email-already-in-use') {
//         Alert.alert('Email Déjà Utilisé', 'Cette adresse email est déjà associée à un compte.');
//       } else if (error.code === 'auth/weak-password') {
//         Alert.alert('Mot de Passe Faible', 'Le mot de passe choisi est trop faible.');
//       } else {
//         Alert.alert('Erreur d\'Inscription', 'Une erreur est survenue. Veuillez réessayer.');
//       }
//     }
//   };

//   return (
//     // Utilise un ScrollView si le formulaire devient long avec le clavier
//     <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
//       <Text style={styles.title}>Créer un Compte</Text>
//       <Text style={styles.description}>Rejoignez notre communauté de Super-Locataire et Proprio !</Text>

//       <TextInput
//         style={styles.textInput}
//         onChangeText={setUserName}
//         value={userName}
//         placeholder="Nom d'utilisateur*" // Ou "Prénom"
//         placeholderTextColor="#aaa"
//         autoCapitalize="words" // Capitalise la première lettre de chaque mot
//       />

//       {/* Si tu veux nom et prénom séparés :
//       <TextInput
//         style={styles.textInput}
//         onChangeText={setSurname}
//         value={surname}
//         placeholder="Nom de famille*"
//         placeholderTextColor="#aaa"
//         autoCapitalize="words"
//       />
//       */}

//       <TextInput
//         style={styles.textInput}
//         onChangeText={setEmail}
//         value={email}
//         autoCapitalize="none"
//         placeholder="Email*"
//         keyboardType="email-address"
//         placeholderTextColor="#aaa"
//       />

//       <TextInput
//         style={styles.textInput}
//         onChangeText={setPassword}
//         value={password}
//         autoCapitalize="none"
//         autoCorrect={false}
//         placeholder="Mot de Passe*"
//         placeholderTextColor="#aaa"
//         secureTextEntry
//       />

//       <TextInput
//         style={styles.textInput}
//         onChangeText={setConfirmPassword}
//         value={confirmPassword}
//         autoCapitalize="none"
//         autoCorrect={false}
//         placeholder="Confirmer le Mot de Passe*"
//         placeholderTextColor="#aaa"
//         secureTextEntry
//       />

//       <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
//         {isLoading ? (
//           <ActivityIndicator size="small" color={COLORS.white || '#fff'} />
//         ) : (
//           <Text style={styles.buttonText}>S'INSCRIRE</Text>
//         )}
//       </TouchableOpacity>

//       <Text style={styles.footerText}>Déjà un Super-Héros ?</Text>

//       <TouchableOpacity onPress={() => navigation.navigate('LogIn')}>
//         <Text style={styles.linkText}>SE CONNECTER ICI <MaterialCommunityIcons name="login-variant" size={20} color={styles.linkText?.color || COLORS.blue} /></Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// // Styles (tu peux les mettre dans un fichier ./style.js et les importer,
// // ou les définir ici. Je vais reprendre une base similaire à ton LogInScreen)
// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1, // Important pour ScrollView pour que le contenu s'étende
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 30, // Espace sur les côtés
//     paddingVertical: 20, // Espace en haut et en bas
//     backgroundColor: COLORS.background || '#f4f7fc', // Couleur de fond
//   },
//   title: {
//     fontSize: 28, // Un peu plus grand
//     fontWeight: 'bold',
//     color: COLORS.primary || 'blue', // Couleur principale
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   description: {
//     fontSize: 16,
//     color: COLORS.lightText || '#555',
//     textAlign: 'center',
//     marginBottom: 30,
//   },
//   textInput: {
//     width: '100%', // Prend toute la largeur disponible
//     height: 50,
//     backgroundColor: COLORS.surface || '#fff',
//     borderRadius: 10, // Coins arrondis
//     paddingHorizontal: 15,
//     fontSize: 16,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: COLORS.lightGray || '#ddd',
//     color: COLORS.text || '#333',
//   },
//   button: {
//     width: '100%',
//     backgroundColor: COLORS.primary || 'blue',
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 10, // Espace avant le bouton
//     minHeight: 50, // Pour que le loader ne réduise pas la taille
//   },
//   buttonText: {
//     color: COLORS.white || '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   footerText: {
//     marginTop: 40, // Plus d'espace
//     fontSize: 15,
//     color: COLORS.gray || '#888',
//   },
//   linkText: {
//     marginTop: 8,
//     color: COLORS.blue || 'blue', // Couleur du lien
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   // Tu avais `styles.icon` dans LogInScreen, assure-toi que cette couleur est définie
//   // ou utilise directement COLORS.blue comme j'ai fait pour l'icône de lien.
// });

// export default SignUpScreen;

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../../src/api/FirebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { COLORS } from '../../constants/Theme';

const SignUpScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async () => {
    if (!userName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Champs Requis', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: userName,
      });

      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        userName: userName.trim(),
        createdAt: serverTimestamp(),
      });

      Alert.alert('Succès', 'Inscription réussie !');
      navigation.navigate('LogIn');
    } catch (error) {
      handleSignUpError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpError = (error) => {
    let message = 'Une erreur est survenue';
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'Cet email est déjà utilisé';
        break;
      case 'auth/invalid-email':
        message = 'Email invalide';
        break;
      case 'auth/weak-password':
        message = 'Mot de passe trop faible (6 caractères minimum)';
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
          {/* Header */}
          <View style={styles.header}>
            <Image 
              source={require('../../assets/icon.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez notre communauté</Text>
          </View>

          {/* Formulaire */}
          <View style={styles.form}>
            {/* Nom d'utilisateur */}
            <View style={styles.inputGroup}>
              <Ionicons name="person-outline" size={20} color={COLORS.gray} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
                placeholderTextColor={COLORS.gray}
                value={userName}
                onChangeText={setUserName}
                autoCapitalize="words"
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Ionicons name="mail-outline" size={20} color={COLORS.gray} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={COLORS.gray}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Mot de passe */}
            <View style={styles.inputGroup}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor={COLORS.gray}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={COLORS.gray} 
                />
              </TouchableOpacity>
            </View>

            {/* Confirmation mot de passe */}
            <View style={styles.inputGroup}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.gray} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmer le mot de passe"
                placeholderTextColor={COLORS.gray}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={COLORS.gray} 
                />
              </TouchableOpacity>
            </View>

            {/* Bouton d'inscription */}
            <TouchableOpacity
              style={[styles.signupButton, isLoading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.signupButtonText}>S'INSCRIRE</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Lien vers connexion */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('LogIn')}>
              <Text style={styles.footerLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
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
  eyeIcon: {
    padding: 5,
  },
  signupButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: COLORS.gray,
  },
  footerLink: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;