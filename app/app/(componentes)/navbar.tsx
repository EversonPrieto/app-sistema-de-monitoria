// (componentes)/navbar.tsx ou seu arquivo da Navbar

import React, { useState, useEffect, useRef } from 'react';
import { Link, useRouter } from 'expo-router'; // Adicionar useRouter para o logout
import {
    View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal,
    Pressable, Animated, Dimensions, Easing, ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage

const { height: windowHeight } = Dimensions.get('window');

interface SideMenuContentProps {
    onClose: () => void;
    isLoggedIn: boolean;
    userName: string | null;
    onLogout: () => void; // Função para lidar com o logout
}

// Mova SideMenuContent para fora da função Navbar se ainda não estiver,
// ou mantenha-o dentro, mas certifique-se de que pode acessar os props corretamente.
// Para este exemplo, vou assumir que está no mesmo arquivo.

function SideMenuContent({ onClose, isLoggedIn, userName, onLogout }: SideMenuContentProps) {
    const router = useRouter(); // Para navegação após logout

    const handleLogoutPress = () => {
        onLogout(); // Chama a função de logout passada pelo Navbar
        onClose(); // Fecha o menu
        router.replace('/login'); // Redireciona para a tela de login
    };

    return (
        <View style={styles.menuContent}>
            <TouchableOpacity style={styles.closeButtonArea} onPress={onClose}>
                <FontAwesome name="times" size={30} color="#333" />
            </TouchableOpacity>
            <Text style={styles.menuTitle}>Menu</Text>

            {isLoggedIn && userName && (
                <Text style={styles.greetingText}>Olá, {userName}!</Text>
            )}

            <Link href="/" onPress={onClose} style={styles.menuItem}>
                <Text style={styles.menuItemText}>Home</Text>
            </Link>

            {!isLoggedIn ? (
                <>
                    <Link href="/login" onPress={onClose} style={styles.menuItem}>
                        <Text style={styles.menuItemText}>Login</Text>
                    </Link>
                    <Link href="/cadastro" onPress={onClose} style={styles.menuItem}>
                        <Text style={styles.menuItemText}>Cadastre-se</Text>
                    </Link>
                </>
            ) : (
                <TouchableOpacity onPress={handleLogoutPress} style={styles.menuItem}>
                    <Text style={styles.menuItemText}>Sair</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalActuallyVisible, setIsModalActuallyVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const animationDuration = 300;

    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Para estado de carregamento da autenticação

    const router = useRouter(); // Para navegação

    // Função para verificar o estado de login
    const checkLoginStatus = async () => {
        setIsLoadingAuth(true);
        try {
            const loggedInStatus = await AsyncStorage.getItem('isLoggedIn');
            const userDataString = await AsyncStorage.getItem('userData');

            if (loggedInStatus === 'true' && userDataString) {
                const userData = JSON.parse(userDataString);
                setIsUserLoggedIn(true);
                setUserName(userData.nome); // Assumindo que 'nome' está em userData
            } else {
                setIsUserLoggedIn(false);
                setUserName(null);
            }
        } catch (error) {
            console.error("Erro ao verificar status de login:", error);
            setIsUserLoggedIn(false);
            setUserName(null);
        } finally {
            setIsLoadingAuth(false);
        }
    };

    useEffect(() => {
        checkLoginStatus(); // Verificar no mount inicial

        // Opcional: Adicionar um listener para focar na tela, caso o login/logout
        // possa acontecer em outra parte do app e você queira que a Navbar atualize
        // sem precisar de um remount completo.
        // Com Expo Router, você pode usar `useFocusEffect` se estiver numa tela,
        // ou gerenciar isso através de um estado global (Context API).
        // Para este caso, vamos assumir que um login/logout redireciona e
        // causa um remount ou que o usuário navega para uma tela que remonta a Navbar.

    }, []); // Executa apenas no mount

    // Função para logout
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userData');
            await AsyncStorage.removeItem('isLoggedIn');
            // Remova também o userToken se estiver usando
            // await AsyncStorage.removeItem('userToken');
            setIsUserLoggedIn(false);
            setUserName(null);
            // O redirecionamento já é feito dentro do SideMenuContent ou aqui, se preferir:
            // closeMenu(); // Fecha o menu
            // router.replace('/login'); // Redireciona
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            // Tratar erro de logout, se necessário
        }
    };


    useEffect(() => {
        if (isMenuOpen) {
            // Re-checar o status de login ao abrir o menu pode ser útil
            // se o estado puder mudar enquanto o app está aberto e o menu fechado.
            checkLoginStatus();
            setIsModalActuallyVisible(true);
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: animationDuration,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: animationDuration,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
            }).start(() => {
                setIsModalActuallyVisible(false);
            });
        }
    }, [isMenuOpen, slideAnim]);

    const menuTranslateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-windowHeight, 0], // Começa completamente fora da tela no topo
        extrapolate: 'clamp',
    });


    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={toggleMenu} style={styles.iconButton}>
                    <FontAwesome name="bars" size={30} color="#F49F0A" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Askademia</Text>
                <View style={styles.placeholder} />
            </View>

            <Modal
                visible={isModalActuallyVisible}
                animationType="none" // A animação é controlada pelo Animated.View
                transparent={true}
                onRequestClose={closeMenu}
            >
                <Pressable style={styles.overlay} onPress={closeMenu}>
                    <Animated.View
                        style={[
                            styles.animatedContainer,
                            { transform: [{ translateY: menuTranslateY }] }
                        ]}
                    >
                        {/* Adicionado para evitar que o toque no Animated.View feche o menu */}
                        <Pressable style={styles.menuContainer} onPress={(e) => e.stopPropagation()}>
                            {isLoadingAuth ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#508CA4" />
                                </View>
                            ) : (
                                <SideMenuContent
                                    onClose={closeMenu}
                                    isLoggedIn={isUserLoggedIn}
                                    userName={userName}
                                    onLogout={handleLogout}
                                />
                            )}
                        </Pressable>
                    </Animated.View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaContainer: {
        backgroundColor: '#508CA4',
        // zIndex: 100 // Se a Navbar precisar ficar sobre outros elementos globais
    },
    header: {
        backgroundColor: '#508CA4',
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F49F0A',
        minHeight: 60, // Garante altura mínima
    },
    iconButton: {
        padding: 8, // Área de toque maior
    },
    headerText: {
        fontFamily: 'Inknut Antiqua', // Certifique-se que a fonte está carregada
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    placeholder: { // Para equilibrar o ícone do menu e centralizar o texto
        width: 30 + 16, // largura do ícone + padding do iconButton
        height: 30,
    },
    // Overlay e Modal
    overlay: {
        // marginTop: 71, // Removido ou ajustado - o SafeAreaView já deve cuidar do topo
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start', // Para o menu animar do topo
    },
    animatedContainer: {
        width: '100%',
        position: 'absolute', // Para animar sobre o overlay
        top: 0,
        left: 0,
        // Sombra (opcional, mas dá um bom efeito)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Para Android
    },
    menuContainer: {
        width: '100%', // Ocupa toda a largura
        backgroundColor: 'white',
        borderBottomLeftRadius: 10, // Cantos arredondados apenas na parte de baixo
        borderBottomRightRadius: 10,
        // overflow: 'hidden', // Se necessário para conter os cantos arredondados
    },
    menuContent: {
        paddingTop: 40, // Espaço para o botão de fechar e título
        paddingBottom: 20, // Espaço na parte inferior
        paddingHorizontal: 20,
    },
    closeButtonArea: {
        position: 'absolute',
        top: 15, // Ajuste conforme necessário
        right: 15, // Ajuste conforme necessário
        padding: 10, // Área de toque
        zIndex: 1, // Para ficar sobre outros itens do menu
    },
    menuTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20, // Reduzido um pouco
        color: '#333',
        textAlign: 'center', // Centralizar título do menu
    },
    greetingText: { // Novo estilo para a saudação
        fontSize: 18,
        fontWeight: '600',
        color: '#508CA4',
        marginBottom: 20,
        textAlign: 'center',
    },
    menuItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    menuItemText: {
        fontSize: 18,
        color: '#444',
    },
    loadingContainer: { // Para o ActivityIndicator
        height: 200, // Altura de exemplo, ajuste conforme necessário
        justifyContent: 'center',
        alignItems: 'center',
    }
});