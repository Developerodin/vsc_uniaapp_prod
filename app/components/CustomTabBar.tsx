import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemeData } from "../theme/Theme";

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const translateX = useRef(new Animated.Value(0)).current; 
  const [tabWidth, setTabWidth] = useState(0);
  
  const onLayout = (event: any) => {
    const {width} = event.nativeEvent.layout;
    const calculatedTabWidth = width / 3;
    setTabWidth(calculatedTabWidth);
    console.log("Container width:", width, "Tab width:", calculatedTabWidth);
  };

  useEffect(() => {
    const activeTabIndex = state.index;
    Animated.timing(translateX, {
      toValue: activeTabIndex,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [state.index, translateX]);

  return (
    <View 
      style={[styles.tabBarContainer, {
        backgroundColor: ThemeData.backgroundColor,
        borderRadius: 33,
        width: '90%',
        marginHorizontal: '5%',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 10,
        height: 75
      }]}
      onLayout={onLayout}
    >
      <View style={styles.absoluteFill}>
        <Animated.View 
          style={[
            styles.activeBackground,
            {
              transform: [{ 
                translateX: translateX.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: tabWidth > 0 
                    ? [tabWidth/2 - 52.5, tabWidth*1.5 - 52.5, tabWidth*2.5 - 52.5]
                    : [20, 135, 252],
                }) 
              }]
            }
          ]} 
        />
      </View>
      
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || route.name;
        const icon = options.tabBarIcon;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            style={styles.tabButton}
          >
            {icon && icon({ 
              focused: isFocused,
              color: isFocused ? "#fff" : "#BCBEC1", 
              size: 24 
            })}
            <Text style={{ 
              fontSize: 10, 
              color: isFocused ? "#fff" : "#BCBEC1",
              marginTop: 4,
              fontFamily: 'Poppins-Regular'
            }}>
              {typeof label === 'string' ? label : route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  activeBackground: {
    width: 105,
    height: 55,
    backgroundColor: '#292B2F',
    borderRadius: 27.5,
    position: 'absolute',
    left: 0,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    zIndex: 1,
    height: 55,
  }
});
