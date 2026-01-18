import apiClient from './client'
import type { ChatMessage, ApiResponse } from '@/types'

// Get chat history
export const getMessages = (notebookId: string) =>
  apiClient.get<ApiResponse<ChatMessage[]>>(`/api/notebooks/${notebookId}/chats`)

// Send message (non-streaming)
export const sendMessage = (
  notebookId: string,
  message: string,
  sourceIds?: string[]
) =>
  apiClient.post<ApiResponse<ChatMessage>>(`/api/notebooks/${notebookId}/chats`, {
    message,
    source_ids: sourceIds,
  })

// Stream message
export const streamMessage = async (
  notebookId: string,
  message: string,
  sourceIds: string[] | undefined,
  onChunk: (chunk: string) => void,
  onSources: (refs: unknown[]) => void,
  onDone: (messageId: string) => void,
  onError: (error: string) => void
) => {
  try {
    const response = await fetch(`/api/notebooks/${notebookId}/chats/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, source_ids: sourceIds }),
    })

    if (!response.ok) {
      throw new Error('Streaming request failed')
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Unable to read stream')
    }

    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))

            if (data.type === 'chunk') {
              onChunk(data.content)
            } else if (data.type === 'sources') {
              onSources(data.references)
            } else if (data.type === 'done') {
              onDone(data.message_id)
            } else if (data.type === 'error') {
              onError(data.message)
            }
          } catch {
            // Ignore parsing errors.
          }
        }
      }
    }
  } catch (error) {
    onError(error instanceof Error ? error.message : 'Unknown error')
  }
}

// Get suggested questions
export const getSuggestedQuestions = (notebookId: string) =>
  apiClient.get<ApiResponse<string[]>>(`/api/notebooks/${notebookId}/suggested-questions`)

// Delete message
export const deleteMessage = (notebookId: string, messageId: string) =>
  apiClient.delete<ApiResponse<void>>(`/api/notebooks/${notebookId}/chats/${messageId}`)

// Clear chat
export const clearMessages = (notebookId: string) =>
  apiClient.delete<ApiResponse<void>>(`/api/notebooks/${notebookId}/chats/clear`)
