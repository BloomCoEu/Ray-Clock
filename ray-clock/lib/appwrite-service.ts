import { databases, account } from './appwrite-client';
import { ID, Query } from 'appwrite';
import * as types from './types';

const DB_ID = process.env.EXPO_PUBLIC_APPWRITE_DB_ID || '';
const USERS_COLLECTION_ID = 'users';
const TASKS_COLLECTION_ID = 'tasks';
const PRESETS_COLLECTION_ID = 'presets';
const SETTINGS_COLLECTION_ID = 'settings';

// User operations
export const userService = {
  async createUser(userId: string, email: string, name: string): Promise<types.User> {
    return await databases.createDocument(
      DB_ID,
      USERS_COLLECTION_ID,
      userId,
      {
        email,
        name,
        preferences: {
          defaultTime: 15,
          accentColor: '#10B981',
          theme: 'auto',
          smartTimeDetection: true,
          pieTimerEnabled: false,
        },
      }
    );
  },

  async getUser(userId: string): Promise<types.User> {
    return await databases.getDocument(DB_ID, USERS_COLLECTION_ID, userId);
  },

  async updateUser(userId: string, data: Partial<types.User>) {
    return await databases.updateDocument(
      DB_ID,
      USERS_COLLECTION_ID,
      userId,
      data
    );
  },
};

// Task operations
export const taskService = {
  async createTask(userId: string, task: Omit<types.Task, '$id' | '$createdAt' | '$updatedAt'>) {
    return await databases.createDocument(
      DB_ID,
      TASKS_COLLECTION_ID,
      ID.unique(),
      {
        ...task,
        userId,
      }
    );
  },

  async getTasks(userId: string): Promise<types.Task[]> {
    return await databases.listDocuments(
      DB_ID,
      TASKS_COLLECTION_ID,
      [Query.equal('userId', userId), Query.orderAsc('order')]
    );
  },

  async updateTask(taskId: string, data: Partial<types.Task>) {
    return await databases.updateDocument(
      DB_ID,
      TASKS_COLLECTION_ID,
      taskId,
      data
    );
  },

  async deleteTask(taskId: string) {
    return await databases.deleteDocument(
      DB_ID,
      TASKS_COLLECTION_ID,
      taskId
    );
  },

  async reorderTasks(tasks: Array<{ $id: string; order: number }>) {
    // Batch update task orders
    for (const task of tasks) {
      await databases.updateDocument(
        DB_ID,
        TASKS_COLLECTION_ID,
        task.$id,
        { order: task.order }
      );
    }
  },
};

// Preset operations
export const presetService = {
  async createPreset(userId: string, preset: Omit<types.Preset, '$id' | '$createdAt' | '$updatedAt'>) {
    return await databases.createDocument(
      DB_ID,
      PRESETS_COLLECTION_ID,
      ID.unique(),
      {
        ...preset,
        userId,
      }
    );
  },

  async getPresets(userId: string): Promise<types.Preset[]> {
    return await databases.listDocuments(
      DB_ID,
      PRESETS_COLLECTION_ID,
      [Query.equal('userId', userId)]
    );
  },

  async updatePreset(presetId: string, data: Partial<types.Preset>) {
    return await databases.updateDocument(
      DB_ID,
      PRESETS_COLLECTION_ID,
      presetId,
      data
    );
  },

  async deletePreset(presetId: string) {
    return await databases.deleteDocument(
      DB_ID,
      PRESETS_COLLECTION_ID,
      presetId
    );
  },

  async duplicatePreset(presetId: string, userId: string) {
    const preset = await databases.getDocument(
      DB_ID,
      PRESETS_COLLECTION_ID,
      presetId
    );
    delete (preset as any).$id;
    delete (preset as any).$createdAt;
    delete (preset as any).$updatedAt;

    return await databases.createDocument(
      DB_ID,
      PRESETS_COLLECTION_ID,
      ID.unique(),
      {
        ...preset,
        userId,
        name: `${preset.name} (Copy)`,
      }
    );
  },
};

// Settings operations
export const settingsService = {
  async createSettings(userId: string, settings: Omit<types.Settings, '$id' | '$createdAt' | '$updatedAt'>) {
    return await databases.createDocument(
      DB_ID,
      SETTINGS_COLLECTION_ID,
      userId,
      settings
    );
  },

  async getSettings(userId: string): Promise<types.Settings> {
    try {
      return await databases.getDocument(DB_ID, SETTINGS_COLLECTION_ID, userId);
    } catch (error) {
      // If settings don't exist, create default ones
      return await this.createSettings(userId, {
        userId,
        defaultTime: 15,
        accentColor: '#10B981',
        theme: 'auto',
        smartTimeDetection: true,
        pieTimerEnabled: false,
      });
    }
  },

  async updateSettings(userId: string, data: Partial<types.Settings>) {
    return await databases.updateDocument(
      DB_ID,
      SETTINGS_COLLECTION_ID,
      userId,
      data
    );
  },
};
