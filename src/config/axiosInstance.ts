import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from 'axios'
import Cookies from 'js-cookie'

const apiClient = axios.create({
  baseURL: 'https://api.job-tracking.janardhanchaturvedi.in/api/v1',
  timeout: 10000, // 10 seconds timeout
})

// Request Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { data } = error.response as { data: { message?: string } }
      const message = data?.message || 'An unexpected error occurred.'

      // Attach the error message for use in the catch block
      return Promise.reject(
        new AxiosError(message, error.code, error.config, error.request, error.response),
      )
    } else if (error.request) {
      return Promise.reject(
        new AxiosError(
          'No response from server. Please check your network connection.',
          error.code,
          error.config,
        ),
      )
    } else {
      return Promise.reject(
        new AxiosError(
          'Failed to process the request. Please try again.',
          error.code,
          error.config,
        ),
      )
    }
  },
)

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response as { status: number; data: { message?: string } }

      // Customize error messages based on status codes
      switch (status) {
        case 400:
          error.message = data?.message || 'Bad request. Please check your input.'
          break
        case 401:
          error.message = 'Unauthorized. Please log in again.'
          break
        case 403:
          error.message = 'Forbidden. You do not have permission to access this resource.'
          break
        case 404:
          error.message = data?.message || 'Resource not found.'
          break
        case 500:
          error.message = 'Internal server error. Please try again later.'
          break
        default:
          error.message = data?.message || 'An unexpected error occurred. Please try again.'
      }
    } else if (error.request) {
      // No response received
      error.message = 'No response from server. Please check your network connection.'
    } else {
      // Error setting up the request
      error.message = 'Failed to process the request. Please try again.'
    }

    console.error('Response error:', error.message)
    return Promise.reject(error)
  },
)

export default apiClient
