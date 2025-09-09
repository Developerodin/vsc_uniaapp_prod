import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Card = ({
  icon,
  title,
  value,
  selected,
  onPress,
  backgroundColor = '#fff',
  textColor = '#222',
  valueColor = '#fff',
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: selected ? backgroundColor : '#fff', borderColor: selected ? backgroundColor : '#E6E6E6' },
        selected && styles.selectedShadow,
      ]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.iconWrap}>
        <Image source={icon} style={styles.icon} />
      </View>
      <View style={styles.textWrap}>
        <Text style={[styles.title, { color: selected ? '#fff' : textColor }]}>{title}</Text>
        {value !== undefined && (
          <Text style={[styles.value, { color: selected ? '#fff' : backgroundColor }]}>{value}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 18,
    minWidth: 150,
    minHeight: 100,
    marginRight: 16
  },
  selectedShadow: {
    shadowOpacity: 0.18,
    elevation: 4,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  textWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
  },
});

export default Card;
