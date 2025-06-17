import { Link } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>

        <FontAwesome name="compass" size={100} color="#CBD5E1" style={styles.icon} />

        <Text style={styles.title}>Oops! Página Não Encontrada</Text>

        <Text style={styles.subtitle}>
          Parece que o link que você seguiu está quebrado ou a página foi removida.
        </Text>
        
        <Link href="/" asChild>
          <TouchableOpacity style={styles.button}>
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
    backgroundColor: '#F8FAFC', 
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', 
    padding: 24,
    width: '100%',
  },
  icon: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B', 
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#475569', 
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320, 
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#F49F0A', 
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30, 
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#F49F0A", 
    shadowOffset: {
        width: 0,
        height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});