export type PedagogyMode = 'feynman' | 'socratic' | 'deep-dive' | 'quiz-me' | 'analogy';
export type StudentLevel = 'high-school' | 'undergraduate' | 'graduate' | 'self-taught';
export type ActiveTab = 'search-gpt' | 'tutor' | 'explore' | 'simulation' | 'flashcards' | 'quiz' | 'notes';

export interface SearchSource {
  title: string;
  uri: string;
}

export interface StudyMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: SearchSource[];
  searchQueries?: string[];
  attachedImage?: string;
  isStreaming?: boolean;
}

export interface StudySession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: StudyMessage[];
  pinned?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  mode?: PedagogyMode;
}

export interface ConceptPillar {
  title: string;
  explanation: string;
  formulaOrCode?: string;
  keyTakeaway: string;
}

export interface SimulationModel {
  title: string;
  description: string;
  variableName: string;
  unit: string;
  min: number;
  max: number;
  defaultVal: number;
  lowLabel: string;
  midLabel: string;
  highLabel: string;
  type?: 'gradient_descent' | 'bohr_effect' | 'retention_curve' | 'generic';
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  mastered?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
}

export interface LearningLesson {
  id: string;
  title: string;
  tagline: string;
  category: 'AI & CS' | 'Biological Sciences' | 'Physics & Quantum' | 'Economics & Math' | 'Custom';
  imageSrc?: string;
  overview: string;
  prerequisites: string[];
  coreMetaphor: string;
  deepConcepts: ConceptPillar[];
  simulationModel: SimulationModel;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  nextQuestions: string[];
}

export interface StudyBookmark {
  id: string;
  topicTitle: string;
  text: string;
  date: string;
  category: string;
}
