export type TipoUsuario = "ALUNO" | "MONITOR" | "PROFESSOR";

export interface Usuario {
  id: number;
  nome: string;
  tipo: TipoUsuario; 
}

export interface Resposta {
  id: number;
  descricao: string;
  createdAt: string; 
  usuario: Usuario; 
}

export interface Pergunta {
  id: number;
  titulo: string;
  descricao?: string;
  createdAt: string; 
  usuario: Usuario;
  respostas: Resposta[]; 
}