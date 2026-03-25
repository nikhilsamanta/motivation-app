import { useContext, useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, AuthContext } from '../src/context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import { useNotificationResponse } from '../src/hooks/useNotifications';

function RootLayoutNav() {
  const { token, isLoading } = useContext(AuthContext);
  useNotificationResponse();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (!token && inAuthGroup) {
      // Redirect to the login page.
      router.replace('/login');
    } else if (token && !inAuthGroup) {
      // Redirect to the dashboard page if logged in.
      router.replace('/(tabs)');
    }
  }, [token, isLoading, segments]);

  return (
    <>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
