import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Base_url } from '../../config/BaseUrl';

export default function LoanProducts({ navigation, route }) {
    const { productId, categoryType } = route?.params || {};
    
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState({});
    const [categoryImages, setCategoryImages] = useState({});
    const [categoryNames, setCategoryNames] = useState([]);

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    const fetchProductDetails = async () => {
        if (!productId) {
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
            
            // Fetch product details
            const response = await axios.get(`${Base_url}products/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data) {
                setProduct(response.data);
                
                // If product has categories, fetch their names
                if (response.data.categories && response.data.categories.length > 0) {
                    // Fetch category details
                    const categoriesResponse = await axios.get(`${Base_url}categories?limit=100`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    
                    if (categoriesResponse.data && categoriesResponse.data.results) {
                        const categoryMap = {};
                        const categoryImagesMap = {};
                        categoriesResponse.data.results.forEach(category => {
                            categoryMap[category.id] = category;
                            categoryImagesMap[category.id] = category.image;
                        });
                        
                        setCategories(categoryMap);
                        setCategoryImages(categoryImagesMap);
                        
                        
                        // Extract category names from the product's categories
                        const names = response.data.categories.map(catId => {
                            const category = categoryMap[catId];
                            return category ? category.name : ''; // Get full category name
                        }).filter(name => name); // Remove empty names
                        console.log("names", names);
                        setCategoryNames(names);

                    }
                }
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryPress = (category, categoryId) => {
        // Navigate to specific category screen with the category ID
        navigation.navigate('LifeInsurance', { 
            category, 
            productId,
            categoryId, 
            categoryType 
        });
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    // Get icons based on product type
    const getIconsForProductType = () => {
        // Return different icon sets based on the category type
        switch(categoryType) {
            case "Insurance Services":
                return [
                    require("../../../assets/icons/Business_Loan.png"),
      require("../../../assets/icons/Car_Loan.png"),
      require("../../../assets/icons/Home_Loan.png"),
      require("../../../assets/icons/Personal_Loan.png"),
                ];
            case "Bank Loans":
                return [
                    require("../../../assets/icons/Business_Loan.png"),
                    require("../../../assets/icons/Car_Loan.png"),
                    require("../../../assets/icons/Home_Loan.png"),
                    require("../../../assets/icons/Personal_Loan.png"),
                ];
            case "Project Funding":
                return [
                    require("../../../assets/icons/Business_Loan.png"),
                    require("../../../assets/icons/Car_Loan.png"),
                    require("../../../assets/icons/Home_Loan.png"),
                    require("../../../assets/icons/Personal_Loan.png"),
                ];
            case "IT Sector Related Services":
                return [
                    require("../../../assets/icons/Business_Loan.png"),
                    require("../../../assets/icons/Car_Loan.png"),
                    require("../../../assets/icons/Home_Loan.png"),
                    require("../../../assets/icons/Personal_Loan.png"),
                ];
            case "Capital Market Services":
                return [
                    require("../../../assets/icons/Business_Loan.png"),
                    require("../../../assets/icons/Car_Loan.png"),
                    require("../../../assets/icons/Home_Loan.png"),
                    require("../../../assets/icons/Personal_Loan.png"),
                ];
            default:
                return [
                    require("../../../assets/icons/Business_Loan.png"),
                    require("../../../assets/icons/Car_Loan.png"),
                    require("../../../assets/icons/Home_Loan.png"),
                    require("../../../assets/icons/Personal_Loan.png"),
                ];
        }
    };

    // Get category items from product
    const getCategoryItems = () => {
        const icons = getIconsForProductType();
        
        if (product && product.categories && product.categories.length > 0) {
            return product.categories.map((categoryId, index) => {
                const categoryName = categories[categoryId] ? categories[categoryId].name : '';
                const backendImage = categoryImages[categoryId];
                const defaultIcon = icons[index % icons.length];
                
                return {
                    id: categoryId,
                    title: categoryName,
                    iconSource: backendImage ? { uri: backendImage } : defaultIcon,
                    defaultIcon: defaultIcon,
                    onPress: () => handleCategoryPress(categoryName, categoryId)
                };
            });
        }
        
        // Default items if no categories are found
        return [
            {
                id: 1,
                title: "Category 1",
                iconSource: icons[0],
                defaultIcon: icons[0],
                onPress: () => console.log("No category ID available")
            },
            {
                id: 2,
                title: "Category 2",
                iconSource: icons[1],
                defaultIcon: icons[1],
                onPress: () => console.log("No category ID available")
            },
            {
                id: 3,
                title: "Category 3",
                iconSource: icons[2],
                defaultIcon: icons[2],
                onPress: () => console.log("No category ID available")
            },
            {
                id: 4,
                title: "Category 4",
                iconSource: icons[3],
                defaultIcon: icons[3],
                onPress: () => console.log("No category ID available")
            }
        ];
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
                        <Text style={styles.headerTitle}>
                            {product ? product.name : categoryType || "Product Categories"}
                        </Text>
                    </View>
                    
                    {/* Main Content Area */}
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#FF7115" />
                            <Text style={styles.loadingText}>Loading categories...</Text>
                        </View>
                    ) : (
                        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                            <View style={styles.categoriesContainer}>
                                {getCategoryItems().map((item) => (
                                    <TouchableOpacity 
                                        key={item.id} 
                                        style={styles.categoryCard}
                                        onPress={item.onPress}
                                    >
                                        <View style={styles.iconContainer}>
                                            <Image 
                                                source={item.iconSource} 
                                                style={styles.icon} 
                                                resizeMode="contain"
                                                defaultSource={item.defaultIcon}
                                                onError={() => {
                                                    // If backend image fails, it will automatically fallback to default icon
                                                    console.log(`Failed to load image for category: ${item.title}`);
                                                }}
                                            />
                                        </View>
                                        <Text style={styles.categoryTitle}>{item.title}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
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
        fontFamily: 'Poppins-SemiBold',
        color: '#000000',
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
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        backgroundColor: "#F6F6F6",
                borderColor: "#E6E6E6",
    },
    iconContainer: {
        width: 58,
        height: 58,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    icon: {
        width: 26,
        height: 26,
        resizeMode: 'contain',
    },
    categoryTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        flex: 1,
    },
    categoriesContainer: {
        marginTop: 20,
        marginBottom: 30,
    }
});