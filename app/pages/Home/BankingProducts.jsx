import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { navigateTo, goBack, replace } from "../../utils/navigation";
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';


export default function BankingProducts() {
    const handleLifeInsurance = () => {
        navigateTo('PersonalLoan');
    };
    const handleBackPress = () => {
        goBack();
    };

    const insuranceTypes = [
        {
            id: 1,
            title: "Personal Loan",
            iconSource: require('../../assets/icons/Personal_Loan.png'), // Update path as needed
            onPress: handleLifeInsurance,
            iconWidth: 30,
            iconHeight: 30,
        },
        {
            id: 2,
            title: "Business Loan",
            iconSource: require('../../assets/icons/Business_Loan.png'), // Update path as needed
            onPress: handleLifeInsurance,
            iconWidth: 31,
            iconHeight: 31,
        },
        {
            id: 3,
            title: "Car Loan",
            iconSource: require('../../assets/icons/Car_Loan.png'), // Update path as needed
            onPress: handleLifeInsurance,
            iconWidth: 39,
            iconHeight: 39,
        },
        {
            id: 4,
            title: "MSME Loan",
            iconSource: require('../../assets/icons/Home_Loan.png'), // Update path as needed
            onPress: handleLifeInsurance,
            iconWidth: 40,
            iconHeight: 40,
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Banking Products</Text>
            </View>
            
            {/* Main Content Area */}
            <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.insuranceContainer}>
                {insuranceTypes.map((item) => (
                    <TouchableOpacity 
                        key={item.id} 
                        style={styles.insuranceCard}
                        onPress={item.onPress}
                    >
                        <View style={styles.iconContainer}>
                            <Image 
                                source={item.iconSource} 
                                style={[styles.icon, { width: item.iconWidth, height: item.iconHeight }]} 
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.insuranceTitle}>{item.title}</Text>
                       
                    </TouchableOpacity>
                ))}
                </View>
            </ScrollView>
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
        fontFamily: 'Poppins-SemiBold',
        color: '#000000',
    },
    contentContainer: {
        flex: 1,
    },
    insuranceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#EFEDED',
    },
    iconContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    icon: {
        width: 40,
        height: 40,
    },
    insuranceTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        flex: 1,
    },
    arrowIcon: {
        opacity: 0.6,
    },
    insuranceContainer: {
        marginTop: 30,
    }
});