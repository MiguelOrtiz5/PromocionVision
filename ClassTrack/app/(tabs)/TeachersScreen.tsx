import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  TeacherProfileScreen: {
    teacherId: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TeacherProfileScreen'>;

interface Teacher {
  id: string;
  name: string;
  studentID: string;
  email: string;
}

const TeacherCard: React.FC<Teacher> = ({ id, name, studentID, email }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate('TeacherProfileScreen', { teacherId: id });
  };

  return (
    <TouchableOpacity style={styles.teacherCard} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.teacherInfo}>
        <Text style={styles.teacherName}>{name}</Text>
        <Text style={styles.teacherDetails}>ID: {studentID}</Text>
        <Text style={styles.teacherDetails}>Email: {email}</Text>
      </View>
      <FontAwesome name="chevron-right" size={20} color="#666" />
    </TouchableOpacity>
  );
};

const TeachersScreen: React.FC = () => {
  const [sortOption, setSortOption] = useState<'name' | 'studentID'>('name');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    studentID: '',
    email: '',
    password: '',
  });
  const [isSorted, setIsSorted] = useState<boolean>(false);

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
              email
              studentID
            }
          }
        `,
        variables: {
          data: {
            name: newTeacher.name,
            studentID: newTeacher.studentID,
            email: newTeacher.email,
            password: '12345678', // Contraseña predeterminada
            role: 'teacher',
          },
        },
      });

      const createdTeacher = response.data.data.createUser;
      if (createdTeacher) {
        setTeachers([...teachers, createdTeacher]);
        Alert.alert('Success', 'Teacher created successfully!');
        setModalVisible(false);
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.error('Error creating teacher:', error);
      Alert.alert('Error', 'Failed to create teacher. Please try again.');
    }
  };



  const sortData = () => {
    if (isSorted) {
      return [...teachers].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      return teachers;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Teacher List</Text>
        <TouchableOpacity onPress={() => setIsSorted(!isSorted)}>
          <FontAwesome
            name={isSorted ? 'sort-alpha-asc' : 'sort'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={sortData()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TeacherCard
            id={item.id}
            name={item.name}
            studentID={item.studentID}
            email={item.email}
          />
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Teacher</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
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
          {/* Campo de contraseña eliminado */}
          <Button title="Create" onPress={handleCreateTeacher} />
          <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e3a63',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  teacherCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  teacherDetails: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    paddingBottom: 16,
  },
  addButton: {
    backgroundColor: '#1e3a63',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  input: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default TeachersScreen;