import $axios from '../plugins/vueAxios'
const propertyService = {
  create: (data) => $axios.post('/api/properties', data),
  update: (id, data) => $axios.put(`/api/properties/${id}`, data),
  delete: (id) => $axios.delete(`/api/properties/${id}`),
  getAll: () => $axios.get('/api/properties'),
  getById: (id) => $axios.get(`/api/properties/${id}`)
}

const userService = {
  login: (data) => $axios.post('/api/users/login', data),
  logout: () => $axios.post('/api/users/logout'),
  getUserById: (id) => $axios.get(`/api/users/${id}`),
  getUsers: () => $axios.get('/api/users'),
  createUser: (data) => $axios.post('/api/users/register', data),
  updateUser: (id, data) => $axios.put(`/api/users/${id}`, data),
  deleteUser: (id) => $axios.delete(`/api/users/${id}`)
  // Add more user-related methods as needed
}

export { propertyService, userService }
