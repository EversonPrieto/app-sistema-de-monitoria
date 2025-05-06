import React, { useState, useEffect, useRef } from 'react'; 
import { Link } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal, Pressable, Animated, Dimensions, Easing,      
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const { height: windowHeight } = Dimensions.get('window');

interface SideMenuContentProps {
    onClose: () => void;
}
function SideMenuContent({ onClose }: SideMenuContentProps) {
    return (
        <View style={styles.menuContent}>
            <TouchableOpacity style={styles.closeButtonArea} onPress={onClose}>
                <FontAwesome name="times" size={30} color="#333" />
            </TouchableOpacity>
            <Text style={styles.menuTitle}>Menu</Text>
            <Link href="/" onPress={onClose} style={styles.menuItem}>
                <Text style={styles.menuItemText}>Home</Text>
            </Link>
        </View>
    );
}

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalActuallyVisible, setIsModalActuallyVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const animationDuration = 300; 

    useEffect(() => {
        if (isMenuOpen) {
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
        outputRange: [-windowHeight, 0],
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
                animationType="none"
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
                        <Pressable style={styles.menuContainer} onPress={(e) => e.stopPropagation()}>
                            <SideMenuContent onClose={closeMenu} />
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
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    placeholder: {
        width: 30,
        height: 30,
    },
    overlay: {
        marginTop: 71,
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
    },
    animatedContainer: {
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, 
    },
    menuContainer: {
        width: '100%', 
        backgroundColor: 'white',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    menuContent: {
        paddingTop: 40, 
        paddingBottom: 20, 
        paddingHorizontal: 20,
    },
    closeButtonArea: {
        position: 'absolute',
        top: 15, 
        right: 15,
        padding: 10,
        zIndex: 1, 
    },
    menuTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
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
});