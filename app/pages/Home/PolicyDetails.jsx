import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
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
import { Base_url } from '../../config/BaseUrl';

const { width } = Dimensions.get('window');

export default function PolicyDetails({ navigation, route }) {
    const params = route?.params || {};
    const { subcategory, category } = params || {};
    
    const [loading, setLoading] = useState(true);
    const [subcategoryDetails, setSubcategoryDetails] = useState(null);
    const [commissionData, setCommissionData] = useState(null);
    
    useEffect(() => {
        fetchSubcategoryDetails();
    }, []);
    
    const fetchSubcategoryDetails = async () => {
        if (!subcategory || !subcategory.id) {
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('access_token');
            
            if (!token) {
                console.error('No access token found');
                setLoading(false);
                return;
            }
            
            // Fetch subcategory details
            const response = await axios.get(`${Base_url}subcategories/${subcategory.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("response",response.data)
            if (response.data) {
                setSubcategoryDetails(response.data);
                
                // Extract commission data from the response
                if (response.data.commission) {
                    setCommissionData(response.data.commission);
                }
            }
        } catch (error) {
            console.error('Error fetching subcategory details:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleSharePDF = () => {
        // Add logic to share PDF
        console.log('Share PDF clicked');
    };

    return (
        <View style={styles.viewWrapper}>
            
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleBackPress}>
                            <Ionicons name="chevron-back" size={24} color="black" style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Product Details</Text>
                    </View>

                    {/* Main Content Area */}
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#FF7115" />
                            <Text style={styles.loadingText}>Loading details...</Text>
                        </View>
                    ) : (
                        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                            <View style={{paddingHorizontal:10,marginBottom:80}}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={require('../../../assets/images/Watch.png')} // Static image
                                    style={styles.watchImage}
                                    resizeMode="cover"
                                />
                            </View>

                            {/* First Card: Policy Info */}
                            <View style={styles.card}>
                                <View style={styles.policyHeader}>
                                    <Text style={styles.policyTitle}>
                                        {subcategoryDetails?.name || subcategory?.title || "Policy Name"}
                                    </Text>
                                    {/* <Text style={styles.policyNumber}>POL#1870295</Text> */}
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Status :</Text>
                                    <View style={styles.statusContainer}>
                                        <View style={[styles.statusDot, {
                                            backgroundColor: (subcategoryDetails?.status === 'active' || subcategory?.status === 'active') 
                                                ? '#00BC64' 
                                                : '#FF6347'
                                        }]} />
                                        <Text style={styles.detailValue}>
                                            {(subcategoryDetails?.status || subcategory?.status || "Active").charAt(0).toUpperCase() + 
                                            (subcategoryDetails?.status || subcategory?.status || "Active").slice(1)}
                                        </Text>
                                    </View>
                                </View>

                                {subcategoryDetails?.description && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Description :</Text>
                                        <Text style={[styles.detailValue, { flex: 1 }]}>
                                            {subcategoryDetails.description}
                                        </Text>
                                    </View>
                                )}

                                {/* Commission details hidden */}
                            </View>

                            {/* Second Card: Policy Details */}
                            <View style={styles.card}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Type :</Text>
                                    <Text style={styles.typeValue}>
                                        {category?.toUpperCase() || "INSURANCE"}
                                    </Text>
                                </View>

                                {subcategoryDetails?.duration && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Duration :</Text>
                                        <Text style={styles.detailValue}>{subcategoryDetails.duration} years</Text>
                                    </View>
                                )}

                                {subcategoryDetails?.interestRate && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Interest Rate :</Text>
                                        <Text style={styles.detailValue}>{subcategoryDetails.interestRate}%</Text>
                                    </View>
                                )}

                                {subcategoryDetails?.loanAmount && (
                                    <>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Min Loan Amount :</Text>
                                            <Text style={styles.detailValue}>₹{subcategoryDetails.loanAmount.min}</Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Max Loan Amount :</Text>
                                            <Text style={styles.detailValue}>₹{subcategoryDetails.loanAmount.max}</Text>
                                        </View>
                                    </>
                                )}

                                {subcategoryDetails?.tenure && (
                                    <>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Min Tenure :</Text>
                                            <Text style={styles.detailValue}>{subcategoryDetails.tenure.min} months</Text>
                                        </View>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Max Tenure :</Text>
                                            <Text style={styles.detailValue}>{subcategoryDetails.tenure.max} months</Text>
                                        </View>
                                    </>
                                )}

                                {subcategoryDetails?.pricing?.basePrice && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Base Price :</Text>
                                        <Text style={styles.detailValue}>₹{subcategoryDetails.pricing.basePrice}</Text>
                                    </View>
                                )}

                                {subcategoryDetails?.pricing?.currency && (
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Currency :</Text>
                                        <Text style={styles.detailValue}>{subcategoryDetails.pricing.currency}</Text>
                                    </View>
                                )}
                            </View>

                            {/* Share PDF Button */}
                            {/* <TouchableOpacity style={styles.pdfButton} onPress={handleSharePDF}>
                                <View style={styles.pdfIconContainer}>
                                   <Image source={Pdf} style={{width:23, height:23}}/>
                                </View>
                                <Text style={styles.pdfButtonText}>Share Policy PDF</Text>
                            </TouchableOpacity> */}

                            {/* Add some bottom padding for scrolling */}
                            <View style={{ height: 30 }} />
                            </View>
                        </ScrollView>
                    )}
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
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Poppins-SemiBold',
        color: '#000000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    contentContainer: {
        flex: 1,
    },
    imageContainer: {
        width: 338,
        height: 174,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 20,
    },
    watchImage: {
        width: 338,
        height: 174,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#D6D6D6',
    },
    policyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    policyTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#000000',
        flex: 1,
    },
    policyNumber: {
        fontSize: 14,
        color: '#333333',
        fontFamily: 'Poppins-SemiBold',
    },
    detailRow: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        paddingVertical: 10,
    },
    detailLabel: {
        fontSize: 14,
        color: '#000000',
        fontFamily: 'Poppins-SemiBold',
    },
    detailValue: {
        fontSize: 14,
        color: '#000000',
        fontFamily: 'Poppins-SemiBold',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#00BC64',
        marginRight: 8,
    },
    linkText: {
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Poppins-SemiBold',
        textDecorationLine: 'underline',
    },
    typeValue: {
        fontSize: 16,
        color: '#FF6347',
        fontFamily: 'Poppins-SemiBold',
    },
    pdfButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F6F6FA',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginVertical: 10,
        height: 80,
    },
    pdfButtonText: {
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Poppins-SemiBold',
    },
    pdfIconContainer: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        backgroundColor: 'transparent', // or any color you want
    },
});