import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform,
    StatusBar
} from 'react-native';
import { Base_url } from '../../config/BaseUrl';

import { useNavigation } from '@react-navigation/native';
export default function TransactionHistory() {
    const navigation = useNavigation();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalEarnings, setTotalEarnings] = useState(0);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            const response = await axios.get(`${Base_url}/wallet/transactions`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("response.data.data.results", response.data.data.results);
            if (response.data.status === 'success') {
                setTransactions(response.data.data.results);
                const total = response.data.data.results.reduce((sum, transaction) => sum + transaction.amount, 0);
                setTotalEarnings(total);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleWithdraw = () => {
        navigation.navigate('WithdrawMoney');
    };

    // Function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Function to format time
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <View style={styles.viewWrapper}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#000000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Transaction History</Text>
                </View>
                
                {/* Main Content Area */}
                <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    {/* Total Earnings Card */}
                    {/* <View style={styles.earningsCard}>
                        <Text style={styles.earningsLabel}>Total Earnings :</Text>
                        <Text style={styles.earningsAmount}>₹ {totalEarnings}</Text>
                    </View> */}
                    
                    {/* Transactions List */}
                    <View style={styles.transactionsContainer}>
                        {loading ? (
                            <ActivityIndicator size="large" color="#00BC64" style={styles.loader} />
                        ) : transactions.length === 0 ? (
                            <View style={styles.noTransactionsContainer}>
                                <Ionicons name="wallet-outline" size={64} color="#000000" />
                                <Text style={styles.noTransactionsTitle}>No Transactions Yet</Text>
                                <Text style={styles.noTransactionsMessage}>
                                    You haven&apos;t made any transactions yet. Your transaction history will appear here once you start earning.
                                </Text>
                            </View>
                        ) : (
                            transactions.map((transaction) => (
                                <View key={transaction.id} style={styles.transactionItem}>
                                    <View style={styles.avatarContainer}>
                                        <Text style={styles.avatarText}>
                                            {transaction.type.charAt(0).toUpperCase()}
                                        </Text>
                                    </View>
                                    
                                    <View style={styles.transactionDetails}>
                                        <Text style={styles.transactionTitle}>
                                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                        </Text>
                                        <Text style={styles.transactionDate}>
                                            {formatDate(transaction.createdAt)}  {formatTime(transaction.createdAt)}
                                        </Text>
                                    </View>
                                    
                                    <Text style={[
                                        styles.transactionAmount,
                                        transaction.amount < 0 ? styles.negativeAmount : styles.positiveAmount
                                    ]}>
                                        {transaction.amount < 0 ? '- ' : '+ '}
                                        ₹{Math.abs(transaction.amount)}
                                    </Text>
                                </View>
                            ))
                        )}
                    </View>
                </ScrollView>
                
                {/* Withdraw Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
                        <Text style={styles.withdrawButtonText}>Withdraw Money</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
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
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
    earningsCard: {
        backgroundColor: '#00BC64',
        borderRadius: 12,
        paddingHorizontal: 30,
        paddingVertical: 32,
        marginVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    earningsLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    earningsAmount: {
        fontSize: 24,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    transactionsContainer: {
        marginTop: 5,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 0,
    },
    avatarContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#c5dceb',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '500',
        color: '#fff',
    },
    transactionDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        lineHeight: 22,
    },
    transactionDate: {
        fontSize: 14,
        color: '#8b8b8b',
        marginTop: 4,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '400',
    },
    positiveAmount: {
        color: '#008B3E',
    },
    negativeAmount: {
        color: '#FF0000',
    },
    buttonContainer: {
        padding: 15,
        paddingBottom: 25,
    },
    withdrawButton: {
        backgroundColor: '#2A2A2A',
        borderRadius: 50,
        paddingVertical: 16,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    withdrawButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    loader: {
        marginTop: 20,
    },
    noTransactionsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    noTransactionsTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333333',
        marginTop: 16,
        marginBottom: 12,
        textAlign: 'center',
    },
    noTransactionsMessage: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    }
});