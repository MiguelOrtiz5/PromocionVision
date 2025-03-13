import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Card, Text, ProgressBar, Avatar, IconButton, Button } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  TeacherProfile: undefined;
  ClassScreen: {
    subject: string;
    schedule: string;
    classroom: string;
  };
};

type ClassScreenRouteProp = RouteProp<RootStackParamList, 'ClassScreen'>;

const MAX_ABSENCES = 5;

interface AttendanceRecord {
  id: string;
  studentName: string;
  accumulatedAbsences: number;
  isPresent: boolean;
}

const AttendanceScreen: React.FC = () => {
  const route = useRoute<ClassScreenRouteProp>();
  const navigation = useNavigation();

  const defaultParams = {
    subject: "Sin nombre",
    schedule: "Horario no disponible",
    classroom: "Aula no disponible",
  };

  const { subject, schedule, classroom } = route.params || defaultParams;

  const courseInfo = {
    name: subject,
    schedule: schedule,
    classroom: classroom,
    group: "ISC09A",
    maxAbsences: MAX_ABSENCES,
    totalStudents: 24,
  };

  const attendanceRecords: AttendanceRecord[] = [
    {
      id: '1',
      studentName: 'Sara Itzel García Vidal',
      accumulatedAbsences: 3,
      isPresent: true,
    },
    {
      id: '2',
      studentName: 'Sara Itzel García Vidal',
      accumulatedAbsences: 4,
      isPresent: false,
    },
    {
      id: '3',
      studentName: 'Sara Itzel García Vidal',
      accumulatedAbsences: 4,
      isPresent: true,
    },
    {
      id: '4',
      studentName: 'Sara Itzel García Vidal',
      accumulatedAbsences: 2,
      isPresent: false,
    },
  ];

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
      {/* Appbar */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={courseInfo.name} />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      {/* Course Information */}
      <Card style={styles.courseInfoCard}>
        <Card.Content>
          <Text variant="bodyMedium">Horario: {courseInfo.schedule}</Text>
          <Text variant="bodyMedium">Aula: {courseInfo.classroom}</Text>
          <Text variant="bodyMedium">Carrera y Grupo: {courseInfo.group}</Text>
          <Text variant="bodyMedium">Límite de inasistencias: {courseInfo.maxAbsences}</Text>
        </Card.Content>
      </Card>

      {/* Total Counter */}
      <Card style={styles.totalCounterCard}>
        <Card.Content style={styles.totalCounterContent}>
          <Text variant="bodySmall">TOTAL</Text>
          <Text variant="headlineMedium">{courseInfo.totalStudents}</Text>
          <Text variant="bodySmall">ASISTENCIAS</Text>
        </Card.Content>
      </Card>

      {/* Attendance List Header */}
      <View style={styles.listHeader}>
        <Text variant="titleMedium">Asistencias - Noviembre 05</Text>
        <IconButton icon="magnify" size={24} onPress={() => {}} />
      </View>

      {/* Attendance List */}
      <ScrollView>
        {attendanceRecords.map((record) => (
          <Card key={record.id} style={styles.attendanceCard}>
            <Card.Content style={styles.attendanceContent}>
              <Avatar.Text 
                size={40} 
                label={record.studentName.charAt(0)} 
                style={record.isPresent ? styles.presentAvatar : styles.absentAvatar} 
              />
              <View style={styles.attendanceDetails}>
                <Text variant="bodyMedium">{record.studentName}</Text>
                <Text variant="bodySmall">Inasistencias acumuladas</Text>
                <ProgressBar
                  progress={record.accumulatedAbsences / MAX_ABSENCES}
                  color={record.accumulatedAbsences >= MAX_ABSENCES ? '#F44336' : '#4CAF50'}
                  style={styles.progressBar}
                />
                <Text variant="bodySmall">
                  {record.accumulatedAbsences}/{MAX_ABSENCES}
                </Text>
              </View>
              <IconButton 
                icon={record.isPresent ? "check-circle" : "close-circle"} 
                size={24} 
                iconColor={record.isPresent ? '#4CAF50' : '#F44336'} 
              />
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  courseInfoCard: {
    margin: 16,
    borderRadius: 8,
  },
  totalCounterCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  totalCounterContent: {
    alignItems: 'center',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  attendanceCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  attendanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendanceDetails: {
    flex: 1,
    marginLeft: 16,
  },
  progressBar: {
    height: 8,
    marginVertical: 4,
    borderRadius: 4,
  },
  presentAvatar: {
    backgroundColor: '#4CAF50',
  },
  absentAvatar: {
    backgroundColor: '#F44336',
  },
  logoutButton: {
    margin: 16,
    borderRadius: 8,
  },
});

export default AttendanceScreen;
