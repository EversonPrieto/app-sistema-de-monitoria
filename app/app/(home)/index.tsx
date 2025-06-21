import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, RefreshControl,} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Navbar from '../(componentes)/navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import QuestionBlock from "../(componentes)/questionblock";
import { Pergunta } from '../../assets/types/types';

const API_BASE_URL = 'http://localhost:3004';

export default function ForumScreen() {
  const [newQuestionText, setNewQuestionText] = useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [isLoadingPerguntas, setIsLoadingPerguntas] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPerguntas = async (showLoadingIndicator = true) => {
    if (showLoadingIndicator && !refreshing) {
      setIsLoadingPerguntas(true);
    }
    try {
      const response = await axios.get<Pergunta[]>(`${API_BASE_URL}/perguntas`);

      const sortedPerguntas = response.data.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setPerguntas(sortedPerguntas);

    } catch (error) {
      console.error("Erro ao buscar perguntas:", error);
      alert('Erro, Não foi possível carregar as perguntas.');
    } finally {
      if (showLoadingIndicator || refreshing) {
        setIsLoadingPerguntas(false);
      }
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPerguntas(true);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPerguntas(false);
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
        descricao: "",
        usuarioId: usuarioId,
      };

      const response = await axios.post(`${API_BASE_URL}/perguntas`, questionPayload);

      if (response.status === 201) {
        alert('Sucesso! Sua pergunta foi enviada.');
        setNewQuestionText('');
        await fetchPerguntas(false);
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

  const handleReplyPostedSuccess = () => {
    fetchPerguntas(false);
  };

  return (
    <View style={styles.container}>
      <Navbar />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
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
        ) : !isLoadingPerguntas && !refreshing && perguntas.length === 0 ? (
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
    paddingBottom: 40,
  },
  topInputContainer: {
    backgroundColor: "#E0F2FE", 
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  dotIconAsk: {
    width: 12,
    height: 12,
    backgroundColor: "#F49F0A",
    borderRadius: 9999,
    marginTop: 10,
  },
  inputAsk: {
    flex: 1,
    color: "black",
    fontSize: 15,
    minHeight: 45,
    maxHeight: 120,
    paddingVertical: 5,
    textAlignVertical: 'top',
  },
  buttonAsk: {
    backgroundColor: "#F49F0A",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    alignSelf: 'flex-end',
  },
  buttonAskDisabled: {
    opacity: 0.7,
  },
  buttonAskText: {
    color: "white",
    fontSize: 14,
    fontWeight: 'bold',
  },
  feedHeading: {
    marginBottom: 15,
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'left',
  },
  listLoadingIndicator: {
    marginVertical: 40,
  },
  noQuestionsText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 16,
    marginVertical: 40,
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
});