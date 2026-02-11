import { useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { useAppStore } from '@/lib/store';
import { taskService } from '@/lib/appwrite-service';

export const useTaskCompletion = () => {
  const user = useAppStore((state) => state.user);
  const currentTask = useAppStore((state) => state.getCurrentTask());
  const elapsedTime = useAppStore((state) => state.elapsedTime);
  const currentTaskIndex = useAppStore((state) => state.currentTaskIndex);
  const tasks = useAppStore((state) => state.tasks);
  const setCurrentTaskIndex = useAppStore((state) => state.setCurrentTaskIndex);
  const updateTask = useAppStore((state) => state.updateTask);
  const setElapsedTime = useAppStore((state) => state.setElapsedTime);
  const setTimerIsRunning = useAppStore((state) => state.setTimerIsRunning);

  useEffect(() => {
    // Check if task is complete (elapsed time >= planned duration * 60 seconds)
    if (
      currentTask &&
      elapsedTime >= currentTask.plannedDuration * 60
    ) {
      completeCurrentTask();
    }
  }, [elapsedTime, currentTask]);

  const completeCurrentTask = async () => {
    try {
      // Play haptic feedback
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );

      // Play sound (optional)
      try {
        const sound = new Audio.Sound();
        // Using a simple beep sound
        await sound.loadAsync(
          require('@/assets/notification.mp3')
        );
        await sound.playAsync();
      } catch (error) {
        // Sound file not found, that's ok
      }

      // Update task in database and local state
      if (user && currentTask) {
        updateTask(currentTask.$id, {
          completed: true,
          completedAt: new Date().toISOString(),
          actualDuration: Math.ceil(elapsedTime / 60),
        });

        // Update in Appwrite
        await taskService.updateTask(currentTask.$id, {
          completed: true,
          completedAt: new Date().toISOString(),
          actualDuration: Math.ceil(elapsedTime / 60),
        });
      }

      // Move to next task
      if (currentTaskIndex < tasks.length - 1) {
        setCurrentTaskIndex(currentTaskIndex + 1);
        setElapsedTime(0);
        setTimerIsRunning(false); // User should manually start next task
      } else {
        // All tasks completed
        setTimerIsRunning(false);
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  return {
    completeCurrentTask,
  };
};
