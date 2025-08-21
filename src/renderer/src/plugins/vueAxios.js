// src/plugins/axios.js
import axios from 'axios'
import { ref } from 'vue'
import { useLoginState } from '../stores/login'

export const isLoading = ref(false)

const $axios = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://alnakhel.online:3003/'
      : 'http://localhost:3003/',
  timeout: 10000
})

// Interceptors to manage loading state & set token dynamically
$axios.interceptors.request.use(
  (config) => {
    isLoading.value = true

    // استدعاء store داخل interceptor حتى يأخذ آخر قيمة للتوكن
    const loginState = useLoginState()
    const token = loginState.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      delete config.headers.Authorization
    }

    return config
  },
  (error) => {
    isLoading.value = false
    return Promise.reject(error)
  }
)

$axios.interceptors.response.use(
  (response) => {
    isLoading.value = false
    return response
  },
  (error) => {
    isLoading.value = false
    return Promise.reject(error)
  }
)

export default $axios
