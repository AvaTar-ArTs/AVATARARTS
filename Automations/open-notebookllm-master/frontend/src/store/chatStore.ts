import { create } from 'zustand'
import type { ChatMessage, SourceReference } from '@/types'
import * as chatApi from '@/api/chat'

interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  isStreaming: boolean
  streamingContent: string
  suggestedQuestions: string[]
  currentSourceRefs: SourceReference[]
  error: string | null

  // Actions
  fetchMessages: (notebookId: string) => Promise<void>
  sendMessage: (notebookId: string, message: string, sourceIds?: string[]) => Promise<void>
  sendStreamMessage: (notebookId: string, message: string, sourceIds?: string[]) => Promise<void>
  fetchSuggestedQuestions: (notebookId: string) => Promise<void>
  deleteMessage: (notebookId: string, messageId: string) => Promise<void>
  clearMessages: (notebookId: string) => Promise<void>
  clearError: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  isStreaming: false,
  streamingContent: '',
  suggestedQuestions: [],
  currentSourceRefs: [],
  error: null,

  fetchMessages: async (notebookId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await chatApi.getMessages(notebookId)
      if (response.data.success && response.data.data) {
        set({ messages: response.data.data })
      }
    } catch (error) {
      set({ error: 'Unable to load conversation history' })
    } finally {
      set({ isLoading: false })
    }
  },

  sendMessage: async (notebookId: string, message: string, sourceIds?: string[]) => {
    set({ isLoading: true, error: null })

    // Add the user message to the UI first.
    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      notebook_id: notebookId,
      role: 'user',
      content: message,
      used_source_ids: sourceIds,
      created_at: new Date().toISOString(),
    }
    set((state) => ({ messages: [...state.messages, userMessage] }))

    try {
      const response = await chatApi.sendMessage(notebookId, message, sourceIds)
      if (response.data.success && response.data.data) {
        // Update user message ID and append assistant response.
        set((state) => ({
          messages: [
            ...state.messages.slice(0, -1), // Remove temporary user message.
            { ...userMessage, id: response.data.data!.id.replace('assistant', 'user') },
            response.data.data!,
          ],
        }))
      }
    } catch (error) {
      set({ error: 'Failed to send message' })
      // Remove temporary message.
      set((state) => ({ messages: state.messages.slice(0, -1) }))
    } finally {
      set({ isLoading: false })
    }
  },

  sendStreamMessage: async (notebookId: string, message: string, sourceIds?: string[]) => {
    set({ isStreaming: true, streamingContent: '', currentSourceRefs: [], error: null })

    // Add the user message first.
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      notebook_id: notebookId,
      role: 'user',
      content: message,
      used_source_ids: sourceIds,
      created_at: new Date().toISOString(),
    }
    set((state) => ({ messages: [...state.messages, userMessage] }))

    await chatApi.streamMessage(
      notebookId,
      message,
      sourceIds,
      // onChunk
      (chunk: string) => {
        set((state) => ({ streamingContent: state.streamingContent + chunk }))
      },
      // onSources
      (refs: unknown[]) => {
        set({ currentSourceRefs: refs as SourceReference[] })
      },
      // onDone
      (messageId: string) => {
        const { streamingContent, currentSourceRefs } = get()
        const assistantMessage: ChatMessage = {
          id: messageId,
          notebook_id: notebookId,
          role: 'assistant',
          content: streamingContent,
          source_refs: currentSourceRefs,
          used_source_ids: sourceIds,
          created_at: new Date().toISOString(),
        }
        set((state) => ({
          messages: [...state.messages, assistantMessage],
          isStreaming: false,
          streamingContent: '',
        }))
      },
      // onError
      (error: string) => {
        set({ error, isStreaming: false, streamingContent: '' })
      }
    )
  },

  fetchSuggestedQuestions: async (notebookId: string) => {
    try {
      const response = await chatApi.getSuggestedQuestions(notebookId)
      if (response.data.success && response.data.data) {
        set({ suggestedQuestions: response.data.data })
      }
    } catch (error) {
      // Fail silently.
    }
  },

  deleteMessage: async (notebookId: string, messageId: string) => {
    try {
      await chatApi.deleteMessage(notebookId, messageId)
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== messageId),
      }))
    } catch (error) {
      set({ error: 'Failed to delete message' })
    }
  },

  clearMessages: async (notebookId: string) => {
    try {
      await chatApi.clearMessages(notebookId)
      set({ messages: [] })
    } catch (error) {
      set({ error: 'Failed to clear conversation' })
    }
  },

  clearError: () => {
    set({ error: null })
  },
}))
