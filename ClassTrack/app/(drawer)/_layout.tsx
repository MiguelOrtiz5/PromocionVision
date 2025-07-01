// app/(drawer)/_layout.tsx

import React from 'react';
import { Platform, useColorScheme } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DrawerLayout() {
  const colorScheme = useColorScheme();
  const isWeb = Platform.OS === 'web';

  return (
    <Drawer
      initialRouteName="index"
      screenOptions={{
        // ✅ Activar el header
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1e3a63',
        },
        headerTintColor: '#fff',
        // ✅ Botón hamburguesa manual en cada pantalla
        headerLeft: () => {
          const navigation = useNavigation();
          return (
            <Pressable
              onPress={() => navigation.toggleDrawer()}
              style={{ paddingLeft: 15 }}
            >
              <Ionicons name="menu" size={24} color="white" />
            </Pressable>
          );
        },
        // ✅ Drawer que se puede ocultar
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1e3a63' : '#fff',
          width: 240,
        },
        drawerActiveTintColor: colorScheme === 'dark' ? '#fff' : '#1e3a63',
        drawerInactiveTintColor: colorScheme === 'dark' ? '#bbb' : '#888',
        sceneContainerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#f0f0f0',
        },
      }}
    >
      {/* SOLO estas pantallas aparecen en el drawer */}
      <Drawer.Screen
        name="StudentsScreen"
        options={{
          title: 'Estudiantes',
          drawerIcon: ({ color }) => (
            <Ionicons name="people-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="TeacherClassesScreen"
        options={{
          title: 'Clases',
          drawerIcon: ({ color }) => (
            <Ionicons name="book-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="TeachersScreen"
        options={{
          title: 'Profesores',
          drawerIcon: ({ color }) => (
            <Ionicons name="school-outline" size={20} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
