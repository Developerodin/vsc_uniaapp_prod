import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import CustomAlertModal from '../../components/CustomAlertModal';
import { Base_url } from '../../config/BaseUrl';

import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

export default function Login({ route }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const[forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    isVisible: false,
    title: '',
    message: '',
    icon: 'alert-circle',
    iconColor: '#FF3B30'
  });
  const isRegister = route?.params?.isRegister || false;
  const navigation = useNavigation();

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

  const isValidEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  };

  const isValidMobile = (text) => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(text);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Error', 'Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Determine if input is email or mobile number
      const isEmail = isValidEmail(email);
      const isMobile = isValidMobile(email);
      
      if (!isEmail && !isMobile) {
        showAlert('Error', 'Please enter a valid email or 10-digit mobile number');
        setLoading(false);
        return;
      }

      const loginData = {
        email: email,
        password: password
      };
      
      console.log('Sending login data:', loginData);
      const response = await axios.post(`${Base_url}auth/login-or-send-otp`, loginData);
      
      if (response && response.data) {
        console.log('Response:', response.data);
        
        if (response.data.message === "OTP sent to email") {
          console.log('Storing credentials for OTP verification');
          // Store email and password for later use
          await AsyncStorage.setItem('temp_email', email);
          await AsyncStorage.setItem('temp_password', password);
          
          // Verify storage
          const storedEmail = await AsyncStorage.getItem('temp_email');
          const storedPassword = await AsyncStorage.getItem('temp_password');
          console.log('Stored credentials:', { storedEmail, storedPassword });
          
          // Navigate to OTP verification screen
          navigation.navigate('OtpVerification', {
            email: email,
            isRegister: true
          });
        } else {
          // Handle successful login
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
      }
    } catch (error) {
      console.error('Login error:', error);
      showAlert(
        'Login Failed', 
        error.response?.data?.message || 'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      showAlert('Error', 'Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Determine if input is email or mobile number
      const isEmail = isValidEmail(email);
      const isMobile = isValidMobile(email);
      
      if (!isEmail && !isMobile) {
        showAlert('Error', 'Please enter a valid email or 10-digit mobile number');
        setLoading(false);
        return;
      }

      const registerData = {
        email: email,
        password: password
      };
      
      console.log('Sending registration data:', registerData);
      const response = await axios.post(`${Base_url}auth/login-or-send-otp`, registerData);
      
      if (response && response.data) {
        console.log('Registration response:', response.data);
        
        if (response.data.message === "OTP sent to email") {
          console.log('Storing credentials for OTP verification');
          // Store email and password for later use
          await AsyncStorage.setItem('temp_email', email);
          await AsyncStorage.setItem('temp_password', password);
          
          // Verify storage
          const storedEmail = await AsyncStorage.getItem('temp_email');
          const storedPassword = await AsyncStorage.getItem('temp_password');
          console.log('Stored credentials:', { storedEmail, storedPassword });
          
          // Navigate to OTP verification screen
          navigation.navigate('OtpVerification', {
            email: email,
            isRegister: true
          });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      showAlert(
        'Registration Failed', 
        error.response?.data?.message || 'An error occurred during registration'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      showAlert('Error', 'Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setForgotPasswordLoading(true);
      const response = await axios.post(`${Base_url}auth/forgot-password`, { email });
      
      if (response && response.data ) {
        await AsyncStorage.setItem('forgot_email', email);
        showAlert('Success', 'OTP has been sent to your email', 'checkmark-circle', '#4CD964');
        setTimeout(() => {
          navigation.navigate('ReOtpVerification');
        }, 1500);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      showAlert('Error', error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google login
    console.log('Login with Google');
  };

  const handleFacebookLogin = () => {
    // Implement Facebook login
    console.log('Login with Facebook');
  };

  return (
    <LinearGradient
    colors={['#fe8900', '#970251']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0.9 }}
      style={styles.container}
      
    >
        
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidView}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('Welcome')}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{isRegister ? 'Register' : 'Log In'}</Text>
          </View>
          <ScrollView>
          <View style={styles.contentContainer}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeTitle}>{isRegister ? 'Join VSC ' : 'Welcome Back'}</Text>
              <Text style={styles.welcomeSubtitle}>
                {isRegister 
                  ? 'Sign up to sell insurance & banking products. track commissions, and grow your income.'
                  : 'Login to manage leads, track earnings, and boost your sales.'}
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.formInnerContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>
                    Email <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder=""
                    placeholderTextColor="#000000"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>
                    Password <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder=""
                      placeholderTextColor="#000000"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={hidePassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setHidePassword(!hidePassword)}
                    >
                      <Ionicons
                        name={hidePassword ? "eye" : "eye-off"}
                        size={24}
                        color="#000000"
                        style={{color: '#000000'}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {!isRegister && (
                  <View style={styles.rememberForgotContainer}>
                    <TouchableOpacity
                      style={styles.rememberMeContainer}
                      onPress={() => setRememberMe(!rememberMe)}
                    >
                      <View style={styles.checkboxContainer}>
                        {rememberMe ? (
                          <View style={styles.checkedBox}>
                            <Text style={styles.checkmark}>✓</Text>
                          </View>
                        ) : (
                          <View style={styles.uncheckedBox} />
                        )}
                      </View>
                      <Text style={styles.rememberMeText}>Remember me</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleForgotPassword} disabled={forgotPasswordLoading}>
                      <Text style={styles.forgotPasswordText}>{forgotPasswordLoading ? 'Sending OTP' : 'Forgot Password?'}</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity 
                  style={[styles.loginButton, loading && styles.disabledButton]} 
                  onPress={isRegister ? handleRegister : handleLogin}
                  disabled={loading}
                >
                  <Text style={styles.loginButtonText}>
                    {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
                  </Text>
                </TouchableOpacity>

                {/* <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>Or</Text>
                  <View style={styles.dividerLine} />
                </View> */}

                {/* <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                  <View style={styles.googleIconContainer}>
                    <Text style={styles.googleIcon}>G</Text>
                  </View>
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
                  <View style={styles.facebookIconContainer}>
                    <FontAwesome name="facebook" size={20} color="#1877F2" />
                  </View>
                  <Text style={styles.socialButtonText}>Continue with Facebook</Text>
                </TouchableOpacity> */}
              </View>
            </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <CustomAlertModal
        isVisible={alertConfig.isVisible}
        onClose={hideAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        icon={alertConfig.icon}
        iconColor={alertConfig.iconColor}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20 
  },
  welcomeTextContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize:24,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginBottom: 3,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: 'white',
    lineHeight: 24,
    fontFamily: 'Poppins-Regular'
  },
  formContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingBottom: 30,
    flex: 1,
    marginLeft: -20,
    marginRight: -20,
    height: height,
    
  },
  formInnerContainer: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
    color: '#333',
  },
  requiredStar: {
    color: 'red',
  },
  input: {
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#000000'
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    height: 60,
  },
  passwordInput: {
    flex: 1,
    height: 60,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#000000'
  },
  eyeIcon: {
    paddingHorizontal: 15,
  },
  rememberForgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginRight: 8,
  },
  uncheckedBox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 4,
  },
  checkedBox: {
    width: 22,
    height: 22,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#333',
    fontSize: 14,
    fontFamily: 'Poppins-Bold'
  },
  rememberMeText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-Regular'
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-Regular'
  },
  loginButton: {
    backgroundColor: '#333',
    borderRadius: 30,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-Bold'
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    paddingHorizontal: 10,
    color: '#666',
    fontSize: 16,
    fontFamily: 'Poppins-Regular'
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 54,
    marginBottom: 15,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    fontSize: 20,
    color: '#DB4437',
    fontFamily: 'Poppins-Bold'
  },
  facebookIconContainer: {
    width: 24,
    height: 24,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
});