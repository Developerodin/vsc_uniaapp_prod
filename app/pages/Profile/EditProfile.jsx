import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    Image as RNImage,
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
import { pickImageFromLibrary } from '../../utils/imagePicker';


import { useNavigation } from '@react-navigation/native';
export default function EditProfile() {
    const [userId, setUserId] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [fullName, setFullName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [selectedProfileImage, setSelectedProfileImage] = useState(null);
    const [alertConfig, setAlertConfig] = useState({
        isVisible: false,
        title: '',
        message: '',
        icon: 'alert-circle',
        iconColor: '#FF3B30'
    });

    // Add validation state
    const [errors, setErrors] = useState({});

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

    // Validation function
    const validateFields = () => {
        const newErrors = {};
        let hasErrors = false;

        // Check mandatory fields (excluding email since it's disabled)
        if (!fullName.trim()) {
            newErrors.fullName = true;
            hasErrors = true;
        }
        if (!mobileNumber.trim()) {
            newErrors.mobileNumber = true;
            hasErrors = true;
        }
        if (!street.trim()) {
            newErrors.street = true;
            hasErrors = true;
        }
        if (!city.trim()) {
            newErrors.city = true;
            hasErrors = true;
        }
        if (!state.trim()) {
            newErrors.state = true;
            hasErrors = true;
        }
        if (!pincode.trim()) {
            newErrors.pincode = true;
            hasErrors = true;
        }

        setErrors(newErrors);
        return !hasErrors;
    };

    useEffect(() => {
        const loadUserData = async () => {
            try {
                setLoading(true);
                
                // Get user details and access token from AsyncStorage
                const userDetailsStr = await AsyncStorage.getItem('user details');
                const accessToken = await AsyncStorage.getItem('access_token');
                
                if (userDetailsStr && accessToken) {
                    const userDetails = JSON.parse(userDetailsStr);
                    console.log("userDetails",userDetails.id);
                    setUserId(userDetails.id);
                    setAccessToken(accessToken);
                    
                    // Fetch latest user profile data from the API
                    const response = await axios.get(`${Base_url}users/${userDetails.id}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });

                    console.log("response",response.data);
                    
                    if (response.data) {
                        const userData = response.data;
                        
                        // Update state with fetched data
                        setFullName(userData.name || '');
                        setMobileNumber(userData.mobileNumber || '');
                        setEmail(userData.email || '');
                        setProfilePicture(userData.profilePicture || null);
                        
                        // Handle address fields
                        if (userData.address) {
                            setStreet(userData.address.street || '');
                            setCity(userData.address.city || '');
                            setState(userData.address.state || '');
                            setPincode(userData.address.pincode || '');
                        }
                    }
                } else {
                    showAlert('Error', 'Unable to load profile. Please login again.');
                    navigation.navigate('Login');
                }
            } catch (error) {
                console.error('Error loading profile:', error);
                showAlert('Error', 'Failed to load profile data');
            } finally {
                setLoading(false);
            }
        };
        
        loadUserData();
    }, []);

    const handleBackPress = () => {
        navigation.goBack();
    };


    const handleSaveChanges = async () => {
        if (!userId || !accessToken) {
            showAlert('Error', 'User authentication required');
            return;
        }

        // Validate all fields first
        if (!validateFields()) {
            showAlert('Validation Error', 'All fields are required. Please fill in all mandatory fields.');
            return;
        }
        
        try {
            setIsSubmitting(true);
            
            // Prepare data for update
            const updateData = {
                name: fullName,
                mobileNumber: mobileNumber,
                address: {
                    street: street,
                    city: city,
                    state: state,
                    pincode: pincode,
                    country: 'India'
                }
            };
            
            // Upload profile picture if selected
            if (selectedProfileImage) {
                try {
                    const formData = new FormData();
                    
                    // For iOS, we need to handle the file differently
                    const fileInfo = {
                        uri: selectedProfileImage,
                        type: 'image/jpeg',
                        name: 'profile_picture.jpg'
                    };
                    
                    formData.append('file', fileInfo);

                    // Add timeout for iOS uploads
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

                    const uploadResponse = await fetch(`${Base_url}files/upload`, {
                        method: 'POST',
                        body: formData,
                        signal: controller.signal,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    });

                    clearTimeout(timeoutId);

                    if (!uploadResponse.ok) {
                        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
                    }

                    const uploadData = await uploadResponse.json();

                    if (!uploadData.success) {
                        throw new Error(uploadData.message || 'Upload failed');
                    }

                    updateData.profilePicture = uploadData.data.url;
                    updateData.profilePictureKey = uploadData.data.key;
                } catch (uploadError) {
                    console.error('Profile picture upload error:', uploadError);
                    if (uploadError.name === 'AbortError') {
                        throw new Error('Upload timed out. Please try again with a smaller image.');
                    }
                    throw new Error(`Failed to upload profile picture: ${uploadError.message}`);
                }
            }
            
            // Call PATCH API to update user profile
            const response = await axios.patch(
                `${Base_url}users/${userId}`,
                updateData,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.status === 200) {
                // Update local storage with new user data
                const updatedUserDetailsStr = await AsyncStorage.getItem('user details');
                if (updatedUserDetailsStr) {
                    const updatedUserDetails = JSON.parse(updatedUserDetailsStr);
                    const newUserDetails = {
                        ...updatedUserDetails,
                        ...updateData
                    };
                    await AsyncStorage.setItem('user details', JSON.stringify(newUserDetails));
                }
                
                showAlert(
                    'Success',
                    'Profile updated successfully!',
                    'checkmark-circle',
                    '#4CD964'
                );
                setTimeout(() => {
                    navigation.goBack();
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showAlert(
                'Update Failed', 
                error.response?.data?.message || 'Failed to update profile'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUploadProfilePicture = async () => {
        try {
            // Use the improved image picker utility
            const result = await pickImageFromLibrary({
                aspect: [1, 1], // Square aspect ratio for profile picture
                quality: 0.8, // Reduced quality to prevent memory issues
            });

            if (result) {
                setSelectedProfileImage(result.uri);
            }
        } catch (error) {
            console.log('Error picking image:', error);
            
            // Provide more specific error messages
            if (error.message.includes('Permission')) {
                showAlert('Permission Required', 'Please grant photo library access in Settings to upload profile pictures.');
            } else if (error.message.includes('file size')) {
                showAlert('File Too Large', 'Please select a smaller image (under 10MB).');
            } else {
                showAlert('Error', 'Failed to select image. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <View style={styles.viewWrapper}>
                
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.container}>
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#1972B2" />
                            <Text style={styles.loadingText}>Loading profile...</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.viewWrapper}>
            
            <SafeAreaView style={styles.safeArea}>
                {/* Header Section with LinearGradient and Background Image */}
                <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <LinearGradient
                    colors={['#fe8900', '#970251']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0.9 }}
                    style={styles.gradientHeader}
                >
                    <RNImage
                        source={require('../../../assets/images/CenterBg2.png')}
                        style={styles.headerBgImage}
                        resizeMode="cover"
                    />
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={handleBackPress} style={styles.backButtonHeader}>
                            <Ionicons name="chevron-back" size={28} color="#fff" />
                        </TouchableOpacity>
                        {/* <Text style={styles.headerTitleWhite}>Edit Profile</Text> */}
                    </View>
                    <View style={styles.profilePictureContainerHeader}>
                        <View style={styles.profilePictureHeader}>
                            {(selectedProfileImage || profilePicture) ? (
                                <Image 
                                    source={{ uri: selectedProfileImage || profilePicture }} 
                                    style={styles.profilePictureImageHeader}
                                    contentFit="cover"
                                />
                            ) : (
                                <Text style={styles.profileInitialHeader}>
                                    {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity style={styles.editPictureButtonHeader} onPress={handleUploadProfilePicture}>
                            <Ionicons name="pencil-outline" size={20} color="#fff" />
                            <Text style={styles.editPictureTextHeader}>Edit Profile Photo</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
                <View style={styles.container}>
                    {/* Main Content Area */}
                        {/* Form Fields */}
                        <View style={styles.formContainer}>
                            {/* Full Name */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>
                                    Full Name<Text style={styles.requiredAsterisk}> *</Text>
                                </Text>
                                <TextInput
                                    style={[styles.input, errors.fullName && styles.inputError]}
                                    value={fullName}
                                    onChangeText={setFullName}
                                    placeholder="Enter full name"
                                />
                            </View>

                            {/* Mobile Number */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>
                                    Mobile Number<Text style={styles.requiredAsterisk}> *</Text>
                                </Text>
                                <View style={styles.inputWithIcon}>
                                    <TextInput
                                        style={[styles.input,  errors.mobileNumber && styles.inputError]}
                                        value={mobileNumber}
                                        onChangeText={setMobileNumber}
                                        editable={true}
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                        placeholder="Enter mobile number"
                                    />
                                </View>
                            </View>

                            {/* Email */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>
                                    Email
                                </Text>
                                <View style={styles.inputWithIcon}>
                                    <TextInput
                                        style={[styles.input, { backgroundColor: '#f0f0f0' }, styles.disabledInput]}
                                        value={email}
                                        editable={false}
                                        keyboardType="email-address"
                                    />
                                </View>
                                <Text style={styles.emailNote}>Email cannot be changed</Text>
                            </View>

                            {/* Street Address */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>
                                    Street Address<Text style={styles.requiredAsterisk}> *</Text>
                                </Text>
                                <TextInput
                                    style={[styles.input, errors.street && styles.inputError]}
                                    value={street}
                                    onChangeText={setStreet}
                                    placeholder="Enter street address"
                                />
                            </View>

                            {/* City */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>
                                    City<Text style={styles.requiredAsterisk}> *</Text>
                                </Text>
                                <TextInput
                                    style={[styles.input, errors.city && styles.inputError]}
                                    value={city}
                                    onChangeText={setCity}
                                    placeholder="Enter city"
                                />
                            </View>

                            {/* State */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>
                                    State<Text style={styles.requiredAsterisk}> *</Text>
                                </Text>
                                <TextInput
                                    style={[styles.input, errors.state && styles.inputError]}
                                    value={state}
                                    onChangeText={setState}
                                    placeholder="Enter state"
                                />
                            </View>

                            {/* Pincode */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>
                                    Pincode<Text style={styles.requiredAsterisk}> *</Text>
                                </Text>
                                <TextInput
                                    style={[styles.input, errors.pincode && styles.inputError]}
                                    value={pincode}
                                    onChangeText={setPincode}
                                    keyboardType="numeric"
                                    placeholder="Enter pincode"
                                />
                            </View>
                        </View>
                    
                    {/* Save Changes Button */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={[styles.saveButton, isSubmitting && styles.disabledButton]} 
                            onPress={handleSaveChanges}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.saveButtonText}>
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                    </ScrollView>
            </SafeAreaView>

            <CustomAlertModal
                isVisible={alertConfig.isVisible}
                onClose={hideAlert}
                title={alertConfig.title}
                message={alertConfig.message}
                icon={alertConfig.icon}
                iconColor={alertConfig.iconColor}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    viewWrapper: {
        flex: 1,
        backgroundColor: '#ffffff',
        
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        
        
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    gradientHeader: {
        paddingBottom: 30,
        
        paddingHorizontal: 0,
        overflow: 'hidden',
        position: 'relative',
        minHeight: 210,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        zIndex: 1,
        alignItems: 'center',
    },
    headerBgImage: {
        position: 'absolute',
        top: 160,
        left: 0,
        right: 20,
        width: '100%',
        height: 120,
        
        zIndex: 0,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        
        paddingHorizontal: 24,
        marginBottom: 0,
        marginTop: 0,
        zIndex: 2,
        position: 'relative',
        height: 56,
        width: '100%',
      
    },
    backButtonHeader: {
        position: 'absolute',
        left: 0,
        top: -2,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 16,
        zIndex: 3,
        
    },
    headerTitleWhite: {
        fontSize: 20,
        fontFamily: 'Poppins-Regular',
        color: '#fff',
        letterSpacing: 0.5,
        marginLeft: 20,
    },
    profilePictureContainerHeader: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        zIndex: 2,
    },
    profilePictureHeader: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 3,
        borderColor: '#fff',
        overflow: 'hidden',
    },
    profilePictureImageHeader: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    profileInitialHeader: {
        fontSize: 50,
        color: '#BD3334',
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    editPictureButtonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 0,
        justifyContent: 'center',
    },
    editPictureTextHeader: {
        fontSize: 16,
        color: '#fff',
        marginLeft: 5,
        fontFamily: 'Poppins-Regular',
        textDecorationLine: 'underline',
    },
    contentContainer: {
        flex: 1,
    },
    formContainer: {
        marginBottom: 80,
    },
    inputGroup: {
        marginBottom: 25,
    },
    inputLabel: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 10,
        fontFamily: 'Poppins-Medium',
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
    inputWithIcon: {
        position: 'relative',
    },
    verifiedIconContainer: {
        position: 'absolute',
        right: 15,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emailNote: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
        fontStyle: 'italic',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
    },
    saveButton: {
        backgroundColor: '#2a2a2a',
        borderRadius: 30,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#999',
    },
    saveButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontFamily: 'Poppins-SemiBold',
    },
    requiredAsterisk: {
        color: 'red',
        fontWeight: 'bold',
    },
    inputError: {
        borderColor: 'red',
        borderWidth: 1,
    },
    disabledInput: {
        backgroundColor: '#f0f0f0',
    },
});