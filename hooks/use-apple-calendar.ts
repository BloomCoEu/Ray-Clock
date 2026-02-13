import { useState, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { caldavService } from '@/lib/caldav-service';
import { appleCredentials } from '@/lib/apple-credentials';

export function useAppleCalendar() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setCalendarEvents = useAppStore((state) => state.setCalendarEvents);
  const setReminders = useAppStore((state) => state.setReminders);
  const setAppleCalendarConfig = useAppStore((state) => state.setAppleCalendarConfig);
  const appleCalendarConfig = useAppStore((state) => state.appleCalendarConfig);

  const connect = useCallback(async (appleId: string, appPassword: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await caldavService.testConnection(appleId, appPassword);
      await appleCredentials.saveCredentials(appleId, appPassword);
      setAppleCalendarConfig({ appleId, isConnected: true });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to connect to Apple Calendar';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setAppleCalendarConfig]);

  const disconnect = useCallback(async () => {
    await appleCredentials.deleteCredentials();
    setAppleCalendarConfig(null);
    setCalendarEvents([]);
    setReminders([]);
  }, [setAppleCalendarConfig, setCalendarEvents, setReminders]);

  const syncEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const creds = await appleCredentials.getCredentials();
      if (!creds) {
        setError('No Apple Calendar credentials found. Please connect first.');
        return;
      }

      const events = await caldavService.fetchAllEvents(creds.appleId, creds.appPassword);
      setCalendarEvents(events);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sync calendar events';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [setCalendarEvents]);

  const syncReminders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const creds = await appleCredentials.getCredentials();
      if (!creds) {
        setError('No Apple Calendar credentials found. Please connect first.');
        return;
      }

      const reminders = await caldavService.fetchAllReminders(creds.appleId, creds.appPassword);
      setReminders(reminders);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sync reminders';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [setReminders]);

  const syncAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const creds = await appleCredentials.getCredentials();
      if (!creds) {
        setError('No Apple Calendar credentials found. Please connect first.');
        return;
      }

      const [events, reminders] = await Promise.all([
        caldavService.fetchAllEvents(creds.appleId, creds.appPassword),
        caldavService.fetchAllReminders(creds.appleId, creds.appPassword),
      ]);

      setCalendarEvents(events);
      setReminders(reminders);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sync';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [setCalendarEvents, setReminders]);

  const loadSavedConfig = useCallback(async () => {
    try {
      const config = await appleCredentials.getConfig();
      if (config) {
        setAppleCalendarConfig(config);
      }
    } catch {
      // Credentials not available (e.g., web platform)
    }
  }, [setAppleCalendarConfig]);

  return {
    isLoading,
    error,
    isConnected: appleCalendarConfig?.isConnected ?? false,
    appleId: appleCalendarConfig?.appleId ?? '',
    connect,
    disconnect,
    syncEvents,
    syncReminders,
    syncAll,
    loadSavedConfig,
  };
}
