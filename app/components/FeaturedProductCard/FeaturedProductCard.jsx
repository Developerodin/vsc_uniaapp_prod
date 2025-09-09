import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FeaturedProductCard = ({
  image,
  title,
  subtitle,
  commission,
  onPress,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle || 'Health Insurance'}</Text>
      <View style={{ height: 8 }} />
      {/* <Text style={styles.commissionLabel}>
        Commission: <Text style={styles.commissionPercent}>{commission}</Text>
      </Text> */}
      <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.85}>
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
      <LinearGradient
        colors={["#fe8900", "#970251"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <Image source={image} style={styles.image} />
      </LinearGradient>
    </View>
  );
};

const BORDER_RADIUS = 18;
const BORDER_WIDTH = 2;
const IMAGE_WIDTH = 138;
const IMAGE_HEIGHT = 98;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    padding: 20,
    marginRight: 10,
    width: 279,
    position: 'relative',
    overflow: 'visible',
  },
  title: {
    fontSize: 20,
    color: '#181818',
    fontFamily: 'Poppins-Bold',
    marginBottom: 2,
    textAlign: 'left',
    width: '100%',
  },
  subtitle: {
    fontSize: 15,
    color: '#000000',
    fontFamily: 'Poppins-Regular',
    marginBottom: 0,
    textAlign: 'left',
    width: '100%',
  },
  commissionLabel: {
    fontSize: 15,
    color: '#000000',
    fontFamily: 'Poppins-Regular',
    marginBottom: 14,
    textAlign: 'left',
  },
  commissionPercent: {
    color: '#970251',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 17,
  },
  button: {
    backgroundColor: '#F6C7B0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 2,
    marginBottom: 10,
  },
  buttonText: {
    color: '#BA3036',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
  },
  gradientBorder: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderTopLeftRadius: 58,
    borderBottomRightRadius: BORDER_RADIUS,
    padding: BORDER_WIDTH,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  image: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      right: 0,
      bottom: 0,
    borderTopLeftRadius: 58,
    borderBottomRightRadius: 18,
    backgroundColor: '#fff',
    resizeMode: 'cover',
  },
});

export default FeaturedProductCard; 