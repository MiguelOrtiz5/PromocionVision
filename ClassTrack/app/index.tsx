import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, Text, useColorScheme, View, Image } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { ThemedView } from '../components/ThemedView'
import { jwtDecode } from 'jwt-decode';

const tenetID = "55c141c0-1153-41d9-8f6f-f53ab9f5da3a";
const clientID = "a4c4ef1c-b9e8-4ac5-b941-3219f02288f6";

WebBrowser.maybeCompleteAuthSession()

export default function OfficeSignIn(props: any) {
  const [discovery, $discovery]: any = useState({})
  const [authRequest, $authRequest]: any = useState({})
  const [authorizeResult, $authorizeResult]: any = useState({})
  const [isSignedIn, setIsSignedIn] = useState(false)
  const colorScheme = useColorScheme()
  const navigation = useNavigation()  // Initialize navigation
  const scopes = ['openid', 'profile', 'email', 'offline_access']
  const domain = `https://login.microsoftonline.com/${tenetID}/v2.0`
  const redirectUrl = AuthSession.makeRedirectUri(__DEV__ ? { scheme: 'myapp' } : {})

  useEffect(() => {
    const getSession = async () => {
      const d = await AuthSession.fetchDiscoveryAsync(domain)

      const authRequestOptions: AuthSession.AuthRequestConfig = {
        prompt: AuthSession.Prompt.Login,
        responseType: AuthSession.ResponseType.Code,
        scopes: scopes,
        usePKCE: true,
        clientId: clientID,
        redirectUri: __DEV__ ? redirectUrl : redirectUrl + 'example',
      }
      const authRequest = new AuthSession.AuthRequest(authRequestOptions)
      $authRequest(authRequest)
      $discovery(d)
    }
    getSession()
    checkSignInStatus()
  }, [])

  useEffect(() => {
    const getCodeExchange = async () => {
      try {
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            code: authorizeResult.params.code,
            clientId: clientID,
            redirectUri: __DEV__ ? redirectUrl : redirectUrl + 'example',
            extraParams: {
              code_verifier: authRequest.codeVerifier || '',
            },
          },
          discovery
        );
    
        const { accessToken, idToken } = tokenResult;
    
        // Decode the ID token or access token
        const decodedToken: any = jwtDecode(idToken || accessToken);
    
        // Extract name and email directly
        const userName = decodedToken.name; // Full name
        const userEmail = decodedToken.preferred_username; // Email address
    
        console.log('Decoded Token:', decodedToken);
    
        // Store the information locally
        await AsyncStorage.setItem('accessToken', accessToken);
        await AsyncStorage.setItem('userEmail', userEmail);
        await AsyncStorage.setItem('userName', userName);
    
        setIsSignedIn(true);
      } catch (error) {
        console.error('Error during token exchange:', error);
      }
    };
    

    if (authorizeResult && authorizeResult.type === 'success' && authRequest && authRequest.codeVerifier) {
      getCodeExchange()
    }
  }, [authorizeResult, authRequest])

  useEffect(() => {
    // Redirect if the user is already signed in
    if (isSignedIn) {
      navigation.navigate('(tabs)')  // Navigate to home if authenticated
    }
  }, [isSignedIn])

  const handleSignIn = async () => {
    const result = await authRequest.promptAsync(discovery)
    $authorizeResult(result)
  }

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('accessToken')
    setIsSignedIn(false)
  }

  const checkSignInStatus = async () => {
    const token = await AsyncStorage.getItem('accessToken')
    setIsSignedIn(!!token)
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ClassTrack</Text>
        <Image source={require('../assets/images/ClassTrack3.png')} style={styles.logo} />
        {authRequest && discovery ? (
          isSignedIn ? (
            <TouchableOpacity
              style={[styles.button, colorScheme === 'dark' ? styles.buttonDark : styles.buttonLight]}
              onPress={handleSignOut}
            >
              <Ionicons name="log-out-outline" size={24} color="#ffffff" />
              <Text style={[styles.buttonText, styles.textDark]}>Sign Out</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, colorScheme === 'dark' ? styles.buttonDark : styles.buttonLight]}
              onPress={handleSignIn}
            >
              <Ionicons name="logo-microsoft" size={24} color="#ffffff" />
              <Text style={[styles.buttonText, styles.textDark]}>Sign In Microsoft</Text>
            </TouchableOpacity>
          )
        ) : null}
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  card: {
    width: '40%',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonLight: {
    backgroundColor: '#00A4EF',
  },
  buttonDark: {
    backgroundColor: '#00A4EF',
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  textDark: {
    color: '#ffffff',
  },
})