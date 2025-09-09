import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
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
    View
} from 'react-native';
import CustomAlertModal from '../../components/CustomAlertModal';
import { Base_url } from '../../config/BaseUrl';

import { useNavigation } from '@react-navigation/native';
export default function AddBankAccount() {
    const [accountNumber, setAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const navigation = useNavigation();
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

    useEffect(() => {
        const getUserData = async () => {
            try {
                const userDetailsStr = await AsyncStorage.getItem('user details');
                const token = await AsyncStorage.getItem('access_token');
                
                if (userDetailsStr && token) {
                    const userDetails = JSON.parse(userDetailsStr);
                    setUserId(userDetails.id);
                    console.log(userDetails.id);
                    setAccessToken(token);
                }
            } catch (error) {
                console.error('Error getting user data:', error);
            }
        };
        
        getUserData();
    }, []);

    const verifyBank = async (accountNumber, ifscCode) => {
        try {
            const response = await axios.post(
                `${Base_url}users/${userId}/kyc/bank/verify`,
                { accountNumber, ifscCode },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error verifying bank:', error);
            throw error;
        }
    };

    const handleVerify = async () => {
        if (!accountNumber || !ifscCode) {
            showAlert('Error', 'Please fill all fields');
            return;
        }

        try {
            setLoading(true);
            const response = await verifyBank(accountNumber, ifscCode);
            
            if (response.valid === true) {
                showAlert('Success', 'Bank details verification successful!', 'checkmark-circle', '#4CD964');
                setTimeout(() => {
                    navigation.goBack();
                }, 1500);
            } else {
                showAlert('Verification Failed', 'Bank details verification failed. Please try again.');
            }
        } catch (error) {
            console.log('Full error object:', error);
            console.log('Error response data:', error.response?.data);
            
            let errorMessage = 'Failed to verify bank details';
            
            // Handle different error response formats
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            // Show the complete message from backend without cleaning it up
            
            // If errorMessage is still generic, try to get more specific info
            if (errorMessage === 'Failed to verify bank details' && error.response?.status) {
                errorMessage = `Error ${error.response.status}: ${error.response.statusText || 'Request failed'}`;
            }
            
            showAlert('Verification Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.viewWrapper}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    {/* Header Section with LinearGradient and Background Image */}
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
                            <Text style={styles.headerTitleWhite}>Add Bank Account</Text>
                        </View>
                    </LinearGradient>
                    
                    <View style={styles.container}>
                        {/* Main Content Area */}
                        <View style={styles.formContainer}>
                            {/* Account Number */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Account Number</Text>
                                <TextInput
                                    style={styles.input}
                                    value={accountNumber}
                                    onChangeText={setAccountNumber}
                                    keyboardType="numeric"
                                    placeholder="Enter account number"
                                />
                            </View>

                            {/* IFSC Code */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>IFSC Code</Text>
                                <TextInput
                                    style={styles.input}
                                    value={ifscCode}
                                    onChangeText={setIfscCode}
                                    autoCapitalize="characters"
                                    placeholder="Enter IFSC code"
                                />
                            </View>

                        </View>
                    </View>
                </ScrollView>
                
                {/* Verify Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={[styles.verifyButton, loading && styles.disabledButton]} 
                        onPress={handleVerify}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Text style={styles.verifyButtonText}>Verify Bank Account</Text>
                        )}
                    </TouchableOpacity>
                </View>
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
}

const styles = StyleSheet.create({
    viewWrapper: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 0 : 15,
    },
    contentContainer: {
        flex: 1,
    },
    gradientHeader: {
        paddingBottom: 30,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: 0,
        overflow: 'hidden',
        position: 'relative',
        minHeight: 150,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        zIndex: 1,
        alignItems: 'center',
    },
    headerBgImage: {
        position: 'absolute',
        top: 100,
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
    formContainer: {
        marginTop: 20,
        marginBottom: 80,
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
    otpNote: {
        fontSize: 14,
        color: '#666666',
        fontFamily: 'Poppins-Regular',
        marginTop: 10,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
    },
    verifyButton: {
        backgroundColor: '#2a2a2a',
        borderRadius: 30,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifyButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontFamily: 'Poppins-SemiBold',
    },
    disabledButton: {
        opacity: 0.6,
    },
});
