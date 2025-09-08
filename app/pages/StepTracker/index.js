import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const StepTracker = ({ navigation }) => {
  const [steps, setSteps] = useState(7245);
  const [goal] = useState(10000);
  const [calories, setCalories] = useState(324);

  const progress = (steps / goal) * 100;

  const weeklyData = [
    { day: 'Mon', steps: 8932 },
    { day: 'Tue', steps: 7456 },
    { day: 'Wed', steps: 9123 },
    { day: 'Thu', steps: 6789 },
    { day: 'Fri', steps: 8456 },
    { day: 'Sat', steps: 9876 },
    { day: 'Sun', steps: 7245 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Step Tracker</Text>
        <Text style={styles.subtitle}>Track your daily activity</Text>
        
        {/* Today's Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.mainStat}>
            <Text style={styles.stepCount}>{steps.toLocaleString()}</Text>
            <Text style={styles.stepLabel}>steps today</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
            </View>
            <Text style={styles.goalText}>{goal.toLocaleString()} steps goal</Text>
          </View>
          
          <View style={styles.secondaryStats}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{calories}</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{(steps * 0.0008).toFixed(1)} km</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
          </View>
        </View>

        {/* Weekly Overview */}
        <View style={styles.weeklyContainer}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.weeklyChart}>
            {weeklyData.map((day, index) => (
              <View key={index} style={styles.dayColumn}>
                <View 
                  style={[
                    styles.stepBar, 
                    { height: (day.steps / 10000) * 100 }
                  ]} 
                />
                <Text style={styles.dayLabel}>{day.day}</Text>
                <Text style={styles.daySteps}>{(day.steps / 1000).toFixed(1)}k</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EB784E',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
  },
  statsContainer: {
    marginBottom: 30,
  },
  mainStat: {
    backgroundColor: '#F8F8F8',
    padding: 25,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  stepCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#EB784E',
  },
  stepLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 15,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#EB784E',
    borderRadius: 4,
  },
  goalText: {
    fontSize: 14,
    color: '#666666',
  },
  secondaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#F8F8F8',
    padding: 20,
    borderRadius: 12,
    flex: 0.48,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
  },
  weeklyContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    backgroundColor: '#F8F8F8',
    padding: 20,
    borderRadius: 16,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  stepBar: {
    width: 20,
    backgroundColor: '#EB784E',
    borderRadius: 10,
    marginBottom: 10,
    minHeight: 20,
  },
  dayLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  daySteps: {
    fontSize: 10,
    color: '#999999',
  },
});

export default StepTracker;
