import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Navbar from '../(componentes)/navbar'; // Ajuste o caminho se necessário
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import QuestionBlock from "../(componentes)/questionblock"; // Ajuste o caminho se necessário
import { Pergunta } from '../../assets/types/types'; // Ajuste o caminho se necessário

const API_BASE_URL = 'http://localhost:3004'; // Ajuste conforme sua configuração de backend

export default function ForumScreen() {
  const [newQuestionText, setNewQuestionText] = useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false); // Renomeado para clareza

  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [isLoadingPerguntas, setIsLoadingPerguntas] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPerguntas = async (showLoadingIndicator = true) => {
    if (showLoadingIndicator && !refreshing) { // Não mostrar loading principal se já estiver em refresh
      setIsLoadingPerguntas(true);
    }
    try {
      // Verifique se o endpoint está correto (ex: /perguntas ou /)
      const response = await axios.get<Pergunta[]>(`${API_BASE_URL}/perguntas`);
      // Ordenar por data de criação (mais recentes primeiro), se o campo existir
      // Assumindo que 'createdAt' é um campo no seu modelo Pergunta
      const sortedPerguntas = response.data.sort((a, b) => {
        // @ts-ignore - Se createdAt não estiver explicitamente na interface Pergunta mas vier da API
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        // @ts-ignore
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setPerguntas(sortedPerguntas);

    } catch (error) {
      console.error("Erro ao buscar perguntas:", error);
      alert('Erro, Não foi possível carregar as perguntas.');
    } finally {
      if (showLoadingIndicator || refreshing) { // Apenas atualiza loading se foi ativado
        setIsLoadingPerguntas(false);
      }
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPerguntas(true); // Carga inicial com indicador de loading
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPerguntas(false); // `refreshing` já indica o carregamento
  }, []);

  const handleAskQuestion = async () => {
    if (newQuestionText.trim() === '') {
      alert('Atenção, Por favor, digite sua pergunta.');
      return;
    }

    setIsSubmittingQuestion(true);

    try {
      const loggedInStatus = await AsyncStorage.getItem('isLoggedIn');
      const userDataString = await AsyncStorage.getItem('userData');

      if (loggedInStatus !== 'true' || !userDataString) {
        alert('Erro, Você precisa estar logado para fazer uma pergunta.');
        setIsSubmittingQuestion(false);
        return;
      }

      const userData = JSON.parse(userDataString);
      const usuarioId = userData.id;

      if (!usuarioId) {
        alert('Erro, Não foi possível identificar o usuário.');
        setIsSubmittingQuestion(false);
        return;
      }

      const questionPayload = {
        titulo: newQuestionText,
        descricao: "", // Ajuste se tiver um campo de descrição separado para a pergunta
        usuarioId: usuarioId,
      };

      // Verifique se o endpoint está correto (ex: /perguntas ou /)
      const response = await axios.post(`${API_BASE_URL}/perguntas`, questionPayload);

      if (response.status === 201) {
        alert('Sucesso! Sua pergunta foi enviada.');
        setNewQuestionText('');
        await fetchPerguntas(false); // Recarregar perguntas sem o loading principal, pois a lista será atualizada
      } else {
        alert('Erro, Não foi possível enviar sua pergunta. Status: ${response.status}');
      }
    } catch (error) {
      console.error("Erro ao enviar pergunta:", error);
      if (axios.isAxiosError(error) && error.response) {
        alert('Erro ao enviar pergunta, Ocorreu um problema no servidor.');
      } else {
        alert('Erro, Não foi possível enviar sua pergunta. Verifique sua conexão.');
      }
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  // Callback para quando uma resposta é postada com sucesso no QuestionBlock
  const handleReplyPostedSuccess = () => {
    // Recarrega as perguntas para incluir a nova resposta.
    // `false` para não mostrar o loading principal, a atualização deve ser sutil.
    fetchPerguntas(false);
  };

  return (
    <View style={styles.container}>
      <Navbar />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled" // Para fechar teclado ao tocar fora dos inputs na scrollview
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#F49F0A", "#508CA4"]} />
        }
      >
        <View style={styles.topInputContainer}>
          <View style={styles.dotIconAsk} />
          <TextInput
            style={styles.inputAsk}
            placeholder="Qual é a sua dúvida?"
            placeholderTextColor="rgba(0,0,0,0.6)"
            multiline={true}
            value={newQuestionText}
            onChangeText={setNewQuestionText}
            editable={!isSubmittingQuestion}
          />
          <TouchableOpacity
            style={[styles.buttonAsk, isSubmittingQuestion && styles.buttonAskDisabled]}
            onPress={handleAskQuestion}
            disabled={isSubmittingQuestion}
          >
            {isSubmittingQuestion ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonAskText}>Perguntar</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.feedHeading}>Perguntas da Comunidade</Text>

        {isLoadingPerguntas && !refreshing ? (
          <ActivityIndicator size="large" color="#508CA4" style={styles.listLoadingIndicator} />
        ) : perguntas.length > 0 ? (
          perguntas.map((pergunta) => (
            <QuestionBlock
              key={pergunta.id}
              pergunta={pergunta}
              onReplyPosted={handleReplyPostedSuccess}
            />
          ))
        ) : !isLoadingPerguntas && !refreshing && perguntas.length === 0 ? ( // Condição para mostrar "Nenhuma pergunta" apenas se não estiver carregando
          <Text style={styles.noQuestionsText}>Nenhuma pergunta encontrada. Seja o primeiro a perguntar!</Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    padding: 16,
    paddingBottom: 40, // Espaço no final da lista
  },
  // Estilos para o campo de fazer nova pergunta
  topInputContainer: {
    backgroundColor: "#E0F2FE", // Um azul bem claro, quase branco
    borderRadius: 12,
    padding: 15, // Um pouco mais de padding
    flexDirection: "row",
    alignItems: "flex-start", // Para input multiline
    gap: 12,
    marginBottom: 25,
    shadowColor: "#000", // Sombra sutil
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  dotIconAsk: {
    width: 12, // Menor
    height: 12, // Menor
    backgroundColor: "#F49F0A",
    borderRadius: 9999,
    marginTop: 10, // Ajuste para alinhar com o texto do input
  },
  inputAsk: {
    flex: 1,
    color: "black",
    fontSize: 15, // Um pouco maior
    minHeight: 45, // Altura mínima
    maxHeight: 120, // Altura máxima
    paddingVertical: 5, // Ajuste fino
    textAlignVertical: 'top',
  },
  buttonAsk: {
    backgroundColor: "#F49F0A",
    paddingVertical: 10, // Mais confortável
    paddingHorizontal: 18, // Mais confortável
    borderRadius: 25, // Mais arredondado
    alignSelf: 'flex-end', // Alinhar ao final
  },
  buttonAskDisabled: {
    opacity: 0.7,
  },
  buttonAskText: {
    color: "white",
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Título do feed
  feedHeading: {
    // marginTop: 16, // Já tem margem do topInputContainer
    marginBottom: 15,
    fontSize: 22, // Maior
    fontWeight: '700', // Mais forte
    color: '#1E293B', // Azul escuro
    textAlign: 'left',
  },
  // Indicadores de estado da lista
  listLoadingIndicator: {
    marginVertical: 40, // Mais espaço
  },
  noQuestionsText: {
    textAlign: 'center',
    color: '#64748B', // Cinza azulado
    fontSize: 16,
    marginVertical: 40, // Mais espaço
    fontStyle: 'italic',
    paddingHorizontal: 20, // Para não ficar colado nas bordas
  },
});