import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Fontisto, MaterialIcons } from '@expo/vector-icons';

// Import pages
import Home from '../pages/Home';
import GroupClasses from '../pages/GroupClasses';
import PersonalClasses from '../pages/PersonalClasses';
import StepTracker from '../pages/StepTracker';

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
        
       
        
        <Stack.Screen 
          name="StepTracker" 
          component={StepTracker}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
