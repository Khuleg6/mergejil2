'use client';
import { useEffect } from 'react';

export function useScrollToHash() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Section-ууд render хийгдэх хугацаа өгөх
      const timeout = setTimeout(() => {
        document
          .getElementById(hash.slice(1))
          ?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, []);
}
