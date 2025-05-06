import { Link, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, useWindowDimensions, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Navbar from '../(componentes)/navbar';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LARGE_SCREEN_BREAKPOINT = 768;

export default function HomeScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= LARGE_SCREEN_BREAKPOINT;

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const logged = await AsyncStorage.getItem('usuarioLogado');
        if (logged === 'true') {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Failed to check login status:", error);
        setIsLoggedIn(false); 
      }
    };
    checkLogin();
  }, []); 

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('usuarioLogado');
      setIsLoggedIn(false);
      alert("Logout feito com sucesso!");
    } catch (error) {
      alert("Erro, Não foi possível fazer logout.");
    }
  };

  const handleTestAlert = () => {
    alert("Aviso! ISSO DEFINITIVAMENTE É UM AVISO!");
  }

  const mainContentStyle = [
    styles.mainContent,
    isLargeScreen && styles.mainContentLarge
  ];
  const titleStyle = [
    styles.title,
    isLargeScreen && styles.titleLarge
  ];
  const buttonStyle = [
    styles.button,
    isLargeScreen && styles.buttonLarge
  ];
  const linkButtonTextStyle = [
    styles.buttonText,
    isLargeScreen && styles.buttonTextLarge 
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <View style={mainContentStyle}>
        <Text style={titleStyle}> Home</Text>

        {!isLoggedIn && (
          <>
            <Link href="/login" style={buttonStyle} asChild>
              <TouchableOpacity>
                <Text style={linkButtonTextStyle}>Login</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/cadastro" style={buttonStyle} asChild>
              <TouchableOpacity>
                <Text style={linkButtonTextStyle}>Cadastre-se</Text>
              </TouchableOpacity>
            </Link>
          </>
        )}

        {isLoggedIn && (
          <TouchableOpacity
            onPress={handleLogout}
            style={buttonStyle} 
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleTestAlert}
          style={buttonStyle} 
        >
          <Text style={styles.buttonText}>Testando Alert</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  title: {
    color: '#F49F0A',
    fontFamily: 'Inter',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 22,
    marginTop: 20,
    textAlign: 'center', 
  },
  button: {
    backgroundColor: '#BFD7EA',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginTop: 25, 
    width: '90%', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: 45, 
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  buttonText: {
    color: '#000000', 
    fontFamily: 'Inter', 
    fontSize: 16, 
    fontWeight: '500', 
    textAlign: 'center',
  },
  mainContentLarge: {
    padding: 40,
    maxWidth: 700, 
    alignSelf: 'center', 
  },
  titleLarge: {
    fontSize: 38, 
    marginBottom: 40, 
    marginTop: 30,
  },
  buttonLarge: {
    width: '70%', 
    maxWidth: 450,
    paddingVertical: 15, 
    marginTop: 30, 
  },
  buttonTextLarge: { 
    fontSize: 18,
  }
});