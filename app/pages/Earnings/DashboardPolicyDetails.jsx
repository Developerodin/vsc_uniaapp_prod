import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
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
import Pdf from "../../../assets/icons/Pdf.png";

import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');

export default function DashboardPolicyDetails() {
    const navigation = useNavigation();
    
    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleCall = () => {
        Linking.openURL('tel:+919876543210');
    };

    const handleEmail = () => {
        Linking.openURL('mailto:vinays456@gmail.com');
    };

    const handleDownloadPDF = () => {
        console.log('Download PDF clicked');
    };

    return (
        <View style={styles.viewWrapper}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackPress}>
                        <Ionicons name="chevron-back" size={24} color="black" style={{ marginRight: 10 }} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Policy Details</Text>
                </View>

                {/* Main Content Area */}
                <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    {/* Policy Image */}
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../../../assets/images/Watch.png')}
                            style={styles.watchImage}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Policy Info Card */}
                    <View style={styles.card}>
                        <View style={styles.policyHeader}>
                            <Text style={styles.policyTitle}>Star Health – {'\n'}Young Star Plan</Text>
                            <Text style={styles.policyNumber}>POL#1870295</Text>
                        </View>

                        <Text style={styles.insuranceType}>HEALTH INSURANCE</Text>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Status :</Text>
                            <View style={styles.statusContainer}>
                                <View style={[styles.statusDot, {backgroundColor: '#00BC64'}]} />
                                <Text style={styles.detailValue}>Active</Text>
                            </View>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Date Sold :</Text>
                            <Text style={styles.detailValue}>02 May 2025</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Commission Earned :</Text>
                            <Text style={styles.detailValue}>₹1,500 -- Paid</Text>
                        </View>
                    </View>
                     <View style={styles.customerHeader}>
                            <Image 
                                source={require('../../../assets/icons/Profile.png')} 
                                style={styles.profileImage} 
                            />
                            <Text style={styles.customerName}>Mr. Vinay Singh</Text>
                        </View>

                    {/* Customer Card */}
                    <View style={styles.card}>
                       

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Mobile No. :</Text>
                            <TouchableOpacity onPress={handleCall}>
                                <Text style={styles.linkText}>+91 9876543210</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Email :</Text>
                            <TouchableOpacity onPress={handleEmail}>
                                <Text style={styles.linkText}>vinays456@gmail.com</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Location :</Text>
                            <Text style={styles.detailValue}>Jaipur, Rajasthan</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Created on :</Text>
                            <Text style={styles.detailValue}>28 Apr 2025</Text>
                        </View>
                    </View>

                    {/* Policy Details Card */}
                    <View style={styles.card}>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Type :</Text>
                            <Text style={styles.typeValue}>HEALTH INSURANCE</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Coverage Amount :</Text>
                            <Text style={styles.detailValue}>₹10,00,000</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Premium :</Text>
                            <Text style={styles.detailValue}>₹6,200/year</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Policy Term :</Text>
                            <Text style={styles.detailValue}>1 Year</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Payment Mode :</Text>
                            <Text style={styles.detailValue}>Online</Text>
                        </View>

                        <View style={styles.notesRow}>
                            <Text style={styles.detailLabel}>Notes :</Text>
                            <Text style={styles.notesValue}>
                                &quot;Customer was referred by Suresh.{'\n'}
                                Interested in top-up next year.&quot;
                            </Text>
                        </View>
                    </View>

                    {/* PDF Button */}
                    <TouchableOpacity style={styles.pdfButton} onPress={handleDownloadPDF}>
                        <Image source={Pdf} style={{width: 24, height: 24}} />
                        <Text style={styles.pdfButtonText}>Download Policy PDF</Text>
                    </TouchableOpacity>

                    {/* Bottom Space */}
                    <View style={{ height: 40 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

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
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: '#000000',
    },
    contentContainer: {
        flex: 1,
    },
    imageContainer: {
        width: '100%',
        height: 180,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
    },
    watchImage: {
        width: '100%',
        height: '100%',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    policyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    policyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        lineHeight: 26,
    },
    policyNumber: {
        fontSize: 14,
        color: '#333333',
        fontWeight: '500',
    },
    insuranceType: {
        fontSize: 14,
        fontWeight: '500',
        color: '#CD4747',
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        
        paddingVertical: 8,
    },
    notesRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        alignItems: 'flex-start',
    },
    detailLabel: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '600',
        
    },
    detailValue: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '500',
        paddingLeft: 10,
    },
    notesValue: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '500',
        flex: 1,
        lineHeight: 22,
        paddingLeft: 10,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    linkText: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '500',
        textDecorationLine: 'underline',
        paddingLeft: 10,
    },
    typeValue: {
        fontSize: 14,
        color: '#CD4747',
        fontWeight: '500',
        paddingLeft: 10,
    },
    customerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingLeft: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    customerName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
    },
    pdfButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F6F6FA',
        borderRadius: 12,
        paddingVertical: 18,
        marginBottom: 20,
        gap: 12,
    },
    pdfButtonText: {
        fontSize: 16,
        color: '#000000',
        fontWeight: '500',
    },
});