// Em src/assets/types/types.ts ou similar

export interface Usuario {
  id: string; // ou number
  nome: string;
  email?: string;
}

export interface Resposta {
  id: string; // ou number
  descricao: string; // <<< ALINHADO COM A ROTA DE CRIAÇÃO DE RESPOSTA
  usuario: Usuario;
  perguntaId?: string; // A API de criação de resposta não retorna isso no corpo, mas o GET pode incluir
  // Adicione createdAt, updatedAt se vierem da API e forem úteis
}

export interface Pergunta {
  id: string; // ou number
  titulo: string;
  descricao?: string | null; // Descrição da pergunta
  usuario: Usuario;
  respostas: Resposta[];
  // Adicione createdAt, updatedAt se vierem da API e forem úteis
}