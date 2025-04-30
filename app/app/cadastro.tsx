import React from 'react';
import { Link } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Navbar from './(componentes)/navbar';

const LARGE_SCREEN_BREAKPOINT = 768;
export default function App() {
const { width, height } = useWindowDimensions();

const isLargeScreen = width >= LARGE_SCREEN_BREAKPOINT;

const titleStyle = [
  styles.title,
  isLargeScreen && styles.titleLarge // Apply large style if screen is large
];
const mainContentStyle = [
  styles.mainContent,
  isLargeScreen && styles.mainContentLarge
];
const inputContainerStyle = [
  styles.inputContainer,
  isLargeScreen && styles.inputContainerLarge
];
const buttonStyle = [
  styles.button,
  isLargeScreen && styles.buttonLarge
];


  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <View style={mainContentStyle}>
        <Text style={titleStyle}>Cadastre-se</Text>
        <View style={inputContainerStyle}>
          <FontAwesome name="user" size={isLargeScreen ? 24 : 20} color="black" style={styles.icon} />
          <TextInput placeholder="Nome Completo" style={styles.input} />
        </View>
        <View style={inputContainerStyle}>
          <FontAwesome name="envelope" size={isLargeScreen ? 24 : 20} color="black" style={styles.icon} />
          <TextInput placeholder="Email" style={styles.input} />
        </View>
        <View style={inputContainerStyle}>
          <FontAwesome name="lock" size={isLargeScreen ? 24 : 20} color="black" style={styles.icon} />
          <TextInput placeholder="Senha" style={styles.input} />
          <FontAwesome name="eye" size={isLargeScreen ? 24 : 20} color="black" />
        </View>
        <View style={inputContainerStyle}>
          <FontAwesome name="lock" size={isLargeScreen ? 24 : 20} color="black" style={styles.icon} />
          <TextInput placeholder="Confirmar Senha"  style={styles.input} />
          <FontAwesome name="eye" size={isLargeScreen ? 24 : 20} color="black" />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
        <Text style={styles.loginText}>
          Já possui uma conta? <Link href="/login" style={styles.loginButton}>Faça Login</Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}
;


const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: 'white',
  },
  mainContent: {
      flex: 1,
      alignItems: 'center',
      padding: 20,
      width: '100%', // Ensure it takes full width initially
  },
  title: {
      color: '#F49F0A',
      fontFamily: 'Inter',
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 25,
      marginTop: 20,
  },
  inputContainer: {
      backgroundColor: '#D9D9D9',
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#508CA4',
      borderRadius: 25,
      paddingHorizontal: 15,
      marginBottom: 20,
      width: '90%', // Relative width for mobile
      height: 50,
  },
  icon: {
      marginRight: 10,
  },
  input: {
      flex: 1,
      height: '100%',
      fontFamily: 'Inter',
      fontSize: 16,
  },
  button: {
      backgroundColor: '#BFD7EA',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 10,
      marginTop: 20,
      width: '70%', // Relative width for mobile
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
  },
  buttonText: {
      color: '#000000',
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: '500',
  },
  loginText: {
      color: '#000000',
      marginTop: 15,
      fontFamily: 'Inter',
      fontSize: 14,
  },
  loginButton: {
      color: '#F49F0A',
      fontWeight: 'bold',
  },
  errorText: {
      color: 'red',
      fontFamily: 'Inter',
      marginBottom: 15,
      fontSize: 14,
      textAlign: 'center',
  },

  // --- Styles for Larger Screens (applied conditionally) ---
  mainContentLarge: {
      padding: 40, // Increase padding
      maxWidth: 600, // Set a max width to prevent excessive stretching
      alignSelf: 'center' // Center the content block
  },
  titleLarge: {
      fontSize: 36, // Make title bigger
      marginBottom: 40, // Increase spacing
  },
  inputContainerLarge: {
      width: '100%', // Use full width of the constrained mainContentLarge
      maxWidth: 500, // Or set a max width directly if preferred
      height: 55, // Slightly taller inputs
  },
  buttonLarge: {
      width: '60%', // Button takes less relative space
      maxWidth: 350, // Add a max width for the button too
      paddingVertical: 15, // Make button slightly bigger
  },
});
