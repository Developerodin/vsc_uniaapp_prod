import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const ProductsCardUI2 = ({ title, icon, categoryImage, onPress }) => {
    const [imageError, setImageError] = useState(false);
    
    // Determine which image source to use
    const imageSource = (categoryImage && categoryImage !== undefined && !imageError) 
        ? { uri: categoryImage } 
        : icon;

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <TouchableOpacity onPress={onPress} style={{  textAlign: "center", width: 90 ,alignItems: 'center' }}>
            <View style={{
                backgroundColor: '#fff',
                borderRadius: 20,
                width: 58,
                height: 58,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
                elevation: 2,
                borderWidth: 1,
                borderColor: '#F0F0F0',
            }}>
                <Image 
                    source={imageSource} 
                    style={{ width: 24, height: 24, resizeMode: 'contain' }}
                    onError={handleImageError}
                    defaultSource={icon} // Fallback to default icon if backend image fails
                />
            </View>
            <Text style={{ fontSize: 14, color: '#000', fontFamily: 'Poppins-Regular', textAlign: 'center' }}>{title}</Text>
        </TouchableOpacity>
    );
};

export default ProductsCardUI2;
