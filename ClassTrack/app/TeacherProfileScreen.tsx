import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Text,
  Button,
  Appbar,
  TextInput,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

interface Class {
  name: string;
  schedule: string;
  description: string;
  id: string;
}

const windowWidth = Dimensions.get('window').width;

const TeacherProfileScreen = () => {
  const router = useRouter();
  const { teacherId } = useLocalSearchParams();

  const [teacherData, setTeacherData] = useState({ name: '', studentID: '', email: '' });
  const [updatedData, setUpdatedData] = useState(teacherData);
  const [editMode, setEditMode] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teacherId) {
      setError('No teacherId found');
      setLoading(false);
      return;
    }

    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        setError(null);

        const teacherResponse = await axios.post(
          'http://localhost:3000/api/graphql',
          {
            query: `
              query Query($where: UserWhereInput!) {
                users(where: $where) {
                  id
                  name
                  studentID
                  email
                }
              }
            `,
            variables: { where: { id: { equals: teacherId } } },
          }
        );

        if (teacherResponse.data?.data?.users?.length > 0) {
          const fetchedData = teacherResponse.data.data.users[0];
          setTeacherData(fetchedData);
          setUpdatedData(fetchedData);
        } else {
          throw new Error('No teacher data found');
        }

        const classResponse = await axios.post(
          'http://localhost:3000/api/graphql',
          {
            query: `
              query Query($where: ClassWhereInput!) {
                classes(where: $where) {
                  id
                  name
                  schedule
                  description
                }
              }
            `,
            variables: {
              where: {
                teacher: {
                  id: {
                    equals: teacherId,
                  },
                },
              },
            },
          }
        );

        setClasses(classResponse.data.data.classes || []);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [teacherId]);

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
            where: { id: teacherId },
            data: {
              name: updatedData.name,
              studentID: updatedData.studentID,
              email: updatedData.email,
            },
          },
        }
      );

      if (response.data.data.updateUser) {
        setTeacherData(response.data.data.updateUser);
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar esta cuenta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
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
                  variables: { where: { id: teacherId } },
                }
              );
              await AsyncStorage.clear();
              router.push('/TeachersScreen');
            } catch (error) {
              console.error('Error deleting user:', error);
              alert('Hubo un error al eliminar la cuenta.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.containerCentered}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.containerCentered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  // Para calcular ancho de cada tarjeta en grid 3 columnas con padding/margin:
  const cardMargin = 8;
  const numColumns = 3;
  const cardWidth = (windowWidth - cardMargin * 2 * numColumns) / numColumns;

  const renderClassCard = ({ item }: { item: Class }) => (
    <TouchableOpacity
      style={[styles.classCard, { width: cardWidth, margin: cardMargin }]}
      onPress={() =>
        router.push({
          pathname: '/classScreen',
          params: {
            subject: item.name,
            schedule: item.schedule,
            classroom: item.description,
          },
        })
      }
    >
      <Card>
        <Card.Content>
          <Title style={styles.classTitle}>{item.name}</Title>
          <Paragraph style={styles.classText}>{item.description}</Paragraph>
          <Text style={styles.classSchedule}>Horario: {item.schedule}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Perfil del Docente" titleStyle={styles.appbarTitle} />
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
                    style={{ marginBottom: 8 }}
                  />
                  <TextInput
                    label="ID"
                    value={updatedData.studentID}
                    onChangeText={(text) => setUpdatedData({ ...updatedData, studentID: text })}
                    style={{ marginBottom: 8 }}
                  />
                  <TextInput
                    label="Email"
                    value={updatedData.email}
                    onChangeText={(text) => setUpdatedData({ ...updatedData, email: text })}
                    style={{ marginBottom: 8 }}
                  />
                  <Button mode="contained" onPress={handleUpdate}>
                    Guardar Cambios
                  </Button>
                </>
              ) : (
                <>
                  <Title style={styles.profileTitle}>{teacherData.name}</Title>
                  <Paragraph style={styles.profileText}>ID: {teacherData.studentID}</Paragraph>
                  <Paragraph style={styles.profileText}>Email: {teacherData.email}</Paragraph>
                  <Button
                    style={styles.editButton}
                    mode="text"
                    onPress={() => setEditMode(true)}
                  >
                    Editar Información
                  </Button>
                </>
              )}
            </View>
          </Card.Content>
        </Card>

        <Title style={styles.classesTitle}>Clases Asignadas</Title>

        <FlatList
          data={classes}
          renderItem={renderClassCard}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />

      </ScrollView>

      <Button
        mode="contained"
        onPress={() => router.push('/(drawer)/TeachersScreen')}
        style={styles.backButton}
        icon="arrow-left"
      >
        Regresar
      </Button>
      <Button
        mode="contained"
        onPress={handleDelete}
        style={styles.deleteButton}
        icon="delete"
      >
        Eliminar Cuenta
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  containerCentered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 80 },
  profileCard: { marginBottom: 16, elevation: 2 },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 58, 99, 0.2)',
  },
  profileImage: { width: 60, height: 60, borderRadius: 30, marginRight: 16 },
  profileInfo: { flex: 1 },
  profileTitle: {
    color: '#1e3a63',
    fontWeight: 'bold',
    fontSize: 20,
  },
  profileText: { color: '#1e3a63', fontSize: 16 },
  classesTitle: { marginVertical: 16, fontSize: 20, fontWeight: 'bold' },
  classCard: {
    marginBottom: 12,
  },
  classTitle: { fontSize: 18, fontWeight: 'bold' },
  classText: { fontSize: 14 },
  classSchedule: { fontSize: 12, color: '#777' },
  appbar: { backgroundColor: '#1e3a63' },
  appbarTitle: { fontWeight: 'bold', color: 'white' },
  errorText: { color: 'red', textAlign: 'center' },
  backButton: { marginTop: 16, backgroundColor: '#1e3a63' },
  deleteButton: { marginTop: 16, marginBottom: 16, backgroundColor: '#1e3a63' },
  editButton: {
    marginTop: 16,
    backgroundColor: 'rgba(30, 58, 99, 0.1)',
  },
});

export default TeacherProfileScreen;
