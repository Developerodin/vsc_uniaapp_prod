import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navigation from './app/navigation/Navigation';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    async function prepare() {
      try {
        // Check if it's the first time opening the app
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        if (hasSeenOnboarding) {
          setIsFirstTime(false);
        }

        // Check if user is authenticated
        const authStatus = await AsyncStorage.getItem('Auth');
        if (authStatus === 'true') {
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.warn('Error checking app state:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <Navigation 
        isFirstTime={isFirstTime}
        isAuthenticated={isAuthenticated}
        setIsFirstTime={setIsFirstTime}
        setIsAuthenticated={setIsAuthenticated}
      />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
