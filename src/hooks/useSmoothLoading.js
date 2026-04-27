import { useEffect, useRef, useState } from 'react';

const SHOW_DELAY_MS = 150;
const MIN_VISIBLE_MS = 300;

export default function useSmoothLoading(isLoading) {
  const [visible, setVisible] = useState(false);
  const shownAtRef = useRef(0);
  const delayTimerRef = useRef(null);
  const hideTimerRef = useRef(null);

  useEffect(() => {
    if (isLoading) {
      clearTimeout(hideTimerRef.current);
      if (!visible) {
        delayTimerRef.current = setTimeout(() => {
          shownAtRef.current = Date.now();
          setVisible(true);
        }, SHOW_DELAY_MS);
      }
    } else {
      clearTimeout(delayTimerRef.current);
      if (!visible) return undefined;
      const elapsed = Date.now() - shownAtRef.current;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      hideTimerRef.current = setTimeout(() => setVisible(false), wait);
    }

    return () => {
      clearTimeout(delayTimerRef.current);
      clearTimeout(hideTimerRef.current);
    };
  }, [isLoading, visible]);

  return visible;
}
