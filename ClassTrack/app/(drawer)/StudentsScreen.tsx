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
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  StudentProfile: { studentId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'StudentProfile'>;

interface Student {
  id: string;
  name: string;
  studentID: string;
  email: string;
}

const StudentCard: React.FC<{ student: Student; cardWidth: number }> = ({ student, cardWidth }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate('StudentProfile', { studentId: student.id });
  };

  return (
    <TouchableOpacity
      style={[styles.studentCard, { width: cardWidth }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text style={styles.studentName}>{student.name}</Text>
      <View style={styles.tag}>
        <FontAwesome name="id-badge" size={14} color="#4a5568" />
        <Text style={styles.tagText}>ID: {student.studentID}</Text>
      </View>
      <View style={styles.tag}>
        <FontAwesome name="envelope" size={14} color="#4a5568" />
        <Text style={styles.tagText}>{student.email}</Text>
      </View>
      <View style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>Ver Perfil</Text>
      </View>
    </TouchableOpacity>
  );
};

const StudentsScreen: React.FC = () => {
  const { width } = useWindowDimensions();

  // Responsive columns: 1 para móvil pequeño, 2 para tablets, 3 para desktop
  let numColumns = 1;
  if (width >= 900) numColumns = 3;
  else if (width >= 600) numColumns = 2;
  const flatListKey = `flatlist-columns-${numColumns}`;

  const cardMargin = 12;
  const cardWidth = (width - cardMargin * (numColumns + 1)) / numColumns;

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOption, setFilterOption] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    studentID: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
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
          variables: {
            where: { role: { equals: 'student' } },
          },
        });
        setStudents(response.data.data.users);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleCreateStudent = async () => {
    if (!newStudent.name || !newStudent.studentID || !newStudent.email || !newStudent.password) {
      alert('Por favor llena todos los campos.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/api/graphql', {
        query: `
          mutation Mutation($data: UserCreateInput!) {
            createUser(data: $data) {
              id
              name
              email
              studentID
            }
          }
        `,
        variables: {
          data: {
            name: newStudent.name,
            studentID: newStudent.studentID,
            email: newStudent.email,
            password: newStudent.password,
            role: 'student',
          },
        },
      });
      const createdStudent = response.data.data.createUser;
      if (createdStudent) {
        setStudents((prev) => [...prev, createdStudent]);
        alert('Estudiante creado correctamente!');
        setModalVisible(false);
        setNewStudent({ name: '', studentID: '', email: '', password: '' });
      }
    } catch (error) {
      console.error('Error creating student:', error);
      alert('No se pudo crear el estudiante.');
    }
  };

  // Filtrado simple
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(filterOption.toLowerCase()) ||
      s.studentID.toLowerCase().includes(filterOption.toLowerCase()) ||
      s.email.toLowerCase().includes(filterOption.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#38a169" />
        <Text style={{ marginTop: 10 }}>Cargando estudiantes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header con botón verde arriba a la derecha */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Estudiantes</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <FontAwesome name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Filtro */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar estudiantes..."
          value={filterOption}
          onChangeText={setFilterOption}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Lista en grid */}
      <FlatList
        key={flatListKey}
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <StudentCard student={item} cardWidth={cardWidth} />}
        numColumns={numColumns}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal Crear Estudiante */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Nuevo Estudiante</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={newStudent.name}
              onChangeText={(text) => setNewStudent({ ...newStudent, name: text })}
              autoCapitalize="words"
            />
            <TextInput
              style={styles.input}
              placeholder="ID Estudiante"
              value={newStudent.studentID}
              onChangeText={(text) => setNewStudent({ ...newStudent, studentID: text })}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={newStudent.email}
              onChangeText={(text) => setNewStudent({ ...newStudent, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              value={newStudent.password}
              onChangeText={(text) => setNewStudent({ ...newStudent, password: text })}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancelar" color="#cc3333" onPress={() => setModalVisible(false)} />
              <Button title="Crear" color="#38a169" onPress={handleCreateStudent} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fafc' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e3a63',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#38a169',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#38a169',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f7fafc',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  gridContainer: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 32,
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#edf2f7',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  tagText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#4a5568',
  },
  detailsButton: {
    marginTop: 12,
    backgroundColor: '#22c55e',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default StudentsScreen;
