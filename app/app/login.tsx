import React, { useState } from 'react';
import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  useWindowDimensions,
  ActivityIndicator, // Para feedback de carregamento
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Navbar from './(componentes)/navbar'; // Verifique se o caminho está correto
import AsyncStorage from '@react-native-async-storage/async-storage';

const LARGE_SCREEN_BREAKPOINT = 768;

export default function LoginPage() { // Renomeei para LoginPage para clareza, ajuste se necessário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [wrongInput, setWrongInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Para feedback de carregamento

  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= LARGE_SCREEN_BREAKPOINT;

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha email e senha.');
      return;
    }

    setWrongInput(false);
    setIsLoading(true); // Inicia o carregamento

    try {
      const response = await axios.post('http://localhost:3004/usuarios/login', { // Certifique-se que o IP/URL está correto para seu emulador/dispositivo
        email,
        senha,
      });

      // Login bem-sucedido, backend retornou dados do usuário
      const userData = response.data; // { id, nome, email }

      // Salvar dados do usuário no AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      // Opcional: um marcador simples de que o usuário está logado
      await AsyncStorage.setItem('userToken', 'dummy-token-if-no-real-token'); // Ou um token real se o backend enviar
      await AsyncStorage.setItem('isLoggedIn', 'true');


      setIsLoading(false); // Termina o carregamento
      Alert.alert('Sucesso!', 'Login realizado com sucesso!');
      router.replace('/'); // Usar replace para não poder voltar para a tela de login
    } catch (error) {
      setIsLoading(false); // Termina o carregamento
      setWrongInput(true); // Ativa a mensagem de erro

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // O servidor respondeu com um status de erro (4xx, 5xx)
          console.log('Erro ao fazer login (resposta do servidor):', error.response.data);
          // A mensagem de erro do backend já é "Login ou Senha incorretos"
          // Alert.alert('Erro no Login', error.response.data.erro || 'E-mail ou senha incorretos.');
        } else if (error.request) {
          // A requisição foi feita mas não houve resposta (ex: servidor offline)
          console.log('Erro ao fazer login (sem resposta):', error.request);
          Alert.alert('Erro de Rede', 'Não foi possível conectar ao servidor. Verifique sua conexão ou se o servidor está online.');
        } else {
          // Algo aconteceu ao configurar a requisição
          console.log('Erro ao fazer login (configuração):', error.message);
          Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer login.');
        }
      } else {
        // Erro não relacionado ao Axios
        console.log('Erro desconhecido ao fazer login:', String(error));
        Alert.alert('Erro', 'Ocorreu um erro inesperado.');
      }
    }
  };

  const titleStyle = [styles.title, isLargeScreen && styles.titleLarge];
  const mainContentStyle = [styles.mainContent, isLargeScreen && styles.mainContentLarge];
  const inputContainerStyle = [styles.inputContainer, isLargeScreen && styles.inputContainerLarge];
  const buttonStyle = [styles.button, isLargeScreen && styles.buttonLarge];

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <View style={mainContentStyle}>
        <Text style={titleStyle}>Entrar</Text>

        <View style={inputContainerStyle}>
          <FontAwesome name="envelope" size={isLargeScreen ? 24 : 20} color="black" style={styles.icon} />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            editable={!isLoading} // Desabilitar enquanto carrega
          />
        </View>

        <View style={inputContainerStyle}>
          <FontAwesome name="lock" size={isLargeScreen ? 24 : 20} color="black" style={styles.icon} />
          <TextInput
            placeholder="Senha"
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={true}
            onSubmitEditing={handleLogin}
            editable={!isLoading} // Desabilitar enquanto carrega
          />
          {/* O ícone de olho geralmente é para mostrar/esconder senha, você precisaria de mais lógica para isso */}
          {/* <FontAwesome name="eye" size={isLargeScreen ? 24 : 20} color="black" style={styles.icon} /> */}
        </View>

        {wrongInput && !isLoading && ( // Só mostra se não estiver carregando
          <Text style={styles.errorText}>E-mail ou senha incorretos!</Text>
        )}

        <TouchableOpacity
          style={[buttonStyle, isLoading && styles.buttonDisabled]} // Estilo para botão desabilitado
          onPress={handleLogin}
          disabled={isLoading} // Desabilitar botão enquanto carrega
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            <Text style={styles.buttonText}>Acessar</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Não tem uma conta? <Link href="/cadastro" style={styles.loginButton}>Cadastre-se</Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  title: {
    color: '#F49F0A',
    fontFamily: 'Inter', // Certifique-se que esta fonte está carregada no seu projeto
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
    fontFamily: 'Inter', // Certifique-se que esta fonte está carregada
    fontSize: 16,
    color: 'black', // Adicionado para garantir que o texto digitado seja visível
  },
  button: {
    backgroundColor: '#BFD7EA',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginTop: 20,
    width: '70%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonDisabled: { // Estilo para botão desabilitado
    backgroundColor: '#A8B8C2', // Um tom mais claro/cinza
  },
  buttonText: {
    color: '#000000',
    fontFamily: 'Inter', // Certifique-se que esta fonte está carregada
    fontSize: 16,
    fontWeight: '500',
  },
  loginText: {
    color: '#000000',
    marginTop: 15,
    fontFamily: 'Inter', // Certifique-se que esta fonte está carregada
    fontSize: 14,
  },
  loginButton: {
    color: '#F49F0A',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontFamily: 'Inter', // Certifique-se que esta fonte está carregada
    marginBottom: 15,
    fontSize: 14,
    textAlign: 'center',
  },
  // Estilos responsivos (mainContentLarge, titleLarge, etc.) permanecem os mesmos
  mainContentLarge: {
    padding: 40,
    maxWidth: 600,
    alignSelf: 'center',
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