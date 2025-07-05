// // Description: This component displays a list of chat messages for the logged-in user.
// import React, { useState, useEffect, useContext } from 'react';
// import { 
//   View, 
//   Text, 
//   FlatList, 
//   TouchableOpacity, 
//   StyleSheet, 
//   ActivityIndicator 
// } from 'react-native';
// import { UserContext } from '../../context/AuthContext';
// import { db } from '../../src/api/FirebaseConfig';
// import { 
//   collection, 
//   query, 
//   where, 
//   orderBy, 
//   onSnapshot 
// } from 'firebase/firestore';
// import { useIsFocused } from '@react-navigation/native';

// const MessagesList = ({ navigation }) => {
//   const { userData } = useContext(UserContext);
//   const [chatList, setChatList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const isFocused = useIsFocused();


// useEffect(() => {
//   if (!userData?.uid || !isFocused) { /* ... */ }

//   const q = query(
//     collection(db, 'chats'),
//     where("participants", "array-contains", userData.uid),
//     orderBy("lastMessageTimestamp", "desc")
//   );


// const unsubscribe = onSnapshot(q, (querySnapshot) => {
//   const fetchChats = async () => {
//     const fetchedChats = await Promise.all(
//       querySnapshot.docs.map(async (chatDoc) => {
//         const chatData = chatDoc.data();
//         const chatId = chatDoc.id;
//         const otherParticipantUid = chatData.participants.find(uid => uid !== userData.uid);

//         let resolvedName = chatData.participantNames?.[otherParticipantUid];

//         if (!resolvedName && otherParticipantUid) {
//           try {
//             const userDocRef = doc(db, 'users', otherParticipantUid);
//             const userSnap = await getDoc(userDocRef);
//             if (userSnap.exists()) {
//               resolvedName = userSnap.data().userName || userSnap.data().email || "Utilisateur";
//             }
//           } catch (err) {
//             console.error("Erreur récupération nom utilisateur:", err);
//           }
//         }

//         return {
//           id: chatId,
//           ...chatData,
//           otherUserUid: otherParticipantUid,
//           otherUserName: resolvedName || "Utilisateur",
//           postId: chatData.postId || null,
//           postTitle: chatData.postTitle || null,
//         };
//       })
//     );

//     setChatList(fetchedChats);
//     setLoading(false);
//   };

//   fetchChats(); // 🔁 Appelle la fonction async
// }, (error) => {
//   console.error("Erreur snapshot:", error);
//   setLoading(false);
// });
//  return unsubscribe;
// }, [userData?.uid, isFocused]);
//   const handlePressChat = (chatItem) => {
//   navigation.navigate('ChatScreen', { 
//     receiverId: chatItem.otherUserUid,
//     receiverName: chatItem.otherUserName,
//     postId: chatItem.postId || null,
//     postTitle: chatItem.postTitle || null
//   });
// };

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//       </View>
//     );
//   }

//   if (!userData) {
//     return (
//       <View style={styles.container}>
//         <Text>Veuillez vous connecter</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Mes discussions</Text>
      
//       <FlatList
//         data={chatList}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           // console.log("Rendu de l'item:", item),
//           <TouchableOpacity
//             style={styles.chatItem}
//             onPress={() => handlePressChat(item)}
//           >
//             <View style={styles.chatInfo}>
//               <Text style={styles.chatTitle}>
//                 {item.postTitle || 'Discussion'}
//               </Text>
//               <Text style={styles.lastMessage} numberOfLines={1}>
//                 {item.lastMessageSenderId === userData.uid ? 'Vous: ' : ''}
//                 {item.lastMessageText || 'Nouvelle discussion'}
//               </Text>
//             </View>
            
//             {item.lastMessageTimestamp && (
//               <Text style={styles.timestamp}>
//                 {item.lastMessageTimestamp.toDate().toLocaleTimeString([], 
//                   { hour: '2-digit', minute: '2-digit' }
//                 )}
//               </Text>
//             )}
//           </TouchableOpacity>
//         )}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>Aucune discussion trouvée</Text>
//           </View>
//         }
//       />
//     </View>
//   );
// };

// const COLORS = {
//   primary: '#007AFF',
//   white: '#FFFFFF',
//   lightGray: '#F5F5F5',
//   darkGray: '#333333',
//   text: '#222222',
//   secondaryText: '#666666',
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     padding: 15,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: COLORS.darkGray,
//     marginBottom: 20,
//   },
//   chatItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     marginBottom: 10,
//     backgroundColor: COLORS.lightGray,
//     borderRadius: 10,
//   },
//   chatInfo: {
//     flex: 1,
//     marginRight: 10,
//   },
//   chatTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.text,
//     marginBottom: 5,
//   },
//   lastMessage: {
//     fontSize: 14,
//     color: COLORS.secondaryText,
//   },
//   timestamp: {
//     fontSize: 12,
//     color: COLORS.secondaryText,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 50,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: COLORS.secondaryText,
//   },
// });

// export default MessagesList;

// Description: This component displays a list of chat messages for the logged-in user.
import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { UserContext } from '../../../context/AuthContext';
import { db } from '../../../src/api/FirebaseConfig';
import { COLORS , SIZES , FONTS } from '../../../constants/Theme';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  getDoc
} from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native';

