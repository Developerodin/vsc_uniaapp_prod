import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Dimensions,
  FlatList,
  Image as RNImage,
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
    image: require('../../../assets/images/onboard1.png'),
    title: 'Sell Smarter,\nEarn Faster',
    subtitle: 'Manage insurance & banking\nproducts with ease.\nGet instant access to leads, payouts &\nproduct tools — right in your pocket.',
  },
  {
    id: '2',
    image: require('../../../assets/images/onboard2.png'),
    title: 'Track Every Lead,\nClose Every Deal',
    subtitle: 'Never miss a follow-up.\nMonitor leads, update status, and\nconvert faster than ever.',
  },
  {
    id: '3',
    image: require('../../../assets/images/onboard3.png'),
    title: 'Earn More with\nEvery Policy',
    subtitle: 'Transparent commissions, instant\npayouts, and bonus rewards.\nThe more you sell, the more you grow.',
  },
  {
    id: '4',
    image: require('../../../assets/images/onboard4.png'),
    title: 'Your Growth.\nOur Platform.',
    subtitle: 'From onboarding to earnings,\nVSC ONE gives you the tools to scale\nyour success.',
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();
  const navigation = useNavigation();
  
  const handleNext = () => {
    console.log('=== handleNext called ===');
    console.log('Button pressed - Current Index:', currentIndex);
    
    if (currentIndex < slides.length - 1) {
      try {
        flatListRef.current?.scrollToIndex({
          index: currentIndex + 1,
          animated: true,
        });
        console.log('ScrollToIndex called successfully');
      } catch (error) {
        console.error('Error scrolling to next slide:', error);
      }
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = async () => {
    console.log('=== handleGetStarted called ===');
    try {
      // Mark that user has seen onboarding
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      navigation.navigate('Welcome');
      console.log('Navigation to Welcome successful');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleSkip = async () => {
    console.log('=== handleSkip called ===');
    try {
      // Mark that user has seen onboarding
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      navigation.navigate('Welcome');
      console.log('Skip navigation successful');
    } catch (error) {
      console.error('Skip navigation error:', error);
    }
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item, index }) => {
    const isLastSlide = index === slides.length - 1;

    return (
      <View style={styles.slide}>
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>

          <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.image} contentFit="contain" />
          </View>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#fe8900', '#970251']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0.9 }}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="auto" />

        {/* Background image - positioned behind everything */}
        <RNImage
          source={require('../../../assets/images/BottomBg.png')}
          style={styles.bottomBgImage}
          resizeMode="contain"
          pointerEvents="none"
        />

        {/* Navigation header area */}
        <View style={styles.headerContainer}>
          {/* Back button (appears after first slide) */}
          {currentIndex > 0 ? (
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => {
                console.log('=== Back button pressed ===');
                try {
                  flatListRef.current?.scrollToIndex({
                    index: currentIndex - 1,
                    animated: true,
                  });
                  console.log('Back scroll successful');
                } catch (error) {
                  console.error('Back scroll error:', error);
                }
              }}
              activeOpacity={0.7}
            >
              <Ionicons style={styles.backButtonText} name="chevron-back" size={22} color="white" />
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholderButton} />
          )}

          {/* Pagination indicators */}
          <View style={styles.paginationContainer}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  { backgroundColor: index === currentIndex ? '#fff' : '#000' ,width: index === currentIndex ? 30 : 10,height: index === currentIndex ? 10 : 10},
                ]}
              />
            ))}
          </View>

          {/* Skip button */}
          {currentIndex < slides.length - 1 ? (
            <TouchableOpacity 
              style={styles.skipButton} 
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>SKIP</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholderButton} />
          )}
        </View>

        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={handleScroll}
          style={styles.flatList}
        />

        {/* Button positioned absolutely outside FlatList */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={currentIndex === slides.length - 1 ? handleGetStarted : handleNext}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPressIn={() => {
              console.log('=== Button Press In ===');
              console.log('Button pressed for slide:', currentIndex + 1);
              console.log('Is last slide:', currentIndex === slides.length - 1);
            }}
            onPressOut={() => {
              console.log('=== Button Press Out ===');
              console.log('Button released for slide:', currentIndex + 1);
            }}
            onLongPress={() => {
              console.log('=== Button Long Press ===');
              console.log('Long press detected for slide:', currentIndex + 1);
            }}
          >
            <Text style={styles.buttonText}>
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 20,
    zIndex: 10 
  },
  slide: {
    width,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    zIndex: 2
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 60,
  },
  image: {
    width: width * 0.5,
    height: width * 0.5,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 36,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 40,
    zIndex: 50,
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    zIndex: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    alignItems: 'flex-end',
  },
  skipText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
  backButton: {
    alignItems: 'flex-start',
    height: 40,
    width: 40,
    justifyContent:"center"
  },
  backButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  placeholderButton: {
    width: 40,
    height: 40,
  },
  bottomBgImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: width * 1,
    height: 619,
    zIndex: 1,
    pointerEvents: 'none',
  },
  flatList: {
    flex: 1,
  },
});