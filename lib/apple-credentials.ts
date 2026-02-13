import { Platform } from 'react-native';
import type { AppleCalendarConfig } from './types';

const APPLE_ID_KEY = 'apple_calendar_apple_id';
const APP_PASSWORD_KEY = 'apple_calendar_app_password';

let SecureStore: typeof import('expo-secure-store') | null = null;

async function getSecureStore() {
  if (SecureStore) return SecureStore;
  if (Platform.OS === 'web') return null;
  try {
    SecureStore = await import('expo-secure-store');
    return SecureStore;
  } catch {
    return null;
  }
}

export const appleCredentials = {
  async saveCredentials(appleId: string, appPassword: string): Promise<void> {
    const store = await getSecureStore();
    if (store) {
      await store.setItemAsync(APPLE_ID_KEY, appleId);
      await store.setItemAsync(APP_PASSWORD_KEY, appPassword);
    }
  },

  async getCredentials(): Promise<{ appleId: string; appPassword: string } | null> {
    const store = await getSecureStore();
    if (!store) return null;
    try {
      const appleId = await store.getItemAsync(APPLE_ID_KEY);
      const appPassword = await store.getItemAsync(APP_PASSWORD_KEY);
      if (appleId && appPassword) {
        return { appleId, appPassword };
      }
      return null;
    } catch {
      return null;
    }
  },

  async deleteCredentials(): Promise<void> {
    const store = await getSecureStore();
    if (store) {
      await store.deleteItemAsync(APPLE_ID_KEY);
      await store.deleteItemAsync(APP_PASSWORD_KEY);
    }
  },

  async getConfig(): Promise<AppleCalendarConfig | null> {
    const creds = await this.getCredentials();
    if (creds) {
      return { appleId: creds.appleId, isConnected: true };
    }
    return null;
  },
};
