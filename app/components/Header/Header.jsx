import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Header = ({ userData, onProfilePress, onNotificationPress, onSearch, searchQuery, setSearchQuery }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Search Bar */}
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
          onSubmitEditing={onSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Notification Icon */}
      <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
        <Ionicons name="notifications" size={24} color="#000" />
      </TouchableOpacity>

      {/* Profile Image */}
      <TouchableOpacity onPress={onProfilePress} style={styles.profileButton}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    // borderBottomWidth: 1,
    // borderBottomColor: '#E5E5E5',
  },
  searchBoxWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
    height: 40,
  },
  searchBox: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
  },
  profileButton: {
    padding: 4,
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});

export default Header;
