import { Link } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, useWindowDimensions } from 'react-native';

const LARGE_SCREEN_BREAKPOINT = 768;


export default function NotFoundScreen() {
   const { width, height } = useWindowDimensions();

  const isLargeScreen = width >= LARGE_SCREEN_BREAKPOINT;
  
  const buttonStyle = [
    styles.button,
    isLargeScreen && styles.buttonLarge
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <Text style={styles.title}>Tela não encontrada!</Text>
        
        <Link href="/" style={buttonStyle} asChild>
          <TouchableOpacity>
            <Text style={styles.buttonText}>Voltar para a Home</Text>
          </TouchableOpacity>
        </Link>
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
    padding: 16,
    width: '100%',
  },
  title: {
    color: '#F49F0A',
    fontFamily: 'Inter',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 22,
    marginTop: 20,
    textAlign: 'center',
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
buttonLarge: {
  width: '60%', 
  maxWidth: 350, 
  paddingVertical: 15, 
},
});
