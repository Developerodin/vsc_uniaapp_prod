import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const QuickActionCards = ({ title, icon, onPress }) => (
    <TouchableOpacity onPress={onPress} style={{ alignItems: 'center', flex: 1 }}>
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
            <Image source={icon} style={{ width: 24, height: 24, resizeMode: 'contain' }} />
        </View>
        <Text style={{ fontSize: 13, color: '#000', fontFamily: 'Poppins-Regular', textAlign: 'center' }}>{title}</Text>
    </TouchableOpacity>
);

export default QuickActionCards;
