import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import ProductsCardUI1 from "../../components/Cards/ProductsCardUI1.jsx"
import ProductsCardUI2 from "../../components/Cards/ProductsCardUI2.jsx"
import FeaturedProductCard from "../../components/FeaturedProductCard/FeaturedProductCard.jsx"
import Header from "../../components/Header/Header.jsx";
import { Base_url } from "../../config/BaseUrl.jsx"


const { width ,height} = Dimensions.get("window");
const Home = ({navigation}) => {
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [categoryImages, setCategoryImages] = useState({});
  const [categoryProducts, setCategoryProducts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [userData, setUserData] = useState(null);
  const [productSections, setProductSections] = useState([]);
  const [sectionConfigs, setSectionConfigs] = useState({});
  const [dynamicSections, setDynamicSections] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = 200; // Approximate height of gradient header
  const isDataFetched = useRef(false);
  const isMounted = useRef(true);
  const fetchDataPromise = useRef(null);

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
    fetchData();
    
    return () => {
      isMounted.current = false;
    };
  }, []); // Empty dependency array - only run once on mount

  const fetchData = useCallback(async () => {
    if (!isMounted.current) {
      console.log("Component unmounted, skipping fetchData...");
      return;
    }
    
    if (isDataFetched.current) {
      console.log("fetchData already called, skipping...");
      return;
    }
    
    try {
      console.log("Starting fetchData...");
      setLoading(true);
      isDataFetched.current = true;
      const token = await AsyncStorage.getItem("access_token");
      console.log("accessToken", token);

      if (!token) {
        console.error("No access token found");
        setLoading(false);
        isDataFetched.current = false;
        return;
      }

      // Fetch categories
      const categoriesResponse = await axios.get(
        `${Base_url}categories?limit=1000`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const categoryMap = {};
      const categoryImages = {};
      categoriesResponse.data.results.forEach((category) => {
        categoryMap[category.id] = category.name;
        categoryImages[category.id] = category.image;
      });
      if (isMounted.current) {
        setCategories(categoryMap);
        setCategoryImages(categoryImages);
      }
      
      console.log("categoryImages",categoryImages)
      console.log("categoryMap",categoryMap)
      // Fetch products
      const productsResponse = await axios.get(`${Base_url}products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allProducts = productsResponse.data.results || [];
      if (isMounted.current) {
        setProducts(allProducts);
      }
      console.log("response.data.results", allProducts)
      // Generate dynamic sections from products
      const sections = generateDynamicSections(allProducts);
      if (isMounted.current) {
        setDynamicSections(sections);
      }

      // Organize products by sections
      const productsByCategory = {};
      sections.forEach((section) => {
        productsByCategory[section.name] = [];
      });

      // Group products by sections - each product is its own section
      allProducts.forEach((product) => {
        if (productsByCategory[product.name]) {
          productsByCategory[product.name].push(product);
        }
      });

      if (isMounted.current) {
        setCategoryProducts(productsByCategory);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      isDataFetched.current = false;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  // Generate dynamic sections from products
  const generateDynamicSections = useCallback((products) => {
    const sectionMap = new Map();
    
    products.forEach((product, index) => {
      // Use product name as section name since products are the sections
      let sectionName = product.name || 'Other Products';
      
      if (!sectionMap.has(sectionName)) {
        const iconSets = getDefaultIcons(sectionName);
        sectionMap.set(sectionName, {
          name: sectionName,
          cardType: sectionMap.size % 2 === 0 ? 1 : 2, // Alternate card types
          iconSet1: iconSets.iconSet1,
          iconSet2: iconSets.iconSet2,
          order: sectionMap.size,
          productCount: 0,
          productId: product.id // Store the product ID for navigation
        });
      }
      
      sectionMap.get(sectionName).productCount++;
    });
    
    return Array.from(sectionMap.values());
  }, []);

  // Find which section a product belongs to
  const findProductSection = (product, sections) => {
    // Since products are the sections, find the section that matches the product name
    const matchingSection = sections.find(section => section.name === product.name);
    return matchingSection ? matchingSection.name : sections[0]?.name;
  };

  // Helper function to get default icons for sections
  const getDefaultIcons = useCallback((sectionName) => {
    // Define two icon arrays for alternative use
    const iconSet1 = [
      require("../../../assets/icons/Life.png"),
      require("../../../assets/icons/Health.png"),
      require("../../../assets/icons/Motor.png"),
      require("../../../assets/icons/Property.png"),
    ];
    
    const iconSet2 = [
      require("../../../assets/icons/Business_Loan.png"),
      require("../../../assets/icons/Car_Loan.png"),
      require("../../../assets/icons/Home_Loan.png"),
      require("../../../assets/icons/Personal_Loan.png"),
    ];
    
    console.log("Icons for section:", sectionName, "Set1 count:", iconSet1.length, "Set2 count:", iconSet2.length);
    
    // Return both icon sets
    return { iconSet1, iconSet2 };
  }, []);



  const getCategoryNames = (categoryIds) => {
    if (!categoryIds || !categories) return [];

    const categoryNames = categoryIds.slice(0, 4).map((id) => {
      const categoryName = categories[id] || "";

      // Special handling for specific category names
      if (categoryName === "Infrastructure Projects") {
        return "Infra-\nstructure";
      } else if (categoryName === "Blockchain Solutions") {
        return "Block-\nchain";
      } else if (categoryName === "Renewable Energy") {
        return "Renew-\nable";
      }

      // Return only the first word of other category names
      return categoryName.split(" ")[0];
    });

    // Return only the actual categories, no additional cards
    return categoryNames;
  };

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

  const handleCategoryView = (categoryType) => {
    // Find the section for this category
    const section = dynamicSections.find(s => s.name === categoryType);
    
    if (section) {
      if (section.cardType === 1) {
        // CardType 1: Navigate to InsuranceProducts
        if (section.productId) {
          navigateTo("InsuranceProducts", { 
            productId: section.productId, 
            categoryType 
          });
        } else {
          // Fallback: Find the product ID from categoryProducts
          const sectionProducts = categoryProducts[categoryType] || [];
          if (sectionProducts.length > 0) {
            navigateTo("InsuranceProducts", { 
              productId: sectionProducts[0].id, 
              categoryType 
            });
          } else {
            navigateTo("CategoryProducts", { categoryType });
          }
        }
      } else {
        // CardType 2: Navigate to LoanProducts
        if (section.productId) {
          navigateTo("LoanProducts", { 
            productId: section.productId, 
            categoryType 
          });
        } else {
          // Fallback: Find the product ID from categoryProducts
          const sectionProducts = categoryProducts[categoryType] || [];
          if (sectionProducts.length > 0) {
            navigateTo("LoanProducts", { 
              productId: sectionProducts[0].id, 
              categoryType 
            });
          } else {
            navigateTo("CategoryProducts", { categoryType });
          }
        }
      }
    } else {
      // If no section found, navigate to default
      navigateTo("CategoryProducts", { categoryType });
    }
  };

  const handleProfile = () => {
    navigateTo("Profile");
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsSearching(true);
    try {
      // Filter products based on the search query
      const searchResults = products.filter((product) => {
        // Check if product name matches
        const nameMatch =
          product.name &&
          product.name.toLowerCase().includes(searchQuery.trim().toLowerCase());

        // Check if any category matches
        let categoryMatch = false;
        if (product.categories && Array.isArray(product.categories)) {
          categoryMatch = product.categories.some((catId) => {
            const catName = categories[catId];
            return (
              catName &&
              catName.toLowerCase().includes(searchQuery.trim().toLowerCase())
            );
          });
        }

        return nameMatch || categoryMatch;
      });

      // Find which section the search query matches
      const matchingSection = dynamicSections.find((section) =>
        section.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );

      // If we found a matching section, filter the category products
      if (matchingSection) {
        const sectionProducts = categoryProducts[matchingSection] || [];
        const filteredSectionProducts = sectionProducts.filter((product) => {
          // Get category names for this product
          const productCategories = product.categories || [];
          const productCategoryNames = productCategories
            .map((catId) => categories[catId])
            .filter(Boolean);

          // Check if any category name matches the search query
          return productCategoryNames.some((catName) =>
            catName.toLowerCase().includes(searchQuery.trim().toLowerCase())
          );
        });

        // Navigate to search results with filtered section products
        navigateTo("SearchResults", {
          results: filteredSectionProducts,
          searchQuery: searchQuery.trim(),
          section: matchingSection.name,
        });
      } else {
        // Navigate to search results screen with the filtered results
        navigateTo("SearchResults", {
          results: searchResults,
          searchQuery: searchQuery.trim(),
        });
      }
    } catch (error) {
      console.error("Error filtering products:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVoiceSearch = () => {
    // Implement voice search functionality here
    // This would typically involve using a speech recognition library
    console.log("Voice search triggered");
  };

  // Filter products by search query (name or category)
  const filteredProducts = searchQuery.trim()
    ? products.filter((product) => {
        const nameMatch =
          product.name &&
          product.name.toLowerCase().includes(searchQuery.trim().toLowerCase());

        let categoryMatch = false;
        if (product.categories && Array.isArray(product.categories)) {
          categoryMatch = product.categories.some((catId) => {
            const catName = categories[catId];
            return (
              catName &&
              catName.toLowerCase().includes(searchQuery.trim().toLowerCase())
            );
          });
        }

        // Check if the product belongs to a matching section
        const sectionMatch = dynamicSections.some((section) =>
          section.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );

        return nameMatch || categoryMatch || sectionMatch;
      })
    : [];

  // Function to render a product section
  const renderProductSection = (section) => {
    const sectionProducts = categoryProducts[section.name] || [];
    
    const filteredSectionProducts = searchQuery.trim()
      ? sectionProducts.filter((product) => {
          const productCategories = product.categories || [];
          const productCategoryNames = productCategories
            .map((catId) => categories[catId])
            .filter(Boolean);
          return productCategoryNames.some((catName) =>
            catName.toLowerCase().includes(searchQuery.trim().toLowerCase())
          );
        })
      : sectionProducts;
    if (searchQuery.trim() && filteredSectionProducts.length === 0) {
      return null;
    }
    let categoryNames = [];
    let categoryIds = [];
    if (
      filteredSectionProducts.length > 0 &&
      filteredSectionProducts[0].categories
    ) {
      const productCategories = filteredSectionProducts[0].categories;
      categoryIds = productCategories;
      categoryNames = getCategoryNames(productCategories);
    }
    
    console.log("Section:", section.name, "IconSet1 count:", section.iconSet1?.length, "IconSet2 count:", section.iconSet2?.length);
    
    // Choose card UI based on cardType
    const CardUI = section.cardType === 1 ? ProductsCardUI1 : ProductsCardUI2;
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
          <TouchableOpacity onPress={() => handleCategoryView(section.name)}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.productsRow}>
          {searchQuery.trim()
            ? categoryNames.map((cardTitle, index) => {
                const categoryId = categoryIds[index];
                const categoryImage = categoryImages[categoryId];
                return (
                  <CardUI
                    key={`${section.name}-card-${index}`}
                    title={cardTitle}
                    icon={section.iconSet1[index % section.iconSet1.length]}
                    categoryImage={categoryImage}
                    onPress={() => {
                      if (categoryId) {
                        navigateTo("LifeInsurance", {
                          category: cardTitle,
                          categoryId,
                          productId: section.productId || filteredSectionProducts[0]?.id,
                          categoryType: section.name,
                        });
                      }
                    }}
                  />
                );
              })
            : categoryNames.map((cardTitle, index) => {
                const categoryId =
                  index < categoryIds.length ? categoryIds[index] : null;
                const categoryImage = categoryId ? categoryImages[categoryId] : undefined;
                
                // Use iconSet1 for even sections, iconSet2 for odd sections
                const iconSet = section.cardType === 1 ? section.iconSet1 : section.iconSet2;
                const icon = iconSet[index % iconSet.length];
                
                console.log(`Card ${index}: Using ${section.cardType === 1 ? 'iconSet1' : 'iconSet2'}, Icon:`, icon);
                
                return (
                  <CardUI
                    key={`${section.name}-card-${index}`}
                    title={cardTitle}
                    icon={icon}
                    categoryImage={categoryImage}
                    onPress={() => {
                      if (categoryId) {
                        // Navigate to specific category
                        navigateTo("LifeInsurance", {
                          category: cardTitle,
                          categoryId,
                          productId: section.productId || sectionProducts[0]?.id,
                          categoryType: section.name,
                        });
                      }
                    }}
                  />
                );
              })}
        </View>
      </View>
    );
  };

  const fetchUserData = useCallback(async () => {
    try {
      const userDetailsStr = await AsyncStorage.getItem("user details");
      if (userDetailsStr) {
        setUserData(JSON.parse(userDetailsStr));
      }
    } catch (error) {
      setUserData(null);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, []); // Empty dependency array - only run once on mount

  const handleNotificationPress = () => {
    navigateTo("Notifications");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Animated.View style={[
        styles.stickyHeader,
        {
          top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 50,
          transform: [{ translateY: regularHeaderTranslateY }],
          zIndex: 1000,
        }
      ]}>
        <Header
          userData={userData}
          onProfilePress={handleProfile}
          onNotificationPress={handleNotificationPress}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </Animated.View>

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ flexGrow: 1,paddingBottom: 100 }}
      >
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
                {userData?.profilePicture ? (
                  <Image
                    source={{ uri: userData.profilePicture }}
                    style={styles.profileCircle}
                    contentFit="cover"
                  />
                ) : (
                  <View style={styles.profileCircle}>
                    <Text style={styles.profileInitial}>
                      {userData?.name ? userData.name[0].toUpperCase() : "P"}
                    </Text>
                  </View>
                )}
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
                onPress={() => navigateTo('LEADS')}
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
              {/* <TouchableOpacity
                style={styles.micIconWrap}
                onPress={handleVoiceSearch}
              >
                <Ionicons name="mic-outline" size={22} color="#FF0000" />
              </TouchableOpacity> */}
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
            {/* Statistics Cards */}

            {/* <Text style={{ fontSize: 17, fontFamily: 'Poppins-Bold', color: '#000', marginBottom: 12 ,alignSelf: 'flex-start',paddingLeft: 12}}>Statistics</Text>
                            <View style={{ flexDirection: 'row', marginBottom: 24 }}>
                                <View style={[styles.statCard, selected === 0 && styles.statCardSelected]}>
                                    <TouchableOpacity onPress={() => setSelected(0)} style={styles.statCardContent}>
                                        <View style={styles.statLeftWrap}>
                                            <Image source={require('../../assets/icons/megaphone.png')} style={styles.statIcon} />
                                            <Text style={[styles.statValue, selected === 0 && { color: '#fff' }]}>12</Text>
                                        </View>
                                        <View style={styles.statTitleWrap}>
                                            <Text style={[styles.statTitle, selected === 0 && { color: '#fff' }]}>Leads</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.statCard, selected === 1 && styles.statCardSelected, { marginLeft: 16 }]}> 
                                    <TouchableOpacity onPress={() => setSelected(1)} style={styles.statCardContent}>
                                        <View style={styles.statLeftWrap}>
                                            <Image source={require('../../assets/icons/money.png')} style={styles.statIcon} />
                                            <Text style={[styles.statValue, selected === 1 && { color: '#fff' }]}>12</Text>
                                        </View>
                                        <View style={styles.statTitleWrap}>
                                            <Text style={[styles.statTitle, selected === 1 && { color: '#fff' }]}>Income</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View> */}

            {/* Search Results */}
            {searchQuery.trim() && (
              <View style={{ width: "100%", marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "Poppins-SemiBold",
                    color: "#000",
                    marginBottom: 8,
                    alignSelf: "flex-start",
                    paddingLeft: 12,
                  }}
                >
                  Search Results
                </Text>
                {filteredProducts.length === 0 ? (
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#888",
                      fontFamily: "Poppins-Regular",
                      alignSelf: "flex-start",
                      paddingLeft: 12,
                    }}
                  >
                    No products found.
                  </Text>
                ) : (
                  filteredProducts.map((product) => (
                    <TouchableOpacity
                      key={product.id}
                      style={{
                        backgroundColor: "#F6F6FA",
                        borderRadius: 8,
                        padding: 16,
                        marginBottom: 10,
                        marginHorizontal: 12,
                      }}
                      onPress={() => {
                        // Find which section this product belongs to
                        const productSection = findProductSection(product, dynamicSections);
                        if (productSection) {
                          // Navigate to InsuranceProducts screen like View All does
                          navigateTo("InsuranceProducts", {
                            productId: product.id,
                            categoryType: productSection,
                          });
                        } else {
                          // Fallback to direct product navigation
                          navigateTo("LifeInsurance", {
                            productId: product.id,
                            category: product.name,
                          });
                        }
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#000",
                          fontFamily: "Poppins-SemiBold",
                        }}
                      >
                        {product.name}
                      </Text>
                      {product.categories &&
                        product.categories.length > 0 && (
                          <Text
                            style={{
                              fontSize: 13,
                              color: "#666",
                              fontFamily: "Poppins-Regular",
                              marginTop: 2,
                            }}
                          >
                            {product.categories
                              .map((catId) => categories[catId])
                              .filter(Boolean)
                              .join(", ")}
                          </Text>
                        )}
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}

            {/* Central Loading Indicator */}
            {loading ? (
              <View style={styles.centralLoadingContainer}>
                <ActivityIndicator size="large" color="#FF7115" />
                <Text style={styles.loadingText}>Loading products...</Text>
              </View>
            ) : (
              <>
                {/* Render each product section dynamically */}
                {dynamicSections
                  .sort((a, b) => a.order - b.order)
                  .map((section) => renderProductSection(section))}

          
                <Text
                  style={{
                    fontSize: 17,
                    fontFamily: "Poppins-Bold",
                    color: "#000",
                    marginBottom: 12,
                    alignSelf: "flex-start",
                    paddingLeft: 12,
                    marginTop: 18,
                  }}
                >
                  Featured Products
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingLeft: 8, paddingRight: 24 }}
                  style={{ width: "100%" }}
                >
                  {products.slice(0, 3).map((product, index) => {
                    const productSection = findProductSection(product, dynamicSections);
                    return (
                      <FeaturedProductCard
                        key={product.id || index}
                        image={require("../../../assets/images/Featured_1.png")}
                        title={product.name}
                        
                                              onPress={() => {
                        handleCategoryView(productSection);
                      }}
                      />
                    );
                  })}

                  {products.length === 0 && (
                    <>
                      <FeaturedProductCard
                        image={require("../../../assets/images/Featured_1.png")}
                        title="Product Name"
                   
                      />
                      <FeaturedProductCard
                        image={require("../../../assets/images/Featured_1.png")}
                        title="Product Name"
                      
                      />
                    </>
                  )}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 0 : 15,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
    paddingBottom: 50,
  },
  statCard: {
    width: 157,
    height: 85,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E6E6E6",
  },
  statCardSelected: {
    backgroundColor: "#FF7115",
  },
  statCardContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingHorizontal: 16,
  },
  statLeftWrap: {
    alignItems: "center",
    marginRight: 14,
  },
  statIcon: {
    width: 33,
    height: 33,
    marginBottom: 4,
  },
  statTitleWrap: {
    flex: 1,
    paddingBottom: 24,
  },
  statTitle: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Poppins-SemiBold",
  },
  statValue: {
    fontSize: 16,
    color: "#000",
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
  micIconWrap: {
    marginLeft: 8,
    padding: 6,
  },
  micIcon: {
    width: 22,
    height: 22,
    tintColor: "#FF7115",
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
     flexDirection:"row",
     justifyContent:"flex-start",
     alignItems:"flex-start",
    marginBottom: 8,
   
  },
  centralLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 80,
  },
  loadingText: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Poppins-SemiBold",
    marginLeft: 10,
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
  bottomImagesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -22,
    paddingHorizontal: 32,
  },
  bottomCircleImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginHorizontal: -12,
    marginTop: 24,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
  },
});

export default Home;