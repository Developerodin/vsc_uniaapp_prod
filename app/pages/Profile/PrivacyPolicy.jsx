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


export default function PrivacyPolicy() {
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
                            <Text style={styles.headerTitle}>Privacy Policy</Text>
                        </View>
                        
                        <ScrollView 
                            style={styles.contentContainer}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                        >
                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>1. Mobile App Permissions</Text>
                                <Text style={styles.termsText}>
                                    Our app may request the following permissions:
                                    • Camera access for document scanning
                                    • Location services for nearby service providers
                                    • Push notifications for policy updates
                                    • Storage access for offline documents
                                    • Device information for app functionality
                                    You can manage these permissions in your device settings.
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>2. Information Collection</Text>
                                <Text style={styles.termsText}>
                                    We collect:
                                    • Account information (name, email, phone)
                                    • Insurance policy details
                                    • Device information (model, OS version)
                                    • Usage statistics and crash reports
                                    • Location data (when permitted)
                                    • Photos and documents you upload
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>3. Mobile-Specific Features</Text>
                                <Text style={styles.termsText}>
                                    Our app uses:
                                    • Push notifications for important updates
                                    • Background location for emergency services
                                    • Offline storage for policy documents
                                    • Biometric authentication (optional)
                                    • Camera for document scanning
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>4. Data Storage and Security</Text>
                                <Text style={styles.termsText}>
                                    • Data is encrypted during transmission
                                    • Secure local storage on your device
                                    • Regular security updates
                                    • Automatic logout after inactivity
                                    • Secure biometric authentication
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>5. Third-Party Services</Text>
                                <Text style={styles.termsText}>
                                    Our app integrates with:
                                    • Payment processors
                                    • Analytics services
                                    • Cloud storage providers
                                    • Emergency service providers
                                    • Insurance partners
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>6. Offline Functionality</Text>
                                <Text style={styles.termsText}>
                                    • Policy documents are stored locally
                                    • Limited functionality when offline
                                    • Automatic sync when online
                                    • Data usage optimization
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>7. App Updates</Text>
                                <Text style={styles.termsText}>
                                    • Automatic updates for security
                                    • Optional feature updates
                                    • Version compatibility information
                                    • Update notifications
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>8. Your Rights</Text>
                                <Text style={styles.termsText}>
                                    You can:
                                    • Manage app permissions
                                    • Delete stored data
                                    • Opt-out of notifications
                                    • Export your information
                                    • Request data deletion
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>9. Contact Support</Text>
                                <Text style={styles.termsText}>
                                    For privacy concerns:
                                    Email: privacy@example.com
                                    In-App Support: Settings → Help & Support
                                    Phone: +1 (555) 123-4567
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