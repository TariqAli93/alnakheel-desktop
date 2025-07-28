import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'

export const useLoginState = defineStore('login', () => {
  const isLoggedIn = ref(localStorage.getItem('isLoggedIn') === 'true')
  const user = ref(null)
  const token = ref(localStorage.getItem('authToken'))

  // التحقق من صحة الـ token عند البداية
  const isTokenValid = computed(() => {
    if (!token.value) return false

    try {
      const decoded = jwtDecode(token.value)
      const now = Date.now() / 1000
      return decoded.exp > now
    } catch {
      return false
    }
  })

  function login(authToken, userData) {
    try {
      const decoded = jwtDecode(authToken)

      isLoggedIn.value = true
      token.value = authToken
      user.value = userData || {
        id: decoded.id,
        username: decoded.username,
        roles: decoded.roles || []
      }

      localStorage.setItem('authToken', authToken)
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('user', JSON.stringify(user.value))
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error)
      logout()
    }
  }

  function logout() {
    isLoggedIn.value = false
    token.value = null
    user.value = null

    localStorage.removeItem('authToken')
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('user')
  }

  // التحقق التلقائي من صحة الـ token
  function checkTokenValidity() {
    if (!isTokenValid.value) {
      logout()
      return false
    }
    return true
  }

  // استرجاع بيانات المستخدم من localStorage عند البداية
  if (token.value && localStorage.getItem('user')) {
    try {
      user.value = JSON.parse(localStorage.getItem('user'))
      if (!checkTokenValidity()) {
        logout()
      }
    } catch {
      logout()
    }
  }

  function decodeToken(token) {
    if (token) {
      try {
        return jwtDecode(token)
      } catch (error) {
        console.error('خطأ في فك تشفير الـ token:', error)
        return null
      }
    }
    return null
  }

  // مراقبة تغييرات حالة تسجيل الدخول
  watch(isLoggedIn, (newVal) => {
    localStorage.setItem('isLoggedIn', newVal.toString())
  })

  return {
    isLoggedIn,
    user,
    token,
    isTokenValid,
    login,
    logout,
    checkTokenValidity,
    decodeToken
  }
})
