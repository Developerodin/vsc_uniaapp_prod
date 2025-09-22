import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import ProductsCardUI1 from "../../components/Cards/ProductsCardUI1.jsx";
import ProductsCardUI2 from "../../components/Cards/ProductsCardUI2.jsx";
import FeaturedProductCard from "../../components/FeaturedProductCard/FeaturedProductCard.jsx";
import LoginPromptModal from "../../components/Models/LoginPromptModal.jsx";

const { width, height } = Dimensions.get("window");

// Static demo data
const demoProducts = [
  {
    id: 1,
    name: "Life Insurance",
    categories: ["Life", "Health"],
    icon: require("../../../assets/icons/Life.png"),
  },
  {
    id: 2,
    name: "Health Insurance",
    categories: ["Health", "Medical"],
    icon: require("../../../assets/icons/Health.png"),
  },
  {
    id: 3,
    name: "Motor Insurance",
    categories: ["Motor", "Vehicle"],
    icon: require("../../../assets/icons/Motor.png"),
  },
  {
    id: 4,
    name: "Property Insurance",
    categories: ["Property", "Home"],
    icon: require("../../../assets/icons/Property.png"),
  },
  {
    id: 5,
    name: "Personal Loan",
    categories: ["Loan", "Personal"],
    icon: require("../../../assets/icons/Personal_Loan.png"),
  },
  {
    id: 6,
    name: "Home Loan",
    categories: ["Loan", "Home"],
    icon: require("../../../assets/icons/Home_Loan.png"),
  },
  {
    id: 7,
    name: "Car Loan",
    categories: ["Loan", "Vehicle"],
    icon: require("../../../assets/icons/Car_Loan.png"),
  },
  {
    id: 8,
    name: "Business Loan",
    categories: ["Loan", "Business"],
    icon: require("../../../assets/icons/Business_Loan.png"),
  },
];

const demoSections = [
  {
    name: "Insurance Products",
    cardType: 1,
    iconSet1: [
      require("../../../assets/icons/Life.png"),
      require("../../../assets/icons/Health.png"),
      require("../../../assets/icons/Motor.png"),
      require("../../../assets/icons/Property.png"),
    ],
    iconSet2: [
      require("../../../assets/icons/Business_Loan.png"),
      require("../../../assets/icons/Car_Loan.png"),
      require("../../../assets/icons/Home_Loan.png"),
      require("../../../assets/icons/Personal_Loan.png"),
    ],
    products: demoProducts.slice(0, 4),
  },
  {
    name: "Loan Products",
    cardType: 2,
    iconSet1: [
      require("../../../assets/icons/Personal_Loan.png"),
      require("../../../assets/icons/Home_Loan.png"),
      require("../../../assets/icons/Car_Loan.png"),
      require("../../../assets/icons/Business_Loan.png"),
    ],
    iconSet2: [
      require("../../../assets/icons/Personal_Loan.png"),
      require("../../../assets/icons/Home_Loan.png"),
      require("../../../assets/icons/Car_Loan.png"),
      require("../../../assets/icons/Business_Loan.png"),
    ],
    products: demoProducts.slice(4, 8),
  },
];

