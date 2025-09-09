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


export default function ContactSupport() {
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
                            <Text style={styles.headerTitle}>Contact Support</Text>
                        </View>
                        
                        <ScrollView 
                            style={styles.contentContainer}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                        >
                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>24/7 Emergency Support</Text>
                                <Text style={styles.termsText}>
                                    For immediate assistance with claims or emergencies:{'\n\n'}
                                    • Emergency Hotline: +1 (800) 999-9999{'\n'}
                                    • Available 24 hours, 7 days a week{'\n'}
                                    • Roadside assistance{'\n'}
                                    • Emergency claims filing{'\n'}
                                    • Medical emergency support
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>Customer Service</Text>
                                <Text style={styles.termsText}>
                                    For general inquiries and policy support:{'\n\n'}
                                    • Main Support: +1 (800) 123-4567{'\n'}
                                    • Email: support@insuranceapp.com{'\n'}
                                    • Hours: Mon-Fri, 8 AM - 8 PM EST{'\n'}
                                    • Saturday: 9 AM - 5 PM EST{'\n'}
                                    • Sunday: Closed
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>Claims Department</Text>
                                <Text style={styles.termsText}>
                                    For assistance with claims:{'\n\n'}
                                    • Claims Hotline: +1 (800) 456-7890{'\n'}
                                    • Email: claims@insuranceapp.com{'\n'}
                                    • Hours: Mon-Fri, 8 AM - 6 PM EST{'\n'}
                                    • Claims Status Check: Available 24/7{'\n'}
                                    • Document Upload Support
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>Technical Support</Text>
                                <Text style={styles.termsText}>
                                    For app-related issues:{'\n\n'}
                                    • Technical Support: +1 (800) 789-0123{'\n'}
                                    • Email: tech@insuranceapp.com{'\n'}
                                    • Hours: Mon-Fri, 7 AM - 9 PM EST{'\n'}
                                    • Weekend Support: 9 AM - 5 PM EST{'\n'}
                                    • Live Chat: Available 24/7
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>In-App Support</Text>
                                <Text style={styles.termsText}>
                                    Quick access to support within the app:{'\n\n'}
                                    • Live Chat Support{'\n'}
                                    • Virtual Assistant{'\n'}
                                    • FAQ Section{'\n'}
                                    • Video Tutorials{'\n'}
                                    • Knowledge Base
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>Social Media Support</Text>
                                <Text style={styles.termsText}>
                                    Connect with us on social media:{'\n\n'}
                                    • Twitter: @InsuranceApp{'\n'}
                                    • Facebook: /InsuranceApp{'\n'}
                                    • Instagram: @InsuranceApp{'\n'}
                                    • LinkedIn: /company/insuranceapp{'\n'}
                                    • Response Time: Within 24 hours
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>Mailing Address</Text>
                                <Text style={styles.termsText}>
                                    For written correspondence:{'\n\n'}
                                    Insurance App Support Center{'\n'}
                                    123 Insurance Plaza{'\n'}
                                    Suite 500{'\n'}
                                    New York, NY 10001{'\n'}
                                    United States
                                </Text>
                            </View>

                            <View style={styles.termsSection}>
                                <Text style={styles.termsTitle}>Feedback & Suggestions</Text>
                                <Text style={styles.termsText}>
                                    Help us improve our service:{'\n\n'}
                                    • Email: feedback@insuranceapp.com{'\n'}
                                    • In-App Feedback Form{'\n'}
                                    • Customer Satisfaction Survey{'\n'}
                                    • Feature Request Portal{'\n'}
                                    • Response Time: 2-3 business days
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