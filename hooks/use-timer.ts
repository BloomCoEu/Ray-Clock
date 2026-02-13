import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';

export function useTimer() {
  const timerIsRunning = useAppStore((state) => state.timerIsRunning);
  const elapsedTime = useAppStore((state) => state.elapsedTime);
  const setElapsedTime = useAppStore((state) => state.setElapsedTime);
  // useRef stores the interval handle without causing re-renders; think of it as a persistent
  // variable that survives function calls in React's world.
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // This effect runs whenever the running flag or the elapsed seconds change.
    // React will run the cleanup function before re-running the effect, so we never stack intervals.
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
