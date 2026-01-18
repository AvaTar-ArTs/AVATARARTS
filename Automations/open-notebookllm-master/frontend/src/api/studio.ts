import apiClient from './client'
import type {
  StudioOutput,
  StudioOutputType,
  ApiResponse,
  PodcastSpeaker,
  PodcastVoice,
  PodcastStyle,
  TTSResponse,
  DifficultyLevel,
  DiagramType
} from '@/types'

// ==================== Studio outputs ====================

// Get studio outputs
export const getStudioOutputs = (notebookId: string) =>
  apiClient.get<ApiResponse<StudioOutput[]>>(`/api/notebooks/${notebookId}/studio/outputs`)

// Generate summary
export const generateSummary = (notebookId: string, sourceIds?: string[]) =>
  apiClient.post<ApiResponse<StudioOutput>>(`/api/notebooks/${notebookId}/studio/summary`, {
    source_ids: sourceIds,
  })

// Generate mind map
export const generateMindmap = (notebookId: string, sourceIds?: string[]) =>
  apiClient.post<ApiResponse<StudioOutput>>(`/api/notebooks/${notebookId}/studio/mindmap`, {
    source_ids: sourceIds,
  })

// Generate flashcards (difficulty supported)
export const generateFlashcards = (
  notebookId: string,
  count?: number,
  sourceIds?: string[],
  difficulty?: DifficultyLevel
) =>
  apiClient.post<ApiResponse<StudioOutput>>(`/api/notebooks/${notebookId}/studio/flashcards`, {
    count: count || 10,
    source_ids: sourceIds,
    difficulty: difficulty || 'mixed',
  })

// Generate quiz (difficulty supported)
export const generateQuiz = (
  notebookId: string,
  count?: number,
  sourceIds?: string[],
  difficulty?: DifficultyLevel
) =>
  apiClient.post<ApiResponse<StudioOutput>>(`/api/notebooks/${notebookId}/studio/quiz`, {
    count: count || 10,
    source_ids: sourceIds,
    difficulty: difficulty || 'mixed',
  })

// Generate report
export const generateReport = (notebookId: string, sourceIds?: string[]) =>
  apiClient.post<ApiResponse<StudioOutput>>(`/api/notebooks/${notebookId}/studio/report`, {
    source_ids: sourceIds,
  })

// Generate data table
export const generateDatatable = (notebookId: string, sourceIds?: string[]) =>
  apiClient.post<ApiResponse<StudioOutput>>(`/api/notebooks/${notebookId}/studio/datatable`, {
    source_ids: sourceIds,
  })

// Generate presentation
export const generatePresentation = (
  notebookId: string,
  sourceIds?: string[],
  slideCount?: number,
  withImages?: boolean
) =>
  apiClient.post<ApiResponse<StudioOutput>>(`/api/notebooks/${notebookId}/studio/presentation`, {
    source_ids: sourceIds,
    slide_count: slideCount || 8,
    with_images: withImages ?? true,
  })

// Generate infographic (Chart.js visualization)
export const generateInfographic = (
  notebookId: string,
  sourceIds?: string[],
  withAiImage?: boolean
) =>
  apiClient.post<ApiResponse<StudioOutput>>(`/api/notebooks/${notebookId}/studio/infographic`, {
    source_ids: sourceIds,
    with_ai_image: withAiImage ?? false,
  })

// Generate flowchart (Draw.io)
export const generateFlowchart = (notebookId: string, sourceIds?: string[]) =>
  apiClient.post<ApiResponse<StudioOutput>>(`/api/notebooks/${notebookId}/studio/flowchart`, {
    source_ids: sourceIds,
  })

// Generate diagram (Draw.io)
export const generateDiagram = (
  notebookId: string,
  sourceIds?: string[],
  diagramType?: DiagramType
) =>
  apiClient.post<ApiResponse<StudioOutput>>(`/api/notebooks/${notebookId}/studio/diagram`, {
    source_ids: sourceIds,
    diagram_type: diagramType || 'auto',
  })

// Get single output
export const getStudioOutput = (notebookId: string, outputId: string) =>
  apiClient.get<ApiResponse<StudioOutput>>(`/api/notebooks/${notebookId}/studio/outputs/${outputId}`)

// Delete output
export const deleteStudioOutput = (notebookId: string, outputId: string) =>
  apiClient.delete<ApiResponse<void>>(`/api/notebooks/${notebookId}/studio/outputs/${outputId}`)

