// app/_layout.tsx   ó   App.tsx

import React from 'react'
import { NativeBaseProvider } from 'native-base'
import { ApolloProvider } from '@apollo/client'
import client from '@/api/apolloClient'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import 'react-native-reanimated'
import { useColorScheme } from '@/hooks/useColorScheme'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({ SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf') })

  React.useEffect(() => {
    if (loaded) SplashScreen.hideAsync()
  }, [loaded])

  if (!loaded) return null

  return (
    <ApolloProvider client={client}>
      {/* 1. Wrap en NativeBaseProvider */}
      <NativeBaseProvider>
        {/* 2. (Opcional) Mantén tu ThemeProvider de React Navigation si lo necesitas */}
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
            <Stack.Screen name="StudentProfile" options={{ title: 'Perfil del Estudiante' }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </NativeBaseProvider>
    </ApolloProvider>
  )
}
