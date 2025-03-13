import React from 'react';
import { StyleSheet, TouchableOpacity, Text, useColorScheme, View, Image } from 'react-native';
import { ThemedView } from '../components/ThemedView';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function OfficeSignIn(): JSX.Element {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const handleNavigate = () => {
    router.push('/(tabs)/TeacherClassesScreen'); // Cambia esta ruta si es necesario
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ClassTrack</Text>
        <Image source={require('../assets/images/ClassTrack3.png')} style={styles.logo} />
        <TouchableOpacity
          style={[styles.button, colorScheme === 'dark' ? styles.buttonDark : styles.buttonLight]}
          onPress={handleNavigate}
        >
          <Ionicons name="log-in-outline" size={24} color="#ffffff" />
          <Text style={[styles.buttonText, styles.textDark]}>Iniciar</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  card: {
    width: '40%',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonLight: {
    backgroundColor: '#00A4EF',
  },
  buttonDark: {
    backgroundColor: '#00A4EF',
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  textDark: {
    color: '#ffffff',
  },
});
