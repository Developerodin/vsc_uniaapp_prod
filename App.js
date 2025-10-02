import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';
import Navigation from './app/navigation/Navigation';
import { AppProvider } from './app/context/AppContext';

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
        // Hide Android system navigation bar
        if (Platform.OS === 'android') {
          await NavigationBar.setVisibilityAsync('hidden');
          await NavigationBar.setBehaviorAsync('overlay-swipe');
          await NavigationBar.setBackgroundColorAsync('transparent');
        }

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

  // Keep navigation bar hidden on Android
  useEffect(() => {
    if (Platform.OS === 'android' && appIsReady) {
      const hideNavBar = async () => {
        try {
          await NavigationBar.setVisibilityAsync('hidden');
        } catch (e) {
          console.warn('Error hiding navigation bar:', e);
        }
      };
      
      hideNavBar();
      
      // Re-hide navigation bar when app comes to foreground
      const handleAppStateChange = () => {
        hideNavBar();
      };
      
      const { AppState } = require('react-native');
      const subscription = AppState.addEventListener('change', handleAppStateChange);
      
      return () => {
        subscription?.remove();
      };
    }
  }, [appIsReady]);

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <AppProvider>
        <Navigation 
          isFirstTime={isFirstTime}
          isAuthenticated={isAuthenticated}
          setIsFirstTime={setIsFirstTime}
          setIsAuthenticated={setIsAuthenticated}
        />
        <StatusBar style="auto" translucent={Platform.OS === 'android'} />
      </AppProvider>
    </SafeAreaProvider>
  );
}
