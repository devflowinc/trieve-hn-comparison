import { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { sha256 } from 'js-sha256';

export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<string>('');

  useEffect(() => {
    const getFingerprint = async () => {
      const storedFingerprint = localStorage.getItem('userFingerprint');
      if (storedFingerprint) {
        setFingerprint(storedFingerprint);
      } else {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const hash = sha256(result.visitorId);
        localStorage.setItem('userFingerprint', hash);
        setFingerprint(hash);
      }
    };

    getFingerprint();
  }, []);

  return fingerprint;
}

