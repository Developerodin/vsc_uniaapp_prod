import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import profile from '../../assets/icons/Profile.png';
export default function LeadCard({ lead, navigation }) {
  const handleCustomerProfile = () => {
    navigation.navigate('CustomerProfile', { leadId: lead.id });
  };
  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'Interested':
        return '#0095FF';
      case 'Follow-up':
        return '#FFAE00';
      case 'Converted':
        return '#00BC64';
      case 'Closed':
        return '#FF0000';
      default:
        return '#0099FF';
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
};

  return (
        <TouchableOpacity onPress={handleCustomerProfile}>
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <View style={styles.profileSection}>
          <Image source={profile} style={styles.profileImage} />
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{lead.name}</Text>
           
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
        <Text style={styles.categoryText}>{lead.category}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.statusRow}>
          <Text style={styles.labelText}>Status : </Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(lead.status) }]} />
            <Text style={styles.statusText}>{lead.status}</Text>
          </View>
        </View>

       

        <View style={styles.createdRow}>
          <Text style={styles.labelText}>Created on : </Text>
          <Text style={styles.valueText}>{lead.createdDate}</Text>
        </View>
      </View>
    </View>
          </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#F6F6FA',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  nameContainer: {
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 17,
    fontFamily: 'Poppins-Bold',
    color: '#000',
  },
  categoryText: {
    fontSize: 13,
    color: '#E94C3D',
    fontFamily: 'Poppins-Regular',
  },
  moreButton: {
    padding: 5,
  },
  cardContent: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  followUpRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  createdRow: {
    flexDirection: 'row',
  },
  labelText: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    color: '#000',
    marginRight: 5,
  },
  valueText: {
    fontSize: 12,
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
});