// Arquivo: src/assets/types/types.ts

// 1. Defina o tipo para o Enum, espelhando o schema.prisma
export type TipoUsuario = "ALUNO" | "MONITOR" | "PROFESSOR";

// 2. Garanta que a interface do usuário inclua o 'tipo'
export interface Usuario {
  id: number;
  nome: string;
  tipo: TipoUsuario; // <-- CAMPO ESSENCIAL
}

// 3. Interface da Resposta
export interface Resposta {
  id: number;
  descricao: string;
  createdAt: string; // ou Date
  usuario: Usuario; // <-- Usa a interface Usuario completa
}

// 4. Interface da Pergunta
export interface Pergunta {
  id: number;
  titulo: string;
  descricao?: string;
  createdAt: string; // ou Date
  usuario: Usuario;
  respostas: Resposta[]; // <-- Usa um array de Respostas completas
}