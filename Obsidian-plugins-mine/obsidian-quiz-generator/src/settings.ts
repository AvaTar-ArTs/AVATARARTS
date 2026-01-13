/**
 * Settings configuration for Quiz Generator 2026
 */

export interface ModelProfile {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'mistral' | 'cohere' | 'perplexity' | 'ollama';
  config: {
    model: string;
    temperature: number;
    maxTokens: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    systemPrompt?: string;
    apiEndpoint?: string; // For Ollama or custom endpoints
  };
  performance: {
    estimatedSpeed: 'fast' | 'balanced' | 'quality';
    costTier?: 'free' | 'low' | 'medium' | 'high';
    isLocal?: boolean;
  };
}

export interface QuizGeneratorSettings {
  // Model Settings
  modelProfiles: ModelProfile[];
  defaultProfileId: string;
  apiKeys: {
    openai?: string;
    anthropic?: string;
    google?: string;
    mistral?: string;
    cohere?: string;
    perplexity?: string;
  };

  // Generation Settings
  defaultDifficulty: 'basic' | 'intermediate' | 'advanced';
  questionsPerGeneration: number;
  questionTypeDistribution: {
    trueFalse: number;
    multipleChoice: number;
    selectAll: number;
    fillInBlank: number;
    matching: number;
    shortAnswer: number;
    longAnswer: number;
    categorization: number;
  };
  maxChoicesPerQuestion: number;
  maxBlanksPerQuestion: number;
  maxPairsPerMatching: number;

  // Chunking Settings
  enableChunking: boolean;
  chunkSize: number; // In tokens
  chunkOverlap: number; // In tokens
  maxChunksPerGeneration: number;
  chunkingStrategy: 'header' | 'paragraph' | 'token' | 'smart';

  // Storage Settings
  quizStorageFolder: string;
  saveFormat: 'callout' | 'flashcard' | 'both';
  autoSave: boolean;
  includeSourceLinks: boolean;
  preserveMetadata: boolean;

  // Test Mode Settings
  defaultTimeLimit: number; // In minutes, 0 for no limit
  saveTestResults: boolean;
  testResultsFolder: string;
  showCorrectAnswersAfterTest: boolean;
  allowTestRetakes: boolean;

  // Dashboard Settings
  dashboardItemsPerPage: number;
  defaultSortOrder: 'date' | 'name' | 'difficulty' | 'score';
  showRecentQuizzesCount: number;

  // Integration Settings
  enableNoteLinks: boolean;
  followBacklinks: boolean;
  maxLinkDepth: number;
  enableDataviewIntegration: boolean;
  enableTagAdder: boolean;
  enableEmbeddedQuizzes: boolean;

  // UI Settings
  theme: 'default' | 'minimal' | 'trash-cat' | 'custom';
  showGenerationProgress: boolean;
  enableSoundEffects: boolean;
  enableAnimations: boolean;
  compactMode: boolean;

  // Advanced Settings
  debugMode: boolean;
  cacheGeneratedQuestions: boolean;
  cacheExpiryHours: number;
  maxRetries: number;
  requestTimeout: number; // In seconds
  rateLimit: number; // Requests per minute
  customPromptTemplate?: string;

  // Metadata
  version: string;
  isFirstLoad: boolean;
  lastUsedProfile?: string;
  statistics: {
    totalQuizzesGenerated: number;
    totalQuestionsGenerated: number;
    totalTestsTaken: number;
    averageScore: number;
  };
}

