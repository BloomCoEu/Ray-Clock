import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';

export function useTimer() {
  const timerIsRunning = useAppStore((state) => state.timerIsRunning);
  const elapsedTime = useAppStore((state) => state.elapsedTime);
  const setElapsedTime = useAppStore((state) => state.setElapsedTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerIsRunning) {
      // Start the timer
      intervalRef.current = setInterval(() => {
        setElapsedTime(elapsedTime + 1);
      }, 1000);
    } else {
      // Stop the timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerIsRunning, elapsedTime]);

  return {
    elapsedTime,
    isRunning: timerIsRunning,
  };
}
