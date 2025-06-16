import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Pergunta as PerguntaType, Resposta as RespostaType, TipoUsuario } from '../../assets/types/types';

const API_BASE_URL = 'http://localhost:3004';

// Componente para renderizar a estrela de prestígio
const UserRoleBadge = ({ tipo }: { tipo: TipoUsuario }) => {
  if (tipo === 'PROFESSOR') {
    return <FontAwesome name="star" size={14} color="#FFC700" style={styles.badgeIcon} />;
  }
  if (tipo === 'MONITOR') {
    return <FontAwesome name="star" size={14} color="#3B82F6" style={styles.badgeIcon} />;
  }
  return null; // Não mostra nada para Alunos
};

interface QuestionBlockProps {
  pergunta: PerguntaType;
  onReplyPosted: () => void;
}

const QuestionBlock: React.FC<QuestionBlockProps> = ({ pergunta, onReplyPosted }) => {
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);

  // Lógica de ordenação das respostas usando useMemo para performance
  const sortedRespostas = useMemo(() => {
    if (!pergunta.respostas || pergunta.respostas.length === 0) {
      return [];
    }

    const getPriority = (tipo: TipoUsuario): number => {
      switch (tipo) {
        case 'PROFESSOR': return 0;
        case 'MONITOR':   return 1;
        case 'ALUNO':     return 2;
        default:          return 3;
      }
    };

    return [...pergunta.respostas].sort((a, b) => {
      const priorityA = getPriority(a.usuario.tipo);
      const priorityB = getPriority(b.usuario.tipo);
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB; // Ordena por prioridade
      }
      // Se a prioridade for a mesma, ordena por data (mais recente primeiro)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [pergunta.respostas]);

  // Função para abrir/fechar o campo de resposta (lógica original)
  const handleToggleReplyInput = async () => {
    if (!showReplyInput) {
        try {
            const loggedInStatus = await AsyncStorage.getItem('isLoggedIn');
            if (loggedInStatus !== 'true') {
                alert('Login Necessário, Você precisa estar logado para responder. Por favor, faça login ou crie uma conta.');
                return;
            }
            setShowReplyInput(true);
        } catch (error) {
            console.error("Erro ao verificar status de login ao tentar responder:", error);
            Alert.alert('Erro', 'Não foi possível verificar seu status de login. Tente novamente.');
            return;
        }
    } else {
        setShowReplyInput(false);
    }
  };

  // Função para postar a resposta (lógica original)
  const handlePostReply = async () => {
    if (replyText.trim() === '') {
        Alert.alert('Atenção', 'Por favor, digite sua resposta.');
        return;
    }
    setIsSubmittingReply(true);
    try {
        const loggedInStatus = await AsyncStorage.getItem('isLoggedIn');
        const userDataString = await AsyncStorage.getItem('userData');
        if (loggedInStatus !== 'true' || !userDataString) {
            Alert.alert('Login Necessário', 'Sua sessão expirou ou você não está logado. Por favor, faça login para responder.', [{ text: 'OK' }]);
            setIsSubmittingReply(false);
            setShowReplyInput(false);
            return;
        }
        const userData = JSON.parse(userDataString);
        const usuarioId = userData.id;
        if (!usuarioId) {
            Alert.alert('Erro', 'Não foi possível identificar o usuário. Tente fazer login novamente.');
            setIsSubmittingReply(false);
            return;
        }
        const replyPayload = {
            descricao: replyText,
            perguntaId: pergunta.id,
            usuarioId: usuarioId,
        };
        const response = await axios.post<RespostaType>(`${API_BASE_URL}/respostas`, replyPayload);
        if (response.status === 201) {
            Alert.alert('Sucesso!', 'Sua resposta foi enviada.');
            setReplyText('');
            setShowReplyInput(false);
            onReplyPosted();
        } else {
            Alert.alert('Erro', `Não foi possível enviar sua resposta. Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Erro ao enviar resposta:", error);
        if (axios.isAxiosError(error) && error.response) {
            Alert.alert('Erro ao enviar resposta', error.response.data?.error || 'Ocorreu um problema no servidor.');
        } else {
            Alert.alert('Erro', 'Não foi possível enviar sua resposta. Verifique sua conexão.');
        }
    } finally {
        setIsSubmittingReply(false);
    }
  };

  const shouldShowDescription = typeof pergunta.descricao === 'string' && pergunta.descricao.trim() !== '';

  return (
    <View style={styles.questionContainer}>
        <View style={styles.questionHeader}>
            <FontAwesome name="user-circle" size={20} color="#508CA4" style={styles.authorIcon} />
            <Text style={styles.authorName}>{pergunta.usuario.nome} perguntou:</Text>
        </View>

        <Text style={styles.questionTitle}>{pergunta.titulo}</Text>

        {shouldShowDescription && (
            <Text style={styles.questionDescription}>{pergunta.descricao}</Text>
        )}

        {sortedRespostas && sortedRespostas.length > 0 && (
            <View style={styles.answersSection}>
                <Text style={styles.answersHeading}>
                    {sortedRespostas.length} {sortedRespostas.length === 1 ? 'Resposta' : 'Respostas'}
                </Text>
                {sortedRespostas.map((resposta) => (
                    <View key={resposta.id} style={styles.answerBlock}>
                        <View style={styles.answerHeader}>
                            <View style={styles.dot} />
                            <Text style={styles.answerUser}>{resposta.usuario.nome}</Text>
                            <UserRoleBadge tipo={resposta.usuario.tipo} />
                            <Text style={styles.answerUserLabel}> respondeu:</Text>
                        </View>
                        <View style={styles.answer}>
                            <Text style={styles.answerText}>{resposta.descricao}</Text>
                        </View>
                    </View>
                ))}
            </View>
        )}
        {(!pergunta.respostas || pergunta.respostas.length === 0) && (
            <Text style={styles.noAnswersText}>Ainda não há respostas para esta pergunta.</Text>
        )}

        <TouchableOpacity style={styles.replyToggleButton} onPress={handleToggleReplyInput}>
            <FontAwesome name={showReplyInput ? "times-circle" : "reply"} size={18} color="#508CA4" />
            <Text style={styles.replyToggleButtonText}>
                {showReplyInput ? 'Cancelar Resposta' : 'Responder'}
            </Text>
        </TouchableOpacity>

        {showReplyInput && (
            <View style={styles.replyInputContainer}>
                <TextInput
                    style={styles.replyInput}
                    placeholder="Digite sua resposta..."
                    placeholderTextColor="rgba(0,0,0,0.5)"
                    multiline
                    value={replyText}
                    onChangeText={setReplyText}
                    editable={!isSubmittingReply}
                />
                <TouchableOpacity
                    style={[styles.submitReplyButton, isSubmittingReply && styles.submitReplyButtonDisabled]}
                    onPress={handlePostReply}
                    disabled={isSubmittingReply}
                >
                    {isSubmittingReply ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.submitReplyButtonText}>Enviar Resposta</Text>
                    )}
                </TouchableOpacity>
            </View>
        )}
        <View style={styles.divider} />
    </View>
  );
};

// Bloco de estilos completo e identado
const styles = StyleSheet.create({
    questionContainer: {
        marginBottom: 10,
    },
    questionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    authorIcon: {
        marginRight: 8,
    },
    authorName: {
        fontSize: 14,
        color: '#4A5568',
        fontWeight: '500',
    },
    questionTitle: {
        backgroundColor: "#E0E7FF",
        borderRadius: 8,
        padding: 16,
        fontSize: 17,
        marginBottom: 8,
        color: '#1E293B',
        fontWeight: '600',
    },
    questionDescription: {
        fontSize: 14,
        color: '#4A5568',
        marginBottom: 12,
        paddingHorizontal: 10,
        lineHeight: 20,
    },
    answersSection: {
        marginTop: 10,
        marginBottom: 15,
    },
    answersHeading: {
        fontSize: 15,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 10,
        paddingLeft: 10,
    },
    answerBlock: {
        marginBottom: 12,
        paddingLeft: 10,
        borderLeftWidth: 2,
        borderLeftColor: '#E2E8F0',
    },
    answerHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 6,
    },
    dot: {
        width: 10,
        height: 10,
        backgroundColor: "#F49F0A",
        borderRadius: 9999,
    },
    answerUser: {
        fontSize: 13,
        color: "#475569",
        fontWeight: '600',
    },
    badgeIcon: {
        marginLeft: 2,
    },
    answerUserLabel: {
        fontSize: 13,
        color: "#475569",
        fontWeight: 'normal',
    },
    answer: {
        backgroundColor: "#F0F9FF",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    answerText: {
        flex: 1,
        fontSize: 14,
        color: "black",
        lineHeight: 20,
    },
    noAnswersText: {
        textAlign: 'center',
        color: '#64748B',
        marginVertical: 15,
        fontStyle: 'italic',
        marginBottom: 20,
    },
    replyToggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#E0E7FF',
        borderRadius: 20,
        alignSelf: 'flex-start',
        gap: 8,
        marginBottom: 10,
    },
    replyToggleButtonText: {
        color: '#508CA4',
        fontWeight: '600',
        fontSize: 14,
    },
    replyInputContainer: {
        marginTop: 10,
        marginBottom: 15,
        backgroundColor: '#F0F9FF',
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: '#E0E7FF'
    },
    replyInput: {
        backgroundColor: 'white',
        minHeight: 60,
        maxHeight: 150,
        padding: 10,
        fontSize: 14,
        textAlignVertical: 'top',
        borderRadius: 6,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#CBD5E1'
    },
    submitReplyButton: {
        backgroundColor: '#F49F0A',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        alignItems: 'center',
    },
    submitReplyButtonDisabled: {
        opacity: 0.6,
    },
    submitReplyButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: "#CBD5E1",
        marginVertical: 20,
    },
});

export default QuestionBlock;