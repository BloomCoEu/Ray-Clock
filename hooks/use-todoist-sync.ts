import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { todoistService } from '@/lib/todoist-service';
import { taskService } from '@/lib/appwrite-service';
import type { Task } from '@/lib/types';
import { ID } from 'appwrite';

export const useTodoistSync = () => {
  const user = useAppStore((state) => state.user);
  const settings = useAppStore((state) => state.settings);
  const tasks = useAppStore((state) => state.tasks);
  const setTasks = useAppStore((state) => state.setTasks);
  const addTask = useAppStore((state) => state.addTask);
  const setIsSyncing = useAppStore((state) => state.setIsSyncing);
  const setLastSyncError = useAppStore((state) => state.setLastSyncError);
  const isSyncing = useAppStore((state) => state.isSyncing);
  const lastSyncError = useAppStore((state) => state.lastSyncError);

  const [syncMessage, setSyncMessage] = useState<string>('');

  /**
   * Sync tasks from Todoist to Ray Clock
   */
  const syncFromTodoist = async () => {
    if (!user) {
      setLastSyncError('User not authenticated');
      return;
    }

    if (!settings?.todoistApiKey) {
      setLastSyncError('Todoist API key not configured');
      return;
    }

    if (!settings?.todoistSyncEnabled) {
      setLastSyncError('Todoist sync is disabled');
      return;
    }

    try {
      setIsSyncing(true);
      setLastSyncError(null);
      setSyncMessage('Syncing from Todoist...');

      // Fetch tasks from Todoist
      const todoistTasks = await todoistService.syncFromTodoist(
        settings.todoistApiKey,
        user.$id
      );

      // Find existing tasks that have todoistId
      const existingTodoistIds = new Set(
        tasks.filter(t => t.todoistId).map(t => t.todoistId)
      );

      // Create new tasks that don't exist in Ray Clock
      let createdCount = 0;
      let skippedCount = 0;

      for (const todoistTask of todoistTasks) {
        if (!todoistTask.todoistId || existingTodoistIds.has(todoistTask.todoistId)) {
          skippedCount++;
          continue;
        }

        try {
          // Create task in Appwrite
          const createdTask = await taskService.createTask(user.$id, {
            ...todoistTask,
            order: tasks.length + createdCount,
            lastSyncedAt: new Date().toISOString(),
          });

          // Type assertion is safe here as createTask returns a document with all Task fields
          addTask(createdTask as unknown as Task);
          createdCount++;
        } catch (error) {
          console.error('Error creating task from Todoist:', error);
        }
      }

      setSyncMessage(`Sync complete: ${createdCount} tasks imported, ${skippedCount} already exist`);
      setLastSyncError(null);
      
      // Clear message after 3 seconds
      setTimeout(() => setSyncMessage(''), 3000);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to sync from Todoist';
      setLastSyncError(errorMessage);
      setSyncMessage(`Sync failed: ${errorMessage}`);
      console.error('Error syncing from Todoist:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Push a Ray Clock task to Todoist
   * Note: This is prepared for future two-way sync but not currently exposed
   */
  const pushTaskToTodoist = async (taskId: string) => {
    if (!user || !settings?.todoistApiKey || !settings?.todoistSyncEnabled) {
      return;
    }

    const task = tasks.find(t => t.$id === taskId);
    if (!task) {
      return;
    }

    try {
      // If task already has a todoistId, update it; otherwise create new
      if (task.todoistId) {
        await todoistService.updateTask(settings.todoistApiKey, task.todoistId, task);
      } else {
        const todoistTask = await todoistService.createTask(settings.todoistApiKey, task);
        
        // Update task with todoistId
        await taskService.updateTask(taskId, { 
          todoistId: todoistTask.id,
          lastSyncedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error pushing task to Todoist:', error);
      throw error;
    }
  };

  return {
    syncFromTodoist,
    pushTaskToTodoist,
    isSyncing,
    lastSyncError,
    syncMessage,
  };
};
