// src/plugins/axios.js
import axios from 'axios'
import { ref } from 'vue'

export const isLoading = ref(false) // متغير reactive يُستخدم في أي مكان

const $axios = axios.create({
  baseURL: 'http://alnakhel.online:3003/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptors to manage loading state
$axios.interceptors.request.use(
  (config) => {
    isLoading.value = true
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
