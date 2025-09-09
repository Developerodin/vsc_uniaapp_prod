import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
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
  View
} from 'react-native';
import CustomAlertModal from '../../components/CustomAlertModal';
import { Base_url } from '../../config/BaseUrl';
import { pickImageFromLibrary, requestImagePickerPermissions } from '../../utils/imagePicker';

import { useNavigation } from '@react-navigation/native';
export default function CompleteProfile() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [alertConfig, setAlertConfig] = useState({
    isVisible: false,
    title: '',
    message: '',
    icon: 'alert-circle',
    iconColor: '#FF3B30'
  });
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    dateOfBirth: '',
    gender: '',
    aadhaarNumber: '',
    panNumber: '',
    kycDetails: {
      aadhaarNumber: '',
      panNumber: '',
      documents: []
    }
  });
  const [selectedImages, setSelectedImages] = useState({
    panCard: null,
    aadhaarCard: null
  });
  
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user details');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          console.log("parsedUserData",parsedUserData.id);
          setUserId(parsedUserData.id);
          
          // Pre-fill any existing data if available
          setFormData(prev => ({
            ...prev,
            name: parsedUserData.name || '',
            mobileNumber: parsedUserData.mobileNumber || '',
            address: {
              street: parsedUserData.address?.street || '',
              city: parsedUserData.address?.city || '',
              state: parsedUserData.address?.state || '',
              pincode: parsedUserData.address?.pincode || '',
              country: parsedUserData.address?.country || 'India'
            },
            dateOfBirth: parsedUserData.dateOfBirth || '',
            gender: parsedUserData.gender || '',
            aadhaarNumber: parsedUserData.aadharNumber || '',
            panNumber: parsedUserData.panNumber || '',
            kycDetails: {
              aadhaarNumber: parsedUserData.aadharNumber || '',
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
    if (field.includes('address.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else if (field === 'aadhaarNumber' || field === 'panNumber') {
      // Update both main field and kycDetails
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

  // Function to convert image to base64
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
      // Use the improved image picker utility
      const result = await pickImageFromLibrary({
        quality: 0.8, // Reduced quality to prevent memory issues
      });

      if (result) {
        setSelectedImages(prev => ({
          ...prev,
          panCard: result.uri
        }));
      }
    } catch (error) {
      console.log('Error picking image:', error);
      
      // Provide more specific error messages
      if (error.message.includes('Permission')) {
        showAlert('Permission Required', 'Please grant photo library access in Settings to upload documents.');
      } else if (error.message.includes('file size')) {
        showAlert('File Too Large', 'Please select a smaller image (under 10MB).');
      } else {
        showAlert('Error', 'Failed to pick image. Please try again.');
      }
    }
  };

  const handleUploadAadhar = async () => {
    try {
      // Use the improved image picker utility
      const result = await pickImageFromLibrary({
        quality: 0.8, // Reduced quality to prevent memory issues
      });

      if (result) {
        setSelectedImages(prev => ({
          ...prev,
          aadhaarCard: result.uri
        }));
      }
    } catch (error) {
      console.log('Error picking image:', error);
      
      // Provide more specific error messages
      if (error.message.includes('Permission')) {
        showAlert('Permission Required', 'Please grant photo library access in Settings to upload documents.');
      } else if (error.message.includes('file size')) {
        showAlert('File Too Large', 'Please select a smaller image (under 10MB).');
      } else {
        showAlert('Error', 'Failed to pick image. Please try again.');
      }
    }
  };

  const updateUserProfile = async () => {
    if (!userId) {
      showAlert('Error', 'User ID not found. Please login again.');
      return false;
    }
    
    try {
      // Prepare the data with base64 documents
      const documentsArray = [];
      
      // Convert PAN card to base64 if selected
      if (selectedImages.panCard) {
        const panBase64 = await convertImageToBase64(selectedImages.panCard);
        if (panBase64) {
          documentsArray.push({
            type: 'pan',
            url: panBase64,
            verified: false,
            uploadedAt: new Date()
          });
        }
      }
      
      // Convert Aadhaar card to base64 if selected
      if (selectedImages.aadhaarCard) {
        const aadhaarBase64 = await convertImageToBase64(selectedImages.aadhaarCard);
        if (aadhaarBase64) {
          documentsArray.push({
            type: 'aadhaar',
            url: aadhaarBase64,
            verified: false,
            uploadedAt: new Date()
          });
        }
      }
      
      // Prepare the update data according to validation schema
      const updateData = {
        name: formData.name,
        mobileNumber: formData.mobileNumber,
        address: formData.address,
        aadhaarNumber: formData.aadhaarNumber,
        panNumber: formData.panNumber,
        kycDetails: {
          aadhaarNumber: formData.aadhaarNumber,
          panNumber: formData.panNumber,
          documents: documentsArray
        }
      };
      
      console.log("updateData", updateData);
      const response = await axios.patch(`${Base_url}users/${userId}`, updateData);
      console.log("response", response);
      
      if (response.status === 200) {
        // Update the local storage with new user data
        const updatedUserData = response.data;
        await AsyncStorage.setItem('user details', JSON.stringify(updatedUserData));
        navigation.navigate('Tabs');
        return true;
      } else {
        showAlert('Error', 'Failed to update profile. Please try again.');
        return false;
      }
    } catch (error) {
      console.log('Error updating profile:', error);
      showAlert('Error', error.response?.data?.message || 'Failed to update profile');
      return false;
    }
  };

  const validateForm = () => {
    // Check required fields
    const requiredFields = {
      name: 'Full Name',
      mobileNumber: 'Mobile Number',
      'address.street': 'Street Address',
      'address.city': 'City',
      'address.state': 'State',
      'address.pincode': 'Pincode',
      panNumber: 'PAN Number',
      aadhaarNumber: 'Aadhaar Number'
    };

    // Check for empty required fields
    for (const [field, label] of Object.entries(requiredFields)) {
      if (field.includes('address.')) {
        const addressField = field.split('.')[1];
        if (!formData.address[addressField]) {
          showAlert('Required Field', `${label} is required.`);
          return false;
        }
      } else if (!formData[field]) {
        showAlert('Required Field', `${label} is required.`);
        return false;
      }
    }

    // Check document uploads
    if (!selectedImages.panCard) {
      showAlert('Required Document', 'Please upload your PAN Card.');
      return false;
    }
    if (!selectedImages.aadhaarCard) {
      showAlert('Required Document', 'Please upload your Aadhaar Card.');
      return false;
    }
    
    // Mobile number validation (10 digits)
    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      showAlert('Invalid Input', 'Please enter a valid 10-digit mobile number.');
      return false;
    }
    
    // Pincode validation (6 digits)
    if (!/^[0-9]{6}$/.test(formData.address.pincode)) {
      showAlert('Invalid Input', 'Please enter a valid 6-digit pincode.');
      return false;
    }
    
    // Aadhaar number validation (12 digits)
    if (!/^[0-9]{12}$/.test(formData.aadhaarNumber)) {
      showAlert('Invalid Input', 'Aadhaar number must be exactly 12 digits.');
      return false;
    }
    
    // PAN number validation (5 letters, 4 digits, 1 letter)
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      showAlert('Invalid Input', 'PAN number must follow the format: ABCDE1234F (5 letters, 4 digits, 1 letter).');
      return false;
    }
    
    return true;
  };

  const renderLabel = (label, required = false) => (
    <View style={styles.labelContainer}>
      <Text style={styles.label}>{label}</Text>
      {required && <Text style={styles.requiredStar}>*</Text>}
    </View>
  );

  const handleFinish = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Update profile via API
    const success = await updateUserProfile();
    
    setLoading(false);
    
    if (success) {
      showAlert(
        'Success', 
        'Profile updated successfully!',
        'checkmark-circle',
        '#4CD964'
      );
      setTimeout(() => {
        navigation.navigate('Tabs');
      }, 1500);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Personal Details</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              {renderLabel('Full Name', true)}
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="Enter your full name"
              />
            </View>

            <View style={styles.inputGroup}>
              {renderLabel('Mobile Number', true)}
              <TextInput
                style={styles.input}
                value={formData.mobileNumber}
                onChangeText={(text) => handleInputChange('mobileNumber', text)}
                placeholder="Enter 10-digit mobile number"
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            <View style={styles.inputGroup}>
              {renderLabel('Street / Flat / House No. / Floor / Building', true)}
              <TextInput
                style={styles.input}
                value={formData.address.street}
                onChangeText={(text) => handleInputChange('address.street', text)}
                placeholder="Enter your street address"
              />
            </View>

            <View style={styles.inputGroup}>
              {renderLabel('City', true)}
              <TextInput
                style={styles.input}
                value={formData.address.city}
                onChangeText={(text) => handleInputChange('address.city', text)}
                placeholder="Enter your city"
              />
            </View>

            <View style={styles.inputGroup}>
              {renderLabel('State', true)}
              <TextInput
                style={styles.input}
                value={formData.address.state}
                onChangeText={(text) => handleInputChange('address.state', text)}
                placeholder="Enter your state"
              />
            </View>

            <View style={styles.inputGroup}>
              {renderLabel('Pincode', true)}
              <TextInput
                style={styles.input}
                value={formData.address.pincode}
                onChangeText={(text) => handleInputChange('address.pincode', text)}
                placeholder="Enter 6-digit pincode"
                keyboardType="numeric"
                maxLength={6}
              />
            </View>

            <View style={styles.divider} />

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

            <View style={styles.inputGroup}>
              {renderLabel('Upload PAN Card', true)}
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={handleUploadPAN}
              >
                {selectedImages.panCard ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image 
                      source={{ uri: selectedImages.panCard }} 
                      style={styles.previewImage}
                      contentFit="cover"
                    />
                    <Text style={styles.imageSelectedText}>PAN Card Selected</Text>
                  </View>
                ) : (
                  <Text style={styles.uploadButtonText}>CLICK TO UPLOAD</Text>
                )}
              </TouchableOpacity>
              <Text style={styles.fileInfoText}>Only PDF, JPG, PNG files are accepted. Max 10 MB</Text>
            </View>

            <View style={styles.inputGroup}>
              {renderLabel('Aadhar Number', true)}
              <TextInput
                style={styles.input}
                value={formData.aadhaarNumber}
                onChangeText={(text) => handleInputChange('aadhaarNumber', text)}
                placeholder="Enter 12-digit Aadhaar number"
                keyboardType="numeric"
                maxLength={12}
              />
            </View>

            <View style={styles.inputGroup}>
              {renderLabel('Upload Aadhar Card', true)}
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={handleUploadAadhar}
              >
                {selectedImages.aadhaarCard ? (
                  <View style={styles.imagePreviewContainer}>
                    <Image 
                      source={{ uri: selectedImages.aadhaarCard }} 
                      style={styles.previewImage}
                      contentFit="cover"
                    />
                    <Text style={styles.imageSelectedText}>Aadhar Card Selected</Text>
                  </View>
                ) : (
                  <Text style={styles.uploadButtonText}>CLICK TO UPLOAD</Text>
                )}
              </TouchableOpacity>
              <Text style={styles.fileInfoText}>Only PDF, JPG, PNG files are accepted. Max 10 MB</Text>
            </View>

            <TouchableOpacity 
              style={[styles.finishButton, loading && styles.disabledButton]}
              onPress={handleFinish}
              disabled={loading}
            >
              <Text style={styles.finishButtonText}>
                {loading ? 'Updating...' : 'Finish'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
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
  input: {
    height: 55,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
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
  finishButton: {
    backgroundColor: '#333',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 30,
  },
  finishButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
});