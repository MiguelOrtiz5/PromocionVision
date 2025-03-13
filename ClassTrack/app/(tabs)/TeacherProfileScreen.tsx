import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Appbar, Avatar, Card, Title, Paragraph, List, IconButton, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  TeacherProfile: undefined;
  ClassScreen: {
    subject: string;
    schedule: string;
    classroom: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TeacherProfile'>;

interface Class {
  subject: string;
  schedule: string;
  classroom: string;
}

interface TeacherProfileProps {
  teacherName: string;
  classes: Class[];
}

const TeacherProfile: React.FC<TeacherProfileProps> = ({ teacherName, classes }) => {
  const navigation = useNavigation<NavigationProp>();

  const handleClassPress = (classItem: Class) => {
    navigation.navigate('ClassScreen', {
      subject: classItem.subject,
      schedule: classItem.schedule,
      classroom: classItem.classroom,
    });
  };

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
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
      <Appbar.Action icon="logout" onPress={handleLogout} />
        <Card.Content>
          <Avatar.Text size={80} label={teacherName[0]} style={styles.avatar} />
          <Title style={styles.teacherName}>{teacherName}</Title>
          <Paragraph style={styles.sectionTitle}>Classes</Paragraph>
        </Card.Content>
      </Card>

      {classes.map((classItem, index) => (
        <Card
          key={index}
          style={styles.classCard}
          onPress={() => handleClassPress(classItem)}
        >
          <Card.Content>
            <Title>{classItem.subject}</Title>
            <Paragraph>{classItem.schedule}</Paragraph>
            <Paragraph>{classItem.classroom}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <IconButton icon="chevron-right" size={24} onPress={() => handleClassPress(classItem)} />
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
};

export const TeacherProfileScreen: React.FC = () => {
  const sampleData = {
    teacherName: "Juan Carlos Herrera",
    classes: [
      {
        subject: "Inteligencia de Negocios",
        schedule: "9:00 - 10:50 AM",
        classroom: "Room 508",
      },
      {
        subject: "Inteligencia de Negocios",
        schedule: "11:00 - 12:50 PM",
        classroom: "Room 508",
      },
      {
        subject: "Inteligencia de Negocios",
        schedule: "1:00 - 2:50 PM",
        classroom: "Room 508",
      },
    ],
  };

  return <TeacherProfile {...sampleData} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  profileCard: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 4,
    padding: 16,
  },
  avatar: {
    alignSelf: 'center',
    marginBottom: 16,
    backgroundColor: '#6200ee',
  },
  teacherName: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6b6b6b',
  },
  classCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
});

export default TeacherProfileScreen;
