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

export default function ForgotPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [loading, setLoading] = useState(false);
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

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      showAlert('Error', 'Please fill all required fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert('Error', 'New password and confirm password do not match');
      return;
    }

    if (newPassword.length < 6) {
      showAlert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      
      // Get the forgot password token
      const token = await AsyncStorage.getItem('forgot_password_token');
      if (!token) {
        showAlert('Error', 'Session expired. Please try again.');
        return;
      }

      const resetData = {
        newPassword: newPassword
      };
      
      const response = await axios.post(
        `${Base_url}auth/update-password`, 
        resetData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response && response.data) {
        // Clear the forgot password token
        await AsyncStorage.removeItem('forgot_password_token');
        await AsyncStorage.removeItem('forgot_email');
        
        showAlert('Success', 'Password has been reset successfully', 'checkmark-circle', '#4CD964');
        // Navigate back to login screen after successful reset
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1500);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      showAlert(
        'Reset Failed', 
        error.response?.data?.message || 'An error occurred while resetting password'
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
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Reset Password</Text>
          </View>
          <ScrollView>
          <View style={styles.contentContainer}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeTitle}>Set New Password</Text>
              <Text style={styles.welcomeSubtitle}>
                Please enter your new password to reset your account.
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.formInnerContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>
                    New Password <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder=""
                      placeholderTextColor="#000000"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={hideNewPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setHideNewPassword(!hideNewPassword)}
                    >
                      <Ionicons
                        name={hideNewPassword ? "eye" : "eye-off"}
                        size={24}
                        color="#000000"
                        style={{color: '#000000'}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>
                    Confirm Password <Text style={styles.requiredStar}>*</Text>
                  </Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder=""
                      placeholderTextColor="#000000"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={hideConfirmPassword}
                      autoCapitalize="none"
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
                    >
                      <Ionicons
                        name={hideConfirmPassword ? "eye" : "eye-off"}
                        size={24}
                        color="#000000"
                        style={{color: '#000000'}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity 
                  style={[styles.loginButton, loading && styles.disabledButton]} 
                  onPress={handleResetPassword}
                  disabled={loading}
                >
                  <Text style={styles.loginButtonText}>
                    {loading ? 'Please wait...' : 'Reset Password'}
                  </Text>
                </TouchableOpacity>
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
});