export const DEFAULT_MODEL_PROFILES: ModelProfile[] = [
  {
    id: 'fast-local',
    name: 'Fast Local (Ollama)',
    provider: 'ollama',
    config: {
      model: 'llama2',
      temperature: 0.7,
      maxTokens: 2000,
      apiEndpoint: 'http://localhost:11434',
    },
    performance: {
      estimatedSpeed: 'fast',
      costTier: 'free',
      isLocal: true,
    },
  },
  {
    id: 'balanced-gpt',
    name: 'Balanced (GPT-4o-mini)',
    provider: 'openai',
    config: {
      model: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 4000,
      topP: 0.9,
    },
    performance: {
      estimatedSpeed: 'balanced',
      costTier: 'low',
      isLocal: false,
    },
  },
  {
    id: 'quality-claude',
    name: 'High Quality (Claude 3.5 Sonnet)',
    provider: 'anthropic',
    config: {
      model: 'claude-3-5-sonnet-20241022',
      temperature: 0.7,
      maxTokens: 4000,
    },
    performance: {
      estimatedSpeed: 'quality',
      costTier: 'medium',
      isLocal: false,
    },
  },
  {
    id: 'creative-gemini',
    name: 'Creative (Gemini 1.5 Pro)',
    provider: 'google',
    config: {
      model: 'gemini-1.5-pro',
      temperature: 0.9,
      maxTokens: 8000,
      topP: 0.95,
    },
    performance: {
      estimatedSpeed: 'balanced',
      costTier: 'medium',
      isLocal: false,
    },
  },
];

export const DEFAULT_SETTINGS: QuizGeneratorSettings = {
  // Model Settings
  modelProfiles: DEFAULT_MODEL_PROFILES,
  defaultProfileId: 'balanced-gpt',
  apiKeys: {},

  // Generation Settings
  defaultDifficulty: 'intermediate',
  questionsPerGeneration: 10,
  questionTypeDistribution: {
    trueFalse: 15,
    multipleChoice: 30,
    selectAll: 10,
    fillInBlank: 15,
    matching: 10,
    shortAnswer: 10,
    longAnswer: 5,
    categorization: 5,
  },
  maxChoicesPerQuestion: 4,
  maxBlanksPerQuestion: 3,
  maxPairsPerMatching: 5,

  // Chunking Settings
  enableChunking: true,
  chunkSize: 2000,
  chunkOverlap: 200,
  maxChunksPerGeneration: 10,
  chunkingStrategy: 'smart',

  // Storage Settings
  quizStorageFolder: 'Quizzes',
  saveFormat: 'both',
  autoSave: true,
  includeSourceLinks: true,
  preserveMetadata: true,

  // Test Mode Settings
  defaultTimeLimit: 30,
  saveTestResults: true,
  testResultsFolder: 'Quiz Results',
  showCorrectAnswersAfterTest: true,
  allowTestRetakes: true,

  // Dashboard Settings
  dashboardItemsPerPage: 20,
  defaultSortOrder: 'date',
  showRecentQuizzesCount: 5,

  // Integration Settings
  enableNoteLinks: true,
  followBacklinks: false,
  maxLinkDepth: 2,
  enableDataviewIntegration: false,
  enableTagAdder: true,
  enableEmbeddedQuizzes: true,

  // UI Settings
  theme: 'default',
  showGenerationProgress: true,
  enableSoundEffects: false,
  enableAnimations: true,
  compactMode: false,

  // Advanced Settings
  debugMode: false,
  cacheGeneratedQuestions: true,
  cacheExpiryHours: 24,
  maxRetries: 3,
  requestTimeout: 30,
  rateLimit: 60,

  // Metadata
  version: '1.0.0',
  isFirstLoad: true,
  statistics: {
    totalQuizzesGenerated: 0,
    totalQuestionsGenerated: 0,
    totalTestsTaken: 0,
    averageScore: 0,
  },
};

/**
 * Question types and their structures
 */
export interface QuizQuestion {
  id: string;
  type: QuestionType;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  question: string;
  correctAnswer: any;
  options?: string[];
  explanation?: string;
  source?: {
    file: string;
    line?: number;
    header?: string;
  };
  metadata?: {
    generatedAt: string;
    modelProfile: string;
    tags?: string[];
  };
}

export type QuestionType = 
  | 'trueFalse'
  | 'multipleChoice'
  | 'selectAll'
  | 'fillInBlank'
  | 'matching'
  | 'shortAnswer'
  | 'longAnswer'
  | 'categorization';

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  settings: {
    difficulty: string;
    timeLimit?: number;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    sourceNotes: string[];
    modelProfile: string;
    totalQuestions: number;
    estimatedTime?: number;
  };
  statistics?: {
    attemptCount: number;
    averageScore: number;
    bestScore: number;
    lastAttempt?: string;
  };
}
