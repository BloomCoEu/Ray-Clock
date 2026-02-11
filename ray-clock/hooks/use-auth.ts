import { useState, useEffect } from 'react';
import { account } from '@/lib/appwrite-client';
import { useAppStore } from '@/lib/store';
import { userService, settingsService } from '@/lib/appwrite-service';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const setUser = useAppStore((state) => state.setUser);
  const setSettings = useAppStore((state) => state.setSettings);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const session = await account.get();
      
      // Get user document from database
      const userDoc = await userService.getUser(session.$id);
      setUser(userDoc);

      // Get user settings
      const settings = await settingsService.getSettings(session.$id);
      setSettings(settings);

      setError(null);
    } catch (err) {
      // User is not logged in
      setUser(null);
      setError(null); // This is not an error, just not logged in yet
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const session = await account.createEmailPasswordSession(email, password);
      const sessionData = await account.get();

      const userDoc = await userService.getUser(sessionData.$id);
      setUser(userDoc);

      const settings = await settingsService.getSettings(sessionData.$id);
      setSettings(settings);

      setError(null);
      return sessionData;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const newUser = await account.create('unique()', email, password, name);
      
      // Create user document
      await userService.createUser(newUser.$id, email, name);

      // Create default settings
      await settingsService.createSettings(newUser.$id, {
        userId: newUser.$id,
        defaultTime: 15,
        accentColor: '#10B981',
        theme: 'auto',
        smartTimeDetection: true,
        pieTimerEnabled: false,
      });

      // Create session
      await account.createEmailPasswordSession(email, password);
      await checkSession();

      setError(null);
      return newUser;
    } catch (err: any) {
      setError(err.message || 'Signup failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      setSettings(null);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Logout failed');
      throw err;
    }
  };

  return {
    isLoading,
    error,
    login,
    signup,
    logout,
    checkSession,
  };
};
