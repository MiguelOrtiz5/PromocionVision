// TeachersScreen.tsx - mismo diseño que ClassesScreen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  ActivityIndicator,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Tipos
interface Teacher {
  id: string;
  name: string;
  studentID: string;
  email: string;
}

type RootStackParamList = {
  TeacherProfileScreen: {
    teacherId: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TeacherProfileScreen'>;

const TeachersScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: '', studentID: '', email: '' });

  let numColumns = 1;
  if (width >= 900) numColumns = 3;
  else if (width >= 600) numColumns = 2;
  const cardMargin = 12;
  const cardWidth = (width - cardMargin * (numColumns + 1)) / numColumns;

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/graphql', {
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
          variables: { where: { role: { equals: 'teacher' } } },
        });
        setTeachers(response.data.data.users);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const handleCreateTeacher = async () => {
    if (!newTeacher.name || !newTeacher.studentID || !newTeacher.email) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/api/graphql', {
        query: `
          mutation Mutation($data: UserCreateInput!) {
            createUser(data: $data) {
              id
              name
              studentID
              email
            }
          }
        `,
        variables: {
          data: {
            name: newTeacher.name,
            studentID: newTeacher.studentID,
            email: newTeacher.email,
            password: '12345678',
            role: 'teacher',
          },
        },
      });
      const createdTeacher = response.data.data.createUser;
      setTeachers((prev) => [...prev, createdTeacher]);
      setModalVisible(false);
      setNewTeacher({ name: '', studentID: '', email: '' });
    } catch (error) {
      console.error('Error creating teacher:', error);
      Alert.alert('Error', 'Failed to create teacher');
    }
  };

  const renderItem = ({ item }: { item: Teacher }) => (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth, marginLeft: cardMargin }]}
      onPress={() => navigation.navigate('TeacherProfileScreen', { teacherId: item.id })}
      activeOpacity={0.8}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.detail}>ID: {item.studentID}</Text>
      <Text style={styles.detail}>Email: {item.email}</Text>
      <View style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>Ver Detalles</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" color="#38a169" /></View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👩‍🏫 Teachers</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <FontAwesome name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add Teacher</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={teachers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        key={`teachers-${numColumns}`}
        numColumns={numColumns}
        contentContainerStyle={styles.gridContainer}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Nuevo Docente</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={newTeacher.name}
              onChangeText={(text) => setNewTeacher({ ...newTeacher, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="ID"
              value={newTeacher.studentID}
              onChangeText={(text) => setNewTeacher({ ...newTeacher, studentID: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={newTeacher.email}
              onChangeText={(text) => setNewTeacher({ ...newTeacher, email: text })}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#ccc" />
              <Button title="Crear" onPress={handleCreateTeacher} color="#38a169" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fafc' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, backgroundColor: '#1e3a63',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  addButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#38a169',
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
  },
  addButtonText: { color: '#fff', fontWeight: '600', marginLeft: 6 },
  gridContainer: { paddingHorizontal: 12, paddingTop: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#1a202c', marginBottom: 4 },
  detail: { fontSize: 14, color: '#4a5568', marginBottom: 2 },
  detailsButton: {
    marginTop: 10, backgroundColor: '#22c55e', paddingVertical: 10,
    borderRadius: 8, alignItems: 'center',
  },
  detailsButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '90%',
  },
  modalTitle: {
    fontSize: 20, fontWeight: 'bold', color: '#2d3748', marginBottom: 12, textAlign: 'center',
  },
  input: {
    borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8,
    padding: 10, marginBottom: 12, backgroundColor: '#f9fafb',
  },
  modalButtons: {
    flexDirection: 'row', justifyContent: 'space-between',
  },
});

export default TeachersScreen;
