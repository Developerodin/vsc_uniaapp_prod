import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import CustomAlertModal from '../../components/CustomAlertModal';
import SelectBankAccountModal from '../../components/Models/SelectBankAccountModal';
import { Base_url } from '../../config/BaseUrl';

import { useNavigation } from '@react-navigation/native';
export default function WithdrawMoney() {
    const navigation = useNavigation();
    const [amount, setAmount] = useState('');
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedBankAccount, setSelectedBankAccount] = useState(null);
    const [alertConfig, setAlertConfig] = useState({
        title: '',
        message: '',
        icon: 'alert-circle',
        iconColor: '#FF3B30'
    });

    useEffect(() => {
        fetchWalletBalance();
    }, []);

    const fetchWalletBalance = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            const response = await axios.get(`${Base_url}/wallet`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.status === 'success') {
                setBalance(response.data.data.wallet.balance);
            }
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
            showErrorAlert('Error', 'Failed to fetch wallet balance');
        } finally {
            setLoading(false);
        }
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleAmountChange = (text) => {
        // Remove any non-numeric characters
        const numericValue = text.replace(/[^0-9]/g, '');
        setAmount(numericValue);
    };


    const handleSelectBankAccount = (account) => {
        setSelectedBankAccount(account);
        setIsModalVisible(false);
    };

    const handleWithdraw = async () => {
        if (!amount || parseInt(amount) <= 0) {
            showErrorAlert('Invalid Amount', 'Please enter a valid amount');
            return;
        }

        if (parseInt(amount) > balance) {
            showErrorAlert('Insufficient Balance', 'You don\'t have enough balance');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('access_token');
            const response = await axios.post(
                `${Base_url}/withdrawal-requests`,
                {
                    amount: parseInt(amount),
                    bankAccount: selectedBankAccount?.id // Using the provided bank account ID
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.status === 'success') {
                showSuccessAlert('Success', 'Withdrawal request submitted successfully');
                // Refresh wallet balance
                fetchWalletBalance();
                // Clear amount
                setAmount('');
            }
        } catch (error) {
            console.error('Error making withdrawal:', error);
            showErrorAlert('Error', 'Failed to process withdrawal request');
        }
    };

    const showErrorAlert = (title, message) => {
        setAlertConfig({
            title,
            message,
            icon: 'alert-circle',
            iconColor: '#FF3B30'
        });
        setShowAlert(true);
    };

    const showSuccessAlert = (title, message) => {
        setAlertConfig({
            title,
            message,
            icon: 'checkmark-circle',
            iconColor: '#00BC64'
        });
        setShowAlert(true);
    };

    return (
        <View style={styles.viewWrapper}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#000000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Withdraw money</Text>
                </View>
                
                {/* Main Content Area */}
                <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    {/* Current Balance Card */}
                    <View style={styles.balanceCard}>
                        <Text style={styles.balanceLabel}>Current Balance</Text>
                        <Text style={styles.balanceAmount}>₹ {balance.toLocaleString()}</Text>
                    </View>
                    
                    {/* Withdraw Section */}
                    <View style={styles.withdrawSection}>
                        <Text style={styles.withdrawTitle}>Withdraw</Text>
                        <View style={styles.bankAccountContainer}>
                        <Text style={styles.bankAccountTitle}>Select Bank Account</Text>
                        <TouchableOpacity 
                            style={styles.bankAccountInput}
                            onPress={() => setIsModalVisible(true)}
                        >
                            <Text style={[
                                styles.bankAccountText,
                                !selectedBankAccount && styles.placeholderText
                            ]}>
                                {selectedBankAccount?.accountNumber || 'Select Bank Account'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="#666666" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.amountContainer}>
    <Text style={styles.amountTitle}>Enter Amount</Text>
    <TextInput
        style={[styles.amountInput, !selectedBankAccount && styles.disabledInput]}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        editable={!!selectedBankAccount}
    />
</View>
</View>

                    <TouchableOpacity 
                        style={[
                            styles.withdrawButton,
                            (!selectedBankAccount || !amount) && styles.disabledButton
                        ]}
                        onPress={handleWithdraw}
                        disabled={!selectedBankAccount || !amount}
                    >
                        <Text style={styles.withdrawButtonText}>Withdraw Money</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Alert Modal */}
                <CustomAlertModal
                    isVisible={showAlert}
                    onClose={() => setShowAlert(false)}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    icon={alertConfig.icon}
                    iconColor={alertConfig.iconColor}
                />
            </SafeAreaView>
            <SelectBankAccountModal
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSelectAccount={handleSelectBankAccount}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    viewWrapper: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 15,
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: '#000000',
    },
    contentContainer: {
        flex: 1,
    },
    balanceCard: {
        borderWidth: 1,
        borderColor: '#E6E6E6',
        borderRadius: 12,
        padding: 24,
        marginTop: 20,
        marginBottom: 40,
    },
    balanceLabel: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 12,
    },
    balanceAmount: {
        fontSize: 32,
        fontWeight: '600',
        color: '#000000',
    },
    withdrawSection: {
        marginBottom: 30,
    },
    withdrawTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F6F6FA',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#E6E6E6',
    },
    currencySymbol: {
        fontSize: 18,
        color: '#000000',
        marginRight: 8,
    },
    amountInput: {
    
        
    },
    buttonContainer: {
        paddingBottom: 30,
    },
    withdrawButton: {
        backgroundColor: '#2a2a2a',
        borderRadius: 30,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    withdrawButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontFamily: 'Poppins-SemiBold',
    },
    disabledButton: {
        backgroundColor: '#CCCCCC',
    },
    bankAccountContainer: {
        marginBottom: 30,
    },
    bankAccountTitle: {
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 10,
    },
    bankAccountInput: {
        height: 55,
        backgroundColor: '#F6F6FA',
        borderRadius: 8,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#E6E6E6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bankAccountText: {
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Poppins-Regular',
    },
    placeholderText: {
        color: '#666666',
    },
    amountContainer: {
        marginBottom: 20,
    },
    amountTitle: {
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 10,
    },
    amountInput: {
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
    disabledInput: {
        backgroundColor: '#F0F0F0',
        color: '#999999',
    },
});