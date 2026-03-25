import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// This configures how notifications are handled when the app is foregrounded
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotificationResponse() {
  const router = useRouter();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      // When the user clicks the notification, redirect to the home screen/dashboard
      router.push('/(tabs)');
    });

    return () => subscription.remove();
  }, [router]);
}

export async function scheduleDailyMotivation(quoteText) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Daily Inspiration 🌟',
      body: quoteText,
      sound: 'default',
    },
    trigger: {
      hour: 8,
      minute: 0,
      repeats: true,
    },
  });
  console.log('Daily motivation scheduled for 8 AM');
}

export async function sendImmediateTestNotification(text) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Daily Inspiration 🌟',
      body: text || 'This is a test notification from your Motivation App!',
      sound: 'default',
    },
    trigger: null, // Send immediately
  });
}

export async function registerForPushNotificationsAsync() {
  // Existing logic...
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#7c5cfc',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }
    
    // projectId is required for Expo Push Tokens in SDK 49+
    // If you don't have an EAS project ID yet, it might work without or using a fallback
    try {
      const projectId = 
        Constants?.expoConfig?.extra?.eas?.projectId ?? 
        Constants?.easConfig?.projectId;
        
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    } catch (e) {
      console.log('Error getting push token', e);
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}
