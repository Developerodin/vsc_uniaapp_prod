import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ProductCard = ({ title, image, imageWidth, imageHeight, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <View style={styles.imageWrap}>
        <Image
          source={image || require('../../assets/icons/profile_icon.png')}
          style={{ width: imageWidth, height: imageHeight, resizeMode: 'contain' }}
        />
      </View>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 72,
    height: 90,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#FF7115',
  },
  imageWrap: {
    marginBottom: 8,
    marginTop: 6
  },
  title: {
    fontSize: 11,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    paddingHorizontal: 5,
    lineHeight: 14,
  },
});

export default ProductCard; 