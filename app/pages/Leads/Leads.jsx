import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Modal from 'react-native-modal';
import CustomAlertModal from '../../components/CustomAlertModal';
import LeadCard from '../../components/LeadCard/LeadCard';
import { Base_url } from '../../config/BaseUrl';

import { useNavigation } from '@react-navigation/native';
// Dropdown component for filter modal
const FilterDropdown = ({ label, value, options, onSelect, required = false, zIndex = 1000 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  const handleClose = () => setIsOpen(false);
  const handleSelect = (selectedValue) => {
    onSelect(selectedValue);
    handleClose();
  };

  return (
    <View style={[styles.filterDropdownContainer, { zIndex }]}>
      <Text style={styles.filterLabel}>
        {label}
        {required && <Text style={styles.requiredStar}>*</Text>}
      </Text>
      <TouchableOpacity
        style={[styles.filterDropdown, isOpen && styles.filterDropdownActive]}
        onPress={() => setIsOpen(true)}
      >
        <Text style={[styles.filterDropdownText, !selectedOption && styles.placeholderText]}>
          {selectedOption ? selectedOption.label : `Select ${label.toLowerCase()}`}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#666666" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="none"
        onRequestClose={handleClose}
        style={styles.dropdownModal}
      >
        <TouchableOpacity 
          style={styles.dropdownModalOverlay}
          activeOpacity={1} 
          onPress={handleClose}
        >
          <View style={styles.dropdownModalContent}>
            <View style={styles.dropdownModalHeader}>
              <Text style={styles.dropdownModalTitle}>{`Select ${label}`}</Text>
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
                    styles.dropdownModalItem,
                    value === item.value && styles.dropdownModalItemSelected
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={[
                    styles.dropdownModalItemText,
                    value === item.value && styles.dropdownModalItemTextSelected
                  ]}>
                    {item.label}
                  </Text>
                  {value === item.value && (
                    <Ionicons name="checkmark" size={20} color="#2a2a2a" />
                  )}
                </TouchableOpacity>
              )}
              style={styles.dropdownModalList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default function Leads() {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('All');
  const [leadsData, setLeadsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  // Filter modal states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  // const [filterLoading, setFilterLoading] = useState(false);

  // Fetch leads data from API
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const userDetailsStr = await AsyncStorage.getItem('user details');
      const accessToken = await AsyncStorage.getItem('access_token');
      console.log("accessToken",accessToken);
      
      if (userDetailsStr && accessToken) {
        const userDetails = JSON.parse(userDetailsStr);
        
        const response = await axios.get(`${Base_url}leads/user/${userDetails.id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (response.data && response.data.results) {
          console.log("response.data.results",response.data.results);
          // Transform API response to match LeadCard format
          const transformedLeads = response.data.results.map((lead) => {
            // Check for various possible name fields
            const nameFields = [
              'Full Name', 'Owner Name', 'Traveler Name', 'Applicant Name',
              'Business Name', 'Student Name', 'Project Name', 'Entity Name',
              'Client Name', 'Startup Name', 'Company Name'
            ];
            
            const name = nameFields.reduce((found, field) => {
              return found || lead.fieldsData?.[field];
            }, null) || 'Unknown';

            return {
              id: lead.id || lead._id,
              name: name,
              category: lead.category?.name || 'Unknown Category',
              status: mapStatus(lead.status),
              followUpDate: formatDate(lead.updatedAt),
              createdDate: formatDate(lead.createdAt),
              originalStatus: lead.status 
            };
          });
          
          setLeadsData(transformedLeads);
        }
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeadsData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Map API status to display status
  const mapStatus = (status) => {
    const statusMap = {
      'new': 'Interested',
      'contacted': 'Follow-up',
      'interested': 'Interested',
      'followUp': 'Follow-up',
      'qualified': 'Interested',
      'proposal': 'Follow-up',
      'negotiation': 'Follow-up',
      'closed': 'Converted',
      'lost': 'Closed'
    };
    return statusMap[status] || 'Interested';
  };

  // Format date to display format
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // Fetch leads once on mount (avoid re-running on every render)
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Fetch products for filter
  const fetchProducts = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await axios.get(`${Base_url}products`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const productOptions = response.data.results.map((product) => ({
        value: product.id || product._id,
        label: product.name || product.title || 'Unnamed Product',
        id: product.id || product._id,
        type: product.type,
        categories: product.categories || []
      }));
      
      setProducts(productOptions);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch categories for filter
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

  // Filter leads by category
  const fetchLeadsByCategory = async (categoryId) => {
    try {
      setLoading(true);
      const userDetailsStr = await AsyncStorage.getItem('user details');
      const accessToken = await AsyncStorage.getItem('access_token');
      
      if (userDetailsStr && accessToken) {
        const userDetails = JSON.parse(userDetailsStr);
        
        const response = await axios.get(`${Base_url}leads/user/${userDetails.id}?category=${categoryId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (response.data && response.data.results) {
          const transformedLeads = response.data.results.map((lead) => {
            const nameFields = [
              'Full Name', 'Owner Name', 'Traveler Name', 'Applicant Name',
              'Business Name', 'Student Name', 'Project Name', 'Entity Name',
              'Client Name', 'Startup Name', 'Company Name'
            ];
            
            const name = nameFields.reduce((found, field) => {
              return found || lead.fieldsData?.[field];
            }, null) || 'Unknown';

            return {
              id: lead.id || lead._id,
              name: name,
              category: lead.category?.name || 'Unknown Category',
              status: mapStatus(lead.status),
              followUpDate: formatDate(lead.updatedAt),
              createdDate: formatDate(lead.createdAt),
              originalStatus: lead.status 
            };
          });
          
          setLeadsData(transformedLeads);
        }
      }
    } catch (error) {
      console.error('Error fetching filtered leads:', error);
      setLeadsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter modal
  const handleFilterPress = () => {
    setShowFilterModal(true);
    fetchProducts();
    fetchCategories();
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSelectedCategory(null);
    
    // Filter categories based on selected product
    if (product && categories.length > 0) {
      const filtered = categories.filter(category => 
        product.categories.includes(category.value)
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([]);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const applyFilter = () => {
    if (selectedCategory) {
      fetchLeadsByCategory(selectedCategory.value);
      setActiveFilter(selectedCategory.label);
      setIsFilterApplied(true);
    }
    setShowFilterModal(false);
  };

  const clearFilter = () => {
    setSelectedProduct(null);
    setSelectedCategory(null);
    setFilteredCategories([]);
    fetchLeads(); // Fetch all leads
    setActiveFilter('All');
    setIsFilterApplied(false);
    setShowFilterModal(false);
  };

  const handleFilterReset = () => {
    clearFilter();
  };

  const handleAddLead = async () => {
    try {
      const userDetailsStr = await AsyncStorage.getItem('user details');
      const accessToken = await AsyncStorage.getItem('access_token');
      
      if (userDetailsStr && accessToken) {
        const userDetails = JSON.parse(userDetailsStr);
        
        // Fetch latest user profile data from the API
        const response = await axios.get(`${Base_url}users/${userDetails.id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (response.data) {
          // Check if user is verified
          if (response.data.kycStatus === "pending") {
            navigation.navigate('AddLead');
          } else {
            setShowAlert(true);
          }
        }
      }
    } catch (error) {
      console.error('Error checking user verification:', error);
      setShowAlert(true);
    }
  };
  
  // Filter options
  const filters = ['All', 'Follow-up Today', 'Interested', 'Converted', 'Closed'];
  
  // Filter colors (commented out as not currently used)
  // const getFilterColor = (filter) => {
  //   switch(filter) {
  //     case 'All': return '#000000';
  //     case 'Follow-up Today': return '#FFAE00';
  //     case 'Interested': return '#0095FE';
  //     case 'Converted': return '#00BC64';
  //     case 'Closed': return '#FF0000';
  //     default: return '#000000';
  //   }
  // };

  const getFilteredLeads = () => {
    switch(activeFilter) {
      case 'All':
        return leadsData;
      case 'Follow-up Today':
        return leadsData.filter(lead => lead.status === 'Follow-up');
      case 'Interested':
        return leadsData.filter(lead => lead.status === 'Interested');
      case 'Converted':
        return leadsData.filter(lead => lead.status === 'Converted');
      case 'Closed':
        return leadsData.filter(lead => lead.status === 'Closed');
      default:
        return leadsData;
    }
  };

  if (loading) {
    return (
      <View style={styles.viewWrapper}>
        
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            {/* <View style={styles.header}>
              <Text style={styles.headerTitle}>Leads</Text>
              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="funnel-outline" size={20} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton} onPress={handleAddLead}>
                  <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View> */}
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF7115" />
              <Text style={styles.loadingText}>Loading leads...</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.viewWrapper}>
      <SafeAreaView style={styles.safeArea}>
        {/* Revamped Header + Filter Section */}
        <LinearGradient
          colors={['#fe8900', '#970251']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.9 }}
          style={styles.gradientHeader}
        >
          <Image
            source={require('../../../assets/images/CenterBg2.png')}
            style={styles.headerBgImage}
          />
          <View style={styles.headerContent}>
            <Text style={styles.headerTitleRevamp}>Leads</Text>
            <View style={styles.headerRightRevamp}>
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={isFilterApplied ? handleFilterReset : handleFilterPress}
              >
                <Ionicons 
                  name={isFilterApplied ? "refresh-outline" : "funnel-outline"} 
                  size={24} 
                  color="#fff" 
                />
              </TouchableOpacity>
              <TouchableOpacity  onPress={handleAddLead}>
                <Ionicons name="add" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainerRevamp}
          >
            {filters.map((filter, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.filterButtonRevamp,
                  activeFilter === filter ? styles.activeFilterRevamp : null
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterTextRevamp,
                    activeFilter === filter ? styles.activeFilterTextRevamp : null
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </LinearGradient>
        {/* Main Content Area */}
        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <View style={{ marginBottom: 100 }}>
            {getFilteredLeads().length > 0 ? (
              <View style={styles.cardsContainer}>
                {getFilteredLeads().map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Image
                  source={require('../../../assets/images/EmptyLead.png')}
                  style={styles.emptyStateImage}
                  resizeMode="contain"
                />
                <Text style={styles.emptyStateTitle}>
                  No Leads Yet. Start growing your business by adding your first lead.
                </Text>
                <TouchableOpacity style={styles.addLeadButton} onPress={handleAddLead}>
                  <Text style={styles.addLeadButtonText}>+ Add a lead</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
      <CustomAlertModal
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
        title="Verification Required"
        message="Please complete your KYC verification before adding leads."
        icon="alert-circle"
        iconColor="#FF3B30"
        buttonText="OK"
        buttonColor="#000"
      />

      {/* Filter Modal */}
      <Modal
        isVisible={showFilterModal}
        onBackdropPress={() => setShowFilterModal(false)}
        onBackButtonPress={() => setShowFilterModal(false)}
        style={styles.modal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Leads</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Product Selection */}
            <FilterDropdown
              label="Product"
              value={selectedProduct?.value}
              options={products}
              onSelect={(value) => {
                const product = products.find(p => p.value === value);
                handleProductSelect(product);
              }}
              required={true}
              
            />

            {/* Category Selection */}
            <FilterDropdown
              label="Category"
              value={selectedCategory?.value}
              options={selectedProduct ? filteredCategories : []}
              onSelect={(value) => {
                const category = filteredCategories.find(c => c.value === value);
                handleCategorySelect(category);
              }}
              required={true}
              zIndex={2000}
            />
            
            {!selectedProduct && (
              <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>Please select a product first to see categories</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilter}>
              <Text style={styles.clearButtonText}>Clear Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.applyButton, !selectedCategory && styles.disabledButton]} 
              onPress={applyFilter}
              disabled={!selectedCategory}
            >
              <Text style={styles.applyButtonText}>Apply Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 15,
    padding: 5,
  },
  addButton: {
    backgroundColor: '#FF7115',
    width: 43,
    height: 43,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersWrapper: {
    paddingBottom: 10,
    
  },
  filtersContainer: {
    marginTop: 2,
    
    gap: 10,
  },
  filterButton: {
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    backgroundColor: '#FFFFFF',
  },
  activeFilter: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  filterText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  activeFilterText: {
    color: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    marginTop: -30,
  },
  cardsContainer: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
    
  },
  emptyStateImage: {
    width: 157,
    height: 178,
    marginBottom: 30,
    
  },
  emptyStateTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#000',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
    
  },
  addLeadButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    marginTop: 20,
    
    
  },
  addLeadButtonText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginTop: 10,
  },
  gradientHeader: {
    paddingBottom: 30,
    paddingTop: Platform.OS === 'ios' ? 40 : 40,
    paddingHorizontal: 0,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 200,
  },
  headerBgImage: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 20,
    width: '100%',
    height: 132,
    zIndex: 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 2,
  },
  headerTitleRevamp: {
    fontSize: 32,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  headerRightRevamp: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonRevamp: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#fff',
  },
  filtersContainerRevamp: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 0,
    zIndex: 2,
    marginBottom: 0,
    marginTop: 0,
    gap: 10,
    
    height:80
  },
  filterButtonRevamp: {
    paddingHorizontal: 22,
    paddingVertical: 6,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilterRevamp: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  filterTextRevamp: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  activeFilterTextRevamp: {
    color: '#BD3334',
    fontFamily: 'Poppins-Regular',
  },
  // Filter Modal Styles
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 25,
  },
  filterLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
    marginBottom: 12,
  },
  filterList: {
    maxHeight: 200,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f6f6fa',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  filterItemSelected: {
    backgroundColor: '#e8f4fd',
    borderColor: '#2a2a2a',
  },
  filterItemText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
    flex: 1,
  },
  filterItemTextSelected: {
    fontFamily: 'Poppins-SemiBold',
    color: '#2a2a2a',
  },
  placeholderContainer: {
    padding: 20,
    backgroundColor: '#f6f6fa',
    borderRadius: 8,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e6e6e6',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#666666',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  // Filter Dropdown Styles
  filterDropdownContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  filterDropdown: {
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
  filterDropdownActive: {
    borderColor: '#2a2a2a',
  },
  filterDropdownText: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  requiredStar: {
    color: '#FF3B30',
    marginLeft: 4,
  },
  // Dropdown Modal Styles
  dropdownModal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  dropdownModalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  dropdownModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  dropdownModalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
  },
  dropdownModalList: {
    maxHeight: 300,
  },
  dropdownModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownModalItemSelected: {
    backgroundColor: '#f8f8f8',
  },
  dropdownModalItemText: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  dropdownModalItemTextSelected: {
    fontFamily: 'Poppins-SemiBold',
    color: '#2a2a2a',
  },
});

