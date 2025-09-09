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
    View
} from 'react-native';


export default function HelpCenter() {
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
                            <Text style={styles.headerTitle}>FAQ & Help Center</Text>
                        </View>
                        
                        <ScrollView 
                            style={styles.contentContainer}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                        >
                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>1. Getting Started</Text>
                                <Text style={styles.termsText}>
                                    • How to create and manage your insurance account{'\n'}
                                    • Setting up your profile and personal information{'\n'}
                                    • Adding and managing multiple policies{'\n'}
                                    • Understanding your dashboard{'\n'}
                                    • Setting up payment methods{'\n'}
                                    • Enabling notifications for important updates
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>2. Policy Management</Text>
                                <Text style={styles.termsText}>
                                    • Viewing your active policies{'\n'}
                                    • Understanding policy details and coverage{'\n'}
                                    • Downloading policy documents{'\n'}
                                    • Making policy changes and updates{'\n'}
                                    • Adding new coverage options{'\n'}
                                    • Managing policy renewals
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>3. Claims Process</Text>
                                <Text style={styles.termsText}>
                                    • How to file a new claim{'\n'}
                                    • Required documentation for claims{'\n'}
                                    • Tracking claim status{'\n'}
                                    • Uploading claim documents{'\n'}
                                    • Understanding claim settlements{'\n'}
                                    • Contacting claims support
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>4. Payments & Billing</Text>
                                <Text style={styles.termsText}>
                                    • Setting up automatic payments{'\n'}
                                    • Understanding premium calculations{'\n'}
                                    • Payment history and receipts{'\n'}
                                    • Managing payment methods{'\n'}
                                    • Handling late payments{'\n'}
                                    • Setting up payment reminders
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>5. Security & Privacy</Text>
                                <Text style={styles.termsText}>
                                    • Protecting your account information{'\n'}
                                    • Two-factor authentication{'\n'}
                                    • Managing app permissions{'\n'}
                                    • Data privacy and protection{'\n'}
                                    • Secure document storage{'\n'}
                                    • Account recovery process
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>6. Emergency Services</Text>
                                <Text style={styles.termsText}>
                                    • 24/7 emergency support{'\n'}
                                    • Roadside assistance{'\n'}
                                    • Emergency contact numbers{'\n'}
                                    • Quick claim filing{'\n'}
                                    • Location-based services{'\n'}
                                    • Emergency document access
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>7. Policy Documents</Text>
                                <Text style={styles.termsText}>
                                    • Accessing policy documents{'\n'}
                                    • Understanding policy terms{'\n'}
                                    • Downloading and sharing documents{'\n'}
                                    • Document storage and backup{'\n'}
                                    • Digital signature process{'\n'}
                                    • Document verification
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>8. Account Settings</Text>
                                <Text style={styles.termsText}>
                                    • Updating personal information{'\n'}
                                    • Managing notification preferences{'\n'}
                                    • Changing password and security settings{'\n'}
                                    • Managing linked devices{'\n'}
                                    • Account deletion process{'\n'}
                                    • Data export options
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>9. Contact Support</Text>
                                <Text style={styles.termsText}>
                                    For immediate assistance:{'\n'}
                                    • In-App Chat Support: Available 24/7{'\n'}
                                    • Email: support@insuranceapp.com{'\n'}
                                    • Phone: +1 (800) 123-4567{'\n'}
                                    • Emergency Hotline: +1 (800) 999-9999{'\n'}
                                    • Office Hours: Mon-Fri, 9 AM - 6 PM EST
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
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 0 : 15,
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