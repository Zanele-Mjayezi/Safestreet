import axios from 'axios'

const API_URL = '/api'

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (data) => client.post('/auth/login', data),
  register: (data) => client.post('/auth/register', data),
}

export const incidentAPI = {
  report: (data) => client.post('/incidents', data),
  getAll: () => client.get('/incidents'),
  getActive: () => client.get('/incidents/active'),
  getMy: () => client.get('/incidents/my'),
  resolve: (id) => client.put(`/incidents/${id}/resolve`),
}

export const emergencyAPI = {
  trigger: (data) => client.post('/emergency/trigger', data),
  getActive: () => client.get('/emergency/active'),
  getMy: () => client.get('/emergency/my'),
  resolve: (id) => client.put(`/emergency/${id}/resolve`),
}

export const patrolAPI = {
  getActive: () => client.get('/patrols/active'),
  getAll: () => client.get('/patrols'),
  start: (data) => client.post('/patrols/start', data),
  updateLocation: (id, data) => client.put(`/patrols/${id}/location`, data),
  end: (id) => client.put(`/patrols/${id}/end`),
}

export const subscriptionAPI = {
  create: (data) => client.post('/subscriptions', data),
  getMy: () => client.get('/subscriptions/my'),
  getAll: () => client.get('/subscriptions'),
}

export const publicAPI = {
  getStats: () => client.get('/public/stats'),
  getIncidents: () => client.get('/public/incidents'),
  getPatrols: () => client.get('/public/patrols'),
}

export default client