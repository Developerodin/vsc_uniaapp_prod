import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StatusBar
} from 'react-native';
import { Base_url } from '../../config/BaseUrl';
import { useAppContext } from '../../context/AppContext';

import { useNavigation } from '@react-navigation/native';
const {height} = Dimensions.get("window");


// const quickActionCards = [
//   {
//     title: 'Withdraw \n Earnings',
//     icon: require('../../assets/icons/Ruppes.png'),
//     onPress: () => {}
//   },
//   {
//     title: 'Payout \n History',
//     icon: require('../../assets/icons/Document.png'),
//     onPress: () => {}
//   },
//   {
//     title: 'Share \n Performance',
//     icon: require('../../assets/icons/Pdf2.png'),
//     onPress: () => {}
//   },
// ]


export default function Earnings() {
  const { profileImageUpdate } = useAppContext();
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState('Week');
  const [showDropdown, setShowDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const [walletData, setWalletData] = useState({
    totalEarnings: 0,
    policiesSold: 0,
    leadsConverted: 0,
    pendingPayout: 0
  });
  const [loadingWallet, setLoadingWallet] = useState(true);
  
  const filterOptions = ['Week', 'Month'];
  
  const handleTransactionHistory = () => {
    navigation.navigate('TransactionHistory');
  };
  const handlePoliciesSold = () => {
    navigation.navigate('leads');
  };
  
  const handleLeadsConverted = () => {
    navigation.navigate('LeadConverted');
  };
  
  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setShowDropdown(false);
  };
  const fetchUserData = async () => {
    try {
        const userDetailsStr = await AsyncStorage.getItem('user details');
        if (userDetailsStr) {
            setUserData(JSON.parse(userDetailsStr));
        }
    } catch (_error) {
        setUserData(null);
    }
};

const fetchWalletData = async () => {
  setLoadingWallet(true);
  try {
    const access_token = await AsyncStorage.getItem('access_token');
    if (!access_token) throw new Error('No access token');
    const response = await axios.get(`${Base_url}wallet`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    console.log("wallet data",response.data)
    if (response.data && response.data.status === 'success' && response.data.data && response.data.data.wallet) {
      setWalletData({
        totalEarnings: response.data.data.wallet.totalEarnings || 0,
        policiesSold: response.data.data.wallet.totalLeadsCreated || 0, // Assuming this is policies sold
        leadsConverted: response.data.data.wallet.totalLeadsClosed || 0,
        pendingPayout: response.data.data.wallet.balance || 0,
      });
    } else {
      setWalletData({ totalEarnings: 0, policiesSold: 0, leadsConverted: 0, pendingPayout: 0 });
    }
  } catch (_error) {
    setWalletData({ totalEarnings: 0, policiesSold: 0, leadsConverted: 0, pendingPayout: 0 });
  }
  setLoadingWallet(false);
};

useEffect(() => {
    fetchUserData();
    fetchWalletData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

// Refetch user data when profile image is updated
useEffect(() => {
  if (profileImageUpdate > 0) {
    fetchUserData();
  }
}, [profileImageUpdate]);

const handleProfile = () => {
    navigation.navigate('Profile');
};

const handleNotificationPress = () => {
    navigation.navigate('Notifications');
};

// Helper to format currency
const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '₹ 0';
  return '₹ ' + amount.toLocaleString('en-IN');
};

  return (
    <View style={styles.viewWrapper}>
     
      <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={{marginBottom:0}}>
       
          {/* Header */}
          <LinearGradient
                colors={['#fe8900', '#970251']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.9, y: 0.7 }}
                style={styles.gradientHeader}
            >
               <View style={styles.headerRow}>
                    <TouchableOpacity onPress={handleProfile}>
                        {userData?.profilePicture ? (
                            <Image
                                source={{ uri: userData.profilePicture }}
                                style={styles.profileCircle}
                                contentFit="cover"
                            />
                        ) : (
                            <View style={styles.profileCircle}>
                                <Text style={styles.profileInitial}>
                                    {userData?.name ? userData.name[0].toUpperCase() : 'P'}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <View style={styles.headerButtons}>
                        <TouchableOpacity onPress={fetchWalletData} style={styles.refreshButton}>
                            <Ionicons name="refresh-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNotificationPress}>
                            <Ionicons name="notifications-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
          <View style={{alignItems: 'center',marginTop: 15}}>
            <Text style={styles.headerTitle}>Dashboard</Text>
          </View>
          
          {/* Main Content Area */}
         
              {/* Top Summary Header */}
              <Text style={styles.summaryTitle}>Top Summary</Text>
              
              {/* Cards Row 1 */}
              <View style={styles.centralBgImage}>
              <Image source={require('../../../assets/images/centerBg.png')} style={{width:493,height:305,marginLeft:-30}} />
              </View>
              <View style={styles.cardsRow}>
                {/* Total Earnings Card */}
                <View style={[styles.card, styles.earningsCard]}>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Total Earnings</Text>
                    <Text style={styles.earningsAmount}>{loadingWallet ? '...' : formatCurrency(walletData.totalEarnings)}</Text>
                  </View>
                  <TouchableOpacity onPress={handleTransactionHistory}>
                    <View style={styles.historyButton}>
                    <Text style={styles.viewHistoryLink}>Transaction</Text>
                    <MaterialIcons name="arrow-forward" size={16} color="#FFF" style={{ marginLeft: 6 }} />
                    </View>
                  </TouchableOpacity>
                </View>
                
                {/* Policies Sold Card */}
                <TouchableOpacity style={[styles.card, styles.policiesCard]} onPress={handlePoliciesSold}>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Policies Sold</Text>
                    <Text style={styles.policiesAmount}>{loadingWallet ? '...' : walletData.policiesSold}</Text>
                  </View>
                </TouchableOpacity>
              </View>
              
              {/* Cards Row 2 */}
              <View style={styles.cardsRow}>
                {/* Leads Converted Card */}
                <TouchableOpacity style={[styles.card, styles.leadsCard]} onPress={handleLeadsConverted}>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Leads Converted</Text>
                    <Text style={styles.leadsAmount}>{loadingWallet ? '...' : walletData.leadsConverted}</Text>
                  </View>
                  <TouchableOpacity onPress={handleLeadsConverted}>
                    <View style={styles.leadsButton}>
                    <Text style={styles.viewHistoryLink}>View</Text>
                    <MaterialIcons name="arrow-forward" size={16} color="#FFF" style={{ marginLeft: 6 }} />
                    </View>
                  </TouchableOpacity>
                </TouchableOpacity>
                
                {/* Pending Payouts Card */}
                <View style={[styles.card, styles.payoutsCard]}>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardLabel}>Pending Payouts</Text>
                    <Text style={styles.payoutsAmount}>{loadingWallet ? '...' : formatCurrency(walletData.pendingPayout)}</Text>
                  </View>
                </View>
              </View>
              </LinearGradient>
              
              
              <View></View>

              {/* <View style={styles.graphContainer}>
                <View style={styles.graphHeader}>
                  <Text style={styles.graphTitle}>Earnings</Text>
                  <TouchableOpacity 
                    style={styles.filterButton}
                    onPress={() => setShowDropdown(true)}
                  >
                    <Text style={styles.filterText}>{selectedFilter}</Text>
                    <Ionicons name="chevron-down" size={20} color="#000" />
                  </TouchableOpacity>
                </View>
                <View style={styles.graphContent}>
                  <Graph timeFilter={selectedFilter} />
                </View>
              </View>
              <View style={{backgroundColor: '#F6F6F6', borderColor: '#E6E6E6', borderRadius: 16, borderWidth: 1, marginBottom: 8, paddingBottom: 8,marginTop: 12,marginHorizontal: 16}}>
              <Text style={[styles.graphTitle,{paddingTop: 16}]}>Quick Actions</Text>
              <View style={styles.quickActionCardsContainer}>
                {quickActionCards.map((card, index) => (
                  <QuickActionCards key={index} {...card} />
                ))}
              </View>
              </View> */}

              {/* Dropdown Modal */}
              <Modal
                transparent={true}
                visible={showDropdown}
                onRequestClose={() => setShowDropdown(false)}
              >
                <TouchableOpacity 
                  style={styles.modalOverlay}
                  onPress={() => setShowDropdown(false)}
                >
                  <View style={styles.dropdownContainer}>
                    {filterOptions.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dropdownItem,
                          selectedFilter === option && styles.selectedDropdownItem
                        ]}
                        onPress={() => handleFilterSelect(option)}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          selectedFilter === option && styles.selectedDropdownItemText
                        ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    marginTop:-12,
    backgroundColor: '#fff'
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    
    
    paddingHorizontal: 10,
    
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
    color: '#fff',
    
    textAlign: 'center',
  },
  centralBgImage:{
    position:"absolute",
    bottom:60
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 20,
  },
  card: {
    width: '48.5%',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 13,
    height:145
    
  },
  cardContent: {
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  earningsCard: {
    backgroundColor: 'rgba(254, 137, 0, 0.2)', 
  },
  policiesCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
  },
  leadsCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
    
  },
  payoutsCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
  },
  earningsAmount: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
    
  },
  viewHistoryLink: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily:"Poppins-SemiBold"
    
  },
  policiesAmount: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    
  },
  leadsAmount: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
   
  },
  payoutsAmount: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    
},
  graphContainer: {
    marginTop: 10,
    marginHorizontal:16
  },
  graphHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
  graphTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    paddingLeft: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 15,
    color: '#000000',
    marginRight: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  graphImage: {
    width: 348,
    height: 206,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    minWidth: 120,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedDropdownItem: {
    backgroundColor: '#FF7115',
  },
  dropdownItemText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#000',
    textAlign: 'center',
  },
  selectedDropdownItemText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
  },
  gradientHeader: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 40,
    position: 'relative',
    overflow: 'visible',
    height:height
},
headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10
},
profileCircle: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
},
profileInitial: {
    fontSize: 19,
    color: '#fff',
    fontFamily: 'Poppins-Medium',
},
historyButton:{
  backgroundColor: 'rgba(255,255,255, 0.3)',
 borderRadius: 24,
 paddingHorizontal: 14,
paddingVertical: 2,
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
marginTop:10
},
leadsButton:{
  backgroundColor: 'rgba(255,255,255, 0.3)',
 borderRadius: 24,
 paddingHorizontal: 5,
paddingVertical: 2,
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
marginTop:10,
width:90
},
quickActionCardsContainer:{
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginHorizontal: 26,
  marginTop: 10,
},
headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
},
refreshButton: {
    marginRight: 15,
},
});