// ==================== Podcast ====================

export interface PodcastOptions {
  sourceIds?: string[]
  speakers?: PodcastSpeaker[]
  durationMinutes?: number
  style?: string
  withAudio?: boolean
  speakerVoices?: Record<string, string>
}

// Generate full podcast (script + optional audio)
export const generatePodcast = (notebookId: string, options: PodcastOptions = {}) =>
  apiClient.post<ApiResponse<StudioOutput & { audio_base64?: string }>>(
    `/api/notebooks/${notebookId}/studio/podcast`,
    {
      source_ids: options.sourceIds,
      speakers: options.speakers,
      duration_minutes: options.durationMinutes || 10,
      style: options.style || 'conversational',
      with_audio: options.withAudio ?? false,
      speaker_voices: options.speakerVoices,
    }
  )

// Generate podcast script only
export const generatePodcastScript = (notebookId: string, options: Omit<PodcastOptions, 'withAudio' | 'speakerVoices'> = {}) =>
  apiClient.post<ApiResponse<{ script: unknown }>>(
    `/api/notebooks/${notebookId}/studio/podcast/script`,
    {
      source_ids: options.sourceIds,
      speakers: options.speakers,
      duration_minutes: options.durationMinutes || 10,
      style: options.style || 'conversational',
    }
  )

// Generate podcast audio from script
export const generatePodcastAudio = (
  notebookId: string,
  script: unknown,
  speakerVoices?: Record<string, string>
) =>
  apiClient.post<ApiResponse<{ audio_base64: string; format: string }>>(
    `/api/notebooks/${notebookId}/studio/podcast/audio`,
    {
      script,
      speaker_voices: speakerVoices,
    }
  )

// Get available podcast voices and styles
export const getPodcastVoices = (notebookId: string) =>
  apiClient.get<ApiResponse<{ voices: PodcastVoice[]; styles: PodcastStyle[] }>>(
    `/api/notebooks/${notebookId}/studio/podcast/voices`
  )

// ==================== TTS ====================

// Text-to-speech
export const textToSpeech = (notebookId: string, text: string, voice?: string, provider?: string) =>
  apiClient.post<ApiResponse<TTSResponse>>(
    `/api/notebooks/${notebookId}/studio/tts`,
    {
      text,
      voice: voice || 'alloy',
      provider: provider || 'openai',
    }
  )

// ==================== Utilities ====================

// Studio output options
export interface StudioOutputOptions {
  count?: number
  slideCount?: number
  withImages?: boolean
  difficulty?: DifficultyLevel
  withAiImage?: boolean
  diagramType?: DiagramType
}

// Call the matching generator by type
export const generateStudioOutput = (
  notebookId: string,
  type: StudioOutputType,
  sourceIds?: string[],
  options?: StudioOutputOptions
) => {
  switch (type) {
    case 'summary':
      return generateSummary(notebookId, sourceIds)
    case 'mindmap':
      return generateMindmap(notebookId, sourceIds)
    case 'flowchart':
      return generateFlowchart(notebookId, sourceIds)
    case 'diagram':
      return generateDiagram(notebookId, sourceIds, options?.diagramType)
    case 'flashcards':
      return generateFlashcards(notebookId, options?.count, sourceIds, options?.difficulty)
    case 'quiz':
      return generateQuiz(notebookId, options?.count, sourceIds, options?.difficulty)
    case 'report':
      return generateReport(notebookId, sourceIds)
    case 'datatable':
      return generateDatatable(notebookId, sourceIds)
    case 'presentation':
      return generatePresentation(notebookId, sourceIds, options?.slideCount, options?.withImages)
    case 'infographic':
      return generateInfographic(notebookId, sourceIds, options?.withAiImage)
    case 'podcast':
      return generatePodcast(notebookId, { sourceIds })
    default:
      throw new Error(`Unknown output type: ${type}`)
  }
}

// Play Base64 audio
export const playBase64Audio = (base64: string, format: string = 'mp3'): HTMLAudioElement => {
  const audio = new Audio(`data:audio/${format};base64,${base64}`)
  audio.play()
  return audio
}

// Download Base64 audio
export const downloadBase64Audio = (base64: string, filename: string = 'audio.mp3') => {
  const link = document.createElement('a')
  link.href = `data:audio/mp3;base64,${base64}`
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
