import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import CustomAlertModal from '../../components/CustomAlertModal';
import { Base_url } from '../../config/BaseUrl';

import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');

export default function ReOtpVerification({ route }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const inputs = useRef([]);
  const navigation = useNavigation();
  const [alertConfig, setAlertConfig] = useState({
    isVisible: false,
    title: '',
    message: '',
    icon: 'alert-circle',
    iconColor: '#FF3B30'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get email from AsyncStorage when component mounts
    const getEmail = async () => {
      console.log('Fetching stored email...');
      const storedEmail = await AsyncStorage.getItem('forgot_email');
      console.log('Stored email:', storedEmail);
      
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        console.error('No email found in storage');
        showAlert('Error', 'Unable to retrieve email address');
      }
    };
    getEmail();
  }, []);

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

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = async () => {
    try {
      // Get stored email
      const email = await AsyncStorage.getItem('forgot_email');

      if (!email) {
        console.error('Email not found');
        showAlert('Error', 'Email not found');
        return;
      }

      const resetData = {
        email: email
      };

      const response = await axios.post(`${Base_url}auth/forgot-password`, resetData);

      if (response && response.data && response.data.message === "OTP sent to email") {
        // Reset timer
        setTimer(45);
        showAlert('Success', 'OTP has been resent to your email', 'checkmark-circle', '#4CD964');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      showAlert('Error', error.response?.data?.message || 'Failed to resend OTP. Please try again.');
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    const otpValue = otp.join('');
    if (!otpValue || otpValue.length !== 6) {
      showAlert('Error', 'Please enter the complete OTP');
      return;
    }

    try {
      setLoading(true);
      const email = await AsyncStorage.getItem('forgot_email');
      
      if (!email) {
        showAlert('Error', 'Email not found. Please try again.');
        return;
      }

      const response = await axios.post(`${Base_url}auth/verify-forgot-password-otp`, {
        email,
        otp: otpValue
      });

      if (response && response.data) {
        // Store the reset token
        if (response.data.resetToken && response.data.resetToken.access && response.data.resetToken.access.token) {
          await AsyncStorage.setItem('forgot_password_token', response.data.resetToken.access.token);
        }

        showAlert('Success', 'OTP verified successfully', 'checkmark-circle', '#4CD964');
        setTimeout(() => {
          navigation.navigate('ForgotPassword');
        }, 1500);
      }
    } catch (error) {
      console.error('Verification error:', error);
      showAlert('Error', error.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Reset Password</Text>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeTitle}>Verify OTP</Text>
              <Text style={styles.welcomeSubtitle}>
                Please enter the 6-digit OTP sent to
                <Text style={styles.phoneNumber}> {email}</Text>
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.formInnerContainer}>
                <Text style={styles.inputLabel}>Enter OTP</Text>
                
                <View style={styles.otpContainer}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => (inputs.current[index] = ref)}
                      style={styles.otpInput}
                      value={otp[index]}
                      onChangeText={(value) => handleOtpChange(value, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                    />
                  ))}
                </View>

                <View style={styles.resendContainer}>
                  <TouchableOpacity 
                    onPress={handleResendOtp}
                    disabled={timer > 0}
                  >
                    <Text 
                      style={[
                        styles.resendText, 
                        timer > 0 && styles.resendTextDisabled
                      ]}
                    >
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.timerText}>
                    {timer > 0 ? `${timer} Secs` : ''}
                  </Text>
                </View>

                <TouchableOpacity 
                  style={styles.submitButton} 
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    fontWeight: 'bold',
    color: 'white',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeTextContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize:24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
  },
  phoneNumber: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
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
  },
  formInnerContainer: {
    paddingHorizontal: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    color: '#333',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    width: (width - 100) / 6,
    height: (width - 100) / 6,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  resendText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  resendTextDisabled: {
    color: '#999',
  },
  timerText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#333',
    borderRadius: 30,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 