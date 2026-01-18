import apiClient from './client'
import type { Settings, ProvidersResponse, AIProvider, ApiResponse } from '@/types'

// Get settings
export const getSettings = () =>
  apiClient.get<ApiResponse<Settings>>('/api/settings')

// Get available AI providers
export const getProviders = () =>
  apiClient.get<ApiResponse<ProvidersResponse>>('/api/settings/providers')

// Update settings (switch provider)
export interface UpdateSettingsParams {
  provider: AIProvider
  apiKey?: string
  model?: string
}

export const updateSettings = (params: UpdateSettingsParams) =>
  apiClient.put<ApiResponse<{
    provider: AIProvider
    provider_ready: boolean
    config: {
      provider: AIProvider
      is_ready: boolean
      has_embedding: boolean
      has_image: boolean
    }
  }>>('/api/settings', {
    provider: params.provider,
    api_key: params.apiKey,
    model: params.model,
  })

// Test API connection
export const testApi = (provider: AIProvider, apiKey?: string) =>
  apiClient.post<ApiResponse<{
    message: string
    response: string
  }>>('/api/settings/test-api', {
    provider,
    api_key: apiKey,
  })

// Reset AI service
export const resetService = () =>
  apiClient.post<ApiResponse<{
    provider_ready: boolean
    current_provider: AIProvider
    config: {
      provider: AIProvider
      is_ready: boolean
      has_embedding: boolean
      has_image: boolean
    }
  }>>('/api/settings/reset')

// Get available models for provider
export const getProviderModels = (provider: AIProvider) =>
  apiClient.get<ApiResponse<{
    provider: AIProvider
    models: string[]
  }>>(`/api/settings/models/${provider}`)

// ==================== Provider info ====================

export interface ProviderDisplayInfo {
  id: AIProvider
  name: string
  description: string
  icon: string
  color: string
  features: string[]
}

// Provider display info
export const PROVIDER_INFO: Record<AIProvider, ProviderDisplayInfo> = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Multimodal, embeddings, image generation',
    icon: '🔷',
    color: '#4285F4',
    features: ['Text generation', 'Embeddings', 'Image generation'],
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4.1/5.1 + DALL-E 3',
    icon: '🟢',
    color: '#10A37F',
    features: ['Text generation', 'Embeddings', 'Image generation', 'TTS/STT'],
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Claude Opus/Sonnet series',
    icon: '🟠',
    color: '#D97706',
    features: ['Text generation', 'Long context'],
  },
  ollama: {
    id: 'ollama',
    name: 'Ollama (Local)',
    description: 'Local models, free and unlimited',
    icon: '🦙',
    color: '#6B7280',
    features: ['Text generation', 'Embeddings', 'Offline use'],
  },
  groq: {
    id: 'groq',
    name: 'Groq (Fast)',
    description: 'Ultra-fast inference, Llama 3.3 70B',
    icon: '⚡',
    color: '#F59E0B',
    features: ['Text generation', 'Fast inference', 'STT'],
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek (Reasoning)',
    description: 'Supports DeepSeek-R1 reasoning model',
    icon: '🧠',
    color: '#8B5CF6',
    features: ['Text generation', 'Reasoning model', 'Chain-of-Thought'],
  },
}

// Get provider display info
export const getProviderInfo = (provider: AIProvider): ProviderDisplayInfo => {
  return PROVIDER_INFO[provider] || {
    id: provider,
    name: provider,
    description: '',
    icon: '❓',
    color: '#6B7280',
    features: [],
  }
}
