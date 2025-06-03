import React, { useState } from 'react';
import { Link } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, useWindowDimensions, Platform, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Navbar from './(componentes)/navbar';
import axios from 'axios'; 

const LARGE_SCREEN_BREAKPOINT = 768;

export default function App() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= LARGE_SCREEN_BREAKPOINT;

  const [usuario, setUsuario] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });

  const handleChange = (name: keyof typeof usuario) => (value: string) => {
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const titleStyle = [styles.title, isLargeScreen && styles.titleLarge];
  const mainContentStyle = [styles.mainContent, isLargeScreen && styles.mainContentLarge];
  const inputContainerStyle = [styles.inputContainer, isLargeScreen && styles.inputContainerLarge];
  const buttonStyle = [styles.button, isLargeScreen && styles.buttonLarge];

  const handleCadastro = async () => {
    const { nome, email, senha, confirmarSenha } = usuario;

    if (!nome || !email || !senha || !confirmarSenha) {
      mostrarAlerta("Erro", "Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      mostrarAlerta("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3004/usuarios', {
        nome,
        email,
        senha
      });

      if (response.status === 201 || response.status === 200) {
        mostrarAlerta("Sucesso", "Usuário cadastrado com sucesso!");
      } else {
        mostrarAlerta("Erro", "Erro inesperado ao cadastrar.");
      }
    } catch (error: any) {
      const mensagemErro = error.response?.data?.error || "Erro ao conectar com o servidor.";
      mostrarAlerta("Erro", mensagemErro);
    }
  };

  const mostrarAlerta = (titulo: string, mensagem: string | undefined) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}: ${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <View style={mainContentStyle}>
        <Text style={titleStyle}>Cadastre-se</Text>

        <View style={inputContainerStyle}>
          <FontAwesome name="user" size={isLargeScreen ? 24 : 20} color="black" style={styles.icon} />
          <TextInput
            placeholder="Nome Completo"
            style={styles.input}
            value={usuario.nome}
            onChangeText={handleChange('nome')}
            autoCapitalize="none"
          />
        </View>

        <View style={inputContainerStyle}>
          <FontAwesome name="envelope" size={isLargeScreen ? 24 : 20} color="black" style={styles.icon} />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={usuario.email}
            onChangeText={handleChange('email')}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={inputContainerStyle}>
          <FontAwesome name="lock" size={isLargeScreen ? 24 : 20} color="black" style={styles.icon} />
          <TextInput
            placeholder="Senha"
            style={styles.input}
            value={usuario.senha}
            onChangeText={handleChange('senha')}
            secureTextEntry={true}
          />
        </View>

        <View style={inputContainerStyle}>
          <FontAwesome name="lock" size={isLargeScreen ? 24 : 20} color="black" style={styles.icon} />
          <TextInput
            placeholder="Confirmar Senha"
            style={styles.input}
            value={usuario.confirmarSenha}
            onChangeText={handleChange('confirmarSenha')}
            secureTextEntry={true}
          />
        </View>

        <TouchableOpacity style={buttonStyle} onPress={handleCadastro}>
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
  mainContent: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    width: '100%',
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
    width: '90%',
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
    width: '70%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
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
  mainContentLarge: {
    padding: 40,
    maxWidth: 600,
    alignSelf: 'center'
  },
  titleLarge: {
    fontSize: 36,
    marginBottom: 40,
  },
  inputContainerLarge: {
    width: '100%',
    maxWidth: 500,
    height: 55,
  },
  buttonLarge: {
    width: '60%',
    maxWidth: 350,
    paddingVertical: 15,
  },
});
