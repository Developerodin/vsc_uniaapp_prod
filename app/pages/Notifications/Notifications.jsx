import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
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

import { useNavigation, useFocusEffect } from '@react-navigation/native';
export default function Notifications() {
    const navigation = useNavigation();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleBackPress = () => {
        navigation.goBack();
    };

    const fetchLeadDetails = async (leadId) => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            const response = await axios.get(`${Base_url}/leads/${leadId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Lead Response:", response.data);

            // Check if response.data exists and has the expected structure
            if (!response.data) {
                console.error('No data received from lead API');
                return {
                    name: 'Unknown',
                    category: 'Unknown Category'
                };
            }

            // Extract name from fieldsData
            const fieldsData = response.data.fieldsData || {};
            const nameFields = [
                'Full Name', 'Owner Name', 'Traveler Name', 'Applicant Name',
                'Business Name', 'Student Name', 'Project Name', 'Entity Name',
                'Client Name', 'Startup Name', 'Company Name'
            ];
            
            let name = 'Unknown';
            for (const field of nameFields) {
                if (fieldsData[field]) {
                    name = fieldsData[field];
                    break;
                }
            }

            // Extract category
            const category = response.data.category?.name || 'Unknown Category';

            console.log("Processed Lead Details:", { name, category });

            return {
                name,
                category
            };
        } catch (error) {
            console.error('Error fetching lead details:', error);
            return {
                name: 'Unknown',
                category: 'Unknown Category'
            };
        }
    };

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('access_token');
            const response = await axios.get(`${Base_url}/notifications`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("response.data.results", response.data.results);

            // Process notifications and fetch lead details for all lead-related types
            const processedNotifications = await Promise.all(
                response.data.results.map(async (notification) => {
                    let leadDetails = null;
                    
                    // Handle all lead-related notification types
                    if ((notification.type === 'lead_created' || 
                         notification.type === 'lead_assigned' || 
                         notification.type === 'lead_status_change') && 
                        notification.data?.leadId) {
                        console.log("Fetching details for leadId:", notification.data.leadId);
                        leadDetails = await fetchLeadDetails(notification.data.leadId);
                        console.log("Received lead details:", leadDetails);
                    }

                    return {
                        id: notification.id,
                        type: notification.type,
                        title: notification.title,
                        message: notification.message.replace(/\$/g, '₹'), // Replace $ with ₹
                        status: notification.status,
                        createdAt: notification.createdAt,
                        leadDetails: leadDetails
                    };
                })
            );

            // Sort notifications by latest first
            const sortedNotifications = processedNotifications.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );

            console.log("Processed Notifications:", sortedNotifications);
            setNotifications(sortedNotifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Use useFocusEffect to refetch notifications when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [fetchNotifications])
    );

    // Render notification icon based on type
    const renderNotificationIcon = (type) => {
        switch (type) {
            case 'lead_created':
                return (
                    <View style={[styles.iconContainer, styles.newLeadIcon]}>
                        <Ionicons name="search-outline" size={24} color="#0095FF" />
                    </View>
                );
            case 'lead_status_change':
                return (
                    <View style={[styles.iconContainer, styles.statusChangeIcon]}>
                        <Ionicons name="refresh-outline" size={24} color="#FF9000" />
                    </View>
                );
            case 'commission_earned':
                return (
                    <View style={[styles.iconContainer, styles.commissionIcon]}>
                        <Ionicons name="cash-outline" size={24} color="#4CAF50" />
                    </View>
                );
            case 'withdrawal_request_created':
                return (
                    <View style={[styles.iconContainer, styles.withdrawalIcon]}>
                        <Ionicons name="wallet-outline" size={24} color="#9C27B0" />
                    </View>
                );
            case 'withdrawal_request_approved':
                return (
                    <View style={[styles.iconContainer, styles.approvedIcon]}>
                        <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
                    </View>
                );
            case 'follow_up':
                return (
                    <View style={[styles.iconContainer, styles.followUpIcon]}>
                        <Ionicons name="notifications-outline" size={24} color="#FF9000" />
                    </View>
                );
            default:
                return (
                    <View style={[styles.iconContainer, styles.defaultIcon]}>
                        <Ionicons name="notifications-outline" size={24} color="#FF9000" />
                    </View>
                );
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <SafeAreaView style={{flex:1}}>
          <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['#fe8900', '#970251']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.9 }}
                style={styles.headerGradient}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={20} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    <View style={styles.headerButtons}>
                        <TouchableOpacity style={styles.refreshButton} onPress={fetchNotifications}>
                            <Ionicons name="refresh-outline" size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('ProfileNotifications')}>
                            <Ionicons name="settings-outline" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
            
            
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0095FF" />
                </View>
            ) : (
                <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    <View style={{flex:1 , paddingBottom:100}}>
                    {notifications.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No notifications yet</Text>
                        </View>
                    ) : (
                        notifications.map((notification) => (
                            <TouchableOpacity key={notification.id} style={styles.notificationItem}>
    
                                {renderNotificationIcon(notification.type)}
                                
                                
                                <View style={styles.notificationContent}>
                                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                                    <Text style={styles.notificationDescription}>
                                        {notification.message}
                                        {notification.leadDetails && (
                                            `\nLead: ${notification.leadDetails.name} (${notification.leadDetails.category})`
                                        )}
                                    </Text>
                                    <Text style={styles.notificationTime}>
                                        {formatDate(notification.createdAt)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                    </View>
                </ScrollView>
            )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    headerGradient: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#ffffff',
        flex: 1,
    },
    backButton: {
        padding: 5,
        marginBottom: 2,
        alignItems: 'center',
        marginRight: 10,
    },
    settingsButton: {
        padding: 5,
        width: 40,
        alignItems: 'center',
    },
    refreshButton: {
        padding: 5,
        width: 40,
        alignItems: 'center',
        marginRight: 10,
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
        fontFamily: 'Poppins-Regular',
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    iconContainer: {
        width: 58,
        height: 58,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#E6E6E6',
    },
    followUpIcon: {
        backgroundColor: 'transparent',
    },
    newLeadIcon: {
        backgroundColor: 'transparent',
    },
    statusChangeIcon: {
        backgroundColor: 'transparent',
    },
    commissionIcon: {
        backgroundColor: 'transparent',
    },
    withdrawalIcon: {
        backgroundColor: 'transparent',
    },
    approvedIcon: {
        backgroundColor: 'transparent',
    },
    defaultIcon: {
        backgroundColor: 'transparent',
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#000',
        
    },
    notificationDescription: {
        fontSize: 12,
        color: '#5E5E5E',
        lineHeight: 20,
        width: '90%',
        fontFamily: 'Poppins-Regular',
    },
    notificationTime: {
        fontSize: 11,
        color: '#888',
        marginTop: 5,
        fontFamily: 'Poppins-Regular',
    },
});