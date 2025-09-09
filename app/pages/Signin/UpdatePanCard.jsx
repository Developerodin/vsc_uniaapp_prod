import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
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

import { useNavigation } from '@react-navigation/native';
export default function UpdatePanCard() {
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
    const [panNumber, setPanNumber] = useState('');

    useEffect(() => {
        const getUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('user details');
                if (userData) {
                    const parsedUserData = JSON.parse(userData);
                    setUserId(parsedUserData.id);
                    setPanNumber(parsedUserData.panNumber || '');
                }
            } catch (error) {
                console.log('Error getting user data:', error);
            }
        };
        
        getUserData();
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

    const verifyPAN = async (panNumber) => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            const response = await axios.post(
                `${Base_url}users/${userId}/kyc/pan/verify`,
                { pan: panNumber },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.log('Error verifying PAN:', error);
            throw error;
        }
    };

    const handleVerify = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            const verifyResponse = await verifyPAN(panNumber);
            
            if (verifyResponse.valid === true) {
                showAlert(
                    'Success',
                    'PAN verification successful!',
                    'checkmark-circle',
                    '#4CD964'
                );
                setTimeout(() => {
                    navigation.goBack();
                }, 1500);
            } else {
                showAlert('Verification Failed', 'PAN verification failed. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying PAN:', error);
            showAlert('Verification Failed', error.response?.data?.message || 'Failed to verify PAN number');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        if (!panNumber) {
            showAlert('Required Field', 'Please enter PAN number');
            return false;
        }

        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
            showAlert('Invalid Input', 'PAN number must follow the format: ABCDE1234F');
            return false;
        }

        return true;
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
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
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonHeader}>
                            <Ionicons name="chevron-back" size={28} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitleWhite}>Verify PAN Card</Text>
                    </View>
                </LinearGradient>

                <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>PAN Number</Text>
                        <TextInput
                            style={styles.input}
                            value={panNumber}
                            onChangeText={(text) => setPanNumber(text.toUpperCase())}
                            placeholder="Enter PAN number (ABCDE1234F)"
                            autoCapitalize="characters"
                            maxLength={10}
                        />
                    </View>
                </ScrollView>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={[styles.verifyButton, loading && styles.disabledButton]}
                        onPress={handleVerify}
                        disabled={loading}
                    >
                        <Text style={styles.verifyButtonText}>
                            {loading ? 'Verifying...' : 'Verify PAN'}
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
        backgroundColor: '#ffffff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
        fontFamily: 'Poppins-SemiBold',
        color: '#fff',
        letterSpacing: 0.5,
        marginLeft: 20,
    },
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 10,
    },
    input: {
        height: 55,
        backgroundColor: '#F6F6FA',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#000000',
        borderWidth: 1,
        borderColor: '#E6E6E6',
    },
    buttonContainer: {
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
    }
});
