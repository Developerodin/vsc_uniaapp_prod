import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Fontisto, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'react-native';
import CustomTabBar from '../components/CustomTabBar';

// Import Onboard pages
import Onboarding from '../pages/Onboard/Onboarding';
import Welcome from '../pages/Onboard/Welcome';

// Import Signin pages
import Login from '../pages/Signin/Login';
import Register from '../pages/Signin/Register';
import OtpVerification from '../pages/Signin/OtpVerification';
import ReOtpVerification from '../pages/Signin/ReOtpVerification';
import ForgotPassword from '../pages/Signin/ForgotPassword';
import CompleteProfile from '../pages/Signin/CompleteProfile';
import CompleteKyc from '../pages/Signin/CompleteKyc';
import Kyc from '../pages/Signin/Kyc';
import UpdatePanCard from '../pages/Signin/UpdatePanCard';
import Congratulations from '../pages/Signin/Congratulations';

// Import Profile pages
import Profile from '../pages/Profile/Profile';
import EditProfile from '../pages/Profile/EditProfile';
import BankDetails from '../pages/Profile/BankDetails';
import AddBankAccount from '../pages/Profile/AddBankAccount';
import ChangePassword from '../pages/Profile/ChangePassword';
import ContactSupport from '../pages/Profile/ContactSupport';
import HelpCenter from '../pages/Profile/HelpCenter';
import PrivacyPolicy from '../pages/Profile/PrivacyPolicy';
import ProfileNotifications from '../pages/Profile/ProfileNotifications';
import TermsCondition from '../pages/Profile/Terms&Condition';
import VerifyOtp from '../pages/Profile/VerifyOtp';

// Import Leads pages
import Leads from '../pages/Leads/Leads';
import AddLead from '../pages/Leads/AddLead';
import CustomerProfile from '../pages/Leads/CustomerProfile';

// Import Notifications pages
import Notifications from '../pages/Notifications/Notifications';

// Import Earnings pages
import Earnings from '../pages/Earnings/Earnings';
import WithdrawMoney from '../pages/Earnings/WithdrawMoney';
import TransactionHistory from '../pages/Earnings/TransactionHistory';
import PoliciesSold from '../pages/Earnings/PoliciesSold';
import LeadConverted from '../pages/Earnings/LeadConverted';
import DashboardPolicyDetails from '../pages/Earnings/DashboardPolicyDetails';

// Import Home pages
import Home from '../pages/Home/Home';
import StepTracker from '../pages/StepTracker';
import BankingProducts from '../pages/Home/BankingProducts.jsx';
import PersonalLoan from '../pages/Home/PersonalLoan.jsx';
import PolicyDetails from '../pages/Home/PolicyDetails.jsx';
import InsuranceProducts from '../pages/Home/InsuranceProducts.jsx';
import LoanProducts from '../pages/Home/LoanProducts.jsx';
import TermLifeInsurance from '../pages/Home/TermLifeInsurance.jsx';
import LifeInsurance from '../pages/Home/LifeInsurance.jsx';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator Component
const Tabs = ({ navigation }) => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          title: "HOME",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/icons/House.png')} 
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="leads"
        component={Leads}
        options={{
          title: "LEADS",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/icons/growth.png')} 
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="earning"
        component={Earnings}
        options={{
          title: "EARNING",
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/icons/ruppe.png')} 
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main Navigation Component
const Navigation = ({ isFirstTime, isAuthenticated, setIsFirstTime, setIsAuthenticated }) => {
  // Determine initial route based on app state
  const getInitialRoute = () => {
    if (isFirstTime) {
      return 'Onboarding';
    } else if (isAuthenticated) {
      return 'Tabs';
    } else {
      return 'Welcome';
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={getInitialRoute()}
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      >
        {/* Onboard Screens */}
        <Stack.Screen 
          name="Onboarding" 
          component={Onboarding}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="Welcome" 
          component={Welcome}
          options={{
            headerShown: false,
          }}
        />
        
        {/* Authentication Screens */}
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="Register" 
          component={Register}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="OtpVerification" 
          component={OtpVerification}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="ReOtpVerification" 
          component={ReOtpVerification}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPassword}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="CompleteProfile" 
          component={CompleteProfile}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="CompleteKyc" 
          component={CompleteKyc}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="Kyc" 
          component={Kyc}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="UpdatePanCard" 
          component={UpdatePanCard}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="Congratulations" 
          component={Congratulations}
          options={{
            headerShown: false,
          }}
        />
        
        {/* Profile Screens */}
        <Stack.Screen 
          name="Profile" 
          component={Profile}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="EditProfile" 
          component={EditProfile}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="BankDetails" 
          component={BankDetails}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="AddBankAccount" 
          component={AddBankAccount}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="ChangePassword" 
          component={ChangePassword}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="ContactSupport" 
          component={ContactSupport}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="HelpCenter" 
          component={HelpCenter}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="PrivacyPolicy" 
          component={PrivacyPolicy}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="ProfileNotifications" 
          component={ProfileNotifications}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="TermsConditions" 
          component={TermsCondition}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="VerifyOtp" 
          component={VerifyOtp}
          options={{
            headerShown: false,
          }}
        />
        
        {/* Leads Screens */}
        <Stack.Screen 
          name="Leads" 
          component={Leads}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="AddLead" 
          component={AddLead}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="CustomerProfile" 
          component={CustomerProfile}
          options={{
            headerShown: false,
          }}
        />
        
        {/* Notifications Screens */}
        <Stack.Screen 
          name="Notifications" 
          component={Notifications}
          options={{
            headerShown: false,
          }}
        />
        
        {/* Earnings Screens */}
        <Stack.Screen 
          name="Earnings" 
          component={Earnings}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="WithdrawMoney" 
          component={WithdrawMoney}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="TransactionHistory" 
          component={TransactionHistory}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="PoliciesSold" 
          component={PoliciesSold}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="LeadConverted" 
          component={LeadConverted}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="DashboardPolicyDetails" 
          component={DashboardPolicyDetails}
          options={{
            headerShown: false,
          }}
        />
        
        {/* Main App - Tab Navigator */}
        <Stack.Screen 
          name="Tabs" 
          component={Tabs}
          options={{
            headerShown: false,
          }}
        />
        
        {/* Individual Stack Screens */}
        <Stack.Screen 
          name="Home" 
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        
        {/* Home folder pages */}
        <Stack.Screen 
          name="BankingProducts" 
          component={BankingProducts}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="PersonalLoan" 
          component={PersonalLoan}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="PolicyDetails" 
          component={PolicyDetails}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="InsuranceProducts" 
          component={InsuranceProducts}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="LoanProducts" 
          component={LoanProducts}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="TermLifeInsurance" 
          component={TermLifeInsurance}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen 
          name="LifeInsurance" 
          component={LifeInsurance}
          options={{
            headerShown: false,
          }}
        />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
