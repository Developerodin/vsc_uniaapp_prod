import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    Platform,
    StatusBar
} from 'react-native';

const { width } = Dimensions.get("window");

export default function ProfileNotifications() {
    const navigation = useNavigation();
    const [notificationSettings, setNotificationSettings] = useState({
        leadReminders: false,
        payoutAlerts: false,
        productUpdates: false,
        appAnnouncements: false
    });

    const handleBackPress = () => {
        navigation.goBack();
    };

    const toggleSwitch = (key) => {
        setNotificationSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['#fe8900', '#970251']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.9 }}
                style={styles.headerGradient}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={20} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notifications Settings</Text>
                    {/* <TouchableOpacity style={styles.settingsButton}>
                        <Ionicons name="settings-outline" size={20} color="white" />
                    </TouchableOpacity> */}
                </View>
            </LinearGradient>
            
            {/* Main Content Area */}
            <View style={styles.contentContainer}>
                {/* Lead Reminders */}
                <View style={styles.notificationItem}>
                    <View style={styles.notificationInfo}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="notifications-outline" size={22} color="#FF9000" />
                        </View>
                        <Text style={styles.notificationTitle}>Lead Reminders</Text>
                    </View>
                    <Switch
                        trackColor={{ false: "#EBEBEB", true: "#C6EFDC" }}
                        thumbColor={notificationSettings.leadReminders ? "#008748" : "#ADADAD"}
                        ios_backgroundColor="#EBEBEB"
                        onValueChange={() => toggleSwitch('leadReminders')}
                        value={notificationSettings.leadReminders}
                        style={styles.switch}
                    />
                </View>

                {/* Payout Alerts */}
                <View style={styles.notificationItem}>
                    <View style={styles.notificationInfo}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="wallet-outline" size={22} color="#00BC64" />
                        </View>
                        <Text style={styles.notificationTitle}>Payout Alerts</Text>
                    </View>
                    <Switch
                        trackColor={{ false: "#EBEBEB", true: "#C6EFDC" }}
                        thumbColor={notificationSettings.payoutAlerts ? "#008748" : "#ADADAD"}
                        ios_backgroundColor="#EBEBEB"
                        onValueChange={() => toggleSwitch('payoutAlerts')}
                        value={notificationSettings.payoutAlerts}
                        style={styles.switch}
                    />
                </View>

                {/* Product Updates */}
                <View style={styles.notificationItem}>
                    <View style={styles.notificationInfo}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="gift-outline" size={22} color="#0095FF" />
                        </View>
                        <Text style={styles.notificationTitle}>Product Updates</Text>
                    </View>
                    <Switch
                        trackColor={{ false: "#EBEBEB", true: "#C6EFDC" }}
                        thumbColor={notificationSettings.productUpdates ? "#008748" : "#ADADAD"}
                        ios_backgroundColor="#EBEBEB"
                        onValueChange={() => toggleSwitch('productUpdates')}
                        value={notificationSettings.productUpdates}
                        style={styles.switch}
                    />
                </View>

                {/* App Announcements */}
                <View style={styles.notificationItem}>
                    <View style={styles.notificationInfo}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="megaphone-outline" size={22} color="#FFAE00" />
                        </View>
                        <Text style={styles.notificationTitle}>App Announcements</Text>
                    </View>
                    <Switch
                        trackColor={{ false: "#EBEBEB", true: "#C6EFDC" }}
                        thumbColor={notificationSettings.appAnnouncements ? "#008748" : "#ADADAD"}
                        ios_backgroundColor="#EBEBEB"
                        onValueChange={() => toggleSwitch('appAnnouncements')}
                        value={notificationSettings.appAnnouncements}
                        style={styles.switch}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    headerGradient: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 5,
        marginBottom: 2,
        alignItems: 'center',
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#ffffff',
        flex: 1,
    },
    settingsButton: {
        padding: 5,
        width: 40,
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        paddingTop: 10,
        marginHorizontal: 15,
        paddingHorizontal: 20,
    },
    notificationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    notificationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 58,
        height: 58,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E6E6E6',
        marginRight: 15,
    },
    notificationTitle: {
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Poppins-SemiBold',
    },
    switch: {
        transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
    },
});