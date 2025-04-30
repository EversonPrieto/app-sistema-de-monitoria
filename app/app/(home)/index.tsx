import { Link, useRouter } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions, // Import hook
  Alert // Import Alert if you are using it, though the onPress uses window.alert
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Navbar from '../(componentes)/navbar';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Define a breakpoint (use the same value for consistency) ---
const LARGE_SCREEN_BREAKPOINT = 768;

export default function HomeScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { width } = useWindowDimensions(); // Get screen width

  // --- Determine if the screen is large ---
  const isLargeScreen = width >= LARGE_SCREEN_BREAKPOINT;

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const logged = await AsyncStorage.getItem('usuarioLogado');
        // Explicitly check for the string 'true'
        if (logged === 'true') {
          setIsLoggedIn(true);
        } else {
          // Ensure state is false if not logged in or value is null/different
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Failed to check login status:", error);
        setIsLoggedIn(false); // Assume not logged in on error
      }
    };
    checkLogin();
  }, []); // Dependency array is empty, runs once on mount

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('usuarioLogado');
      setIsLoggedIn(false);
      alert("Logout feito com sucesso!"); // Use React Native Alert for consistency
    } catch (error) {
      alert("Erro, Não foi possível fazer logout.");
    }
  };

  const handleTestAlert = () => {
    alert("Aviso! ISSO DEFINITIVAMENTE É UM AVISO!");
  }

  // --- Combine base styles with conditional large screen styles ---
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
  // Separate style for Link component text if needed, otherwise buttonText works
  const linkButtonTextStyle = [
    styles.buttonText,
    isLargeScreen && styles.buttonTextLarge // Optional: Adjust text size too
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <View style={mainContentStyle}>
        <Text style={titleStyle}> Home</Text>

        {!isLoggedIn && (
          <>
            {/* Apply combined styles to Links */}
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
            style={buttonStyle} // Apply combined styles
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleTestAlert}
          style={buttonStyle} // Apply combined styles
        >
          <Text style={styles.buttonText}>Testando Alert</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // --- Base Styles (Mobile First) ---
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  // Removed header styles as Navbar is likely handling its own
  mainContent: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  title: {
    color: '#F49F0A',
    fontFamily: 'Inter', // Ensure font is loaded
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 22,
    marginTop: 20,
    textAlign: 'center', // Center title text
  },
  button: {
    backgroundColor: '#BFD7EA',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginTop: 25, // Consistent margin top
    width: '90%', // Slightly less wide on mobile
    alignItems: 'center', // Center text horizontally
    justifyContent: 'center', // Center text vertically (if needed, depends on Text vs View)
    minHeight: 45, // Ensure a minimum touchable height
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
    color: '#000000', // Corrected color code
    fontFamily: 'Inter', // Ensure font is loaded
    fontSize: 16, // Slightly larger text
    fontWeight: '500', // Medium weight is often 'regular' or '500'
    textAlign: 'center',
  },

  // --- Styles for Larger Screens ---
  mainContentLarge: {
    padding: 40,
    maxWidth: 700, // Set a max width for the content area
    alignSelf: 'center', // Center the block
  },
  titleLarge: {
    fontSize: 38, // Larger title
    marginBottom: 40, // More space below title
    marginTop: 30,
  },
  buttonLarge: {
    width: '70%', // Buttons take less relative width
    maxWidth: 450, // Max width for buttons on large screens
    paddingVertical: 15, // Slightly taller buttons
    marginTop: 30, // Increase spacing between buttons
  },
  buttonTextLarge: { // Optional: if you want larger text on larger buttons
    fontSize: 18,
  }
});