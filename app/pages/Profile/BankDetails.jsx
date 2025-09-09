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
    TouchableOpacity,
    View,
    StatusBar
} from 'react-native';
import CustomAlertModal from '../../components/CustomAlertModal';
import { Base_url } from '../../config/BaseUrl';

import { useNavigation } from '@react-navigation/native';
export default function BankDetails() {
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [bankAccounts, setBankAccounts] = useState([]);
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

    const handleBackPress = () => {
        navigation.goBack();
    };

    // Fetch bank accounts from backend
    const fetchBankAccounts = async () => {
        try {
            setLoading(true);
            const userDetailsStr = await AsyncStorage.getItem('user details');
            const token = await AsyncStorage.getItem('access_token');
            
            if (userDetailsStr && token) {
                const userDetails = JSON.parse(userDetailsStr);
                setUserId(userDetails.id);
                setAccessToken(token);
                
                // Fetch all bank accounts
                const response = await axios.get(
                    `${Base_url}users/${userDetails.id}/bank-accounts`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                if (response.data && response.data.results) {
                    setBankAccounts(response.data.results);
                }
            }
        } catch (error) {
            console.error('Error fetching bank accounts:', error);
            showAlert('Error', 'Failed to load bank accounts. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async (accountId) => {
        try {
            await axios.delete(
                `${Base_url}users/${userId}/bank-accounts/${accountId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );
            
            // Refresh bank accounts list
            fetchBankAccounts();
            showAlert(
                'Success',
                'Bank account deleted successfully!',
                'checkmark-circle',
                '#4CD964'
            );
        } catch (error) {
            console.error('Error deleting bank account:', error);
            showAlert('Error', 'Failed to delete bank account. Please try again.');
        }
    };

    const handleAddMoreAccounts = () => {
        navigation.navigate('AddBankAccount');
    };

    useEffect(() => {
        fetchBankAccounts();
    }, []);

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
                            <Text style={styles.headerTitleWhite}>Bank Accounts</Text>
                        </View>
                    </LinearGradient>
                    
                    <View style={styles.container}>
                        {/* Main Content Area */}
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#2a2a2a" />
                                <Text style={styles.loadingText}>Loading bank accounts...</Text>
                            </View>
                        ) : bankAccounts.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Image 
                                    source={require('../../../assets/images/EmptyLead.png')}
                                    style={styles.emptyImage}
                                    resizeMode="contain"
                                />
                                <Text style={styles.emptyText}>No Bank Accounts Found</Text>
                            </View>
                        ) : (
                            <View style={styles.accountsContainer}>
                                {bankAccounts.map((account, index) => (
                                    <View key={index} style={styles.accountCard}>
                                        <View style={styles.accountInfo}>
                                            <Text style={styles.accountNumber}>
                                                Account: {account.accountNumber}
                                            </Text>
                                            <Text style={styles.ifscCode}>
                                                IFSC: {account.ifscCode}
                                            </Text>
                                        </View>
                                        <TouchableOpacity 
                                            style={styles.deleteButton}
                                            onPress={() => handleDeleteAccount(account.id)}
                                        >
                                            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </ScrollView>
                
                {/* Add More Accounts Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.addButton} 
                        onPress={handleAddMoreAccounts}
                    >
                        <Text style={styles.addButtonText}>
                            {bankAccounts.length === 0 ? 'Add Account' : 'Add More Accounts'}
                        </Text>
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
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
    accountsContainer: {
        marginTop: 20,
        marginBottom: 80,
    },
    accountCard: {
        backgroundColor: '#F6F6F6',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E6E6E6',
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    accountInfo: {
        flex: 1,
    },
    accountNumber: {
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 4,
    },
    ifscCode: {
        fontSize: 14,
        color: '#666666',
        fontFamily: 'Poppins-Regular',
    },
    deleteButton: {
        padding: 8,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
    },
    addButton: {
        backgroundColor: '#2a2a2a',
        borderRadius: 30,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontFamily: 'Poppins-SemiBold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666666',
        fontFamily: 'Poppins-Regular',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#666666',
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
    },
});