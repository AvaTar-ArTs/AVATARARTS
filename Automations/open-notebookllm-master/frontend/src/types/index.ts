// Folder type
export interface Folder {
  id: string
  name: string
  emoji: string
  color?: string
  order: number
  is_expanded: boolean
  notebook_count: number
  notebooks?: Notebook[]
  created_at: string
  updated_at: string
}

// Notebook type
export interface Notebook {
  id: string
  name: string
  description?: string
  folder_id?: string
  order: number
  created_at: string
  updated_at: string
  source_count: number
  note_count: number
  sources?: Source[]
}

// Source type - supports audio
export type SourceType = 'pdf' | 'text' | 'web' | 'youtube' | 'gdocs' | 'audio'

export interface Source {
  id: string
  notebook_id: string
  type: SourceType
  name: string
  url?: string
  file_path?: string
  content?: string
  content_length: number
  metadata?: Record<string, unknown>
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error_message?: string
  created_at: string
  updated_at: string
}

// Chat message type
export interface ChatMessage {
  id: string
  notebook_id: string
  role: 'user' | 'assistant'
  content: string
  source_refs?: SourceReference[]
  used_source_ids?: string[]
  created_at: string
}

export interface SourceReference {
  source_id: string
  source_name: string
  chunk_text: string
  similarity: number
}

// Note type
export interface Note {
  id: string
  notebook_id: string
  title?: string
  content: string
  from_message_id?: string
  created_at: string
  updated_at: string
}

// Studio output type - includes Podcast + Draw.io
export type StudioOutputType =
  | 'summary'
  | 'mindmap'
  | 'flashcards'
  | 'quiz'
  | 'report'
  | 'datatable'
  | 'presentation'
  | 'infographic'
  | 'podcast'
  | 'flowchart'
  | 'diagram'

export interface StudioOutput {
  id: string
  notebook_id: string
  type: StudioOutputType
  title?: string
  data: unknown
  source_ids?: string[]
  created_at: string
}

// Mind map data
export interface MindmapData {
  central: string
  branches: MindmapBranch[]
}

export interface MindmapBranch {
  name: string
  children: MindmapBranch[]
}

// Difficulty type
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'mixed'

// Flashcard data (extended)
export interface FlashcardsData {
  cards: Flashcard[]
  metadata?: FlashcardsMetadata
}

export interface Flashcard {
  front: string
  back: string
  difficulty?: DifficultyLevel
  category?: string
  cognitive_level?: string
  hint?: string
}

export interface FlashcardsMetadata {
  total_cards: number
  difficulty_distribution?: {
    easy: number
    medium: number
    hard: number
  }
  categories?: string[]
  recommended_study_order?: number[]
}

// Quiz data (extended)
export interface QuizData {
  quiz_title?: string
  description?: string
  questions: QuizQuestion[]
  metadata?: QuizMetadata
}

export interface QuizQuestion {
  id?: number
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'matching' | 'short_answer'
  difficulty?: DifficultyLevel
  cognitive_level?: string
  category?: string
  question: string
  options?: string[]
  correct: string | boolean | Record<string, string>
  alternatives?: string[]  // Other acceptable answers for fill-in-the-blank
  left_items?: string[]    // Left side of matching question
  right_items?: string[]   // Right side of matching question
  correct_pairs?: Record<string, string>  // Matching answers
  sample_answer?: string   // Reference answer for short answer
  key_points?: string[]    // Key points for short answer
  explanation: string
  hint?: string
  points?: number
}

export interface QuizMetadata {
  total_questions: number
  total_points: number
  time_limit_minutes?: number
  passing_score?: number
  difficulty_distribution?: {
    easy: number
    medium: number
    hard: number
  }
  type_distribution?: {
    multiple_choice: number
    true_false: number
    fill_blank?: number
    matching?: number
    short_answer?: number
  }
  categories?: string[]
}

// Infographic data (Chart.js)
export interface InfographicData {
  title: string
  description?: string
  data_source?: string
  charts: ChartConfig[]
  summary?: {
    key_findings: string[]
    recommendations: string[]
  }
  metadata?: {
    total_charts: number
    chart_types: string[]
    data_points?: number
  }
  image?: string  // Optional AI-generated image
}

export interface ChartConfig {
  id: string
  title: string
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'scatter' | 'polarArea'
  description?: string
  insights?: string[]
  config: {
    type: string
    data: {
      labels: string[]
      datasets: ChartDataset[]
    }
    options?: Record<string, unknown>
  }
}

export interface ChartDataset {
  label?: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
  fill?: boolean
  tension?: number
}

// Podcast data
export interface PodcastData {
  title: string
  description?: string
  script?: PodcastScript
  has_audio?: boolean
  audio_base64?: string
}

export interface PodcastScript {
  title: string
  description?: string
  segments: PodcastSegment[]
}

export interface PodcastSegment {
  speaker: string
  text: string
  emotion?: string
}

export interface PodcastSpeaker {
  name: string
  role: string
  personality?: string
}

export interface PodcastVoice {
  id: string
  name: string
  gender: string
  description: string
}

export interface PodcastStyle {
  id: string
  name: string
  description: string
}

// Search types
export interface SearchResult {
  source_id: string
  source_name: string
  source_type?: string
  snippet: string
  score: number
  search_type: 'fulltext' | 'vector' | 'hybrid'
  fulltext_score?: number
  vector_score?: number
  hybrid_score?: number
}

export interface SearchResponse {
  query: string
  type: 'fulltext' | 'vector' | 'hybrid'
  results: SearchResult[]
}

// API response type
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// AI provider type
export type AIProvider = 'gemini' | 'openai' | 'anthropic' | 'ollama' | 'groq' | 'deepseek'

export interface AIProviderInfo {
  id: AIProvider
  name: string
  available: boolean
  supports_embedding: boolean
  supports_image: boolean
  models: string[]
}

// Settings type - multi-provider
export interface Settings {
  ai_provider: AIProvider
  gemini_model: string
  openai_model: string
  has_gemini_key: boolean
  has_openai_key: boolean
  has_anthropic_key: boolean
  has_groq_key: boolean
  has_deepseek_key: boolean
  provider_ready: boolean
  current_provider?: AIProvider
  current_config?: {
    provider: AIProvider
    is_ready: boolean
    has_embedding: boolean
    has_image: boolean
  }
}

export interface ProvidersResponse {
  current_provider: AIProvider
  providers: AIProviderInfo[]
}

// TTS types
export interface TTSRequest {
  text: string
  voice?: string
  provider?: string
}

export interface TTSResponse {
  audio_base64: string
  format: string
}

// Draw.io diagram data
export type DiagramType = 'auto' | 'architecture' | 'sequence' | 'class' | 'er' | 'network'

export interface DiagramData {
  title: string
  description?: string
  xml: string  // draw.io mxGraph XML
  type: 'flowchart' | 'diagram'
  diagram_type?: DiagramType
  elements?: DiagramElement[]
}

export interface DiagramElement {
  id: string
  type: 'node' | 'edge'
  label?: string
  shape?: string
  source?: string  // For edges
  target?: string  // For edges
}
