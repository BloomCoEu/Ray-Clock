import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { taskService } from '@/lib/appwrite-service';
import * as Haptics from 'expo-haptics';

export function useTaskCompletion() {
  const tasks = useAppStore((state) => state.tasks);
  const currentTaskIndex = useAppStore((state) => state.currentTaskIndex);
  const elapsedTime = useAppStore((state) => state.elapsedTime);
  const timerIsRunning = useAppStore((state) => state.timerIsRunning);
  const setTimerIsRunning = useAppStore((state) => state.setTimerIsRunning);
  const setCurrentTaskIndex = useAppStore((state) => state.setCurrentTaskIndex);
  const setElapsedTime = useAppStore((state) => state.setElapsedTime);
  const updateTask = useAppStore((state) => state.updateTask);

  useEffect(() => {
    const currentTask = tasks[currentTaskIndex];
    
    if (!currentTask || !timerIsRunning) return;

    // Check if timer has reached or exceeded the planned duration
    const plannedSeconds = currentTask.plannedDuration * 60;
    
    if (elapsedTime >= plannedSeconds) {
      handleTaskCompletion();
    }
  }, [elapsedTime, tasks, currentTaskIndex, timerIsRunning]);

  const handleTaskCompletion = async () => {
    const currentTask = tasks[currentTaskIndex];
    if (!currentTask) return;

    // Stop the timer
    setTimerIsRunning(false);

    // Play haptic feedback
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error playing haptic:', error);
    }

    // Note: Removed audio playback to avoid expo-av dependency issues
    // Users can add this back after resolving the Metro bundler issue

    // Update task as completed
    const actualDuration = Math.ceil(elapsedTime / 60);
    try {
      await taskService.updateTask(currentTask.$id, {
        completed: true,
        actualDuration,
      });
      
      updateTask(currentTask.$id, {
        completed: true,
        actualDuration,
      });

      // Move to next task if available
      if (currentTaskIndex < tasks.length - 1) {
        setCurrentTaskIndex(currentTaskIndex + 1);
        setElapsedTime(0);
      } else {
        // All tasks completed
        setElapsedTime(0);
      }
    } catch (error) {
      console.error('Error updating task completion:', error);
    }
  };

  return {
    handleTaskCompletion,
  };
}
