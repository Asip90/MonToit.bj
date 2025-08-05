// // services/cacheManager.js
// import { MMKV } from 'react-native-mmkv';

// export const storage = new MMKV();

// // Cache pour 7 jours (en ms)
// const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; 

// // Génère une clé de cache valide 7 jours
// export const cacheData = (key, data) => {
//   const cacheItem = {
//     timestamp: Date.now(),
//     data,
//     expires: Date.now() + CACHE_DURATION // Explicit expiration
//   };
//   storage.set(key, JSON.stringify(cacheItem));
// };

// // Vérifie si le cache est toujours valide
// export const getCachedData = (key) => {
//   const cached = storage.getString(key);
//   if (!cached) return null;

//   const { timestamp, data, expires } = JSON.parse(cached);
  
//   // Double vérification de l'expiration
//   const isExpired = Date.now() > expires || 
//                    Date.now() - timestamp > CACHE_DURATION;

//   return isExpired ? null : data;
// };


// services/cacheManager.js

// // services/cacheManager.js
// import * as SecureStore from 'expo-secure-store';

// const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 jours

// export const cacheData = async (key, data) => {
//   try {
//     const cacheItem = {
//       timestamp: Date.now(),
//       data
//     };
//     await SecureStore.setItemAsync(key, JSON.stringify(cacheItem));
//   } catch (error) {
//     console.error('Erreur cache:', error);
//   }
// };

// export const getCachedData = async (key) => {
//   try {
//     const cached = await SecureStore.getItemAsync(key);
//     if (!cached) return null;

//     const { timestamp, data } = JSON.parse(cached);
//     const isExpired = Date.now() - timestamp > CACHE_DURATION;

//     return isExpired ? null : data;
//   } catch (error) {
//     console.error('Erreur lecture cache:', error);
//     return null;
//   }
// };

// // Purge les caches expirés
// export const cleanExpiredCache = async () => {
//   const allKeys = await SecureStore.getAllItemsAsync();
//   Object.keys(allKeys).forEach(async (key) => {
//     const { timestamp } = JSON.parse(allKeys[key]);
//     if (Date.now() - timestamp > CACHE_DURATION) {
//       await SecureStore.deleteItemAsync(key);
//     }
//   });
// };

// // let engine;

// // if (__DEV__) {
// //   engine = require('./secureStoreEngine'); // Expo en dev
// // } else {
// //   engine = require('./mmkvEngine'); // MMKV en prod
// // }

// // export const cacheData = engine.cacheData;
// // export const getCachedData = engine.getCachedData;

//cachemanager.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 jours

export const cacheData = async (key, data) => {
  try {
    const cacheItem = {
      timestamp: Date.now(),
      data
    };
    await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Erreur cache:', error);
  }
};

export const getCachedData = async (key) => {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (!cached) return null;

    const { timestamp, data } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;

    return isExpired ? null : data;
  } catch (error) {
    console.error('Erreur lecture cache:', error);
    return null;
  }
};

export const cleanExpiredCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);

    for (const [key, value] of items) {
      try {
        const { timestamp } = JSON.parse(value);
        if (Date.now() - timestamp > CACHE_DURATION) {
          await AsyncStorage.removeItem(key);
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    }
  } catch (error) {
    console.error('Erreur nettoyage cache:', error);
  }
};
