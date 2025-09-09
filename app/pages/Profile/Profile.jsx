import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image as RNImage,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform
} from 'react-native';
import { Base_url } from '../../config/BaseUrl';


import { useNavigation } from '@react-navigation/native';
const {width,height} = Dimensions.get("window");


export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  }

  const handleMenuItemPress = (route) => {
    if (route) {
      navigation.navigate(route);
    } else {
      console.log('Navigation route not defined');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Welcome');
  }

  // Function to get user initials
  const getUserInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Fetch user data from backend (similar to EditProfile approach)
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userDetailsStr = await AsyncStorage.getItem('user details');
      const accessToken = await AsyncStorage.getItem('access_token');
      
      if (userDetailsStr && accessToken) {
        const userDetails = JSON.parse(userDetailsStr);
        setUserId(userDetails.id);
        setAccessToken(accessToken);
        
        // Fetch latest user profile data from the API
        const response = await axios.get(`${Base_url}users/${userDetails.id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (response.data) {
          setUserData(response.data);
        }
      } else {
        console.log('No user details or access token found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to AsyncStorage data
      try {
        const storedUserData = await AsyncStorage.getItem('user details');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      } catch (storageError) {
        console.error('Error loading stored user data:', storageError);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <View style={styles.viewWrapper}>
      <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Revamped Header with Gradient, Background Image, and Profile Card inside */}
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
            <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitleWhite}>My Account</Text>
            <View style={{width: 28}} />
          </View>
          {/* Profile Card inside header */}
          <View style={styles.profileCardInHeaderWrapper}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0085FF" />
                <Text style={styles.loadingText}>Loading profile...</Text>
              </View>
            ) : (
              <View style={styles.profileCardInHeader}>
                <View style={styles.avatarContainerFloating}>
                  {userData?.profilePicture ? (
                    <Image 
                      source={{ uri: userData.profilePicture }} 
                      style={styles.profileImageFloating}
                      contentFit="cover"
                    />
                  ) : (
                    <Text style={styles.avatarTextFloating}>
                      {getUserInitials(userData?.name || userData?.firstName || 'User')}
                    </Text>
                  )}
                </View>
                <View style={styles.nameContainerFloating}>
                  <Text style={styles.profileNameFloating}>
                    {userData?.name || 
                      (userData?.firstName && userData?.lastName 
                        ? `${userData.firstName} ${userData.lastName}` 
                        : userData?.firstName || 
                          userData?.email?.split('@')[0] || 
                          'User')}
                  </Text>
                  <Ionicons name="checkmark-circle" size={18} color="#fff" style={styles.verifiedIconFloating} />
                </View>
              </View>
            )}
          </View>
        </LinearGradient>
        
        {/* Main Content Area */}
       
          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {/* Section 1 */}
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('EditProfile')}>
              <View style={styles.menuIconContainer}>
              <Ionicons name="person-outline" size={18} color="#000" style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>Edit Profile</Text>
             
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('BankDetails')}>
              <View style={styles.menuIconContainer}>
              <Ionicons name="card-outline" size={18} color="#000" style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>Bank Details</Text>
             
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('Kyc')}>
              <View style={styles.menuIconContainer}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#000" style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>KYC</Text>
              
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('TransactionHistory')}>
              <View style={styles.menuIconContainer}>
              <Ionicons name="receipt-outline" size={18} color="#000" style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>Transaction History</Text>
              
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('ChangePassword')}>
              <View style={styles.menuIconContainer}>
              <Ionicons name="lock-closed-outline" size={18} color="#000" style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>Change Password</Text>
              
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Section 2 */}
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('ProfileNotifications')}>
              <View style={styles.menuIconContainer}>
              <Ionicons name="notifications-outline" size={18} color="#000" style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>Notifications</Text>
              
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Section 3 */}
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('TermsConditions')}>
              <View style={styles.menuIconContainer}>
              <Ionicons name="document-text-outline" size={18} color="#000" style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>Terms & Conditions</Text>
              
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('PrivacyPolicy')}>
              <View style={styles.menuIconContainer}>
              <Ionicons name="shield-outline" size={18} color="#000" style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>Privacy Policy</Text>
              
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('HelpCenter')}>
              <View style={styles.menuIconContainer}>
              <Ionicons name="help-circle-outline" size={18} color="#000" style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>FAQs / Help center</Text>
              
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress('ContactSupport')}>
              <View style={styles.menuIconContainer}>
              <Ionicons name="headset-outline" size={18} color="#000" style={styles.menuIcon} />
              </View>
              <Text style={styles.menuText}>Contact Support</Text>
              
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Log Out */}
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <View style={styles.menuIconContainer}>
              <Ionicons name="log-out-outline" size={19} color="#FF0000" style={styles.menuIcon} />
              </View>
              <Text style={styles.logoutText}>Log Out</Text>
              
            </TouchableOpacity>
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
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  gradientHeader: {
    paddingBottom: 30,
    paddingTop: 0,
    paddingHorizontal: 0,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 180,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    zIndex: 1,
  },
  headerBgImage: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 20,
    width: '100%',
    height: 120,
    zIndex: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    marginTop: 20,
  
    position: 'relative',
    height: 56,
    
   
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 16,
    zIndex: 3,
  },
  headerTitleWhite: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginLeft:50
  },
  contentContainer: {
    flex: 1,

  },
  profileCardInHeaderWrapper: {
    position:"absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  profileCardInHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 18,
    minWidth: 220,
    maxWidth: 340,
    zIndex: 2,
  },
  avatarContainerFloating: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  profileImageFloating: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarTextFloating: {
    color: '#BD3334',
    fontSize: 20,
   
    fontFamily: 'Poppins-SemiBold',
  },
  nameContainerFloating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileNameFloating: {
    fontSize: 18,
    color: '#fff',
    marginRight: 5,
    fontFamily: 'Poppins-Medium',
  },
  verifiedIconFloating: {
    marginLeft: 5,
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 30,
    paddingBottom: 80,
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
   
  },
  menuText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Poppins-SemiBold',
  },
  logoutText: {
    fontSize: 18,
    color: '#FF0000',
    fontFamily: 'Poppins-SemiBold',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Poppins-Regular',
  },
  menuIcon: {
    marginRight: 0,
  },
  chevronIcon: {
    marginLeft: 'auto',
  },
});