// export const COLORS = {
//   primary: '#27AE60',       // Vert Zameen caractéristique
//   secondary: '#27AE60',     // Vert légèrement plus foncé
//   white: '#FFFFFF',
//   gray: '#7F8C8D',          // Texte gris
//   lightGray: '#F5F5F5',     // Fond gris clair
//   black: '#2C3E50',         // Texte noir
//   notification: '#EB5757',  // Rouge pour les notifications
// };

// export const SIZES = {
//   // Dimensions standards
//   base: 8,
//   radius: 12,
//   padding: 24,

//   // Tailles de police
//   h1: 30,
//   h2: 22,
//   h3: 16,
//   h4: 14,
//   body1: 30,
//   body2: 22,
//   body3: 16,
//   body4: 14,
// };

// export const FONTS = {
//   h1: { fontSize: SIZES.h1, fontWeight: 'bold', lineHeight: 36 },
//   h2: { fontSize: SIZES.h2, fontWeight: 'bold', lineHeight: 30 },
//   h3: { fontSize: SIZES.h3, fontWeight: 'bold', lineHeight: 22 },
//   h4: { fontSize: SIZES.h4, fontWeight: 'bold', lineHeight: 22 },
//   body1: { fontSize: SIZES.body1, lineHeight: 36 },
//   body2: { fontSize: SIZES.body2, lineHeight: 30 },
//   body3: { fontSize: SIZES.body3, lineHeight: 22 },
//   body4: { fontSize: SIZES.body4, lineHeight: 22 },
// };

const MessagesList = ({ navigation }) => {
  const { userData } = useContext(UserContext);
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!userData?.uid || !isFocused) return;

    const q = query(
      collection(db, 'chats'),
      where("participants", "array-contains", userData.uid),
      orderBy("lastMessageTimestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchChats = async () => {
        const fetchedChats = await Promise.all(
          querySnapshot.docs.map(async (chatDoc) => {
            const chatData = chatDoc.data();
            const chatId = chatDoc.id;
            const otherParticipantUid = chatData.participants.find(uid => uid !== userData.uid);

            let resolvedName = chatData.participantNames?.[otherParticipantUid];

            if (!resolvedName && otherParticipantUid) {
              try {
                const userDocRef = doc(db, 'users', otherParticipantUid);
                const userSnap = await getDoc(userDocRef);
                if (userSnap.exists()) {
                  resolvedName = userSnap.data().userName || userSnap.data().email || "Utilisateur";
                }
              } catch (err) {
                console.error("Erreur récupération nom utilisateur:", err);
              }
            }

            return {
              id: chatId,
              ...chatData,
              otherUserUid: otherParticipantUid,
              otherUserName: resolvedName || "Utilisateur",
              postId: chatData.postId || null,
              postTitle: chatData.postTitle || null,
            };
          })
        );

        setChatList(fetchedChats);
        setLoading(false);
      };

      fetchChats();
    }, (error) => {
      console.error("Erreur snapshot:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [userData?.uid, isFocused]);

  const handlePressChat = (chatItem) => {
    navigation.navigate('ChatScreen', { 
      receiverId: chatItem.otherUserUid,
      receiverName: chatItem.otherUserName,
      postId: chatItem.postId || null,
      postTitle: chatItem.postTitle || null
    });
  };

  const renderChatItem = ({ item }) => {
    const hasUnread = item.lastMessageSenderId !== userData.uid && 
                     (item.lastMessageSeen === false || item.lastMessageSeen === undefined);

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handlePressChat(item)}
      >
        <View style={styles.chatInfo}>
          <Text style={[styles.chatTitle, hasUnread && styles.unreadTitle]}>
            {item.postTitle || 'Discussion'}
          </Text>
          <Text 
            style={[styles.lastMessage, hasUnread && styles.unreadMessage]} 
            numberOfLines={1}
          >
            {item.lastMessageSenderId === userData.uid ? 'Vous: ' : ''}
            {item.lastMessageText || 'Nouvelle discussion'}
          </Text>
        </View>
        
        <View style={styles.rightContainer}>
          {item.lastMessageTimestamp && (
            <Text style={[styles.timestamp, hasUnread && styles.unreadTimestamp]}>
              {item.lastMessageTimestamp.toDate().toLocaleTimeString([], 
                { hour: '2-digit', minute: '2-digit' }
              )}
            </Text>
          )}
          {hasUnread && <View style={styles.unreadBadge} />}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Veuillez vous connecter</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes discussions</Text>
      
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune discussion trouvée</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 15,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 20,
  },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
  },
  chatInfo: {
    flex: 1,
    marginRight: 10,
  },
  chatTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: SIZES.body4,
    color: COLORS.gray,
  },
  timestamp: {
    fontSize: SIZES.body4,
    color: COLORS.gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: SIZES.body3,
    color: COLORS.gray,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  unreadTitle: {
    fontWeight: 'bold',
    color: COLORS.black,
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: COLORS.black,
  },
  unreadTimestamp: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  unreadBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.notification,
    marginTop: 4,
  },
});

export default MessagesList;