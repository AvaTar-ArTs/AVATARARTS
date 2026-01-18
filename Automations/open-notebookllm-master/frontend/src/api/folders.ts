import apiClient from './client'
import type { ApiResponse, Folder, Notebook } from '@/types'

/**
 * Get all folders
 */
export function getFolders(includeNotebooks = false) {
  return apiClient.get<ApiResponse<Folder[]>>('/api/folders', {
    params: { include_notebooks: includeNotebooks }
  })
}

/**
 * Create a folder
 */
export function createFolder(data: { name: string; emoji?: string; color?: string }) {
  return apiClient.post<ApiResponse<Folder>>('/api/folders', data)
}

/**
 * Get a single folder
 */
export function getFolder(folderId: string, includeNotebooks = true) {
  return apiClient.get<ApiResponse<Folder>>(`/api/folders/${folderId}`, {
    params: { include_notebooks: includeNotebooks }
  })
}

/**
 * Update a folder
 */
export function updateFolder(
  folderId: string,
  data: { name?: string; emoji?: string; color?: string; is_expanded?: boolean }
) {
  return apiClient.put<ApiResponse<Folder>>(`/api/folders/${folderId}`, data)
}

/**
 * Delete a folder
 */
export function deleteFolder(folderId: string) {
  return apiClient.delete<ApiResponse<void>>(`/api/folders/${folderId}`)
}

/**
 * Add a notebook to a folder
 */
export function addNotebookToFolder(folderId: string, notebookId: string) {
  return apiClient.put<ApiResponse<Notebook>>(`/api/folders/${folderId}/notebooks/${notebookId}`)
}

/**
 * Remove a notebook from a folder
 */
export function removeNotebookFromFolder(folderId: string, notebookId: string) {
  return apiClient.delete<ApiResponse<Notebook>>(`/api/folders/${folderId}/notebooks/${notebookId}`)
}

/**
 * Reorder folders
 */
export function reorderFolders(folderIds: string[]) {
  return apiClient.put<ApiResponse<void>>('/api/folders/reorder', { folder_ids: folderIds })
}

/**
 * Reorder notebooks inside a folder
 */
export function reorderNotebooksInFolder(folderId: string, notebookIds: string[]) {
  return apiClient.put<ApiResponse<void>>(`/api/folders/${folderId}/notebooks/reorder`, {
    notebook_ids: notebookIds
  })
}

/**
 * Get all folders and uncategorized notebooks
 */
export function getFoldersWithNotebooks() {
  return apiClient.get<ApiResponse<{ folders: Folder[]; uncategorized: Notebook[] }>>(
    '/api/folders/with-notebooks'
  )
}
