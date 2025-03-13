import React from 'react';
import { ScrollView, StyleSheet, Image, View } from 'react-native';
import { Card, Title, Paragraph, ProgressBar, Text, Button, Appbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const StudentScreen = () => {
  const navigation = useNavigation();

  const absenceData = [
    { subject: 'Sistemas Embebidos', absences: 4, maxAbsences: 10 },
    { subject: 'Programación Web', absences: 10, maxAbsences: 10 },
    { subject: 'Inglés', absences: 7, maxAbsences: 10 },
    { subject: 'Español', absences: 2, maxAbsences: 10 },
    { subject: 'Seguridad Informática', absences: 3, maxAbsences: 10 },
  ];

  const renderAbsenceBar = (subject: string, absences: number, maxAbsences: number) => {
    const progress = absences / maxAbsences;
    const isCritical = absences === maxAbsences;

    return (
      <Card style={styles.card} key={subject}>
        <Card.Content>
          <View style={styles.subjectRow}>
            <Title style={styles.subjectTitle} numberOfLines={1}>
              {subject}
            </Title>
            <Text style={[styles.absenceText, isCritical && styles.criticalText]}>
              {absences}/{maxAbsences}
            </Text>
          </View>
          <ProgressBar progress={progress} color={isCritical ? '#F44336' : '#6200EE'} style={styles.progressBar} />
        </Card.Content>
      </Card>
    );
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('userEmail');
      navigation.navigate('index'); // Navegar a la pantalla de inicio o login
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => console.log('Go back')} />
        <Appbar.Content title="Perfil del Estudiante" />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Image
              source={{
                uri: 'https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg',
              }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Title>Sara Itzel García Vidal</Title>
              <Paragraph>ID: UP210612 - ISC09A</Paragraph>
            </View>
          </Card.Content>
        </Card>
        {absenceData.map(({ subject, absences, maxAbsences }) =>
          renderAbsenceBar(subject, absences, maxAbsences)
        )}
      </ScrollView>
      <Button
        mode="contained"
        onPress={() => console.log('Go back')}
        style={styles.backButton}
        icon="arrow-left"
      >
        Regresar
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Espaciado para el botón inferior
  },
  profileCard: {
    marginBottom: 16,
    elevation: 2, // Sombra para darle profundidad
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1, // Prioriza el uso del espacio para el título
    marginRight: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  absenceText: {
    fontSize: 14,
    color: '#757575',
    flexShrink: 0, // Evita que el texto se comprima
  },
  criticalText: {
    color: '#F44336',
  },
  backButton: {
    margin: 16,
    borderRadius: 8,
  },
  logoutButton: {
    margin: 16,
    borderRadius: 8,
    backgroundColor: '#F44336',
  },
});

export default StudentScreen;
