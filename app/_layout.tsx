import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/hooks/use-auth';
import { AuthScreen } from '@/components/auth-screen';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const user = useAppStore((state) => state.user);
  const { isLoading: authLoading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Show auth screen if user is not logged in and auth check is complete
    if (!authLoading && !user) {
      setShowAuth(true);
    } else if (user) {
      setShowAuth(false);
    }
  }, [user, authLoading]);

  if (authLoading) {
    // Show loading screen while checking auth
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="loading" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  }

  if (showAuth) {
    return <AuthScreen onLoginSuccess={() => setShowAuth(false)} />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
