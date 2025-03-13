import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'expo-router';

const GET_CLASSES = gql`
  query GetClasses {
    classes {
      id
      name
      schedule
      description
    }
  }
`;

const GET_TEACHERS = gql`
  query Query($where: UserWhereInput!) {
    users(where: $where) {
      id
      name
    }
  }
`;

const CREATE_CLASS = gql`
  mutation Mutation($data: ClassCreateInput!) {
    createClass(data: $data) {
      name
      description
      schedule
      teacher {
        name
      }
    }
  }
`;

const ClassCard: React.FC<{ classData: any; onPress: (classData: any) => void }> = ({
  classData,
  onPress,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.classCard, isHovered && styles.classCardHovered]}
      onPressIn={() => setIsHovered(true)} // Simulando el hover al presionar
      onPressOut={() => setIsHovered(false)} // Restaurando el estado cuando se deja de presionar
      onPress={() => onPress(classData)}
    >
      <View style={styles.classInfo}>
        <Text style={styles.classSubject}>{classData.name}</Text>
        <Text style={styles.classDetails}>{classData.schedule}</Text>
        <Text style={styles.classDetails}>{classData.description}</Text>
      </View>
      <FontAwesome name="chevron-right" size={20} color="#666" />
    </TouchableOpacity>
  );
};

const ClassesScreen: React.FC = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [className, setClassName] = useState('');
  const [classDescription, setClassDescription] = useState('');
  const [classSchedule, setClassSchedule] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  const { loading: loadingClasses, error: errorClasses, data: dataClasses } = useQuery(GET_CLASSES);
  const { loading: loadingTeachers, data: dataTeachers } = useQuery(GET_TEACHERS, {
    variables: { where: { role: { equals: 'teacher' } } },
  });

  const [createClass] = useMutation(CREATE_CLASS, {
    refetchQueries: [GET_CLASSES],
    onCompleted: () => setModalVisible(false),
  });

  if (loadingClasses) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (errorClasses) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading classes: {errorClasses.message}</Text>
      </View>
    );
  }

  const handleClassPress = (classData: any) => {
    router.push({
      pathname: '/(tabs)/classScreen',
      params: {
        id: classData.id, // Corrected to pass class ID
      },
    });
  };

  const handleCreateClass = () => {
    if (!className || !classSchedule || !selectedTeacher) return;
    createClass({
      variables: {
        data: {
          name: className,
          description: classDescription,
          schedule: classSchedule,
          teacher: { connect: { id: selectedTeacher } },
        },
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Classes</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Class</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        contentContainerStyle={styles.listContainer}
        data={dataClasses.classes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ClassCard classData={item} onPress={handleClassPress} />}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Class</Text>
            <TextInput
              style={styles.input}
              placeholder="Class Name"
              value={className}
              onChangeText={setClassName}
            />
            <TextInput
              style={styles.input}
              placeholder="Class Schedule"
              value={classSchedule}
              onChangeText={setClassSchedule}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={classDescription}
              onChangeText={setClassDescription}
            />

            {loadingTeachers ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <RNPickerSelect
                onValueChange={(value) => setSelectedTeacher(value)}
                items={dataTeachers.users.map((teacher: any) => ({
                  label: teacher.name,
                  value: teacher.id,
                }))}
                style={pickerSelectStyles}
                placeholder={{ label: 'Select a teacher', value: null }}
              />
            )}

            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Create" onPress={handleCreateClass} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: 'red' },
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
  addButton: {
    backgroundColor: '#1e3a63',
    borderRadius: 8,
    padding: 10,
  },
  addButtonText: { color: '#fff', fontWeight: '600' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  classInfo: {
    flex: 1,
  },
  classSubject: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  classDetails: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    paddingBottom: 16,
    marginTop:16,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  classCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  classCardHovered: {
    shadowColor: '#4A90E0', // Sombra con color azul con transparencia
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1, // Transparencia ajustada a 0.2
    shadowRadius: 10,
    elevation: 5, // Agregar elevación para dispositivos Android
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // Necesario para icono de selector
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // Necesario para icono de selector
  },
});

export default ClassesScreen;