const DemoHome = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = 200;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, headerHeight / 2, headerHeight],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const regularHeaderTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [-100, 0],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handleCardPress = () => {
    setShowLoginModal(true);
  };

  const handleLoginPress = () => {
    setShowLoginModal(false);
    navigation.navigate("Login");
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      return;
    }
    // In demo mode, just show the modal
    setShowLoginModal(true);
  };

  const handleProfile = () => {
    setShowLoginModal(true);
  };

  const handleNotificationPress = () => {
    setShowLoginModal(true);
  };

  const renderProductSection = (section) => {
    const CardUI = section.cardType === 1 ? ProductsCardUI1 : ProductsCardUI2;
    const iconSet = section.iconSet1;
    
    return (
      <View
        style={
          section.cardType === 2
            ? {
                backgroundColor: "#F6F6F6",
                borderColor: "#E6E6E6",
                borderRadius: 16,
                borderWidth: 1,
                marginBottom: 8,
                paddingBottom: 8,
                marginTop: 12,
                width: width * 0.9,
              }
            : {
                width: width * 0.9,
              }
        }
      >
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{section.name}</Text>
          <TouchableOpacity onPress={handleCardPress}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.productsRow}>
          {section.products.slice(0, 4).map((product, index) => (
            <CardUI
              key={`${section.name}-card-${index}`}
              title={product.categories[0]}
              icon={iconSet[index % iconSet.length]}
              onPress={handleCardPress}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      {/* Sticky Header */}
      <Animated.View style={[
        styles.stickyHeader,
        {
          top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 50,
          transform: [{ translateY: regularHeaderTranslateY }],
          zIndex: 1000,
        }
      ]}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleProfile}>
            <View style={styles.profileCircle}>
              <Text style={styles.profileInitial}>D</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>VSC ONE</Text>
          </View>
          <TouchableOpacity onPress={handleNotificationPress}>
            <Ionicons name="notifications" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      >
        {/* Gradient Header */}
        <Animated.View style={[
          styles.gradientHeader,
          {
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
          }
        ]}>
          <LinearGradient
            colors={["#fe8900", "#970251"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.9, y: 0.7 }}
            style={styles.gradientContent}
          >
            {/* Top Row: Profile and Bell */}
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={handleProfile}>
                <View style={styles.profileCircle}>
                  <Text style={styles.profileInitial}>D</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNotificationPress}>
                <Ionicons name="notifications" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Promo Banner */}
            <View style={styles.promoBanner}>
              <Text style={styles.promoSubText}>
                Only valid this week. Don&apos;t miss out.
              </Text>
              <Text style={styles.promoMainText}>Get Extra Bonus on Every 3 Sales!</Text>
              <TouchableOpacity 
                style={styles.startSellingBtn}
                onPress={handleCardPress}
              >
                <Text style={styles.startSellingText}>Start Selling</Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={16}
                  color="#FFF"
                  style={{ marginLeft: 6 }}
                />
              </TouchableOpacity>
            </View>

            {/* Search Box */}
            <View style={styles.searchBoxWrap}>
              <Ionicons
                name="search"
                size={22}
                color="#000"
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={styles.searchBox}
                placeholder="Search for Insurance ..."
                placeholderTextColor="#6C6C6C"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Bottom Half-Circle Images */}
            <View style={styles.bottomImagesRow}>
              <Image
                source={require("../../../assets/images/BgHome5.png")}
                style={{ width: 402, height: 133, marginLeft: -30 }}
              />
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.container}>
          <View style={styles.content}>
            {/* Demo Notice */}
            <View style={styles.demoNotice}>
              <Text style={styles.demoNoticeText}>
                🎯 This is a demo version. Login to access full features!
              </Text>
            </View>

            {/* Product Sections */}
            {demoSections.map((section) => renderProductSection(section))}

            {/* Featured Products */}
            <Text style={styles.featuredTitle}>Featured Products</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 8, paddingRight: 24 }}
              style={{ width: "100%" }}
            >
              {demoProducts.slice(0, 3).map((product, index) => (
                <FeaturedProductCard
                  key={product.id}
                  image={require("../../../assets/images/Featured_1.png")}
                  title={product.name}
                  onPress={handleCardPress}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </Animated.ScrollView>

      {/* Login Prompt Modal */}
      <LoginPromptModal
        visible={showLoginModal}
        onClose={handleCloseModal}
        onLogin={handleLoginPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  profileCircle: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitial: {
    fontSize: 19,
    color: "#fff",
    fontFamily: "Poppins-Medium",
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
    paddingBottom: 50,
  },
  demoNotice: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEAA7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    width: '100%',
  },
  demoNoticeText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#856404',
    textAlign: 'center',
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 18,
    marginBottom: 15,
    alignSelf: "stretch",
  },
  sectionTitle: {
    fontSize: 17,
    color: "#000",
    fontFamily: "Poppins-Bold",
    flex: 1,
  },
  viewAll: {
    fontSize: 14,
    color: "#BA3036",
    fontFamily: "Poppins-SemiBold",
    paddingRight: 4,
    marginLeft: 8,
  },
  productsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  featuredTitle: {
    fontSize: 17,
    fontFamily: "Poppins-Bold",
    color: "#000",
    marginBottom: 12,
    alignSelf: "flex-start",
    paddingLeft: 12,
    marginTop: 18,
  },
  gradientHeader: {
    position: 'relative',
    overflow: 'hidden',
  },
  gradientContent: {
    paddingTop: Platform.OS === "ios" ? 20 : 20,
    paddingHorizontal: 14,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  promoBanner: {
    alignItems: "center",
    marginTop: 28,
    marginBottom: 18,
  },
  promoSubText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  promoMainText: {
    color: "#fff",
    fontSize: 23,
    marginBottom: 16,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
  },
  startSellingBtn: {
    backgroundColor: "rgba(255,255,255, 0.3)",
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  startSellingText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Poppins-SemiBold",
  },
  searchBoxWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginTop: 18,
    height: 42,
    marginHorizontal: 8,
    zIndex: 2,
  },
  searchBox: {
    flex: 1,
    fontSize: 15,
    color: "#000",
    backgroundColor: "transparent",
    fontFamily: "Poppins-Regular",
    paddingVertical: 0,
  },
  bottomImagesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -22,
    paddingHorizontal: 32,
  },
});

export default DemoHome;
