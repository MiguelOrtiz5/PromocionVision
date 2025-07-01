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
  useWindowDimensions,
  Platform,
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

const ClassesScreen: React.FC = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();

  // Determina número de columnas para grid responsivo
  let numColumns = 1;
  if (width >= 900) {
    numColumns = 3;
  } else if (width >= 600) {
    numColumns = 2;
  }

  // Cambiar la key para forzar renderizado si numColumns cambia
  const flatListKey = `flatlist-${numColumns}`;

  // Estados para modal y formulario
  const [modalVisible, setModalVisible] = useState(false);
  const [className, setClassName] = useState('');
  const [classDescription, setClassDescription] = useState('');
  const [classSchedule, setClassSchedule] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  // Query para cargar clases y profesores
  const { loading: loadingClasses, error: errorClasses, data: dataClasses } = useQuery(GET_CLASSES);
  const { loading: loadingTeachers, data: dataTeachers } = useQuery(GET_TEACHERS, {
    variables: { where: { role: { equals: 'teacher' } } },
  });

  // Mutation para crear clase
  const [createClass] = useMutation(CREATE_CLASS, {
    refetchQueries: [GET_CLASSES],
    onCompleted: () => {
      setModalVisible(false);
      setClassName('');
      setClassSchedule('');
      setClassDescription('');
      setSelectedTeacher(null);
    },
  });

  const handleClassPress = (classData: any) => {
    router.push({
      pathname: '../classScreen',
      params: { id: classData.id },
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

  // Calcula ancho tarjeta para que quepan 3 tarjetas (con margen) según numColumns
  const cardMargin = 12; // margen horizontal entre tarjetas
  const cardWidth = (width - cardMargin * (numColumns + 1)) / numColumns;

  // Render de cada tarjeta clase
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handleClassPress(item)}
      style={[styles.classCard, { width: cardWidth, marginLeft: cardMargin }]}
      activeOpacity={0.8}
    >
      <Text style={styles.classSubject}>{item.name}</Text>

      <View style={styles.tagSchedule}>
        <FontAwesome name="calendar" size={14} color="#4a5568" />
        <Text style={styles.scheduleText}>{item.schedule}</Text>
      </View>

      <Text style={styles.classDescription} numberOfLines={3}>
        {item.description}
      </Text>

      <View style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>Ver Detalles</Text>
      </View>
    </TouchableOpacity>
  );

  if (loadingClasses) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#38a169" />
      </View>
    );
  }

  if (errorClasses) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>Error loading classes: {errorClasses.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📚 Classes</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
          <FontAwesome name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add Class</Text>
        </TouchableOpacity>
      </View>

      {/* Lista Grid */}
      <FlatList
        key={flatListKey} // clave para forzar remount si cambia columnas
        data={dataClasses.classes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={numColumns}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal para crear clase */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Nueva Clase</Text>

            <Text style={styles.label}>📘 Nombre de la Clase</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Matemáticas Avanzadas"
              value={className}
              onChangeText={setClassName}
            />

            <Text style={styles.label}>🕐 Horario</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Lunes y Miércoles - 10:00 a 12:00"
              value={classSchedule}
              onChangeText={setClassSchedule}
            />

            <Text style={styles.label}>📝 Descripción</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Breve descripción de la clase"
              value={classDescription}
              onChangeText={setClassDescription}
              multiline
            />

            <Text style={styles.label}>👩‍🏫 Docente</Text>
            {loadingTeachers ? (
              <ActivityIndicator size="small" color="#38a169" />
            ) : (
              <RNPickerSelect
                onValueChange={(value) => setSelectedTeacher(value)}
                items={dataTeachers.users.map((teacher: any) => ({
                  label: teacher.name,
                  value: teacher.id,
                }))}
                placeholder={{ label: 'Seleccione un docente', value: null }}
                style={pickerSelectStyles}
              />
            )}

            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#ccc" />
              <Button title="Crear Clase" onPress={handleCreateClass} color="#38a169" />
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
  errorText: { color: 'red', fontSize: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1e3a63',
  },
  classCard: {
    height: 160,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
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
  gridContainer: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#2d3748',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#f9fafb',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  tagSchedule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#edf2f7',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  scheduleText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#4a5568',
  },
  classDescription: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 12,
  },
  classSubject: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 8,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    color: 'black',
    marginBottom: 12,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    color: 'black',
    marginBottom: 12,
  },
});

export default ClassesScreen;
