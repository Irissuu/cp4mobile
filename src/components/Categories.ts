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
  trabalhos: '#c09eff',
  projetos:  '#dcc7ff',
  pessoal:   '#846ead',
  estudos:   '#a689dc',
  consultas: '#755db3',
  tarefas:   '#61527e',
} as const;
