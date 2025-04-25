import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Navbar from './(componentes)/navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LARGE_SCREEN_BREAKPOINT = 768;

export default function App() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [wrongInput, setWrongInput] = useState(false);

    const router = useRouter();

    const { width, height } = useWindowDimensions();

    const isLargeScreen = width >= LARGE_SCREEN_BREAKPOINT;

    const validEmail = 'joao@senacrs.com.br';
    const validsenha = '12345678';

    const handleLogin = async () => {
        setWrongInput(false);
    
        if (email === validEmail && senha === validsenha) {
            await AsyncStorage.setItem('usuarioLogado', 'true'); // Salva o status
            alert("Sucesso! Voltando para home...");
            router.push('/');
        } else {
            console.log("Erro: Email ou senha incorretos.");
            setWrongInput(true);
        }
    }
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
            {/* Apply combined styles */}
            <View style={mainContentStyle}>
                <Text style={titleStyle}>Entrar</Text>

                <View style={inputContainerStyle}>
                    <FontAwesome name="envelope" size={isLargeScreen ? 24 : 20} color="black" style={styles.icon} />
                    <TextInput
                        placeholder="Email"
                        style={styles.input} // Input text size might not need changing often
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete='email'
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
                    />
                    <FontAwesome name="eye" size={isLargeScreen ? 24 : 20} color="black" style={styles.icon} />
                </View>

                {wrongInput && (
                    <Text style={styles.errorText}>E-mail ou senha incorretos!</Text>
                )}

                <TouchableOpacity style={buttonStyle} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Acessar</Text>
                </TouchableOpacity>

                <Text style={styles.loginText}>
                    Nao tem uma conta? <Link href="/cadastro" style={styles.loginButton}>Cadastre-se</Link>
                </Text>
            </View>
        </SafeAreaView>
    );
}

// --- Base Styles (Mobile First) ---
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