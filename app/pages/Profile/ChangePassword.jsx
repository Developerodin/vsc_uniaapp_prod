import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Keyboard,
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
const { width } = Dimensions.get("window");

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigation = useNavigation();
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
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

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleUpdatePassword = async () => {
        // Frontend validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            showAlert('Error', 'Please fill all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            showAlert('Error', 'New password and confirm password do not match');
            return;
        }

        if (newPassword.length < 6) {
            showAlert('Error', 'New password must be at least 6 characters long');
            return;
        }

        try {
            setLoading(true);

            // Get user details and access token from AsyncStorage
            const userDetailsStr = await AsyncStorage.getItem('user details');
            const token = await AsyncStorage.getItem('access_token');

            if (!userDetailsStr || !token) {
                showAlert('Error', 'User session expired. Please login again.');
                return;
            }

            const userDetails = JSON.parse(userDetailsStr);
            const userIdFromStorage = userDetails.id;

            // API call to change password
            const response = await axios.post(
                `${Base_url}users/${userIdFromStorage}/change-password`,
                {
                    currentPassword: currentPassword,
                    newPassword: newPassword
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Success
            showAlert(
                'Success',
                'Password changed successfully!',
                'checkmark-circle',
                '#4CD964'
            );
            setTimeout(() => {
                navigation.goBack();
            }, 1500);

        } catch (error) {
            console.error('Error changing password:', error);
            
            // Handle specific error messages
            let errorMessage = 'Failed to change password. Please try again.';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 400) {
                errorMessage = 'Current password is incorrect.';
            } else if (error.response?.status === 401) {
                errorMessage = 'Session expired. Please login again.';
            }

            showAlert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        if (field === 'current') {
            setShowCurrentPassword(!showCurrentPassword);
        } else if (field === 'new') {
            setShowNewPassword(!showNewPassword);
        } else if (field === 'confirm') {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    // Add keyboard listeners
    React.useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <View style={styles.viewWrapper}>
           
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
                >
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                                <Ionicons name="chevron-back" size={24} color="#000000" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Change Password</Text>
                        </View>
                        
                        {/* Main Content Area */}
                        <ScrollView 
                            style={styles.contentContainer}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                        >
                            {/* Current Password */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Current Password</Text>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        value={currentPassword}
                                        onChangeText={setCurrentPassword}
                                        secureTextEntry={!showCurrentPassword}
                                        placeholder=""
                                    />
                                    <TouchableOpacity 
                                        style={styles.visibilityToggle}
                                        onPress={() => togglePasswordVisibility('current')}
                                    >
                                        <Ionicons 
                                            name={showCurrentPassword ? "eye-off" : "eye"} 
                                            size={24} 
                                            color="#000000" 
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* New Password */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>New Password</Text>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        secureTextEntry={!showNewPassword}
                                        placeholder=""
                                    />
                                    <TouchableOpacity 
                                        style={styles.visibilityToggle}
                                        onPress={() => togglePasswordVisibility('new')}
                                    >
                                        <Ionicons 
                                            name={showNewPassword ? "eye-off" : "eye"} 
                                            size={24} 
                                            color="#000000" 
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Confirm New Password */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Confirm New Password</Text>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showConfirmPassword}
                                        placeholder=""
                                    />
                                    <TouchableOpacity 
                                        style={styles.visibilityToggle}
                                        onPress={() => togglePasswordVisibility('confirm')}
                                    >
                                        <Ionicons 
                                            name={showConfirmPassword ? "eye-off" : "eye"} 
                                            size={24} 
                                            color="#000000" 
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                            {/* Additional space at bottom to ensure scrollability */}
                            <View style={{ height: 100 }} />
                        </ScrollView>
                        
                        {/* Update Password Button */}
                        {!keyboardVisible && (
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity 
                                    style={[styles.updateButton, loading && styles.disabledButton]} 
                                    onPress={handleUpdatePassword}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.updateButtonText}>Update Password</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
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
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 15,
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: '#000000',
        fontFamily: 'Poppins-SemiBold',
    },
    contentContainer: {
        flex: 1,
        paddingTop: 20,
    },
    inputGroup: {
        marginBottom: 25,
    },
    inputLabel: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 10,
        fontFamily: 'Poppins-Regular',
    },
    passwordContainer: {
        flexDirection: 'row',
        height: 55,
        backgroundColor: '#F6F6FA',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E6E6E6',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Poppins-Regular',
    },
    visibilityToggle: {
        paddingHorizontal: 15,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
    },
    updateButton: {
        backgroundColor: '#2a2a2a',
        borderRadius: 30,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    updateButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontFamily: 'Poppins-SemiBold',
    },
    disabledButton: {
        opacity: 0.6,
    },
});