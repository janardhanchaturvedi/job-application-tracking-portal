import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import Cookies from 'js-cookie'

const apiClient = axios.create({
  baseURL: 'https://api.job-tracking.janardhanchaturvedi.in/api/v1',
  timeout: 10000,
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers['x-access-token'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default apiClient
