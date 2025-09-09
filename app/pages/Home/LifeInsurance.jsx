import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StatusBar
} from 'react-native';
import { Base_url } from '../../config/BaseUrl';

export default function LifeInsurance({ navigation, route }) {
    const params = route?.params || {};
    const { category, categoryId, productId, categoryType } = params || {};
    
    const [loading, setLoading] = useState(true);
    const [subcategories, setSubcategories] = useState([]);
    
    useEffect(() => {
        fetchSubcategories();
    }, [categoryId]);
    
    const fetchSubcategories = async () => {
        if (!categoryId) {
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('access_token');
            
            if (!token) {
                console.error('No access token found');
                setLoading(false);
                return;
            }
            
            // Fetch subcategories for the selected category
            const response = await axios.get(`${Base_url}subcategories/category/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // Format the subcategory data
            const formattedData = response.data.map((subcategory, index) => ({
                srNo: index + 1,
                id: subcategory.id,
                title: subcategory.name || '--',
                description: subcategory.description || '--',
                status: subcategory.status
            }));
            
            setSubcategories(formattedData);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleBackPress = () => {
        navigation.goBack();
    };
    
    const handleSubcategoryPress = (subcategory) => {
        // Navigate to AddLead with pre-selected product, category, and subcategory
        // Serialize objects as JSON strings to avoid "[object Object]" issue
        navigation.navigate('AddLead', { 
            preSelectedProduct: JSON.stringify({
                value: productId,
                label: categoryType || 'Product',
                id: productId,
                type: 'insurance',
                categories: [categoryId]
            }),
            preSelectedCategory: JSON.stringify({
                value: categoryId,
                label: category
            }),
            preSelectedSubcategory: JSON.stringify({
                value: subcategory.id,
                label: subcategory.title
            })
        });
    };

    return (
        <View style={styles.viewWrapper}>
            
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                            <Ionicons name="chevron-back" size={24} color="#000000" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{category || "Category Details"}</Text>
                    </View>
                    
                    {/* Main Content Area */}
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#FF7115" />
                            <Text style={styles.loadingText}>Loading subcategories...</Text>
                        </View>
                    ) : (
                        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                            {subcategories.length > 0 ? (
                                <View style={styles.subcategoriesContainer}>
                                    {subcategories.map((item) => (
                                        <TouchableOpacity 
                                            key={item.id} 
                                            style={styles.subcategoryCard}
                                            onPress={() => handleSubcategoryPress(item)}
                                        >
                                            <Text style={styles.subcategoryTitle}>{item.title}</Text>
                                            {/* {item.description !== '--' && (
                                                <Text style={styles.subcategoryDescription}>{item.description}</Text>
                                            )} */}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ) : (
                                <View style={styles.noDataContainer}>
                                    <Text style={styles.noDataText}>No subcategories found for this category.</Text>
                                </View>
                            )}
                        </ScrollView>
                    )}
                </View>
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
        fontFamily: 'Poppins-SemiBold',
        color: '#000000',
        width: '80%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    contentContainer: {
        flex: 1,
    },
    subcategoriesContainer: {
        marginTop: 20,
    },
    subcategoryCard: {
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#EFEDED',
    },
    subcategoryTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#000'
    },
    subcategoryDescription: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#666',
        lineHeight: 20,
    },
    noDataContainer: {
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    noDataText: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#666',
        textAlign: 'center',
    }
});