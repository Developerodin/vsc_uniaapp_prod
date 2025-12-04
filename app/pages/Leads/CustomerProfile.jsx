import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Linking,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StatusBar
} from 'react-native';
import { Base_url } from '../../config/BaseUrl';


import { useNavigation, useRoute } from '@react-navigation/native';
export default function CustomerProfile() {
    const navigation = useNavigation();
    const route = useRoute();
    const { leadId } = route.params || {};
    
    const [leadData, setLeadData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timelineData, setTimelineData] = useState([]);
    const [timelineLoading, setTimelineLoading] = useState(true);
    const [timelineError, setTimelineError] = useState(null);

    // Fetch lead details from API
    const fetchLeadDetails = async () => {
        try {
            setLoading(true);
            const accessToken = await AsyncStorage.getItem('access_token');
            
            if (accessToken && leadId) {
                const response = await axios.get(`${Base_url}leads/${leadId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                
                if (response.data) {
                    setLeadData(response.data);
                    console.log("response.data",response.data);
                }
            }
        } catch (error) {
            console.error('Error fetching lead details:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch timeline data
    const fetchTimelineData = async () => {
        try {
            setTimelineLoading(true);
            setTimelineError(null);
            const accessToken = await AsyncStorage.getItem('access_token');
            if (accessToken && leadId) {
                const response = await axios.get(`${Base_url}leads/${leadId}/timeline`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                console.log("response.data",response.data);
                setTimelineData(response.data);
            }
        } catch (error) {
            console.error('Error fetching timeline data:', error);
            setTimelineError('Failed to load timeline data');
        } finally {
            setTimelineLoading(false);
        }
    };

    useEffect(() => {
        if (leadId) {
            fetchLeadDetails();
            fetchTimelineData();
        } else {
            setLoading(false);
        }
    }, [leadId]);

    const handleBackPress = () => {
        navigation.goBack();
    };

    // Format date to display format
    const formatDate = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    // Format date and time for follow-up
    const formatFollowUpDate = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const time = date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
        });
        return `${day} ${month} ${year}    --    ${time}`;
    };

    // Map API status to display status
    const mapStatus = (status) => {
        const statusMap = {
            'new': 'Interested',
            'contacted': 'Follow-up',
            'interested': 'Interested',
            'followUp': 'Follow-up',
            'qualified': 'Interested',
            'proposal': 'Follow-up',
            'negotiation': 'Follow-up',
            'closed': 'Success',
            'lost': 'Closed'
        };
        return statusMap[status] || 'Interested';
    };

    // Map phase name to display name
    const mapPhaseName = (phaseName) => {
        if (!phaseName) return '';
        const lowerName = phaseName.toLowerCase().trim();
        const phaseMap = {
            'closed': 'Success',
            'lost': 'Closed'
        };
        // Check if the phase name matches any status that needs mapping
        if (phaseMap[lowerName]) {
            return phaseMap[lowerName];
        }
        // Also check if it contains these words (replace in the name)
        let mappedName = phaseName;
        if (lowerName.includes('closed')) {
            mappedName = mappedName.replace(/\bclosed\b/gi, 'Success');
        }
        if (lowerName.includes('lost')) {
            mappedName = mappedName.replace(/\blost\b/gi, 'Closed');
        }
        // If we made replacements, return the mapped name, otherwise capitalize first letter
        if (mappedName !== phaseName) {
            return mappedName;
        }
        return phaseName.charAt(0).toUpperCase() + phaseName.slice(1);
    };

    // Map phase description to replace status words
    const mapPhaseDescription = (description) => {
        if (!description) return '';
        let mappedDesc = description;
        // Replace "closed" with "Success" (case insensitive, whole word)
        mappedDesc = mappedDesc.replace(/\bclosed\b/gi, 'Success');
        // Replace "lost" with "Closed" (case insensitive, whole word)
        mappedDesc = mappedDesc.replace(/\blost\b/gi, 'Closed');
        return mappedDesc;
    };

    // Get status color
    const getStatusColor = (status) => {
        const displayStatus = mapStatus(status);
        switch (displayStatus) {
            case 'Interested':
                return '#0085FF';
            case 'Follow-up':
                return '#FFAE00';
            case 'Success':
                return '#00BC64';
            case 'Closed':
                return '#FF0000';
            default:
                return '#0085FF';
        }
    };

    const getContactNumber = () => {
        const contactFields = ['Mobile Number', 'Contact Number'];
        return contactFields.reduce((found, field) => {
            return found || leadData?.fieldsData?.[field];
        }, null);
    };

    const getName = () => {
        const nameFields = [
            'Full Name', 'Owner Name', 'Traveler Name', 'Applicant Name',
            'Business Name', 'Student Name', 'Project Name', 'Entity Name',
            'Client Name', 'Startup Name', 'Company Name'
        ];
        return nameFields.reduce((found, field) => {
            return found || leadData?.fieldsData?.[field];
        }, null) || 'Unknown';
    };

    const handleCall = () => {
        const phoneNumber = getContactNumber();
        if (phoneNumber) {
            Linking.openURL(`tel:+91${phoneNumber}`);
        }
    };

    const handleEmail = () => {
        const email = leadData?.fieldsData?.['Email'];
        if (email) {
            Linking.openURL(`mailto:${email}`);
        }
    };

    // Timeline phase icon
    const getPhaseIcon = (phase) => {
        if (phase.completed) return <Ionicons name="checkmark-circle" size={22} color="#00BC64" />;
        if (phase.active) return <Ionicons name="play-circle" size={22} color="#0085FF" />;
        if (phase.skipped) return <Ionicons name="play-skip-forward" size={22} color="#B0B0B0" />;
        return <Ionicons name="ellipse-outline" size={22} color="#E0E0E0" />;
    };
    // Timeline phase status badge
    const getPhaseStatus = (phase) => {
        if (phase.completed) return { bg: '#E6F9F0', color: '#00BC64', label: 'Completed' };
        if (phase.active) return { bg: '#E6F0FA', color: '#0085FF', label: 'Pending' };
        if (phase.skipped) return { bg: '#F0F0F0', color: '#B0B0B0', label: 'Skipped' };
        return { bg: '#F8F8F8', color: '#B0B0B0', label: 'Pending' };
    };
    // Timeline date formatter
    const formatTimelineDate = (dateString) => {
        if (!dateString) return '--';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <View style={styles.viewWrapper}>
                
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                                <Ionicons name="chevron-back" size={24} color="#000000" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Customer&apos;s Profile</Text>
                        </View>
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#FF7115" />
                            <Text style={styles.loadingText}>Loading customer details...</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    if (!leadData) {
        return (
            <View style={styles.viewWrapper}>
                
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                                <Ionicons name="chevron-back" size={24} color="#000000" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Customer&apos;s Profile</Text>
                        </View>
                        <View style={styles.loadingContainer}>
                            <Text style={styles.errorText}>Customer data not found</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={styles.viewWrapper}>
        
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                            <Ionicons name="chevron-back" size={24} color="#000000" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Customer&apos;s Profile</Text>
                    </View>
                    
                    {/* Main Content Area */}
                    <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                        {/* Profile Section */}
                        <View style={styles.profileSection}>
                            <Image 
                                source={require('../../../assets/icons/Profile.png')} 
                                style={styles.profileImage} 
                            />
                            <Text style={styles.profileName}>{getName()}</Text>
                        </View>

                        {/* Details Card */}
                        <View style={styles.card}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Type : </Text>
                                <Text style={styles.insuranceText}>{leadData.category?.name?.toUpperCase() || 'UNKNOWN'}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Created on : </Text>
                                <Text style={styles.detailValue}>{formatDate(leadData.createdAt)}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Mobile No. : </Text>
                                <TouchableOpacity onPress={handleCall}>
                                    <Text style={styles.linkText}>+91 {getContactNumber() || 'N/A'}</Text>
                                </TouchableOpacity>
                            </View>

                            {leadData?.fieldsData?.['Email'] && (
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Email : </Text>
                                    <TouchableOpacity onPress={handleEmail}>
                                        <Text style={styles.linkText}>{leadData.fieldsData['Email']}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        {/* Status Card */}
                        <View style={styles.card}>
                            <View style={styles.statusRow}>
                                <Text style={styles.detailLabel}>Status : </Text>
                                <View style={styles.statusContent}>
                                    <View style={styles.statusIndicator}>
                                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(leadData.status) }]} />
                                        <Text style={styles.detailValue}>{mapStatus(leadData.status)}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Timeline Card */}
                        <View style={styles.timelineCard}>
                            <Text style={styles.timelineTitle}>Timeline</Text>
                            {timelineLoading ? (
                                <ActivityIndicator size="small" color="#0085FF" style={{ marginVertical: 20 }} />
                            ) : timelineError ? (
                                <Text style={styles.timelineError}>{timelineError}</Text>
                            ) : (
                                <View style={styles.timelineContainer}>
                                    {timelineData?.phases?.length > 0 ? timelineData.phases.map((phase, idx) => {
                                        const isCompleted = phase.completed;
                                        const isActive = phase.active;
                                        // Map phase name and status if they exist
                                        const displayPhaseName = mapPhaseName(phase.name || phase.status || '');
                                        return (
                                            <View key={idx} style={styles.timelinePhaseRow}>
                                                {/* Timeline Dot and Line */}
                                                <View style={styles.timelineLineWrap}>
                                                    {idx !== 0 && <View style={styles.timelineLine} />}
                                                    <View style={[
                                                        styles.timelineIconWrap,
                                                        isCompleted ? { borderColor: '#00BC64' } : isActive ? { borderColor: '#0085FF' } : { borderColor: '#E0E0E0' }
                                                    ]}>
                                                        <Ionicons
                                                            name={isCompleted ? 'checkmark-circle' : isActive ? 'play-circle' : 'ellipse-outline'}
                                                            size={22}
                                                            color={isCompleted ? '#00BC64' : isActive ? '#0085FF' : '#E0E0E0'}
                                                        />
                                                    </View>
                                                    {idx !== timelineData.phases.length - 1 && <View style={styles.timelineLine} />}
                                                </View>
                                                {/* Phase Content */}
                                                <View style={styles.timelinePhaseContent}>
                                                    <View style={styles.timelinePhaseHeader}>
                                                        <Text style={styles.timelinePhaseTitle}>{displayPhaseName}</Text>
                                                        <View style={[
                                                            styles.timelineStatusBadge,
                                                            isCompleted ? { backgroundColor: '#E6F9F0' } : isActive ? { backgroundColor: '#E6F0FA' } : { backgroundColor: '#F8F8F8' }
                                                        ]}>
                                                            <Text style={[
                                                                styles.timelineStatusText,
                                                                isCompleted ? { color: '#00BC64' } : isActive ? { color: '#0085FF' } : { color: '#B0B0B0' }
                                                            ]}>
                                                                {isCompleted ? 'Completed' : 'Pending'}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <Text style={styles.timelinePhaseDesc}>{mapPhaseDescription(phase.description)}</Text>
                                                    <Text style={styles.timelinePhaseDate}>
                                                        {phase.estimatedActiveDate
                                                            ? new Date(phase.estimatedActiveDate).toLocaleString('en-IN', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })
                                                            : '--'}
                                                    </Text>
                                                    <Text style={styles.timelinePhaseDuration}>{phase.estimatedDuration}</Text>
                                                </View>
                                            </View>
                                        );
                                    }) : (
                                        <Text style={styles.timelineEmpty}>No timeline data found.</Text>
                                    )}
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
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
        fontFamily: 'Poppins-SemiBold',
        color: '#000000',
    },
    contentContainer: {
        flex: 1,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
        paddingLeft: 10,
    },
    profileImage: {
        width: 35,
        height: 35,
        borderRadius: 30,
        marginRight: 15,
    },
    profileName: {
        fontSize: 24,
        fontFamily: 'Poppins-SemiBold',
        color: '#000',
    },
    card: {
        borderWidth: 1,
        borderColor: '#d6d6d6',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#0085FF',
        marginRight: 8,
    },
    detailLabel: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#000',
    },
    detailValue: {
        fontSize: 16,
        color: '#000',
        marginLeft: 4,
    },
    gradientContainer: {
        marginLeft: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    insuranceText: {
        color: '#FE8900',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
    },
    linkText: {
        fontSize: 16,
        color: '#000',
        textDecorationLine: 'underline',
        marginLeft: 4,
        fontFamily: 'Poppins-Regular',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#000',
        marginTop: 10,
    },
    errorText: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#FF0000',
        marginTop: 10,
    },
    timelineCard: {
        borderWidth: 1,
        borderColor: '#d6d6d6',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        marginTop: 10,
        backgroundColor: '#fff',
    },
    timelineTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#000',
        marginBottom: 18,
    },
    timelineContainer: {
        flexDirection: 'column',
    },
    timelinePhaseRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 30,
        minHeight: 70,
    },
    timelineLineWrap: {
        alignItems: 'center',
        width: 36,
        height: '100%',
        position: 'relative',
    },
    timelineLine: {
        width: 2,
        backgroundColor: '#E0E0E0',
        flex: 1,
    },
    timelineIconWrap: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        marginVertical: 2,
    },
    timelinePhaseContent: {
        flex: 1,
        marginLeft: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    timelinePhaseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    timelinePhaseTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#222',
        marginRight: 10,
    },
    timelineStatusBadge: {
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 2,
        marginLeft: 4,
    },
    timelineStatusText: {
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
    },
    timelinePhaseDesc: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Poppins-Regular',
        marginBottom: 2,
    },
    timelinePhaseDate: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'Poppins-Regular',
        marginTop: 2,
    },
    timelineEmpty: {
        fontSize: 14,
        color: '#999',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
        marginVertical: 20,
    },
    timelineError: {
        color: '#FF3B30',
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 20,
    },
    timelinePhaseDuration: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'Poppins-Regular',
        marginTop: 2,
    },
});