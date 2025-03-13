import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define an interface for the props
interface ProfileCardProps {
  name: string;
  id: string;
}

// Use the interface as the type for props in ProfileCard
export const ProfileCard: React.FC<ProfileCardProps> = ({ name, id }) => (
  <View style={styles.container}>
    <Ionicons name="person-circle-outline" size={100} color="#000" style={styles.icon} />
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.id}>{id}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#D3E0FF',
    borderRadius: 8,
    marginBottom: 20,
  },
  icon: {
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  id: {
    fontSize: 14,
    color: '#666',
  },
});
