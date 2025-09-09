import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StatusBar
} from 'react-native';
import FeaturedProductCard from '../../components/FeaturedProductCard/FeaturedProductCard';


export default function PersonalLoan({ navigation }) {
    const handleBackPress = () => {
        navigation.goBack();
    };


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
            <Ionicons name="chevron-back" size={24} color="black" style={{marginRight:10}} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Loan</Text>
      </View>
      
      {/* Main Content Area */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.cardsContainer}>
          {/* Row 1 */}
          <View style={styles.cardRow}>
            <FeaturedProductCard
              image={require('../../../assets/images/Featured_1.png')}
              pillText="Health Insurance"
              title="Star Health – Young Star Policy"
              commission="15%"
            />
            <FeaturedProductCard
              image={require('../../../assets/images/Featured_1.png')}
              pillText="Health Insurance"
              title="Star Health – Young Star Policy"
              commission="15%"
            />
          </View>
          
          {/* Row 2 */}
          <View style={styles.cardRow}>
            <FeaturedProductCard
              image={require('../../../assets/images/Featured_1.png')}
              pillText="Health Insurance"
              title="Star Health – Young Star Policy"
              commission="15%"
            />
            <FeaturedProductCard
              image={require('../../../assets/images/Featured_1.png')}
              pillText="Health Insurance"
              title="Star Health – Young Star Policy"
              commission="15%"
            />
          </View>
          
          {/* Row 3 */}
          <View style={styles.cardRow}>
            <FeaturedProductCard
              image={require('../../../assets/images/Featured_1.png')}
              pillText="Health Insurance"
              title="Star Health – Young Star Policy"
              commission="15%"
            />
            <FeaturedProductCard
              image={require('../../../assets/images/Featured_1.png')}
              pillText="Health Insurance"
              title="Star Health – Young Star Policy"
              commission="15%"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#000000',
  },
  contentContainer: {
    flex: 1,
  },
  cardsContainer: {
    paddingVertical: 10,
    marginBottom: 80,
    paddingLeft:5,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});