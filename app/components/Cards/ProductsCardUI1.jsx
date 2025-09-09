import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const ProductsCardUI1 = ({ title, icon, categoryImage, onPress }) => {
    const [imageError, setImageError] = useState(false);
    
    // Determine which image source to use
    const imageSource = (categoryImage && categoryImage !== undefined && !imageError) 
        ? { uri: categoryImage } 
        : icon;

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <TouchableOpacity onPress={onPress} style={{ alignItems: 'center', textAlign: "center", width: 90 }}>
            <View style={{
                backgroundColor: '#FE711A',
                borderRadius: 16,
                width: 58,
                height: 58,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 8,
              

            }}>
                <Image 
                    source={imageSource} 
                    style={{ width: 24, height: 24, resizeMode: 'contain' }}
                    onError={handleImageError}
                    defaultSource={icon} // Fallback to default icon if backend image fails
                />
            </View>
            <Text style={{ fontSize: 14, color: '#000', fontFamily: 'Poppins-Regular'}}>{title}</Text>
        </TouchableOpacity>
    );
};

export default ProductsCardUI1;
