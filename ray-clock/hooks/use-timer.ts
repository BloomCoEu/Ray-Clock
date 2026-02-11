import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

const TIMER_TASK_NAME = 'TIMER_TASK';

export const useTimer = () => {
  const timerIsRunning = useAppStore((state) => state.timerIsRunning);
  const elapsedTime = useAppStore((state) => state.elapsedTime);
  const setElapsedTime = useAppStore((state) => state.setElapsedTime);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  useEffect(() => {
    if (timerIsRunning) {
      lastUpdateRef.current = Date.now();
      
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const delta = (now - lastUpdateRef.current) / 1000; // convert to seconds
        lastUpdateRef.current = now;
        
        setElapsedTime(elapsedTime + delta);
      }, 100); // Update every 100ms for smooth display
    } else {
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
  }, [timerIsRunning, elapsedTime, setElapsedTime]);
};

// Register background task
TaskManager.defineTask(TIMER_TASK_NAME, async () => {
  // This is called by the background fetch
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

// Setup background fetch for timer persistence
export const setupBackgroundTimer = async () => {
  try {
    await BackgroundFetch.registerTaskAsync(TIMER_TASK_NAME, {
      minimumInterval: 10, // 10 seconds
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch (err) {
    console.error('Failed to register background task:', err);
  }
};
