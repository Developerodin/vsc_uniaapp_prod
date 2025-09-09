import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StatusBar
} from 'react-native';
import LeadCard from '../../components/LeadCard/LeadCard';
import { Base_url } from '../../config/BaseUrl';

import { useNavigation } from '@react-navigation/native';
export default function LeadConverted() {
    const navigation = useNavigation();
    const [leadsData, setLeadsData] = useState([]);
    const [loading, setLoading] = useState(true);
    // Fetch converted leads data from API
    const fetchConvertedLeads = useCallback(async () => {
        try {
            setLoading(true);
            const userDetailsStr = await AsyncStorage.getItem('user details');
            const accessToken = await AsyncStorage.getItem('access_token');
            
            if (userDetailsStr && accessToken) {
                const userDetails = JSON.parse(userDetailsStr);
                
                const response = await axios.get(`${Base_url}leads/user/${userDetails.id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                
                if (response.data && response.data.results) {
                    // Filter only converted leads and transform API response
                    const convertedLeads = response.data.results
                        .filter(lead => lead.status === 'closed') // Filter for converted leads
                        .map((lead) => {
                            // Check for various possible name fields
                            const nameFields = [
                                'Full Name', 'Owner Name', 'Traveler Name', 'Applicant Name',
                                'Business Name', 'Student Name', 'Project Name', 'Entity Name',
                                'Client Name', 'Startup Name', 'Company Name'
                            ];
                            
                            const name = nameFields.reduce((found, field) => {
                                return found || lead.fieldsData?.[field];
                            }, null) || 'Unknown';

                            return {
                                id: lead.id || lead._id,
                                name: name,
                                category: lead.category?.name || 'Unknown Category',
                                status: 'Converted', // Always show as Converted
                                followUpDate: formatDate(lead.updatedAt),
                                createdDate: formatDate(lead.createdAt),
                                originalStatus: lead.status 
                            };
                        });
                    
                    setLeadsData(convertedLeads);
                }
            }
        } catch (error) {
            console.error('Error fetching converted leads:', error);
            setLeadsData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Format date to display format
    const formatDate = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    // Fetch converted leads once on mount
    useEffect(() => {
        fetchConvertedLeads();
    }, [fetchConvertedLeads]);

    const handleBack = () => {
        navigation.goBack();
    };

    if (loading) {
        return (
            <View style={styles.viewWrapper}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.container}>
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#FF7115" />
                            <Text style={styles.loadingText}>Loading converted leads...</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.viewWrapper}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <LinearGradient
                    colors={['#fe8900', '#970251']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0.9 }}
                    style={styles.gradientHeader}
                >
                    <Image
                        source={require('../../../assets/images/CenterBg2.png')}
                        style={styles.headerBgImage}
                    />
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitleRevamp}>Converted Leads</Text>
                        <View style={styles.placeholder} />
                    </View>
                </LinearGradient>

                {/* Main Content Area */}
                <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    <View style={{ marginBottom: 100 }}>
                        {leadsData.length > 0 ? (
                            <View style={styles.cardsContainer}>
                                {leadsData.map((lead) => (
                                    <LeadCard key={lead.id} lead={lead} navigation={navigation} />
                                ))}
                            </View>
                        ) : (
                            <View style={styles.emptyStateContainer}>
                                <Image
                                    source={require('../../../assets/images/EmptyLead.png')}
                                    style={styles.emptyStateImage}
                                    resizeMode="contain"
                                />
                                <Text style={styles.emptyStateTitle}>
                                    No converted leads yet. Your converted leads will appear here once you start closing deals.
                                </Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
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
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    gradientHeader: {
        paddingBottom: 30,
        paddingTop: Platform.OS === 'ios' ? 40 : 40,
        paddingHorizontal: 0,
        overflow: 'hidden',
        position: 'relative',
        minHeight: 200,
    },
    headerBgImage: {
        position: 'absolute',
        top: 80,
        left: 0,
        right: 20,
        width: '100%',
        height: 132,
        zIndex: 0,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        zIndex: 2,
    },
    backButton: {
        padding: 5,
    },
    headerTitleRevamp: {
        fontSize: 24,
        fontFamily: 'Poppins-SemiBold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    placeholder: {
        width: 34, // Same width as back button to center the title
    },
    contentContainer: {
        flex: 1,
        marginTop: -30,
    },
    cardsContainer: {
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
    emptyStateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingVertical: 60,
    },
    emptyStateImage: {
        width: 157,
        height: 178,
        marginBottom: 30,
    },
    emptyStateTitle: {
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        color: '#000',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        marginTop: 10,
    },
});