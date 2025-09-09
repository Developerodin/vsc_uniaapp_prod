import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Modal from 'react-native-modal';
import { Base_url } from '../../config/BaseUrl';

const SelectBankAccountModal = ({ isVisible, onClose, onSelectAccount }) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [bankAccounts, setBankAccounts] = useState([]);

    useEffect(() => {
        if (isVisible) {
            fetchBankAccounts();
        }
    }, [isVisible]);

    const fetchBankAccounts = async () => {
        try {
            setLoading(true);
            const userDetailsStr = await AsyncStorage.getItem('user details');
            const token = await AsyncStorage.getItem('access_token');
            
            if (userDetailsStr && token) {
                const userDetails = JSON.parse(userDetailsStr);
                setUserId(userDetails.id);
                setAccessToken(token);
                
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
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAccount = (account) => {
        onSelectAccount(account);
        onClose();
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            style={styles.modal}
            swipeDirection={['down']}
            onSwipeComplete={onClose}
            backdropOpacity={0.5}
            propagateSwipe
        >
            <View style={styles.modalContent}>
                <View style={styles.handle} />
                <Text style={styles.title}>Select Bank Account</Text>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#2a2a2a" />
                        <Text style={styles.loadingText}>Loading bank accounts...</Text>
                    </View>
                ) : bankAccounts.length === 0 ? (
                    <>
                    <View style={styles.emptyContainer}>
                        <Image 
                            source={require('../../assets/images/EmptyLead.png')}
                            style={styles.emptyImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.emptyText}>No Bank Accounts Found</Text>
                    </View>

                    <View style={styles.addAccountButtonContainer}>
                        <TouchableOpacity style={styles.addAccountButton} onPress={() => navigation.navigate('AddBankAccount')}>
                            <Text style={styles.addAccountButtonText}>Add Bank Account</Text>
                        </TouchableOpacity>
                    </View>
                    </>
                ) : (
                    <ScrollView style={styles.accountsList}>
                        {bankAccounts.map((account, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.accountCard}
                                onPress={() => handleSelectAccount(account)}
                            >
                                <View style={styles.accountInfo}>
                                    <Text style={styles.accountNumber}>
                                        Account: {account.accountNumber}
                                    </Text>
                                    <Text style={styles.ifscCode}>
                                        IFSC: {account.ifscCode}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#666666" />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 10,
        paddingBottom: 30,
        maxHeight: '80%',
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#E6E6E6',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
        marginBottom: 20,
    },
    accountsList: {
        paddingHorizontal: 20,
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
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666666',
        fontFamily: 'Poppins-Regular',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyImage: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666666',
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
    },
    addAccountButtonContainer: {
        padding: 20,
        alignItems: 'center',
    },
    addAccountButton: {
        backgroundColor: '#000000',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 30,
    },
    addAccountButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
    },
});

export default SelectBankAccountModal;
