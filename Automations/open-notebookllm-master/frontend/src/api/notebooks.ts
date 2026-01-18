import apiClient from './client'
import type { Notebook, ApiResponse } from '@/types'

// Get all notebooks
export const getNotebooks = () =>
  apiClient.get<ApiResponse<Notebook[]>>('/api/notebooks')

// Create a notebook
export const createNotebook = (data: { name: string; description?: string }) =>
  apiClient.post<ApiResponse<Notebook>>('/api/notebooks', data)

// Get a notebook
export const getNotebook = (id: string) =>
  apiClient.get<ApiResponse<Notebook>>(`/api/notebooks/${id}`)

// Update a notebook
export const updateNotebook = (id: string, data: { name?: string; description?: string }) =>
  apiClient.put<ApiResponse<Notebook>>(`/api/notebooks/${id}`, data)

// Delete a notebook
export const deleteNotebook = (id: string) =>
  apiClient.delete<ApiResponse<void>>(`/api/notebooks/${id}`)
