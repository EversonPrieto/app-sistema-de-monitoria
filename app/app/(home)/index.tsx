import React from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Navbar from '../(componentes)/navbar';

export default function ForumScreen() {
  return (
    <View style={styles.container}>
      <Navbar />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topInput}>
          <View style={styles.dot} />
          <TextInput
            style={styles.input}
            placeholder="Qual é a sua dúvida?"
            placeholderTextColor="black"
          />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Perguntar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.heading}>Outros usuários já perguntaram....</Text>

        <Text style={styles.question}>Pergunta aleatória número 1?</Text>

        <View style={styles.answerBlock}>
          <View style={styles.answerHeader}>
            <View style={styles.dot} />
            <Text style={styles.answerUser}>Usuário Professor Responde</Text>
            <View style={styles.responses}>
              <FontAwesome name="comment-o" size={14} color="#475569" />
              <Text style={styles.responseText}>3 Respostas</Text>
            </View>
          </View>
          <View style={styles.answer}>
            <Text>Resposta Professor</Text>
            <FontAwesome name="star" size={16} color="#f97316" style={styles.star} />
          </View>
        </View>

        <View style={styles.answerBlock}>
          <View style={styles.answerHeader}>
            <View style={styles.dot} />
            <Text style={styles.answerUser}>Usuário Monitor Responde</Text>
          </View>
          <View style={styles.answer}>
            <Text>Resposta Monitor</Text>
            <FontAwesome name="star" size={16} color="#0284c7" style={styles.star} />
          </View>
        </View>

        <View style={styles.answerBlock}>
          <View style={styles.answerHeader}>
            <View style={styles.dot} />
            <Text style={styles.answerUser}>Usuário Aluno Responde</Text>
          </View>
          <View style={styles.answer}>
            <Text>Resposta Aluno</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.question}>Pergunta aleatória número 2?</Text>

        <View style={styles.answerBlock}>
          <View style={styles.answerHeader}>
            <View style={styles.dot} />
            <Text style={styles.answerUser}>Usuário Monitor Responde</Text>
            <View style={styles.responses}>
              <FontAwesome name="comment-o" size={14} color="#475569" />
              <Text style={styles.responseText}>2 Respostas</Text>
            </View>
          </View>
          <View style={styles.answer}>
            <Text>Resposta Monitor</Text>
            <FontAwesome name="star" size={16} color="#0284c7" style={styles.star} />
          </View>
        </View>

        <View style={styles.answerBlock}>
          <View style={styles.answerHeader}>
            <View style={styles.dot} />
            <Text style={styles.answerUser}>Usuário Aluno Responde</Text>
          </View>
          <View style={styles.answer}>
            <Text>Resposta Aluno</Text>
          </View>
        </View>

        <View style={styles.divider} />
        <Text style={styles.question}>Pergunta aleatória número 3?</Text>
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
  },
  topInput: {
    backgroundColor: "#BFD7EA",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dot: {
    width: 16,
    height: 16,
    backgroundColor: "#F49F0A",
    borderRadius: 9999,
  },
  input: {
    flex: 1,
    backgroundColor: "#BFD7EA",
    color: "black",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#F49F0A",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 9999,
  },
  buttonText: {
    color: "white",
    fontSize: 12,
  },
  heading: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 18,
  },
  question: {
    backgroundColor: "#BFD7EA",
    borderRadius: 12,
    padding: 16,
    textAlign: "center",
    fontSize: 16,
    marginBottom: 12,
  },
  answerBlock: {
    marginBottom: 16,
  },
  answerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  answerUser: {
    fontSize: 12,
    color: "#000000",
  },
  responses: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  responseText: {
    fontSize: 12,
    color: "#475569",
  },
  answer: {
    backgroundColor: "#BFD7EA",
    borderRadius: 9999,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "black",
    position: "relative",
    maxWidth: "90%",
    marginTop: 2,
  },
  star: {
    position: "absolute",
    right: 1,
    top: "50%",
    transform: [{ translateY: -8 }],
  },
  divider: {
    height: 1,
    backgroundColor: "black",
    marginVertical: 16,
  },
});