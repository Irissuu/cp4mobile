export type Category = 'trabalhos' | 'pessoal' | 'estudos' | 'tarefas' | 'projetos' | 'consultas';

export const CATEGORIES: Category[] = ['trabalhos', 'pessoal', 'estudos', 'tarefas', 'projetos', 'consultas'];

export const CAT_LABELS: Record<Category, string> = {
  trabalhos: 'Trabalho',
  pessoal: 'Pessoal',
  estudos: 'Estudos',
  tarefas: 'Tarefas',
  projetos: 'Projetos',
  consultas: 'Consultas',
};

export const CAT_COLORS = {
  trabalhos: '#8C6C77',
  projetos:  '#B3929D',
  pessoal:   '#D9BDC5',
  estudos:   '#664E57',
  consultas: '#ADA0A3',
  tarefas:   '#FFEEF2',
} as const;
