import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import {
  Appbar,
  Card,
  Text,
  ActivityIndicator,
  ProgressBar,
  Button,
} from 'react-native-paper';
import {
  useRoute,
  useNavigation,
  RouteProp,
} from '@react-navigation/native';
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

  const [errorShown, setErrorShown] = useState(false);

  useEffect(() => {
    if (!id && !errorShown) {
      setErrorShown(true);
      Alert.alert('Error', 'ID de clase no encontrado.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  }, [id, errorShown, navigation]);

  if (!id) {
    // Retorna null mientras se muestra la alerta y se navega atrás
    return null;
  }

  const {
    loading: classLoading,
    error: classError,
    data: classData,
  } = useQuery(GET_CLASS_DETAILS, {
    variables: { where: { id: { equals: id } } },
  });

  const {
    loading: attendanceLoading,
    error: attendanceError,
    data: attendanceData,
  } = useQuery(GET_ATTENDANCES, {
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
      pathname: '/StudentProfile',
      params: { studentId },
    });
  };

  if (classLoading || attendanceLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1e3a63" />
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

  const attendanceCounts: {
    [key: string]: { name: string; count: number };
  } = {};
  attendances.forEach((attendance: any) => {
    const userId = attendance.user.id;
    const userName = attendance.user.name;

    if (!attendanceCounts[userId]) {
      attendanceCounts[userId] = { name: userName, count: 1 };
    } else {
      attendanceCounts[userId].count += 1;
    }
  });

  const renderAttendanceCard = (
    studentId: string,
    studentName: string,
    count: number
  ) => {
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
            color={isCritical ? '#e53935' : '#34D399'}
            style={styles.progressBar}
          />
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.BackAction color="white" onPress={() => router.push('/(drawer)/TeacherClassesScreen')} />
        <Appbar.Content title={classInfo?.name || 'Clase'} titleStyle={styles.appbarTitle} />
      </Appbar.Header>

      <Card style={styles.courseInfoCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Información de la clase</Text>
          <Text style={styles.infoText}>📚 Nombre: {classInfo?.name || 'No disponible'}</Text>
          <Text style={styles.infoText}>⏰ Horario: {classInfo?.schedule || 'No disponible'}</Text>
          <Text style={styles.infoText}>📝 Descripción: {classInfo?.description || 'No disponible'}</Text>
          <Text style={styles.infoText}>👨‍🏫 Docente: {classInfo?.teacher?.name || 'No asignado'}</Text>
        </Card.Content>
      </Card>

      <ScrollView style={{ marginTop: 8 }}>
        <Text style={styles.sectionTitle}>📋 Asistencia</Text>
        {Object.entries(attendanceCounts).map(([userId, { name, count }]) =>
          renderAttendanceCard(userId, name, count)
        )}
      </ScrollView>

      <Button
        mode="contained"
        onPress={handleDeleteClass}
        style={styles.deleteButton}
        icon="delete"
        labelStyle={{ fontWeight: 'bold' }}
      >
        Eliminar Clase
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#1e3a63',
  },
  appbarHeader: {
    backgroundColor: '#1e3a63',
  },
  appbarTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#e53935',
    fontSize: 16,
  },
  courseInfoCard: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e3a63',
  },
  infoText: {
    fontSize: 15,
    marginVertical: 2,
  },
  attendanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  attendanceName: {
    fontSize: 16,
    fontWeight: '600',
  },
  attendanceCount: {
    fontSize: 14,
    color: '#555',
  },
  criticalText: {
    color: '#e53935',
  },
  progressBar: {
    height: 8,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
  },
  attendanceCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 10,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    elevation: 4,
  },
  deleteButton: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#ff0000',
  },
});

export default ClassScreen;
