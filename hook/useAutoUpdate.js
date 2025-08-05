// import { useEffect, useState } from 'react';
// import * as Updates from 'expo-updates';

// export const useAutoUpdate = () => {
//   const [status, setStatus] = useState('checking'); // checking, downloading, reloading, done, error
//   const [progress, setProgress] = useState(0); // simulate % for user feedback

//   useEffect(() => {
//     if (__DEV__) {
//       setStatus('done');
//       return;
//     }

//     let progressInterval;

//     (async () => {
//       try {
//         const update = await Updates.checkForUpdateAsync();
//         if (update.isAvailable) {
//           setStatus('downloading');
//           // simulate progress
//           progressInterval = setInterval(() => {
//             setProgress(prev => {
//               if (prev >= 90) {
//                 clearInterval(progressInterval);
//               }
//               return Math.min(prev + 5, 100);
//             });
//           }, 300);

//           await Updates.fetchUpdateAsync();
//           setStatus('reloading');
//           await Updates.reloadAsync();
//         } else {
//           setStatus('done');
//         }
//       } catch (e) {
//         console.error('Erreur mise à jour OTA:', e);
//         setStatus('error');
//       }
//     })();

//     return () => {
//       if (progressInterval) clearInterval(progressInterval);
//     };
//   }, []);

//   return { status, progress };
// };
import { useState, useEffect } from 'react';
import * as Updates from 'expo-updates';
import NetInfo from '@react-native-community/netinfo';

export const useAutoUpdate = () => {
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (__DEV__) {
      setStatus('done');
      return;
    }

    const handleUpdate = async () => {
      try {
        // Vérifier la connexion internet
        const networkState = await NetInfo.fetch();
        if (!networkState.isConnected) {
          setStatus('error');
          return;
        }

        setStatus('checking');
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          setStatus('downloading');
          await Updates.fetchUpdateAsync({
            onProgress: ({ total, done }) => {
              const progress = Math.round((done / total) * 100);
              setProgress(progress);
            }
          });
          setStatus('reloading');
          await Updates.reloadAsync();
        } else {
          setStatus('done');
        }
      } catch (error) {
        console.error('Erreur de mise à jour:', error);
        setStatus('error');
      }
    };

    handleUpdate();
  }, []);

  return { status, progress };
};