import React from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { Appbar, Card, Text, ActivityIndicator, ProgressBar, Button } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { gql, useQuery, useMutation } from '@apollo/client';
import { router } from 'expo-router';

type RootStackParamList = {
  ClassScreen: {
    id: string;
  };
};

type ClassScreenRouteProp = RouteProp<RootStackParamList, 'ClassScreen'>;

const GET_CLASS_DETAILS = gql`
  query Query($where: ClassWhereInput!) {
    classes(where: $where) {
      id
      name
      schedule
      description
      teacher {
        name
      }
    }
  }
`;

const GET_ATTENDANCES = gql`
  query Attendance($where: AttendanceWhereInput!) {
    attendances(where: $where) {
      class {
        id
        name
      }
      user {
        id
        name
      }
    }
  }
`;

const DELETE_CLASS = gql`
  mutation DeleteClass($where: ClassWhereUniqueInput!) {
    deleteClass(where: $where) {
      id
      name
    }
  }
`;

const ClassScreen: React.FC = () => {
  const route = useRoute<ClassScreenRouteProp>();
  const navigation = useNavigation();

  const { id } = route.params || {};

  if (!id) {
    Alert.alert('Error', 'ID de clase no encontrado.');
    navigation.goBack();
    return null;
  }

  const { loading: classLoading, error: classError, data: classData } = useQuery(GET_CLASS_DETAILS, {
    variables: { where: { id: { equals: id } } },
  });

  const { loading: attendanceLoading, error: attendanceError, data: attendanceData } = useQuery(GET_ATTENDANCES, {
    variables: { where: { class: { id: { equals: id } } } },
  });

  const [deleteClass] = useMutation(DELETE_CLASS, {
    onCompleted: () => {
      Alert.alert('Éxito', 'La clase ha sido eliminada.');
      navigation.goBack();
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });

  const handleDeleteClass = () => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que deseas eliminar esta clase?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteClass({ variables: { where: { id } } });
          },
        },
      ]
    );
  };

  const handleStudentClick = (studentId: string) => {
    router.push({
      pathname: '/(tabs)/StudentProfile',
      params: { studentId },
    });
  };

  if (classLoading || attendanceLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loaderText}>Cargando información...</Text>
      </View>
    );
  }

  if (classError || attendanceError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error: {classError?.message || attendanceError?.message}
        </Text>
      </View>
    );
  }

  const classInfo = classData?.classes?.[0];
  const attendances = attendanceData?.attendances || [];

  const renderAttendanceCard = (studentId: string, studentName: string, count: number) => {
    const progress = count / 10;
    const isCritical = count >= 10;

    return (
      <Card
        style={styles.attendanceCard}
        key={studentId}
        onPress={() => handleStudentClick(studentId)}
      >
        <Card.Content>
          <View style={styles.attendanceRow}>
            <Text style={styles.attendanceName}>{studentName}</Text>
            <Text style={[styles.attendanceCount, isCritical && styles.criticalText]}>
              {count}/10
            </Text>
          </View>
          <ProgressBar
            progress={progress}
            color={isCritical ? '#F44336' : '#6200EE'}
            style={styles.progressBar}
          />
        </Card.Content>
      </Card>
    );
  };

  const attendanceCounts: { [key: string]: { name: string; count: number } } = {};
  attendances.forEach((attendance: any) => {
    const userId = attendance.user.id;
    const userName = attendance.user.name;

    if (!attendanceCounts[userId]) {
      attendanceCounts[userId] = { name: userName, count: 1 };
    } else {
      attendanceCounts[userId].count += 1;
    }
  });

  return (
    <View style={styles.container}>
      {/* Appbar */}
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.BackAction color="white" onPress={() => router.push('/(tabs)/TeacherClassesScreen')} />
        <Appbar.Content title={classInfo?.name || 'Clase'} titleStyle={styles.appbarTitle} />
      </Appbar.Header>

      {/* Class Information */}
      <Card style={styles.courseInfoCard}>
        <Card.Content>
          <Text variant="bodyMedium">Nombre: {classInfo?.name || 'No disponible'}</Text>
          <Text variant="bodyMedium">Horario: {classInfo?.schedule || 'No disponible'}</Text>
          <Text variant="bodyMedium">Descripción: {classInfo?.description || 'No disponible'}</Text>
          <Text variant="bodyMedium">Docente: {classInfo?.teacher?.name || 'No asignado'}</Text>
        </Card.Content>
      </Card>

      {/* Attendance List */}
      <ScrollView>
        {Object.entries(attendanceCounts).map(([userId, { name, count }]) =>
          renderAttendanceCard(userId, name, count)
        )}
      </ScrollView>

      {/* Delete Button */}
      <Button
        mode="contained"
        onPress={handleDeleteClass}
        style={styles.deleteButton}
        icon="delete"
      >
        Eliminar Clase
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6200EE',
  },
  appbarHeader: {
    backgroundColor: '#1e3a63',
  },
  appbarTitle: {
    color: 'white',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
  },
  courseInfoCard: {
    margin: 16,
    borderRadius: 8,
  },
  attendanceCard: {
    margin: 16,
    borderRadius: 8,
  },
  attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  attendanceName: {
    fontSize: 16,
    fontWeight: '600',
  },
  attendanceCount: {
    fontSize: 14,
    color: '#757575',
  },
  criticalText: {
    color: '#F44336',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  deleteButton: {
    margin: 16,
    borderRadius: 8,
    backgroundColor: '#1e3a63',
  },
});

export default ClassScreen;
