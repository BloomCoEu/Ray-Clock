import type { Task } from './types';

// Todoist REST API v2 endpoint
const TODOIST_API_ENDPOINT = 'https://api.todoist.com/rest/v2';

// Todoist Task type from API
interface TodoistTask {
  id: string;
  content: string;
  description: string;
  is_completed: boolean;
  duration?: {
    amount: number;
    unit: 'minute' | 'day';
  };
  order: number;
  created_at: string;
}

// Initialize API with token
const getTodoistHeaders = (apiToken: string) => ({
  'Authorization': `Bearer ${apiToken}`,
  'Content-Type': 'application/json',
});

// Todoist Service
export const todoistService = {
  /**
   * Get all active tasks from Todoist
   */
  async getTasks(apiToken: string): Promise<TodoistTask[]> {
    if (!apiToken) {
      console.warn('Todoist API token not provided');
      return [];
    }

    try {
      const response = await fetch(`${TODOIST_API_ENDPOINT}/tasks`, {
        method: 'GET',
        headers: getTodoistHeaders(apiToken),
      });

      if (!response.ok) {
        throw new Error(`Todoist API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching tasks from Todoist:', error);
      throw error;
    }
  },

  /**
   * Create a task in Todoist
   */
  async createTask(apiToken: string, task: Partial<Task>): Promise<TodoistTask> {
    if (!apiToken) {
      throw new Error('Todoist API token not provided');
    }

    try {
      const todoistTask = {
        content: task.title || 'Untitled Task',
        description: task.emoji || '',
        duration: task.plannedDuration ? {
          amount: task.plannedDuration,
          unit: 'minute' as const,
        } : undefined,
      };

      const response = await fetch(`${TODOIST_API_ENDPOINT}/tasks`, {
        method: 'POST',
        headers: getTodoistHeaders(apiToken),
        body: JSON.stringify(todoistTask),
      });

      if (!response.ok) {
        throw new Error(`Todoist API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating task in Todoist:', error);
      throw error;
    }
  },

  /**
   * Update a task in Todoist
   */
  async updateTask(apiToken: string, todoistId: string, updates: Partial<Task>): Promise<TodoistTask> {
    if (!apiToken) {
      throw new Error('Todoist API token not provided');
    }

    try {
      const todoistUpdates: any = {};
      
      if (updates.title !== undefined) {
        todoistUpdates.content = updates.title;
      }
      
      if (updates.emoji !== undefined) {
        todoistUpdates.description = updates.emoji;
      }
      
      if (updates.plannedDuration !== undefined) {
        todoistUpdates.duration = {
          amount: updates.plannedDuration,
          unit: 'minute' as const,
        };
      }

      const response = await fetch(`${TODOIST_API_ENDPOINT}/tasks/${todoistId}`, {
        method: 'POST',
        headers: getTodoistHeaders(apiToken),
        body: JSON.stringify(todoistUpdates),
      });

      if (!response.ok) {
        throw new Error(`Todoist API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating task in Todoist:', error);
      throw error;
    }
  },

  /**
   * Close (complete) a task in Todoist
   */
  async closeTask(apiToken: string, todoistId: string): Promise<void> {
    if (!apiToken) {
      throw new Error('Todoist API token not provided');
    }

    try {
      const response = await fetch(`${TODOIST_API_ENDPOINT}/tasks/${todoistId}/close`, {
        method: 'POST',
        headers: getTodoistHeaders(apiToken),
      });

      if (!response.ok) {
        throw new Error(`Todoist API error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error closing task in Todoist:', error);
      throw error;
    }
  },

  /**
   * Delete a task in Todoist
   */
  async deleteTask(apiToken: string, todoistId: string): Promise<void> {
    if (!apiToken) {
      throw new Error('Todoist API token not provided');
    }

    try {
      const response = await fetch(`${TODOIST_API_ENDPOINT}/tasks/${todoistId}`, {
        method: 'DELETE',
        headers: getTodoistHeaders(apiToken),
      });

      if (!response.ok) {
        throw new Error(`Todoist API error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting task in Todoist:', error);
      throw error;
    }
  },

  /**
   * Convert Todoist task to Ray Clock task format
   */
  convertToRayClockTask(todoistTask: TodoistTask, userId: string): Partial<Task> {
    return {
      title: todoistTask.content,
      emoji: todoistTask.description || undefined,
      plannedDuration: todoistTask.duration?.unit === 'minute' 
        ? todoistTask.duration.amount 
        : 15, // default to 15 minutes if not specified
      completed: todoistTask.is_completed,
      order: todoistTask.order,
      todoistId: todoistTask.id,
      userId,
    };
  },

  /**
   * Sync tasks from Todoist to Ray Clock
   * Returns array of tasks that should be created/updated in Ray Clock
   */
  async syncFromTodoist(apiToken: string, userId: string): Promise<Partial<Task>[]> {
    try {
      const todoistTasks = await this.getTasks(apiToken);
      
      // Convert Todoist tasks to Ray Clock format
      return todoistTasks
        .filter(task => !task.is_completed) // Only sync active tasks
        .map(task => this.convertToRayClockTask(task, userId));
    } catch (error) {
      console.error('Error syncing from Todoist:', error);
      throw error;
    }
  },
};
