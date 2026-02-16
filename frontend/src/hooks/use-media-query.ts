'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive media queries
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (globalThis.window === undefined) return false;
    return globalThis.window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = globalThis.window.matchMedia(query);

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
