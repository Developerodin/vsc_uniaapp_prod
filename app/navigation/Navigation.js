import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Fontisto, MaterialIcons } from '@expo/vector-icons';

// Import pages
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
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#EB784E',
        tabBarInactiveTintColor: '#AAAAAA',
        tabBarLabelStyle: { fontSize: 10 },
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#FFFFFF',
          paddingTop: 10,
          paddingBottom: 20,
          height: 80,
          borderTopColor: '#000',
          borderTopWidth: 0,
          width: '100%',
          left: '0%',
          right: '0%',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="home" size={size ?? 24} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="StepTracker"
        component={StepTracker}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="directions-walk" size={size ?? 24} color={color} />
          ),
          headerShown: false,
          tabBarLabel: 'Steps',
        }}
      />
    </Tab.Navigator>
  );
};

// Main Navigation Component
const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Tabs"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      >
        {/* Tab Navigator */}
        <Stack.Screen name="Tabs" component={Tabs} />
        
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
