import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState ,useEffect} from 'react';
import {
  BackHandler,
  Dimensions,
  Image as RNImage,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform

} from 'react-native';

import CustomAlertModal from '../../components/CustomAlertModal';
import { Base_url } from '../../config/BaseUrl';

import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

export default function Congratulations() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [alertConfig, setAlertConfig] = useState({
    isVisible: false,
    title: '',
    message: '',
    icon: 'alert-circle',
    iconColor: '#FF3B30'
  });

  const showAlert = (title, message, icon = 'alert-circle', iconColor = '#FF3B30') => {
    setAlertConfig({
      isVisible: true,
      title,
      message,
      icon,
      iconColor
    });
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, isVisible: false }));
  };

  const handleCompleteProfile = async () => {
    try {
      setLoading(true);
      
      // Retrieve stored email and password from AsyncStorage
      const storedEmail = await AsyncStorage.getItem('temp_email');
      const storedPassword = await AsyncStorage.getItem('temp_password');
      console.log("storedEmail",storedEmail);
      console.log("storedPassword",storedPassword);
      
      if (!storedEmail || !storedPassword) {
        showAlert('Error', 'Unable to retrieve login credentials');
        setLoading(false);
        return;
      }

      const loginData = {
        email: storedEmail,
        password: storedPassword
      };
      
      const response = await axios.post(`${Base_url}auth/login-or-send-otp`, loginData);
      
      if (response && response.data) {
        console.log('Auto-login successful:', response.data);
        
        // Extract tokens and user data
        const { tokens, user } = response.data;
        
        // Store tokens separately in AsyncStorage
        if (tokens) {
          if (tokens.access && tokens.access.token) {
            await AsyncStorage.setItem('access_token', tokens.access.token);
          }
          
          if (tokens.refresh && tokens.refresh.token) {
            await AsyncStorage.setItem('refresh_token', tokens.refresh.token);
          }
        }
        
        // Store user details in AsyncStorage
        await AsyncStorage.setItem("Auth", "true");
        await AsyncStorage.setItem('user details', JSON.stringify(user));
        
        // Navigate to CompleteProfile screen
        navigation.navigate('CompleteKyc');
      }
    } catch (error) {
      console.error('Auto-login error:', error);
      showAlert(
        'Login Failed', 
        'Unable to log in automatically. Please try logging in manually.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(
    React.useCallback(() => {
        const backAction = () => {
            BackHandler.exitApp();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, [])
);
  const handleExplore = async () => {
    try {
      setLoading(true);
      
      // Retrieve stored email and password from AsyncStorage
      const storedEmail = await AsyncStorage.getItem('temp_email');
      const storedPassword = await AsyncStorage.getItem('temp_password');
      
      if (!storedEmail || !storedPassword) {
        showAlert('Error', 'Unable to retrieve login credentials');
        setLoading(false);
        return;
      }

      const loginData = {
        email: storedEmail,
        password: storedPassword
      };
      
      const response = await axios.post(`${Base_url}auth/login-or-send-otp`, loginData);
      
      if (response && response.data) {
        console.log('Auto-login successful:', response.data);
        
        // Extract tokens and user data
        const { tokens, user } = response.data;
        
        // Store tokens separately in AsyncStorage
        if (tokens) {
          if (tokens.access && tokens.access.token) {
            await AsyncStorage.setItem('access_token', tokens.access.token);
          }
          
          if (tokens.refresh && tokens.refresh.token) {
            await AsyncStorage.setItem('refresh_token', tokens.refresh.token);
          }
        }
        
        // Store user details in AsyncStorage
        await AsyncStorage.setItem("Auth", "true");
        await AsyncStorage.setItem('user details', JSON.stringify(user));
        
        // Navigate to Tabs screen
        navigation.navigate('Tabs');
      }
    } catch (error) {
      console.error('Auto-login error:', error);
      showAlert(
        'Login Failed', 
        'Unable to log in automatically. Please try logging in manually.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#fe8900', '#970251']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0.9 }}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../../../assets/images/congratulations.png')}
              style={styles.image}
              contentFit="contain"
            />
          </View>
          <Text style={styles.title}>Congratulations!</Text>
          <Text style={styles.subtitle}>
            Your account has been created. Please provide few more details to complete the registration or explore our platform.
          </Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.completeButton, loading && styles.disabledButton]}
              onPress={handleCompleteProfile}
              disabled={loading}
            >
              <Text style={styles.completeButtonText}>
                {loading ? 'Logging in...' : 'Complete Profile'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.exploreButton, loading && styles.disabledButton]}
              onPress={handleExplore}
              disabled={loading}
            >
              <Text style={styles.exploreButtonText}>
                {loading ? 'Logging in...' : 'Explore the platform'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Bottom background image */}
        <RNImage
          source={require('../../../assets/images/BottomBg.png')}
          style={styles.bottomBgImage}
          resizeMode="contain"
        />
        <CustomAlertModal
          isVisible={alertConfig.isVisible}
          onClose={hideAlert}
          title={alertConfig.title}
          message={alertConfig.message}
          icon={alertConfig.icon}
          iconColor={alertConfig.iconColor}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
    
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    justifyContent: 'center',
    zIndex: 2,
  },
  imageContainer: {
    marginBottom: 40,
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 24,
  },
  buttonsContainer: {
    width: '100%',
    marginTop: 20,
    zIndex: 2,
  },
  completeButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  exploreButton: {
    backgroundColor: 'transparent',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  bottomBgImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: width * 1,
    height: 619,
    zIndex: 1,
  },
});