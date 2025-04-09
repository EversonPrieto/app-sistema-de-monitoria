import React, { useState, useEffect, useRef } from 'react'; // Import useEffect, useRef
import { Link } from 'expo-router';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Modal,
    Pressable,
    Animated,    // Import Animated
    Dimensions,  // Import Dimensions
    Easing,      // Import Easing (optional, for smoother animations)
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// Get screen height for animation calculation
const { height: windowHeight } = Dimensions.get('window');

// Define an interface for the props of SideMenuContent
interface SideMenuContentProps {
    onClose: () => void;
}

// SideMenuContent remains the same
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
    // State to manage modal's presence for exit animation
    const [isModalActuallyVisible, setIsModalActuallyVisible] = useState(false);
    // Animated value for the slide position (0 = hidden top, 1 = visible)
    const slideAnim = useRef(new Animated.Value(0)).current;
    const animationDuration = 300; // Configurable duration

    useEffect(() => {
        if (isMenuOpen) {
            // If menu should open, make modal visible *then* animate in
            setIsModalActuallyVisible(true);
            Animated.timing(slideAnim, {
                toValue: 1, // Animate to visible position
                duration: animationDuration,
                easing: Easing.out(Easing.ease), // Smooth easing out
                useNativeDriver: true, // Use native driver for performance
            }).start();
        } else {
            // If menu should close, animate out *then* hide modal
            Animated.timing(slideAnim, {
                toValue: 0, // Animate to hidden position
                duration: animationDuration,
                easing: Easing.in(Easing.ease), // Smooth easing in
                useNativeDriver: true,
            }).start(() => {
                // Callback after animation: Hide the modal completely
                setIsModalActuallyVisible(false);
            });
        }
        // Dependency array: re-run effect when isMenuOpen changes
    }, [isMenuOpen, slideAnim]);

    // Calculate the actual translateY based on the animated value
    // 0 (hidden) -> -windowHeight (or estimated menu height if known)
    // 1 (visible) -> 0
    const menuTranslateY = slideAnim.interpolate({
        inputRange: [0, 1],
        // We slide it down from *above* the screen. Using windowHeight ensures it's offscreen.
        // If you know the menu's max height, you could use -maxHeight for a potentially shorter slide-in distance.
        outputRange: [-windowHeight, 0],
        extrapolate: 'clamp', // Don't extrapolate beyond 0 and -windowHeight
    });


    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Close menu function now simply updates the controlling state
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            {/* Header Bar remains the same */}
            <View style={styles.header}>
                <TouchableOpacity onPress={toggleMenu} style={styles.iconButton}>
                    <FontAwesome name="bars" size={30} color="#F49F0A" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Askademia</Text>
                <View style={styles.placeholder} />
            </View>

            {/* --- MODIFIED MODAL SECTION --- */}
            <Modal
                // Use the internal state to control actual visibility
                visible={isModalActuallyVisible}
                // MUST be 'none' as we are controlling animation manually
                animationType="none"
                transparent={true}
                onRequestClose={closeMenu} // For Android back button
            >
                {/* Pressable overlay to close */}
                <Pressable style={styles.overlay} onPress={closeMenu}>
                    {/* Animated.View wraps the part that slides */}
                    <Animated.View
                        style={[
                            styles.animatedContainer, // Use specific styles for the animated part
                            // Apply the dynamic translateY transform
                            { transform: [{ translateY: menuTranslateY }] }
                        ]}
                    >
                        {/* Pressable to prevent taps inside closing the menu */}
                        {/* This now directly contains the SideMenuContent */}
                        <Pressable style={styles.menuContainer} onPress={(e) => e.stopPropagation()}>
                            <SideMenuContent onClose={closeMenu} />
                        </Pressable>
                    </Animated.View>
                </Pressable>
            </Modal>
            {/* --- END OF MODIFIED MODAL SECTION --- */}
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
        fontFamily: 'Inknut Antiqua', // Ensure font is linked
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    placeholder: {
        width: 30 + 16,
        height: 30,
    },
    // --- Modal and Menu Styles ---
    overlay: {
        marginTop: 71,
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        // Crucial for top-down: Ensure content starts at the top
        justifyContent: 'flex-start',
    },
    // Style for the View that gets animated
    animatedContainer: {
        width: '100%', // Takes full width
        // Position it absolutely at the top, the transform will move it
        position: 'absolute',
        top: 0,
        left: 0,
        // Add shadow here if desired for the sliding element
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Android shadow for the container itself
    },
    // Style for the actual menu content area (inside the animated view)
    // Removed height: '100%' as it's not suitable for top-down slide
    menuContainer: {
        // Let width be controlled by animatedContainer or set explicitly if needed
        // e.g., width: '75%', maxWidth: 300, if you don't want full width
        width: '100%', // Let's make the content full width for this example
        backgroundColor: 'white',
        // Add padding *inside* the menu, if needed, separate from animated container
        // The SideMenuContent already has padding, which is good.
        // Removed shadow from here as it's on animatedContainer now
        // Ensure bottom radius if desired
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    // menuContent styles remain the same (padding, etc.)
    menuContent: {
        paddingTop: 40, // Adjust as needed, consider status bar height
        paddingBottom: 20, // Add bottom padding
        paddingHorizontal: 20,
    },
    closeButtonArea: {
        position: 'absolute',
        top: 15, // Relative to menuContent
        right: 15,
        padding: 10,
        zIndex: 1, // Ensure it's clickable above links
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