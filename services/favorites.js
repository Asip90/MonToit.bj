
// services/favorites.js
import { db } from '../src/api/FirebaseConfig';
import { 
  doc, 
  setDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  orderBy 
} from 'firebase/firestore';

// Ajouter ou retirer un favori
export const toggleFavorite = async (userId, postId) => {
  const favRef = doc(db, `users/${userId}/favorites`, postId);
  
  const existingFav = await getDoc(favRef);
  
  if (existingFav.exists()) {
    await deleteDoc(favRef);
    return false;
  } else {
    await setDoc(favRef, { createdAt: new Date() });
    return true;
  }
};

// Vérifier si un post est favori
export const isPostFavorite = async (userId, postId) => {
  const favRef = doc(db, `users/${userId}/favorites`, postId);
  const docSnap = await getDoc(favRef);
  return docSnap.exists();
};

// Obtenir les IDs favoris d’un utilisateur
export const getUserFavoritesIds = async (userId) => {
  const q = query(collection(db, `users/${userId}/favorites`), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.id); // postId est le document ID
};

// Obtenir les posts par ID
export const getPostsByIds = async (postIds) => {
  if (postIds.length === 0) return [];
  
  const posts = await Promise.all(postIds.map(async id => {
    const docRef = doc(db, 'posts', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    return null;
  }));

  return posts.filter(p => p !== null);
};
