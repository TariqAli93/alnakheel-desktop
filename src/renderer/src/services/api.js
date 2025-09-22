import $axios from '../plugins/vueAxios'
import { generateJWT } from '../plugins/jwt.js'
const propertyService = {
  create: (data) => $axios.post('/api/properties', data),
  update: (id, data) => $axios.put(`/api/properties/${id}`, data),
  delete: (id) => $axios.delete(`/api/properties/${id}`),
  getAll: () => $axios.get('/api/properties'),
  getById: (id) => $axios.get(`/api/properties/${id}`),
  createPropertyImage: (data) => $axios.post(`/api/propertyimages`, data),
  deletePropertyImage: (id, propertyId) =>
    $axios.delete(`/api/propertyimages?imageId=${id}&propertyId=${propertyId}`),
  createPropertyVideo: (data) => $axios.post(`/api/propertyvideos`, data),
  deletePropertyVideo: (id) => $axios.delete(`/api/propertyvideos/${id}`),
  exportPropertiesToExcel: (data = {}) =>
    $axios.post(`/api/export/properties`, data, {
      responseType: 'arraybuffer'
    })
}

const userService = {
  login: async (data) => {
    const isOffline = !navigator.onLine

    if (isOffline) {
      const { username, password } = data

      const generatedToken = await generateJWT(
        { username: 'admin', role: 'admin' },
        'your_jwt_secret',
        60 * 60 * 24 * 10
      )

      const storedUser = {
        username: 'admin',
        password: '12345678',
        token: generatedToken
      }

      if (username === storedUser.username && password === storedUser.password) {
        return {
          data: {
            success: true,
            token: storedUser.token,
            message: 'Login successful (offline mode)'
          }
        }
      } else {
        throw new Error('Invalid username or password (offline mode)')
      }
    } else {
      return $axios.post('/auth/users/login', data)
    }
  },
  logout: () => $axios.post('/api/users/logout'),
  getUserById: (id) => $axios.get(`/api/users/${id}`),
  getUsers: () => $axios.get('/api/users'),
  createUser: (data) => $axios.post('/api/users/register', data),
  updateUser: (id, data) => $axios.put(`/api/users/${id}`, data),
  deleteUser: (id) => $axios.delete(`/api/users/${id}`),
  deleteUserPermanently: (id) => $axios.delete(`/api/users/permanently/${id}`),
  restoreUser: (id) => $axios.put(`/api/user/restore/${id}`),
  activeUser: (id) => $axios.put(`/api/users/active/${id}`),
  disactiveUser: (id) => $axios.put(`/api/users/disactive/${id}`)
  // Add more user-related methods as needed
}

export { propertyService, userService }
