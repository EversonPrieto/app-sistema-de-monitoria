import React from 'react';
import { Link } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Navbar from './(componentes)/navbar';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <View style={styles.mainContent}>
        <Text style={styles.title}>Cadastre-se</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={20} color="black" />
          <TextInput placeholder="Nome Completo" style={styles.input} />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome name="envelope" size={20} color="black" />
          <TextInput placeholder="Email" style={styles.input} />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="black" />
          <TextInput placeholder="Senha" secureTextEntry style={styles.input} />
          <FontAwesome name="eye" size={20} color="black" />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="black" />
          <TextInput placeholder="Confirmar Senha" secureTextEntry style={styles.input} />
          <FontAwesome name="eye" size={20} color="black" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#508CA4',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F49F0A'
  },
  headerText: {
    fontFamily: 'Inknut Antiqua',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  title: {
    color: '#F49F0A',
    fontFamily: 'Inter',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 22,
    marginTop: 20,
  },
  inputContainer: {
    backgroundColor: '#D9D9D9',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#508CA4',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
    width: '100%',
    fontFamily: 'Inter',
    fontWeight: 'regular',
  },
  input: {
    flex: 1,
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#BFD7EA',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginTop: 32,
    width: '70%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontFamily: 'Inter',
    fontWeight: 'regular',
  },
  loginText: {
    color: '#000000',
    marginTop: 4,
  },
  loginButton: {
    color: '#F49F0A',
    fontWeight: 'bold',
  },
});
