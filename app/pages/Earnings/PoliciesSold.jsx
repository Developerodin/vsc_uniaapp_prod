import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform,
    StatusBar
} from 'react-native';

// Sample data for policies
const policiesData = [
    { id: '1', title: 'Young Star Policy', commission: '15%' },
    { id: '2', title: 'Young Star Policy', commission: '15%' },
    { id: '3', title: 'Young Star Policy', commission: '15%' },
    { id: '4', title: 'Young Star Policy', commission: '15%' }
];

export default function PoliciesSold() {
    const navigation = useNavigation();
    
    const handleBackPress = () => {
        navigation.goBack();
    };

    const handlePolicyPress = (policy) => {
        // Handle policy selection
        navigation.navigate('DashboardPolicyDetails');
    };

    return (
        <View style={styles.viewWrapper}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#000000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Policies Sold</Text>
                </View>
                
                {/* Main Content Area */}
                <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.policyContainer}>
                        {policiesData.map((policy) => (
                            <TouchableOpacity 
                                key={policy.id} 
                                style={styles.policyCard}
                                onPress={() => handlePolicyPress(policy)}
                            >
                                <Image 
                                    source={require('../../../assets/icons/watch.png')}
                                    style={styles.policyImage}
                                />
                                <View style={styles.policyInfo}>
                                    <Text style={styles.policyTitle}>{policy.title}</Text>
                                    <Text style={styles.policyCommission}>Commission: {policy.commission}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#000" style={styles.arrowIcon} />
                            </TouchableOpacity>
                        ))}
                    </View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 15,
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: '#000000',
    },
    contentContainer: {
        flex: 1,
        paddingTop: 10,
    },
    policyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 0,
        marginBottom: 15,
    },
    policyImage: {
        width: 55,
        height: 55,
        borderRadius: 4,
        marginRight: 15,
    },
    policyInfo: {
        flex: 1,
    },
    policyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
    },
    policyCommission: {
        fontSize: 14,
        color: '#606060',
    },
    arrowIcon: {
        marginLeft: 10,
    },
    policyContainer: {
        marginTop: 10,
    }
});