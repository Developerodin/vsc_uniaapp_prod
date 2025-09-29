import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Animated,
  BackHandler,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('../../../assets/images/arrowforward.png'),
    title: 'Track Every Lead, Close Every Deal.',
    subtitle: 'Never miss a follow-up. Monitor leads, update statuses, and convert faster than ever.'
  },
  {
    id: '2',
    image: require('../../../assets/images/arrowforward.png'),
    title: 'Manage Your Pipeline Efficiently',
    subtitle: 'Stay organized with an intuitive dashboard that gives you complete visibility of your sales funnel.'
  },
  {
    id: '3',
    image: require('../../../assets/images/arrowforward.png'),
    title: 'Boost Your Sales Performance',
    subtitle: 'Access powerful analytics and insights to optimize your approach and increase your conversion rates.'
  }
];


export default function Welcome() {
  const [isChecked, setIsChecked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const viewConfig = { viewAreaCoveragePercentThreshold: 50 };
  const navigation = useNavigation();

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };



  // Auto slide functionality
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentIndex < slides.length - 1) {
        flatListRef.current?.scrollToIndex({
          index: currentIndex + 1,
          animated: true,
        });
      } else {
        flatListRef.current?.scrollToIndex({
          index: 0,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentIndex]);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  useEffect(
    React.useCallback(() => {
        const backAction = () => {
            BackHandler.exitApp();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, [])
);

  const renderSlide = ({ item }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.arrowContainer}>
          <Image 
            source={item.image} 
            style={styles.arrowImage1}
            contentFit="contain"
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>
            {item.subtitle}
          </Text>
        </View>
      </View>
    );
  };

  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 30, 10],
            extrapolate: 'clamp',
          });
          
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });
          
          return (
            <Animated.View 
              key={index} 
              style={[
                styles.paginationDot, 
                { 
                  width: dotWidth,
                  opacity: opacity,
                  backgroundColor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.4)'
                }
              ]} 
            />
          );
        })}
      </View>
    );
  };

  return (
    <LinearGradient
    colors={['#fe8900', '#970251']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
      style={styles.container}
      
    >
      <SafeAreaView style={[styles.safeArea]}>
       
        <View style={styles.header}>
          {/* <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
          <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity> */}
        </View>

        <View style={styles.content}>
          <FlatList
            ref={flatListRef}
            data={slides}
            renderItem={renderSlide}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            scrollEventThrottle={32}
          />
          
          <Pagination />
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
          

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Continue to Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.termsContainer}>
            <TouchableOpacity 
              style={styles.checkbox} 
              onPress={toggleCheckbox}
            >
              {isChecked ? (
                <View style={styles.checkedBox}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              ) : (
                <View style={styles.uncheckedBox} />
              )}
            </TouchableOpacity>
            <Text style={styles.termsText}>
              I agree with the <Text style={styles.termsLink} onPress={() => navigation.navigate('TermsConditions')}>Terms & Conditions</Text>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    paddingHorizontal: 20,
  },
  backButton: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  arrowContainer: {
    width: 220,
    height: 220,
    position: 'relative',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowImage1: {
    width: 220,
    height: 220,
    position: 'absolute',
  },
  textContainer: {
    alignItems: 'flex-start',
    marginBottom: 30,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'left',
    lineHeight: 26,
    fontFamily: 'Poppins-Regular'
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  paginationDot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 5,
  },
  bottomContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  registerButton: {
    flex: 1,
    height: 60,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#333',
  },
  registerButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  loginButton: {
    flex: 1,
    height: 60,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#333',
  },
  loginButtonText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Poppins-Bold'
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:50
  },
  checkbox: {
    marginRight: 10,
  },
  uncheckedBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 4,
  },
  checkedBox: {
    width: 24,
    height: 24,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'Poppins-Regular'
  },
  termsLink: {
    color: '#3498db',
    textDecorationLine: 'underline',
    fontFamily: 'Poppins-Regular'
  },
});