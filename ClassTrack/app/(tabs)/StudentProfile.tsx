import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Image, View } from 'react-native';
import { Card, Title, Paragraph, ProgressBar, Text, Button, Appbar, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

interface AbsenceData {
  subject: string;
  count: number;
  attendanceIds: string[]; // Corregido a 'attendanceIds' (array de IDs de asistencia)
}

const StudentProfile = () => {
  const router = useRouter();
  const { studentId } = useLocalSearchParams();

  const [studentData, setStudentData] = useState({ name: '', studentID: '', email: '' });
  const [absenceData, setAbsenceData] = useState<AbsenceData[]>([]);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false); // Para alternar el modo de edición
  const [updatedData, setUpdatedData] = useState(studentData); // Para almacenar los valores actualizados

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Obtener los datos del estudiante
        const studentResponse = await axios.post(
          'http://localhost:3000/api/graphql',
          {
            query: `
              query Query($where: UserWhereInput!) {
                users(where: $where) {
                  name
                  studentID
                  email
                }
              }
            `,
            variables: { where: { id: { equals: studentId } } },
          }
        );
        setStudentData(studentResponse.data.data.users[0]);
        setUpdatedData(studentResponse.data.data.users[0]);

        // Obtener las asistencias del estudiante
        const absenceResponse = await axios.post(
          'http://localhost:3000/api/graphql',
          {
            query: `
              query Query($where: AttendanceWhereInput!) {
                attendances(where: $where) {
                  id
                  class {
                    name
                  }
                }
              }
            `,
            variables: { where: { user: { id: { equals: studentId } } } },
          }
        );

        const classCounts: { [key: string]: number } = {};
        const attendanceIds: { [key: string]: string[] } = {}; // Para almacenar los attendanceIds por clase

        absenceResponse.data.data.attendances.forEach((attendance: any) => {
          const className = attendance.class.name;
          if (classCounts[className]) {
            classCounts[className] += 1;
            attendanceIds[className].push(attendance.id);
          } else {
            classCounts[className] = 1;
            attendanceIds[className] = [attendance.id];
          }
        });

        // Formatear los datos de ausencias
        const formattedAbsenceData = Object.keys(classCounts).map((className) => ({
          subject: className,
          count: classCounts[className],
          attendanceIds: attendanceIds[className], // Usar el array de IDs de asistencia
        }));

        setAbsenceData(formattedAbsenceData);
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchStudentData();
  }, [studentId]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('userEmail');
      router.push('/'); // Redirige al login o pantalla principal
    } catch (error) {
      console.error('Error durante el cierre de sesión:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3000/api/graphql',
        {
          query: `
            mutation UpdateUser($where: UserWhereUniqueInput!, $data: UserUpdateInput!) {
              updateUser(where: $where, data: $data) {
                name
                studentID
                email
              }
            }
          `,
          variables: {
            where: { id: studentId },
            data: {
              name: updatedData.name,
              studentID: updatedData.studentID,
              email: updatedData.email,
            },
          },
        }
      );

      if (response.data.data.updateUser) {
        setStudentData(response.data.data.updateUser);
        setEditMode(false);
        alert('Datos actualizados correctamente.');
      } else {
        alert('Error al actualizar los datos.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Hubo un error al intentar actualizar los datos.');
    }
  };

  const handleDelete = async () => {
    try {
      // Eliminar las asistencias por attendanceId
      for (const { attendanceIds } of absenceData) {
        for (const attendanceId of attendanceIds) {
          await axios.post(
            'http://localhost:3000/api/graphql',
            {
              query: `
                mutation DeleteAttendance($where: AttendanceWhereUniqueInput!) {
                  deleteAttendance(where: $where) {
                    id
                  }
                }
              `,
              variables: { where: { id: attendanceId } },
            }
          );
        }
      }

      // Eliminar al estudiante
      await axios.post(
        'http://localhost:3000/api/graphql',
        {
          query: `
            mutation DeleteUser($where: UserWhereUniqueInput!) {
              deleteUser(where: $where) {
                id
                name
              }
            }
          `,
          variables: { where: { id: studentId } },
        }
      );

      // Limpiar los datos del usuario en AsyncStorage
      await AsyncStorage.clear();

      // Redirigir a la pantalla de estudiantes
      router.push('/StudentsScreen');
    } catch (error) {
      console.error('Error deleting user and attendances:', error);
    }
  };

  const renderAbsenceBar = (subject: string, count: number) => {
    const progress = count / 10;
    const isCritical = count >= 10;

    return (
      <Card style={styles.card} key={subject}>
        <Card.Content>
          <View style={styles.subjectRow}>
            <Title style={styles.subjectTitle} numberOfLines={1}>
              {subject}
            </Title>
            <Text style={[styles.absenceText, isCritical && styles.criticalText]}>
              {count}/10
            </Text>
          </View>
          <ProgressBar progress={progress} color={isCritical ? '#F44336' : '#6200EE'} style={styles.progressBar} />
        </Card.Content>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbarHeader}>
      <Appbar.BackAction color="white" onPress={() => router.push('/(tabs)/StudentsScreen')} />
        <Appbar.Content title="Perfil del Estudiante" titleStyle={styles.appbarTitle} />
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
              {editMode ? (
                <>
                  <TextInput
                    label="Nombre"
                    value={updatedData.name}
                    onChangeText={(text) => setUpdatedData({ ...updatedData, name: text })}
                  />
                  <TextInput
                    label="ID"
                    value={updatedData.studentID}
                    onChangeText={(text) => setUpdatedData({ ...updatedData, studentID: text })}
                  />
                  <TextInput
                    label="Email"
                    value={updatedData.email}
                    onChangeText={(text) => setUpdatedData({ ...updatedData, email: text })}
                  />
                  <Button mode="contained" onPress={handleUpdate} style={styles.updateButton}>
                    Actualizar
                  </Button>
                </>
              ) : (
                <>
                  <Title>{studentData.name}</Title>
                  <Text>{studentData.studentID}</Text>
                  <Text>{studentData.email}</Text>
                  <Button mode="contained" onPress={() => setEditMode(true)} style={styles.editButton}>
                    Editar
                  </Button>
                </>
              )}
            </View>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Asistencias</Title>
            {absenceData.length > 0 ? (
              absenceData.map(({ subject, count }) => renderAbsenceBar(subject, count))
            ) : (
              <Text>No se encontraron asistencias para este estudiante.</Text>
            )}
          </Card.Content>
        </Card>
        <Button mode="contained" onPress={handleDelete} style={styles.deleteButton}>
          Eliminar Estudiante
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
  },
  appbarHeader: {
    backgroundColor: '#1e3a63'
  },
  appbarTitle: {
    color: 'white' 
  },
  profileCard: {
    marginBottom: 16,
  },
  profileContent: {
    flexDirection: 'row',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  editButton: {
    marginTop: 16,
    backgroundColor: '#1e3a63'
  },
  updateButton: {
    marginTop: 16,
  },
  card: {
    marginBottom: 16,
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  absenceText: {
    fontSize: 14,
    color: '#000',
  },
  criticalText: {
    color: '#F44336',
  },
  progressBar: {
    marginTop: 8,
  },
  deleteButton: {
    marginTop: 16,
    backgroundColor: '#1e3a63'
  },
});

export default StudentProfile;
