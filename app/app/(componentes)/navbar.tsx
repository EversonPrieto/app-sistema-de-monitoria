import React, { useState, useEffect, useRef } from 'react';
import { Link, useRouter } from 'expo-router';
import {
    View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal,
    Pressable, Animated, Dimensions, Easing, ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height: windowHeight } = Dimensions.get('window');

interface SideMenuContentProps {
    onClose: () => void;
    isLoggedIn: boolean;
    userName: string | null;
    onLogout: () => void;
}

import type { LinkProps } from 'expo-router';

type HrefType = LinkProps['href'];

const navItems: { href: HrefType; label: string; icon: keyof typeof FontAwesome.glyphMap }[] = [
    { href: "/", label: "Home", icon: "home" },
    { href: "/telas/sobre", label: "Sobre Nós", icon: "info-circle" },
];

const authItems: { href: HrefType; label: string; icon: keyof typeof FontAwesome.glyphMap }[] = [
    { href: "/telas/login", label: "Login", icon: "sign-in" },
    { href: "/telas/cadastro", label: "Cadastre-se", icon: "user-plus" },
];

function SideMenuContent({ onClose, isLoggedIn, userName, onLogout }: SideMenuContentProps) {
    const router = useRouter();

    const handleLogoutPress = () => {
        onLogout();
        onClose();
        router.replace('/telas/login');
    };

    return (
        <View style={styles.menuContent}>
            <TouchableOpacity style={styles.closeButtonArea} onPress={onClose}>
                <FontAwesome name="times" size={28} color="#333" />
            </TouchableOpacity>

            <View style={styles.menuHeader}>
                <FontAwesome name="user-circle-o" size={50} color="#508CA4" />
                {isLoggedIn && userName ? (
                    <Text style={styles.greetingText}>Olá, {userName}!</Text>
                ) : (
                    <Text style={styles.menuTitle}>Menu</Text>
                )}
            </View>

            <View style={styles.menuBody}>
                {navItems.map(item => (
                    <Link key={String(item.href)} href={item.href} onPress={onClose} asChild>
                        <Pressable style={styles.menuItem}>
                            <FontAwesome name={item.icon} size={20} color="#4A5568" style={styles.menuItemIcon} />
                            <Text style={styles.menuItemText}>{item.label}</Text>
                        </Pressable>
                    </Link>
                ))}
            </View>

            <View style={styles.menuFooter}>
                {!isLoggedIn ? (
                    authItems.map(item => (
                        <Link key={String(item.href)} href={item.href} onPress={onClose} asChild>
                            <Pressable style={styles.menuItem}>
                                <FontAwesome name={item.icon} size={20} color="#4A5568" style={styles.menuItemIcon} />
                                <Text style={styles.menuItemText}>{item.label}</Text>
                            </Pressable>
                        </Link>
                    ))
                ) : (
                    <TouchableOpacity onPress={handleLogoutPress} style={styles.menuItem}>
                        <FontAwesome name="sign-out" size={22} color="#F49F0A" style={styles.menuItemIcon} />
                        <Text style={[styles.menuItemText, { color: '#F49F0A', fontWeight: 'bold' }]}>Sair</Text>
                    </TouchableOpacity>
                )}
            </View>
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
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    const router = useRouter();

    const checkLoginStatus = async () => {
        setIsLoadingAuth(true);
        try {
            const loggedInStatus = await AsyncStorage.getItem('isLoggedIn');
            const userDataString = await AsyncStorage.getItem('userData');
            if (loggedInStatus === 'true' && userDataString) {
                const userData = JSON.parse(userDataString);
                setIsUserLoggedIn(true);
                setUserName(userData.nome);
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
        checkLoginStatus();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.multiRemove(['userData', 'isLoggedIn']);
            setIsUserLoggedIn(false);
            setUserName(null);
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    useEffect(() => {
        if (isMenuOpen) {
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
            }).start(() => setIsModalActuallyVisible(false));
        }
    }, [isMenuOpen, slideAnim]);

    const menuTranslateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-windowHeight, 0],
    });

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.header}>
                <TouchableOpacity onPress={toggleMenu} style={styles.iconButton}>
                    <FontAwesome name="bars" size={28} color="#F49F0A" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Askademia</Text>
                <View style={styles.placeholder} />
            </View>

            <Modal
                visible={isModalActuallyVisible}
                animationType="none"
                transparent={true}
                onRequestClose={closeMenu}
            >
                <Pressable style={styles.overlay} onPress={closeMenu}>
                    <Animated.View style={[styles.animatedContainer, { transform: [{ translateY: menuTranslateY }] }]}>
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
        minHeight: 60,
    },
    iconButton: {
        padding: 8,
    },
    headerText: {
        fontFamily: 'Inknut Antiqua',
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 28 + 16,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    animatedContainer: {
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0,
    },
    menuContainer: {
        backgroundColor: 'white',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
    },
    menuContent: {
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 25,
    },
    closeButtonArea: {
        position: 'absolute',
        top: 15,
        right: 15,
        padding: 10,
    },
    menuHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    menuTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
    },
    greetingText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#508CA4',
        marginTop: 10,
    },
    menuBody: {
        marginBottom: 20,
    },
    menuFooter: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    menuItemIcon: {
        width: 25,
        textAlign: 'center',
        marginRight: 15,
    },
    menuItemText: {
        fontSize: 18,
        color: '#444',
        fontWeight: '500',
    },
    loadingContainer: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    }
});