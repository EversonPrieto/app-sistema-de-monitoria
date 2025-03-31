import { Link } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="bars" size={38} color="#F49F0A" />
        <Text style={styles.headerText}>Askademia</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.mainContent}>
      <Text style={styles.title}> Home</Text>
      <Link href="/login" style={styles.button}><Text style={styles.buttonText}>Login</Text>
      </Link>
      <Link href="/cadastro" style={styles.button}>
        <Text style={styles.buttonText} >Cadastre-se </Text>
      </Link>
      {/* Teste de Alert*/}
      <TouchableOpacity onPress={() => alert("ISSO DEFINITIVAMEN É UM AVISO!")} style={styles.button}>
        <Text style={styles.buttonText}>Testando Alert</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: '#BFD7EA',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginTop: 32,
    width: '100%',
    alignItems: 'center',
    textAlign: 'center',
    
  },
  buttonText: {
    color: '#00000',
    fontFamily: 'Inter',
    fontWeight: 'regular',
  },
});
