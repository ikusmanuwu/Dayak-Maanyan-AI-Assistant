export interface VocabItem {
  term: string;
  meaning: string;
  category: string;
  notes?: string;
  example?: string;
  isLearned?: boolean;
}

export interface LearnedVocabItem {
  id: string;
  term_maanyan: string;
  meaning_indonesian: string;
  category: string;
  example_sentence?: string;
  contributor: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  detectedLearning?: {
    term: string;
    meaning: string;
    category?: string;
    example?: string;
  } | null;
  mode?: "chat" | "latihan";
}

export interface PythonFileDoc {
  filename: string;
  title: string;
  content: string;
}
