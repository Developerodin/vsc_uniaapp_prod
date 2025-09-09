import { Ionicons } from '@expo/vector-icons';

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StatusBar
} from 'react-native';


export default function TermsCondition() {
    const navigation = useNavigation();
    
    const handleBackPress = () => {
        navigation.goBack();
    };

   

    

    return (
        <View style={styles.viewWrapper}>
           
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
                >
                    <View style={styles.container}>

                        <View style={styles.header}>
                            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                                <Ionicons name="chevron-back" size={24} color="#000000" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Terms & Condition</Text>
                        </View>
                        
                        <ScrollView 
                            style={styles.contentContainer}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                        >
                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>1. Acceptance of Terms</Text>
                                <Text style={styles.termsText}>
                                    By accessing and using this application, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the application.
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>2. Insurance Services</Text>
                                <Text style={styles.termsText}>
                                    Our insurance services are subject to the terms of your specific insurance policy. The information provided in this application is for general guidance only and does not constitute professional advice. All insurance claims are subject to verification and approval by our insurance partners.
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>3. User Responsibilities</Text>
                                <Text style={styles.termsText}>
                                    You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You must provide accurate and complete information when using our services.
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>4. Privacy and Data Protection</Text>
                                <Text style={styles.termsText}>
                                    We collect and process your personal information in accordance with our Privacy Policy. By using our services, you consent to such processing and warrant that all data provided by you is accurate.
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>5. Service Availability</Text>
                                <Text style={styles.termsText}>
                                    While we strive to ensure the application is available 24/7, we do not guarantee uninterrupted access. We reserve the right to suspend or terminate the service for maintenance or other reasons.
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>6. Limitation of Liability</Text>
                                <Text style={styles.termsText}>
                                    We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the application.
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>7. Changes to Terms</Text>
                                <Text style={styles.termsText}>
                                    We reserve the right to modify these terms at any time. Continued use of the application after such modifications constitutes your acceptance of the updated terms.
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>8. Contact Information</Text>
                                <Text style={styles.termsText}>
                                    For any questions regarding these terms and conditions, please contact our customer support team through the application or via email at support@example.com.
                                </Text>
                            </View>
                        </ScrollView>
                        
                     
                    </View>
                </KeyboardAvoidingView>
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
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
        fontWeight: "600",
        color: '#000000',
        fontFamily: 'Poppins-SemiBold',
    },
    contentContainer: {
        flex: 1,
        paddingTop: 20,
    },
    inputGroup: {
        marginBottom: 25,
    },
    inputLabel: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 10,
        fontFamily: 'Poppins-Regular',
    },
    passwordContainer: {
        flexDirection: 'row',
        height: 55,
        backgroundColor: '#F6F6FA',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E6E6E6',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Poppins-Regular',
    },
    visibilityToggle: {
        paddingHorizontal: 15,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
    },
    updateButton: {
        backgroundColor: '#2a2a2a',
        borderRadius: 30,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    updateButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontFamily: 'Poppins-SemiBold',
    },
    disabledButton: {
        opacity: 0.6,
    },
    termsSection: {
        marginBottom: 25,
    },
    termsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 10,
        fontFamily: 'Poppins-SemiBold',
    },
    termsText: {
        fontSize: 14,
        color: '#666666',
        lineHeight: 22,
        fontFamily: 'Poppins-Regular',
    },
});