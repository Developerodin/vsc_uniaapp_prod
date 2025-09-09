import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Platform,
    Image as RNImage,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Base_url } from '../../config/BaseUrl';

import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

export default function Kyc() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    // Fetch user KYC data
    const fetchKYCData = async () => {
        try {
            setLoading(true);
            const userDetailsStr = await AsyncStorage.getItem('user details');
            const accessToken = await AsyncStorage.getItem('access_token');
            
            if (userDetailsStr && accessToken) {
                const userDetails = JSON.parse(userDetailsStr);
                
                // Fetch latest user profile data from the API
                const response = await axios.get(`${Base_url}users/${userDetails.id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                
                if (response.data) {
                    setUserData(response.data);
                }
            } else {
                // Fallback to stored user data
                if (userDetailsStr) {
                    setUserData(JSON.parse(userDetailsStr));
                }
            }
        } catch (error) {
            console.error('Error fetching KYC data:', error);
            // Fallback to AsyncStorage data
            try {
                const storedUserData = await AsyncStorage.getItem('user details');
                if (storedUserData) {
                    setUserData(JSON.parse(storedUserData));
                }
            } catch (storageError) {
                console.error('Error loading stored user data:', storageError);
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch KYC data once on mount
    useEffect(() => {
        fetchKYCData();
    }, []);

    const handleBackPress = () => {
        navigation.goBack();
    };

    if (loading) {
        return (
            <View style={styles.viewWrapper}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0085FF" />
                        <Text style={styles.loadingText}>Loading KYC details...</Text>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    const isVerified = userData?.panNumber || userData?.kycDetails?.panNumber;

    if (isVerified) {
        // KYC Verified UI (like screenshot)
        return (
            <LinearGradient
                colors={['#fe8900', '#970251']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.9 }}
                style={styles.gradientContainer}
            >
                <SafeAreaView style={styles.safeArea}>
                    {/* Header */}
                    <View style={styles.kycHeaderRow}>
                        <TouchableOpacity onPress={handleBackPress} style={styles.kycBackButton}>
                            <Ionicons name="chevron-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.kycHeaderTitle}>KYC</Text>
                    </View>
                    <View style={styles.kycVerifiedContent}>
                    <View >
                                    <LottieView source={require('../../../assets/animation/Animation - 1750067074519.json')} autoPlay loop style={{width: 200, height: 200}} />
                                </View>
                        <Text style={styles.kycVerifiedText}>KYC Verified Successfully!</Text>
                        <View style={styles.kycInfoCard}>
                            <Text style={styles.kycInfoText}>NAME : {userData?.name}</Text>
                        </View>
                        <View style={styles.kycInfoCard}>
                            <Text style={styles.kycInfoText}>PAN : {userData?.panNumber || userData?.kycDetails?.panNumber}</Text>
                        </View>
                    </View>
                    {/* Bottom background image */}
                    <RNImage
                        source={require('../../../assets/images/BottomBg.png')}
                        style={styles.bottomBgImage}
                        resizeMode="contain"
                    />
                </SafeAreaView>
            </LinearGradient>
        );
    }

    // Not verified: show default header and layout
    return (
        <View style={styles.viewWrapper}>
            <SafeAreaView style={styles.safeArea}>
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
                        <Text style={styles.headerTitleWhite}>Verify KYC</Text>
                    </View>
                </LinearGradient>
                <ScrollView 
                    style={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.container}>
                        <View style={styles.emptyStateContainer}>
                            <Image 
                                source={require('../../../assets/images/EmptyLead.png')}
                                style={styles.emptyStateImage}
                                contentFit="contain"
                            />
                            <Text style={styles.emptyStateText}>No KYC documents found</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.updateButton}
                            onPress={() => navigation.navigate('UpdatePanCard')}
                        >
                            <Text style={styles.updateButtonText}>Update KYC Documents</Text>
                        </TouchableOpacity>
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
        backgroundColor: 'transparent',
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
    scrollContent: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        marginTop: 60,
    },
    emptyStateImage: {
        width: 157,
        height: 178,
        marginBottom: 20,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Poppins-Medium',
        textAlign: 'center',
    },
    updateButton: {
        backgroundColor: '#2a2a2a',
        borderRadius: 30,
        height: 55,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    updateButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        fontFamily: 'Poppins-SemiBold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        fontFamily: 'Poppins-SemiBold',
    },
    gradientContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    kycHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
        marginLeft: 10,
        
    },
    kycBackButton: {
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 2
    },
    kycHeaderTitle: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Poppins-Regular',
        letterSpacing: 1,
    },
    kycVerifiedContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    kycCheckmarkContainer: {
        marginBottom: 30,
    },
    kycVerifiedText: {
        color: '#fff',
        fontSize: 22,
        
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 40,
        textAlign: 'center',
    },
    kycInfoCard: {
        backgroundColor: 'rgba(60, 16, 16, 0.5)',
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 18,
        width: width - 40,
        alignItems: 'center',
        zIndex: 10,
    },
    kycInfoText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Poppins-Regular',
        letterSpacing: 1,
    },
    bottomBgImage: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        width: width * 1,
        height: 619,
        zIndex: 1,
    },
});