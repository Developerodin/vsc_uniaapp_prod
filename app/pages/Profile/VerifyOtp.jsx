import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get("window");

export default function VerifyOtp() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(45);
    const inputRefs = useRef([]);
    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleSubmit = () => {
        // Handle OTP verification logic here
        navigation.navigate('Profile');
    };

    const handleResendOtp = () => {
        // Resend OTP logic here
        setCountdown(45);
    };

    // Handle OTP input
    const handleOtpChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Move to next input if there's a value
        if (text && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Handle backspace and move to previous input
    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Enter OTP</Text>
            </View>
            
            {/* Main Content Area */}
            <View style={styles.contentContainer}>
                {/* OTP Label */}
                <Text style={styles.otpLabel}>Enter OTP</Text>
                
                {/* OTP Input Boxes */}
                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={ref => inputRefs.current[index] = ref}
                            style={styles.otpInput}
                            value={digit}
                            onChangeText={text => handleOtpChange(text, index)}
                            onKeyPress={e => handleKeyPress(e, index)}
                            keyboardType="numeric"
                            maxLength={1}
                            autoFocus={index === 0}
                        />
                    ))}
                </View>
                
                {/* Resend OTP and Timer */}
                <View style={styles.resendContainer}>
                    <TouchableOpacity onPress={handleResendOtp}>
                        <Text style={styles.resendText}>Resend OTP</Text>
                    </TouchableOpacity>
                    <Text style={styles.timerText}>{countdown} Secs</Text>
                </View>
                <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>
            </View>
            

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingTop: 15,
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
        marginHorizontal: 15,
    },
    otpLabel: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 20,
        fontFamily: 'Poppins-Regular',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    otpInput: {
        width: 45,
        height: 45,
        borderRadius: 10,
        backgroundColor: '#F6F6FA',
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Poppins-Medium',
        borderWidth: 1,
        borderColor: '#E6E6E6',
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    resendText: {
        fontSize: 14,
        color: '#000000',
        fontFamily: 'Poppins-Regular',
    },
    timerText: {
        fontSize: 14,
        color: '#000000',
        fontFamily: 'Poppins-Regular',
    },
    buttonContainer: {
       marginTop: 20,
    },
    submitButton: {
        backgroundColor: '#2a2a2a',
        borderRadius: 30,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontFamily: 'Poppins-SemiBold',
    },
});