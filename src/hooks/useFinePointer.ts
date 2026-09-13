import { useEffect, useState } from 'react';

/** True only on devices with a fine pointer (mouse) — touch stays native. */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(pointer: fine)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const onChange = () => setFine(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return fine;
}
