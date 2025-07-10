import { useEffect, useState } from 'react';
import * as Updates from 'expo-updates';

export const useAutoUpdate = () => {
  const [status, setStatus] = useState('checking'); // checking, downloading, reloading, done, error
  const [progress, setProgress] = useState(0); // simulate % for user feedback

  useEffect(() => {
    if (__DEV__) {
      setStatus('done');
      return;
    }

    let progressInterval;

    (async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          setStatus('downloading');
          // simulate progress
          progressInterval = setInterval(() => {
            setProgress(prev => {
              if (prev >= 90) {
                clearInterval(progressInterval);
              }
              return Math.min(prev + 5, 100);
            });
          }, 300);

          await Updates.fetchUpdateAsync();
          setStatus('reloading');
          await Updates.reloadAsync();
        } else {
          setStatus('done');
        }
      } catch (e) {
        console.error('Erreur mise à jour OTA:', e);
        setStatus('error');
      }
    })();

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, []);

  return { status, progress };
};
