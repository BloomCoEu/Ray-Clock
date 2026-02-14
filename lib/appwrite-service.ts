import { Client, Account, Databases, ID, Query } from 'appwrite';
import type { Task, Preset, Settings } from './types';

// Initialize Appwrite client
const client = new Client();

// These should be set via environment variables
// For now, using placeholder values - users need to configure their own Appwrite instance
const APPWRITE_ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '';
const APPWRITE_DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || '';
const APPWRITE_TASKS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_TASKS_COLLECTION_ID || '';
const APPWRITE_PRESETS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_PRESETS_COLLECTION_ID || '';
const APPWRITE_SETTINGS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SETTINGS_COLLECTION_ID || '';

const APPWRITE_CONFIG = {
  endpoint: APPWRITE_ENDPOINT,
  projectId: APPWRITE_PROJECT_ID,
  databaseId: APPWRITE_DATABASE_ID,
  tasksCollectionId: APPWRITE_TASKS_COLLECTION_ID,
  presetsCollectionId: APPWRITE_PRESETS_COLLECTION_ID,
  settingsCollectionId: APPWRITE_SETTINGS_COLLECTION_ID,
};

const missingAppwriteKeys = Object.entries(APPWRITE_CONFIG)
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const appwriteConfig = {
  ...APPWRITE_CONFIG,
  missingKeys: missingAppwriteKeys,
  isValid: missingAppwriteKeys.length === 0,
};

if (!appwriteConfig.isValid) {
  console.warn(
    `Appwrite config missing: ${appwriteConfig.missingKeys.join(', ')}`
  );
}

if (appwriteConfig.isValid) {
  client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);
}

export const account = new Account(client);
export const databases = new Databases(client);

// Auth Service
export const authService = {
  async createAccount(email: string, password: string, name: string) {
    try {
      return await account.create(ID.unique(), email, password, name);
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  },

  async login(email: string, password: string) {
    try {
      return await account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  async logout() {
    try {
      return await account.deleteSession('current');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      return await account.get();
    } catch (error) {
      return null;
    }
  },
};

// Task Service
export const taskService = {
  async getTasks(userId: string) {
    if (!appwriteConfig.isValid) {
      console.warn('Appwrite not configured, returning empty tasks');
      return { documents: [] };
    }
    try {
      return await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_TASKS_COLLECTION_ID,
        [Query.equal('userId', userId), Query.orderAsc('order')]
      );
    } catch (error: any) {
      if (error?.message?.includes('Attribute not found')) {
        console.error('❌ Appwrite schema error: userId attribute not found in tasks collection.');
        console.error('📖 Please follow setup guide in APPWRITE_SETUP.md');
      } else {
        console.error('Error getting tasks:', error);
      }
      return { documents: [] };
    }
  },

  async createTask(userId: string, taskData: Partial<Task>) {
    if (!appwriteConfig.isValid) {
      console.warn('Appwrite not configured, cannot create task');
      throw new Error('Appwrite not configured. Please check .env file.');
    }
    try {
      return await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_TASKS_COLLECTION_ID,
        ID.unique(),
        {
          ...taskData,
          userId,
          completed: false,
          actualDuration: 0,
        }
      );
    } catch (error: any) {
      if (error?.message?.includes('not authorized')) {
        console.error('❌ Appwrite permissions error: Check collection permissions in Appwrite Console');
        console.error('📖 Please follow setup guide in APPWRITE_SETUP.md');
      } else {
        console.error('Error creating task:', error);
      }
      throw error;
    }
  },

  async updateTask(taskId: string, updates: Partial<Task>) {
    try {
      return await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_TASKS_COLLECTION_ID,
        taskId,
        updates
      );
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  async deleteTask(taskId: string) {
    try {
      return await databases.deleteDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_TASKS_COLLECTION_ID,
        taskId
      );
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },
};

// Preset Service
export const presetService = {
  async getPresets(userId: string) {
    if (!appwriteConfig.isValid) {
      console.warn('Appwrite not configured, returning empty presets');
      return { documents: [] };
    }
    try {
      return await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_PRESETS_COLLECTION_ID,
        [Query.equal('userId', userId)]
      );
    } catch (error: any) {
      if (error?.message?.includes('Attribute not found')) {
        console.error('❌ Appwrite schema error: userId attribute not found in presets collection.');
        console.error('📖 Please follow setup guide in APPWRITE_SETUP.md');
      } else {
        console.error('Error getting presets:', error);
      }
      return { documents: [] };
    }
  },

  async createPreset(userId: string, presetData: Partial<Preset>) {
    try {
      return await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_PRESETS_COLLECTION_ID,
        ID.unique(),
        {
          ...presetData,
          userId,
        }
      );
    } catch (error) {
      console.error('Error creating preset:', error);
      throw error;
    }
  },

  async updatePreset(presetId: string, updates: Partial<Preset>) {
    try {
      return await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_PRESETS_COLLECTION_ID,
        presetId,
        updates
      );
    } catch (error) {
      console.error('Error updating preset:', error);
      throw error;
    }
  },

  async deletePreset(presetId: string) {
    try {
      return await databases.deleteDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_PRESETS_COLLECTION_ID,
        presetId
      );
    } catch (error) {
      console.error('Error deleting preset:', error);
      throw error;
    }
  },

  async duplicatePreset(presetId: string, userId: string) {
    try {
      const original = await databases.getDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_PRESETS_COLLECTION_ID,
        presetId
      );
      
      return await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_PRESETS_COLLECTION_ID,
        ID.unique(),
        {
          name: `${original.name} (Copy)`,
          emoji: original.emoji,
          tasks: original.tasks,
          totalTime: original.totalTime,
          userId,
        }
      );
    } catch (error) {
      console.error('Error duplicating preset:', error);
      throw error;
    }
  },
};

// Settings Service
export const settingsService = {
  async getSettings(userId: string) {
    if (!appwriteConfig.isValid) {
      console.warn('Appwrite not configured, returning null settings');
      return null;
    }
    try {
      const result = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_SETTINGS_COLLECTION_ID,
        [Query.equal('userId', userId), Query.limit(1)]
      );
      return result.documents[0] || null;
    } catch (error: any) {
      if (error?.message?.includes('Attribute not found')) {
        console.error('❌ Appwrite schema error: userId attribute not found in settings collection.');
        console.error('📖 Please follow setup guide in APPWRITE_SETUP.md');
      } else {
        console.error('Error getting settings:', error);
      }
      return null;
    }
  },

  async createSettings(userId: string, settingsData: Partial<Settings>) {
    if (!appwriteConfig.isValid) {
      console.warn('Appwrite not configured, cannot create settings');
      return null;
    }
    try {
      return await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_SETTINGS_COLLECTION_ID,
        ID.unique(),
        {
          ...settingsData,
          userId,
        }
      );
    } catch (error: any) {
      if (error?.message?.includes('not authorized')) {
        console.error('❌ Appwrite permissions error: Check collection permissions in Appwrite Console');
        console.error('📖 Please follow setup guide in APPWRITE_SETUP.md');
      } else {
        console.error('Error creating settings:', error);
      }
      return null;
    }
  },

  async updateSettings(userId: string, updates: Partial<Settings>) {
    try {
      const existing = await this.getSettings(userId);
      if (existing) {
        return await databases.updateDocument(
          APPWRITE_DATABASE_ID,
          APPWRITE_SETTINGS_COLLECTION_ID,
          existing.$id,
          updates
        );
      } else {
        return await this.createSettings(userId, updates);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },
};
