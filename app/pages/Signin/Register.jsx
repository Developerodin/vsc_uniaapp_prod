import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Register() {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Text style={styles.subtitle}>This is a placeholder for the Register component</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});