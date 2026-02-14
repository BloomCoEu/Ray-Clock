import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { authService, settingsService, appwriteConfig } from '@/lib/appwrite-service';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useAppStore((state) => state.setUser);
  const setSettings = useAppStore((state) => state.setSettings);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);

      // Skip auth check if Appwrite is not configured
      if (!appwriteConfig.isValid) {
        console.warn('Appwrite not configured — skipping auth check');
        setUser(null);
        return;
      }

      const currentUser = await authService.getCurrentUser();
      
      if (currentUser) {
        setUser(currentUser as any);
        
        // Load user settings
        const userSettings = await settingsService.getSettings(currentUser.$id);
        if (userSettings) {
          setSettings(userSettings as any);
        } else {
          // Create default settings
          const defaultSettings = {
            userId: currentUser.$id,
            defaultTime: 15,
            accentColor: '#10B981',
            theme: 'auto' as const,
            smartTimeDetection: true,
            pieTimerEnabled: false,
          };
          const created = await settingsService.createSettings(currentUser.$id, defaultSettings);
          setSettings(created as any);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await authService.login(email, password);
      await checkAuth();
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      await authService.createAccount(email, password, name);
      await authService.login(email, password);
      await checkAuth();
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setSettings(null);
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return {
    isLoading,
    login,
    signup,
    logout,
  };
}
