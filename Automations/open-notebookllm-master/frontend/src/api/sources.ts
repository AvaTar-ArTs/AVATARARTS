import apiClient from './client'
import type { Source, ApiResponse, SearchResponse } from '@/types'

// ==================== Source management ====================

// Get all sources for a notebook
export const getSources = (notebookId: string) =>
  apiClient.get<ApiResponse<Source[]>>(`/api/notebooks/${notebookId}/sources`)

// Upload file source (supports files and audio)
export interface UploadOptions {
  sttProvider?: 'openai' | 'groq' | 'local'
  language?: string
}

export const uploadSource = (notebookId: string, file: File, options?: UploadOptions) => {
  const formData = new FormData()
  formData.append('file', file)

  if (options?.sttProvider) {
    formData.append('stt_provider', options.sttProvider)
  }
  if (options?.language) {
    formData.append('language', options.language)
  }

  return apiClient.post<ApiResponse<Source>>(
    `/api/notebooks/${notebookId}/sources/upload`,
    formData
  )
}

// Add URL source
export const addUrlSource = (notebookId: string, url: string) =>
  apiClient.post<ApiResponse<Source>>(`/api/notebooks/${notebookId}/sources/url`, { url })

// Add YouTube source
export const addYoutubeSource = (notebookId: string, url: string) =>
  apiClient.post<ApiResponse<Source>>(`/api/notebooks/${notebookId}/sources/youtube`, { url })

// Add text source
export const addTextSource = (notebookId: string, name: string, content: string) =>
  apiClient.post<ApiResponse<Source>>(`/api/notebooks/${notebookId}/sources/text`, { name, content })

// Get a single source
export const getSource = (sourceId: string) =>
  apiClient.get<ApiResponse<Source>>(`/api/sources/${sourceId}`)

// Delete a source
export const deleteSource = (sourceId: string) =>
  apiClient.delete<ApiResponse<void>>(`/api/sources/${sourceId}`)

// ==================== Search ====================

export type SearchType = 'hybrid' | 'fulltext' | 'vector'

export interface SearchOptions {
  query: string
  type?: SearchType
  topK?: number
  sourceIds?: string[]
}

// Search sources in a notebook
export const searchSources = (notebookId: string, options: SearchOptions) =>
  apiClient.post<ApiResponse<SearchResponse>>(`/api/notebooks/${notebookId}/search`, {
    query: options.query,
    type: options.type || 'hybrid',
    top_k: options.topK || 10,
    source_ids: options.sourceIds,
  })

// Rebuild full-text search index
export const reindexSources = (notebookId?: string) =>
  apiClient.post<ApiResponse<{ message: string }>>(`/api/sources/reindex`, {
    notebook_id: notebookId,
  })

// ==================== Utilities ====================

// Check whether the file is audio
export const isAudioFile = (filename: string): boolean => {
  const audioExtensions = ['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm', 'ogg', 'flac']
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  return audioExtensions.includes(ext)
}

// Get source type icon
export const getSourceTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    pdf: '📄',
    text: '📝',
    web: '🌐',
    youtube: '▶️',
    gdocs: '📑',
    audio: '🎵',
  }
  return icons[type] || '📁'
}

// Get source type label
export const getSourceTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    pdf: 'PDF',
    text: 'Text',
    web: 'Web',
    youtube: 'YouTube',
    gdocs: 'Document',
    audio: 'Audio',
  }
  return labels[type] || type
}
