import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Image as RNImage,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StatusBar
} from 'react-native';
import CustomAlertModal from '../../components/CustomAlertModal';
import { Base_url } from '../../config/BaseUrl';
import { pickImageFromLibrary } from '../../utils/imagePicker';

import { useNavigation, useRoute } from '@react-navigation/native';
const Dropdown = ({ label, value, options, onSelect, required = false, zIndex = 1000 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.value === value);

    const handleClose = () => setIsOpen(false);
    const handleSelect = (selectedValue) => {
        onSelect(selectedValue);
        handleClose();
    };

    return (
        <View style={[styles.dropdownContainer, { zIndex }]}>
            <Text style={styles.inputLabel}>
                {label}
                {required && <Text style={styles.requiredStar}>*</Text>}
            </Text>
            <TouchableOpacity
                style={[styles.dropdown, isOpen && styles.dropdownActive]}
                onPress={() => setIsOpen(true)}
            >
                <Text style={[styles.dropdownText, !selectedOption && styles.placeholderText]}>
                    {selectedOption ? selectedOption.label : `Select ${label.toLowerCase()}`}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666666" />
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={handleClose}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1} 
                    onPress={handleClose}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{`Select ${label}`}</Text>
                            <TouchableOpacity onPress={handleClose}>
                                <Ionicons name="close" size={24} color="#000000" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.modalItem,
                                        value === item.value && styles.modalItemSelected
                                    ]}
                                    onPress={() => handleSelect(item.value)}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        value === item.value && styles.modalItemTextSelected
                                    ]}>
                                        {item.label}
                                    </Text>
                                    {value === item.value && (
                                        <Ionicons name="checkmark" size={20} color="#2a2a2a" />
                                    )}
                                </TouchableOpacity>
                            )}
                            style={styles.modalList}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default function AddLead() {
    const navigation = useNavigation();
    const route = useRoute();
    
    // Get params from React Navigation route
    const params = route.params || {};
    
    // Safely extract and parse parameters with fallbacks - memoized to prevent infinite loops
    const parseParam = useCallback((param) => {
        if (!param) return null;
        if (typeof param === 'string' && param === '[object Object]') {
            console.warn('Received "[object Object]" string, returning null');
            return null;
        }
        if (typeof param === 'string') {
            try {
                const parsed = JSON.parse(param);
                return parsed;
            } catch (e) {
                console.log('Failed to parse param as JSON, using as string:', param);
                return param;
            }
        }
        return param;
    }, []);
    
    // Memoize the parsed parameters to prevent infinite loops
    const preSelectedProduct = useMemo(() => {
        return parseParam(params?.preSelectedProduct) || 
            (params?.preSelectedProductId ? {
                id: params.preSelectedProductId,
                value: params.preSelectedProductId,
                label: params.preSelectedProductName || 'Product'
            } : null);
    }, [params?.preSelectedProduct, params?.preSelectedProductId, params?.preSelectedProductName, parseParam]);
    
    const preSelectedCategory = useMemo(() => {
        return parseParam(params?.preSelectedCategory) || 
            (params?.preSelectedCategoryId ? {
                id: params.preSelectedCategoryId,
                value: params.preSelectedCategoryId,
                label: params.preSelectedCategoryName || 'Category'
            } : null);
    }, [params?.preSelectedCategory, params?.preSelectedCategoryId, params?.preSelectedCategoryName, parseParam]);
    
    const preSelectedSubcategory = useMemo(() => {
        return parseParam(params?.preSelectedSubcategory) || 
            (params?.preSelectedSubcategoryId ? {
                id: params.preSelectedSubcategoryId,
                value: params.preSelectedSubcategoryId,
                label: params.preSelectedSubcategoryName || 'Subcategory'
            } : null);
    }, [params?.preSelectedSubcategory, params?.preSelectedSubcategoryId, params?.preSelectedSubcategoryName, parseParam]);
    
    // Debug logging - only log once when values change
    useEffect(() => {
        if (preSelectedProduct || preSelectedCategory || preSelectedSubcategory) {
            console.log('AddLead params:', params);
            console.log('Pre-selected values:', { preSelectedProduct, preSelectedCategory, preSelectedSubcategory });
        }
    }, [preSelectedProduct, preSelectedCategory, preSelectedSubcategory, params]);
    
    // Add phase state
    const [currentPhase, setCurrentPhase] = useState(1);
    
    // State for dropdowns
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(preSelectedProduct || null);
    const [selectedCategory, setSelectedCategory] = useState(preSelectedCategory || null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(preSelectedSubcategory || null);
    
    // Dropdown states
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);
    const [showSourceDropdown, setShowSourceDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showProductStatusDropdown, setShowProductStatusDropdown] = useState(false);

    // Dynamic fields state
    const [dynamicFields, setDynamicFields] = useState([]);
    const [fieldValues, setFieldValues] = useState({});
    const [isLoadingFields, setIsLoadingFields] = useState(false);
    const [fieldsData, setFieldsData] = useState(null);

    // Static lead fields state - always use default values
    const [leadData, setLeadData] = useState({
        source: 'direct', // always default
        status: 'new', // always default
        productStatus: 'interested' // always default
    });
    const [isSaving, setIsSaving] = useState(false);

    // Static dropdown options
    const sourceOptions = [
        { value: 'direct', label: 'Direct' },
        { value: 'referral', label: 'Referral' },
        { value: 'website', label: 'Website' },
        { value: 'social', label: 'Social Media' },
        { value: 'other', label: 'Other' }
    ];

    const statusOptions = [
        { value: 'new', label: 'New' },
    ];

    const productStatusOptions = [
        { value: 'interested', label: 'Interested' },
        { value: 'proposed', label: 'Proposed' },
        { value: 'sold', label: 'Sold' },
        { value: 'rejected', label: 'Rejected' }
    ];

    const [alertConfig, setAlertConfig] = useState({
        isVisible: false,
        title: '',
        message: '',
        icon: 'alert-circle',
        iconColor: '#FF3B30'
    });

    // Add new state for date pickers
    const [showDynamicDatePickers, setShowDynamicDatePickers] = useState({});

    // Add new state for image fields
    const [imageFields, setImageFields] = useState({});

    // Add this at the top with other state declarations
    const [showGenderDropdown, setShowGenderDropdown] = useState({});

    // Add this with other constants
    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
    ];

    // Add phase validation functions
    const isPhase1Valid = () => {
        // Check if we have pre-selected values or manually selected values
        const hasProduct = selectedProduct || preSelectedProduct;
        const hasCategory = selectedCategory || preSelectedCategory;
        const hasSubcategory = selectedSubcategory || preSelectedSubcategory;
        
        return hasProduct && hasCategory && hasSubcategory;
    };

    // Check if user came from subcategory selection (all pre-selections provided)
    const isFromSubcategorySelection = () => {
        return preSelectedProduct && preSelectedCategory && preSelectedSubcategory;
    };

    const isPhase2Valid = () => {
        return true; // Always valid since we use default values
    };

    const isPhase3Valid = () => {
        if (dynamicFields.length === 0) return true;
        
        return dynamicFields.every(field => {
            const value = fieldValues[field.name];
            
            // Only validate mandatory fields
            if (field.fieldOption !== 'mandatory') {
                return true; // Skip validation for optional fields
            }
            
            if (field.type === 'date') {
                return value instanceof Date && !isNaN(value.getTime());
            }
            if (field.type === 'file') {
                return value && value.url && value.key; // Check for both url and key
            }
            return value && typeof value === 'string' && value.trim().length > 0;
        });
    };

    const handleNextPhase = () => {
        if (currentPhase === 1 && isPhase1Valid()) {
            setCurrentPhase(2); // Go directly to dynamic fields (phase 2)
        }
    };

    const handlePreviousPhase = () => {
        if (currentPhase > 1) {
            setCurrentPhase(currentPhase - 1);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // Handle pre-selected values - use ref to prevent infinite loops
    const hasSetPreSelectedValues = useRef(false);
    
    useEffect(() => {
        if (preSelectedProduct && preSelectedCategory && preSelectedSubcategory && !hasSetPreSelectedValues.current) {
            console.log('Setting pre-selected values:', { preSelectedProduct, preSelectedCategory, preSelectedSubcategory });
            
            // If all pre-selections are provided, automatically move to phase 2 (dynamic fields)
            setCurrentPhase(2);
            
            // Set the pre-selected values
            setSelectedProduct(preSelectedProduct);
            setSelectedCategory(preSelectedCategory);
            setSelectedSubcategory(preSelectedSubcategory);
            
            // Mark as set to prevent re-setting
            hasSetPreSelectedValues.current = true;
        }
    }, [preSelectedProduct, preSelectedCategory, preSelectedSubcategory]);

    // Filter categories when product is selected
    useEffect(() => {
        if (selectedProduct && categories.length > 0) {
            const filtered = categories.filter(category => 
                selectedProduct.categories && selectedProduct.categories.includes(category.value)
            );
            setFilteredCategories(filtered);
            
            // Only reset selections if we don't have pre-selected values and haven't set them yet
            if (!hasSetPreSelectedValues.current && !preSelectedProduct && !preSelectedCategory && !preSelectedSubcategory) {
                setSelectedCategory(null); // Reset category selection when product changes
                setSelectedSubcategory(null); // Reset subcategory selection when product changes
                setSubcategories([]); // Clear subcategories when product changes
                setDynamicFields([]); // Clear dynamic fields when product changes
                setFieldValues({}); // Clear field values
                setFieldsData(null); // Clear fields data
            }
        } else {
            setFilteredCategories([]);
        }
    }, [selectedProduct, categories, preSelectedProduct, preSelectedCategory, preSelectedSubcategory]);

    // Fetch subcategories when category is selected
    useEffect(() => {
        if (selectedCategory) {
            fetchSubcategories(selectedCategory.value);
            
            // Only reset selections if we don't have pre-selected values and haven't set them yet
            if (!hasSetPreSelectedValues.current && !preSelectedProduct && !preSelectedCategory && !preSelectedSubcategory) {
                setSelectedSubcategory(null); // Reset subcategory selection when category changes
                setDynamicFields([]); // Clear dynamic fields when category changes
                setFieldValues({}); // Clear field values
                setFieldsData(null); // Clear fields data
            }
        } else {
            setSubcategories([]);
        }
    }, [selectedCategory, preSelectedProduct, preSelectedCategory, preSelectedSubcategory]);

    // Fetch dynamic fields when product and category are selected (subcategory not required for API)
    useEffect(() => {
        if (selectedProduct && selectedCategory) {
            // Add a small delay to ensure state is properly set
            const timer = setTimeout(() => {
                fetchDynamicFields();
            }, 100);
            
            return () => clearTimeout(timer);
        }
    }, [selectedProduct, selectedCategory]);

    const fetchProducts = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            const response = await axios.get(`${Base_url}products`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // Create product options with proper IDs and categories
            const productOptions = response.data.results.map((product) => ({
                value: product.id || product._id, // Use id or _id depending on your backend
                label: product.name || product.title || 'Unnamed Product',
                id: product.id || product._id,
                type: product.type,
                categories: product.categories || [] // Array of category IDs that belong to this product
            }));
            
            setProducts(productOptions);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            const response = await axios.get(`${Base_url}categories?limit=100`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            const categoryOptions = response.data.results.map((category) => ({
                value: category.id,
                label: category.name
            }));
            
            setCategories(categoryOptions);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchSubcategories = async (categoryId) => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            const response = await axios.get(`${Base_url}subcategories/category/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // The API returns an array directly, not an object with results
            const subcategoryOptions = response.data.map((subcategory) => ({
                value: subcategory.id,
                label: subcategory.name
            }));
            
            setSubcategories(subcategoryOptions);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            setSubcategories([]);
        }
    };

    const fetchDynamicFields = async () => {
        if (!selectedProduct || !selectedCategory) return;
        
        setIsLoadingFields(true);
        try {
            const token = await AsyncStorage.getItem('access_token');
            
            // Use the actual values from selectedProduct and selectedCategory
            const productId = selectedProduct.value || selectedProduct.id;
            const categoryId = selectedCategory.value || selectedCategory.id;
            
            // Additional validation
            if (!productId || !categoryId) {
                console.warn('Missing productId or categoryId:', { productId, categoryId, selectedProduct, selectedCategory });
                setIsLoadingFields(false);
                return;
            }
            
            console.log('Fetching dynamic fields for:', { productId, categoryId });
            
            const response = await axios.get(
                `${Base_url}leadsfields/product/${productId}/category/${categoryId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            setFieldsData(response.data);
            setDynamicFields(response.data.fields || []);
            
            // Initialize field values
            const initialValues = {};
            response.data.fields?.forEach((field) => {
                initialValues[field.name] = '';
            });
            setFieldValues(initialValues);
            
        } catch (error) {
            console.error('Error fetching dynamic fields:', error);
            setDynamicFields([]);
            setFieldValues({});
            setFieldsData(null);
        } finally {
            setIsLoadingFields(false);
        }
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleProductSelect = (value) => {
        const product = products.find(p => p.value === value);
        setSelectedProduct(product);
    };

    const handleCategorySelect = (value) => {
        const category = filteredCategories.find(c => c.value === value);
        setSelectedCategory(category);
    };

    const handleSubcategorySelect = (value) => {
        const subcategory = subcategories.find(s => s.value === value);
        setSelectedSubcategory(subcategory);
    };

    const closeAllDropdowns = () => {
        setShowProductDropdown(false);
        setShowCategoryDropdown(false);
        setShowSubcategoryDropdown(false);
    };

    const handleFieldValueChange = (fieldName, value) => {
        setFieldValues(prevValues => ({
            ...prevValues,
            [fieldName]: value
        }));
    };

    const handleLeadDataChange = (field, value) => {
        setLeadData(prevData => ({
            ...prevData,
            [field]: value
        }));
    };

    const handleSourceSelect = (source) => {
        handleLeadDataChange('source', source.value);
        setShowSourceDropdown(false);
    };

    const handleStatusSelect = (status) => {
        handleLeadDataChange('status', status.value);
        setShowStatusDropdown(false);
    };

    const handleProductStatusSelect = (productStatus) => {
        handleLeadDataChange('productStatus', productStatus.value);
        setShowProductStatusDropdown(false);
    };

    const handleImageUpload = async (fieldName) => {
        try {
            // Use the improved image picker utility
            const result = await pickImageFromLibrary({
                aspect: [4, 3],
                quality: 0.8, // Reduced quality to prevent memory issues
            });

            if (!result) {
                return; // User cancelled
            }

            const imageUri = result.uri;
            setImageFields(prev => ({
                ...prev,
                [fieldName]: imageUri
            }));

            // Upload image to server with timeout protection
            const formData = new FormData();
            formData.append('file', {
                uri: imageUri,
                type: 'image/jpeg',
                name: `${fieldName}_${Date.now()}.jpg`
            });

            const token = await AsyncStorage.getItem('access_token');
            
            // Add timeout for iOS uploads
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            const uploadResponse = await fetch(`${Base_url}files/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!uploadResponse.ok) {
                throw new Error(`Upload failed with status: ${uploadResponse.status}`);
            }

            const uploadData = await uploadResponse.json();

            if (!uploadData.success) {
                throw new Error(uploadData.message || 'Upload failed');
            }

            // Store both URL and key in fieldValues
            handleFieldValueChange(fieldName, {
                url: uploadData.data.url,
                key: uploadData.data.key
            });

        } catch (error) {
            console.error('Error picking/uploading image:', error);
            
            // Provide more specific error messages
            if (error.message.includes('Permission')) {
                showAlert('Permission Required', 'Please grant photo library access in Settings to upload images.');
            } else if (error.message.includes('file size')) {
                showAlert('File Too Large', 'Please select a smaller image (under 10MB).');
            } else if (error.name === 'AbortError') {
                showAlert('Upload Timeout', 'Upload timed out. Please try again with a smaller image.');
            } else if (error.message.includes('Upload failed')) {
                showAlert('Upload Failed', 'Failed to upload image. Please check your connection and try again.');
            } else {
                showAlert('Error', 'Failed to upload image. Please try again.');
            }
        }
    };

    const renderDynamicField = (field) => {
        const { name, type, fieldOption } = field;
        const value = fieldValues[name] || '';
        const imageUri = imageFields[name];
        const isMandatory = fieldOption === 'mandatory';

        // Add special handling for gender field
        if (name.toLowerCase().includes('gender')) {
            return (
                <Dropdown
                    label={name}
                    value={value}
                    options={genderOptions}
                    onSelect={(selectedValue) => handleFieldValueChange(name, selectedValue)}
                    required={isMandatory}
                />
            );
        }

        if (type === 'file') {
            return (
                <View key={name} style={styles.fieldContainer}>
                    <Text style={styles.inputLabel}>
                        {name}
                        {isMandatory && <Text style={styles.requiredStar}>*</Text>}
                    </Text>
                    <TouchableOpacity
                        style={styles.imageUploadButton}
                        onPress={() => handleImageUpload(name)}
                    >
                        {imageUri ? (
                            <View style={styles.imagePreviewContainer}>
                                <Image
                                    source={{ uri: imageUri }}
                                    style={styles.imagePreview}
                                    contentFit="cover"
                                />
                                <TouchableOpacity
                                    style={styles.changeImageButton}
                                    onPress={() => handleImageUpload(name)}
                                >
                                    <Text style={styles.changeImageText}>Change Image</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.uploadPlaceholder}>
                                <Ionicons name="cloud-upload-outline" size={24} color="#666" />
                                <Text style={styles.uploadText}>Upload {name}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            );
        }

        if (type === 'date') {
            return (
                <View key={name} style={styles.fieldContainer}>
                    <Text style={styles.inputLabel}>
                        {name}
                        {isMandatory && <Text style={styles.requiredStar}>*</Text>}
                    </Text>
                    <TouchableOpacity
                        style={[styles.input, styles.dateInput]}
                        onPress={() => setShowDynamicDatePickers(prev => ({ ...prev, [name]: true }))}
                    >
                        <Text style={[
                            styles.dateText,
                            !value && styles.placeholderText
                        ]}>
                            {value ? formatDateForDisplay(value) : `Select ${name.toLowerCase()}`}
                        </Text>
                        <Ionicons name="calendar-outline" size={20} color="#666666" />
                    </TouchableOpacity>
                    {showDynamicDatePickers[name] && (
                        <DateTimePicker
                            value={value ? new Date(value) : new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, selectedDate) => {
                                if (Platform.OS === 'android') {
                                    setShowDynamicDatePickers(prev => ({ ...prev, [name]: false }));
                                }

                                if (selectedDate) {
                                    handleFieldValueChange(name, selectedDate);
                                }
                            }}
                            textColor="#000000"
                            minimumDate={new Date(1900, 0, 1)}
                            maximumDate={new Date()}
                        />
                    )}
                </View>
            );
        }

        const getKeyboardType = (type) => {
            switch (type) {
                case 'email':
                    return 'email-address';
                case 'number':
                    return 'numeric';
                case 'phone':
                    return 'phone-pad';
                default:
                    return 'default';
            }
        };

        return (
            <View key={name} style={styles.fieldContainer}>
                <Text style={styles.inputLabel}>
                    {name}
                    {isMandatory && <Text style={styles.requiredStar}>*</Text>}
                </Text>
                <TextInput
                    style={[
                        styles.input,
                        styles.textInput
                    ]}
                    value={value}
                    onChangeText={(text) => handleFieldValueChange(name, text)}
                    placeholder={`Enter ${name.toLowerCase()}`}
                    placeholderTextColor="#666666"
                    keyboardType={getKeyboardType(type)}
                    autoCapitalize={type === 'email' ? 'none' : 'words'}
                />
            </View>
        );
    };

    const renderDropdown = (label, value, options, onSelect, required = false, zIndex = 1000) => {
        return (
            <Dropdown
                label={label}
                value={value}
                options={options}
                onSelect={onSelect}
                required={required}
                zIndex={zIndex}
            />
        );
    };

    // Helper function to convert dd/mm/yyyy to ISO date
    const convertDateToISO = (dateString) => {
        if (!dateString || dateString.trim() === '') return null;
        
        try {
            // Check if the format is DD/MM/YYYY
            const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
            if (!dateRegex.test(dateString)) {
                console.warn('Invalid date format:', dateString);
                return null;
            }
            
            const [day, month, year] = dateString.split('/');
            
            // Validate day, month, year
            const dayNum = parseInt(day, 10);
            const monthNum = parseInt(month, 10);
            const yearNum = parseInt(year, 10);
            
            if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900 || yearNum > 2100) {
                console.warn('Invalid date values:', { day: dayNum, month: monthNum, year: yearNum });
                return null;
            }
            
            // Create date object (month is 0-indexed in JavaScript)
            const date = new Date(yearNum, monthNum - 1, dayNum);
            
            // Check if the date is valid
            if (date.getFullYear() !== yearNum || date.getMonth() !== monthNum - 1 || date.getDate() !== dayNum) {
                console.warn('Invalid date created:', dateString);
                return null;
            }
            
            return date.toISOString();
        } catch (error) {
            console.error('Error converting date:', error);
            return null;
        }
    };

    // Helper function to format date as dd/mm/yyyy
    const formatDateForDisplay = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const showAlert = (title, message, icon = 'alert-circle', iconColor = '#FF3B30') => {
        setAlertConfig({
            isVisible: true,
            title,
            message,
            icon,
            iconColor
        });
    };

    const hideAlert = () => {
        setAlertConfig(prev => ({ ...prev, isVisible: false }));
    };

    // Save lead function
    const saveLead = async () => {
        if (!isPhase3Valid()) {
            showAlert('Error', 'Please fill all required fields');
            return;
        }

        setIsSaving(true);
        try {
            const userDetails = await AsyncStorage.getItem('user details');
            const userDetailsObj = JSON.parse(userDetails);
            const userId = userDetailsObj.id;
            const token = await AsyncStorage.getItem('access_token');
            
            // Prepare documents array from file fields
            const documents = dynamicFields
                .filter(field => field.type === 'file')
                .map(field => {
                    const value = fieldValues[field.name];
                    if (value && value.url && value.key) {
                        return {
                            url: value.url,
                            key: value.key,
                            name: field.name
                        };
                    }
                    return null;
                })
                .filter(doc => doc !== null);

            // Create fieldsData without file fields
            const fieldsDataWithoutFiles = Object.entries(fieldValues).reduce((acc, [key, value]) => {
                const field = dynamicFields.find(f => f.name === key);
                if (field && field.type !== 'file') {
                    acc[key] = value;
                }
                return acc;
            }, {});

            // Prepare the lead data
            const leadPayload = {
                agent: userId,
                source: leadData.source,
                status: leadData.status,
                category: selectedCategory?.value || selectedCategory?.id,
                subcategory: selectedSubcategory?.value || selectedSubcategory?.id,
                products: [
                    {
                        product: selectedProduct?.value || selectedProduct?.id,
                        status: leadData.productStatus
                    }
                ],
                fieldsData: fieldsDataWithoutFiles,
                documents: documents
            };
            console.log('Lead Payload:', leadPayload);
            

            const response = await axios.post(`${Base_url}leads`, leadPayload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            // Log the response from the API
            console.log('Lead API Response:', response.data);
            
            showAlert(
                'Success',
                'Lead added successfully!',
                'checkmark-circle',
                '#4CD964'
            );
            setTimeout(() => {
                navigation.goBack();
            }, 1500);
        } catch (error) {
            console.error('Error saving lead:', error);
            showAlert(
                'Error',
                error.response?.data?.message || 'Failed to save lead. Please try again.'
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Revamped Header with Gradient and Progress Bar */}
            <LinearGradient
                colors={['#fe8900', '#970251']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.9 }}
                style={styles.gradientHeader}
            >
                <RNImage
                    source={require('../../../assets/images/CenterBg2.png')}
                    style={styles.headerBgImage}
                    resizeMode="cover"
                />
                <View style={styles.headerContent}>
                    <TouchableOpacity 
                        onPress={currentPhase === 1 ? handleBackPress : handlePreviousPhase} 
                        style={{marginBottom: 3}}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitleWhite}>Add a Lead</Text>
                </View>
                {/* Progress Bar / Stepper */}
                <View style={styles.progressBarWrapper}>
                    {/* Step 1 */}
                    <View style={styles.progressStepWrapper}>
                        <View style={[styles.progressCircle, currentPhase >= 1 ? styles.progressCircleActive : null]} />
                        <View style={[styles.progressLine, currentPhase > 1 ? styles.progressLineActive : null]} />
                    </View>
                    {/* Step 2 */}
                    <View style={styles.progressStepWrapper}>
                        <View style={[styles.progressCircle, currentPhase === 2 ? styles.progressCircleActive : null]} />
                    </View>
                </View>
            </LinearGradient>
            
            {/* Main Content Area with KeyboardAvoidingView */}
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
                enabled
            >
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContentContainer}
                    showsVerticalScrollIndicator={true}
                    keyboardShouldPersistTaps="handled"
                    scrollEventThrottle={16}
                    bounces={true}
                    overScrollMode="always"
                    nestedScrollEnabled={false}
                >
                    <View style={styles.contentWrapper}>
                        {/* Phase 1: Product & Category Selection */}
                        {currentPhase === 1 && (
                            <View style={[styles.section, { zIndex: 3000 }]}>
                                <Text style={styles.sectionTitle}>Product & Category Selection</Text>
                                
                                {isFromSubcategorySelection() ? (
                                    // Show pre-selected values as read-only
                                    <>
                                        <View style={[styles.dropdownContainer, { zIndex: 3000 }]}>
                                            <Text style={styles.inputLabel}>Product</Text>
                                            <View style={[styles.dropdown, { backgroundColor: '#f6f6fa', borderColor: '#e6e6e6', opacity: 0.7 }]}>
                                                <Text style={styles.dropdownText}>{preSelectedProduct?.label || 'Product'}</Text>
                                                <Ionicons name="chevron-down" size={20} color="#ccc" />
                                            </View>
                                        </View>
                                        
                                        <View style={[styles.dropdownContainer, { zIndex: 2000 }]}>
                                            <Text style={styles.inputLabel}>Category</Text>
                                            <View style={[styles.dropdown, { backgroundColor: '#f6f6fa', borderColor: '#e6e6e6', opacity: 0.7 }]}>
                                                <Text style={styles.dropdownText}>{preSelectedCategory?.label || 'Category'}</Text>
                                                <Ionicons name="chevron-down" size={20} color="#ccc" />
                                            </View>
                                        </View>
                                        
                                        <View style={[styles.dropdownContainer, { zIndex: 1000 }]}>
                                            <Text style={styles.inputLabel}>Subcategory</Text>
                                            <View style={[styles.dropdown, { backgroundColor: '#f6f6fa', borderColor: '#e6e6e6', opacity: 0.7 }]}>
                                                <Text style={styles.dropdownText}>{preSelectedSubcategory?.label || 'Subcategory'}</Text>
                                                <Ionicons name="chevron-down" size={20} color="#ccc" />
                                            </View>
                                        </View>
                                    </>
                                ) : (
                                    // Normal dropdown selection
                                    <>
                                        {renderDropdown(
                                            'Product',
                                            selectedProduct?.value,
                                            [{ value: '', label: 'Select a product' }, ...products],
                                            handleProductSelect,
                                            true,
                                            3000
                                        )}
                                        
                                        {renderDropdown(
                                            'Category',
                                            selectedCategory?.value,
                                            [
                                                { 
                                                    value: '', 
                                                    label: !selectedProduct 
                                                        ? 'Please select a product first'
                                                        : filteredCategories.length === 0
                                                        ? 'No categories available'
                                                        : 'Select a category'
                                                },
                                                ...filteredCategories
                                            ],
                                            handleCategorySelect,
                                            true,
                                            2000
                                        )}

                                        {renderDropdown(
                                            'Subcategory',
                                            selectedSubcategory?.value,
                                            [
                                                { 
                                                    value: '', 
                                                    label: !selectedCategory 
                                                        ? 'Please select a category first'
                                                        : subcategories.length === 0
                                                        ? 'No subcategories available'
                                                        : 'Select a subcategory'
                                                },
                                                ...subcategories
                                            ],
                                            handleSubcategorySelect,
                                            true,
                                            1000
                                        )}
                                    </>
                                )}
                            </View>
                        )}

                        {/* Phase 2: Dynamic Fields */}
                        {currentPhase === 2 && dynamicFields.length > 0 && !isLoadingFields && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Lead Information</Text>
                                
                                {/* Show selected subcategory */}
                                <View style={styles.subcategoryDisplay}>
                                    <Text style={styles.subcategoryLabel}>Selected Product:</Text>
                                    <Text style={styles.subcategoryValue}>
                                        {selectedSubcategory?.label || preSelectedSubcategory?.label || 'No subcategory selected'}
                                    </Text>
                                </View>
                                
                                {dynamicFields.map(renderDynamicField)}
                            </View>
                        )}
                        
                        {/* Save Button */}
                        <TouchableOpacity 
                            style={[
                                styles.saveButton,
                                (
                                    (currentPhase === 1 && !isPhase1Valid() && !isFromSubcategorySelection()) ||
                                    (currentPhase === 2 && !isPhase3Valid()) ||
                                    isSaving
                                ) && styles.disabledButton
                            ]}
                            disabled={
                                (currentPhase === 1 && !isPhase1Valid() && !isFromSubcategorySelection()) ||
                                (currentPhase === 2 && !isPhase3Valid()) ||
                                isSaving
                            }
                            activeOpacity={0.8}
                            onPress={currentPhase === 2 ? saveLead : handleNextPhase}
                        >
                            {isSaving ? (
                                <View style={styles.savingContainer}>
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                    <Text style={[styles.saveButtonText, { marginLeft: 10 }]}>Saving...</Text>
                                </View>
                            ) : (
                                <Text style={styles.saveButtonText}>
                                    {currentPhase === 2 ? 'Save lead' : 'Next'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <CustomAlertModal
                isVisible={alertConfig.isVisible}
                onClose={hideAlert}
                title={alertConfig.title}
                message={alertConfig.message}
                icon={alertConfig.icon}
                iconColor={alertConfig.iconColor}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    gradientHeader: {
        paddingBottom: 6,
        paddingTop: 20,
        paddingHorizontal: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        overflow: 'hidden',
        position: 'relative',
        minHeight: 110,
        justifyContent: 'flex-end',
    },
    headerBgImage: {
        position: 'absolute',
        top: 80,
        left: 0,
        right: 30,
        width: '100%',
        height: 132,
        
        zIndex: 1,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 18,
        zIndex: 2,
    },
    headerTitleWhite: {
        fontSize: 24,
        fontFamily: 'Poppins-SemiBold',
        color: '#fff',
        marginLeft: 8,
    },
    progressBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        marginTop: 20,
        zIndex: 2,
    },
    progressStepWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressCircle: {
        width: 20,
        height: 20,
        borderRadius: 14,
        backgroundColor: '#6d1836',
        
        
    },
    progressCircleActive: {
        width: 25,
        height: 25,
        backgroundColor: '#fff',
        borderColor: '#fff',
    },
    progressLine: {
        width: 100,
        height: 2,
        backgroundColor: '#6d1836',
       
    },
    progressLineActive: {
        backgroundColor: '#fff',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContentContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    contentWrapper: {
        paddingHorizontal: 20,
        paddingTop: 15,
    },
    section: {
        marginBottom: 30,
        position: 'relative',
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Poppins-SemiBold',
        color: '#000000',
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 10,
        fontFamily: 'Poppins-Regular',
    },
    requiredStar: {
        color: '#FF3B30',
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#f6f6fa',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginBottom: 20,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e6e6e6',
        fontFamily: 'Poppins-Regular',
        height: 55,
    },
    dropdownContainer: {
        marginBottom: 20,
        position: 'relative',
    },
    dropdown: {
        backgroundColor: '#f6f6fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e6e6e6',
        height: 55,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    dropdownText: {
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Poppins-Regular',
        flex: 1,
    },
    dropdownList: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e6e6e6',
        maxHeight: 200,
        marginTop: 5,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 9999,
    },
    dropdownItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dropdownItemSelected: {
        backgroundColor: '#f0f0f0',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Poppins-Regular',
    },
    dropdownItemTextSelected: {
        color: '#2a2a2a',
        fontFamily: 'Poppins-SemiBold',
    },
    saveButton: {
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
    },
    disabledButton: {
        backgroundColor: '#cccccc',
        shadowOpacity: 0,
        elevation: 0,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    loadingText: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        marginLeft: 10,
    },
    savingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 15,
    },
    dateText: {
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Poppins-Regular',
    },
    placeholderText: {
        color: '#666666',
    },
    imageUploadButton: {
        backgroundColor: '#f6f6fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e6e6e6',
        overflow: 'hidden',
        marginBottom: 20,
    },
    imagePreviewContainer: {
        width: '100%',
        aspectRatio: 4/3,
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    changeImageButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    changeImageText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    uploadPlaceholder: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f6f6fa',
    },
    uploadText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
        fontFamily: 'Poppins-Regular',
    },
    dropdownActive: {
        borderColor: '#2a2a2a',
    },
    dropdownPlaceholder: {
        color: '#666',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e6e6e6',
      
    },
    fieldContainer: {
        marginBottom: 0,
    },
    textInput: {
        color: '#000000',
    },
    dropdownInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 15,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        width: '100%',
        maxHeight: Dimensions.get('window').height * 0.7,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#000000',
    },
    modalList: {
        maxHeight: Dimensions.get('window').height * 0.5,
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalItemSelected: {
        backgroundColor: '#f8f8f8',
    },
    modalItemText: {
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Poppins-Regular',
    },
         modalItemTextSelected: {
         fontFamily: 'Poppins-SemiBold',
     },
     subcategoryDisplay: {
         backgroundColor: '#f8f8f8',
         borderRadius: 8,
         padding: 15,
         marginBottom: 20,
         borderWidth: 1,
         borderColor: '#e6e6e6',
     },
     subcategoryLabel: {
         fontSize: 14,
         color: '#666666',
         fontFamily: 'Poppins-Regular',
         marginBottom: 5,
     },
     subcategoryValue: {
         fontSize: 16,
         color: '#000000',
         fontFamily: 'Poppins-SemiBold',
     },
});