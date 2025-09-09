import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar
} from 'react-native';
import CustomAlertModal from '../../components/CustomAlertModal';
import { Base_url } from '../../config/BaseUrl';

import { useNavigation } from '@react-navigation/native';
export default function CompleteKyc() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(1); // 1: PAN, 2: Bank Account
  const navigation = useNavigation();
  const [alertConfig, setAlertConfig] = useState({
    isVisible: false,
    title: '',
    message: '',
    icon: 'alert-circle',
    iconColor: '#FF3B30'
  });
  const [formData, setFormData] = useState({
    panNumber: '',
    bankDetails: {
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      ifscCode: ''
    },
    kycDetails: {
      panNumber: '',
      documents: []
    }
  });
  const [selectedImages, setSelectedImages] = useState({
    panCard: null
  });

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user details');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUserId(parsedUserData.id);
          setFormData(prev => ({
            ...prev,
            panNumber: parsedUserData.panNumber || '',
            kycDetails: {
              panNumber: parsedUserData.panNumber || '',
              documents: parsedUserData.kycDetails?.documents || []
            }
          }));
        }
      } catch (error) {
        console.log('Error getting user data:', error);
      }
    };
    
    getUserData();
  }, []);

  const handleInputChange = (field, value) => {
    if (field.includes('bankDetails.')) {
      const bankField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [bankField]: value
        }
      }));
    } else if (field === 'panNumber') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        kycDetails: {
          ...prev.kycDetails,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const convertImageToBase64 = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };

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

  const handleUploadPAN = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        showAlert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0,
      });

      if (!result.canceled) {
        setSelectedImages(prev => ({
          ...prev,
          panCard: result.assets[0].uri
        }));
      }
    } catch (error) {
      console.log('Error picking image:', error);
      showAlert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSkip = () => {
    if (currentPhase === 1) {
      setCurrentPhase(2); // Move to next phase
    } else {
      navigation.navigate('Tabs'); // Navigate to Tabs in last phase
    }
  };

  const verifyPAN = async (panNumber) => {
    try {
      const response = await axios.post(`${Base_url}users/${userId}/kyc/pan/verify`, {
        pan: panNumber
      });
      return response.data;
    } catch (error) {
      console.log('Error verifying PAN:', error);
      throw error;
    }
  };

  const verifyBank = async (accountNumber, ifscCode) => {
    try {
      const response = await axios.post(`${Base_url}users/${userId}/kyc/bank/verify`, {
        accountNumber,
        ifscCode
      });
      return response.data;
    } catch (error) {
      console.log('Error verifying bank details:', error);
      throw error;
    }
  };

  const handleVerify = async () => {
    if (currentPhase === 1) {
      if (!formData.panNumber) {
        showAlert('Required Field', 'Please enter PAN number');
        return;
      }
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
        showAlert('Invalid Input', 'PAN number must follow the format: ABCDE1234F');
        return;
      }
      
      try {
        setLoading(true);
        const response = await verifyPAN(formData.panNumber);
        if (response.valid === true) {
          showAlert('Success', 'PAN verification successful!', 'checkmark-circle', '#4CD964');
          setCurrentPhase(2);
        } else {
          showAlert('Verification Failed', 'PAN verification failed. Please try again.');
        }
      } catch (error) {
        showAlert('Verification Failed', error.response?.data?.message || 'Failed to verify PAN number');
      } finally {
        setLoading(false);
      }
    } else if (currentPhase === 2) {
      if (!formData.bankDetails.accountNumber || !formData.bankDetails.ifscCode) {
        showAlert('Required Fields', 'Please enter both Account Number and IFSC Code');
        return;
      }
      
      try {
        setLoading(true);
        const response = await verifyBank(formData.bankDetails.accountNumber, formData.bankDetails.ifscCode);
        if (response.valid === true) {
          showAlert('Success', 'Bank details verification successful!', 'checkmark-circle', '#4CD964');
          setTimeout(() => {
            navigation.navigate('Tabs');
          }, 1500);
        } else {
          showAlert('Verification Failed', 'Bank details verification failed. Please try again.');
        }
      } catch (error) {
        showAlert('Verification Failed', error.response?.data?.message || 'Failed to verify bank details');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderPANPhase = () => (
    <View style={styles.phaseContent}>
      <View style={styles.inputGroup}>
        {renderLabel('PAN Number', true)}
        <TextInput
          style={styles.input}
          value={formData.panNumber}
          onChangeText={(text) => handleInputChange('panNumber', text.toUpperCase())}
          placeholder="Enter PAN number (ABCDE1234F)"
          autoCapitalize="characters"
          maxLength={10}
        />
      </View>
    </View>
  );

  const renderBankPhase = () => (
    <View style={styles.phaseContent}>
      <View style={styles.inputGroup}>
        {renderLabel('Account Number', true)}
        <TextInput
          style={styles.input}
          value={formData.bankDetails.accountNumber}
          onChangeText={(text) => handleInputChange('bankDetails.accountNumber', text)}
          placeholder="Enter account number"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        {renderLabel('IFSC Code', true)}
        <TextInput
          style={styles.input}
          value={formData.bankDetails.ifscCode}
          onChangeText={(text) => handleInputChange('bankDetails.ifscCode', text.toUpperCase())}
          placeholder="Enter IFSC code"
          autoCapitalize="characters"
          maxLength={11}
        />
      </View>
    </View>
  );

  const renderLabel = (label, required = false) => (
    <View style={styles.labelContainer}>
      <Text style={styles.label}>{label}</Text>
      {required && <Text style={styles.requiredStar}>*</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <LinearGradient
          colors={['#fe8900', '#970251']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.7 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={20} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>KYC Details</Text>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.phaseSwitchRow}>
            <TouchableOpacity
              style={[styles.phasePill, currentPhase === 1 ? styles.phasePillActive : styles.phasePillInactive]}
              onPress={() => setCurrentPhase(1)}
              activeOpacity={1}
            >
              <View style={[styles.phaseDot, currentPhase === 1 ? styles.phaseDotActive : styles.phaseDotInactive]} />
              <Text style={[styles.phasePillText, currentPhase === 1 ? styles.phasePillTextActive : styles.phasePillTextInactive]}>PAN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.phasePill, currentPhase === 2 ? styles.phasePillActive : styles.phasePillInactive]}
              onPress={() => setCurrentPhase(2)}
              activeOpacity={1}
            >
              <View style={[styles.phaseDot, currentPhase === 2 ? styles.phaseDotActive : styles.phaseDotInactive]} />
              <Text style={[styles.phasePillText, currentPhase === 2 ? styles.phasePillTextActive : styles.phasePillTextInactive]}>Bank</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {currentPhase === 1 && renderPANPhase()}
          {currentPhase === 2 && renderBankPhase()}
        </ScrollView>
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity 
            style={[styles.verifyButton, loading && styles.disabledButton]}
            onPress={handleVerify}
            disabled={loading}
          >
            <Text style={styles.verifyButtonText}>
              {loading ? 'Processing...' : currentPhase === 2 ? 'Verify Bank Account' : 'Verify PAN'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <CustomAlertModal
        isVisible={alertConfig.isVisible}
        onClose={hideAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        icon={alertConfig.icon}
        iconColor={alertConfig.iconColor}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ?  20 : 0,
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 15,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Poppins-Medium',
    flex: 1,
    
  },
  skipButton: {
    padding: 5,
    minWidth: 50,
    alignItems: 'flex-end',
  },
  skipButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  phaseSwitchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
    gap: 18,
  },
  phasePill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingTop: 8,
    paddingBottom: 6,
    paddingHorizontal: 32,
    marginHorizontal: 6,
    backgroundColor: '#fff',
    
  },
  phasePillActive: {
    backgroundColor: '#fff',
    
  },
  phasePillInactive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  phaseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#fe8900',
    marginBottom: 2,
  },
  phaseDotActive: {
    backgroundColor: '#BD3334',
    borderColor: '#BD3334',
  },
  phaseDotInactive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  phasePillText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#BD3334',
  },
  phasePillTextActive: {
    color: '#BD3334',
  },
  phasePillTextInactive: {
    color: '#fff',
    
  },
  scrollView: {
    flex: 1,
  },
  phaseContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  requiredStar: {
    color: '#FF3B30',
    fontSize: 16,
    marginLeft: 4,
  },
  inputLabel: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
  },
  input: {
    height: 55,
    backgroundColor: '#F6F6FA',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  uploadButton: {
    height: 100,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#666',
    fontSize: 16,
  },
  fileInfoText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  imageSelectedText: {
    marginLeft: 10,
    color: '#666',
    fontSize: 14,
  },
  bottomButtonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  verifyButton: {
    backgroundColor: '#333',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
});