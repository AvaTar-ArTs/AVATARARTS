import axios from 'axios'

// Create Axios instance
const apiClient = axios.create({
  baseURL: '',
  timeout: 300000, // 5-minute timeout (AI generation may be slow)
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Remove Content-Type for FormData so the browser sets it.
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling
    if (error.response) {
      // Server response error
      console.error('API Error:', error.response.data)
    } else if (error.request) {
      // Request failed to send
      console.error('Network Error:', error.message)
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default apiClient
