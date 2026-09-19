import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authService = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  logout: () => { localStorage.removeItem('token'); localStorage.removeItem('user') },
}

export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
}

export const careerService = {
  getCareers: () => api.get('/careers'),
  selectCareer: (id) => api.post('/careers/select', { careerId: id }),
}

export const skillService = {
  getSkills: () => api.get('/skills'),
  submitAssessment: (answers) => api.post('/skills/assessment', { answers }),
}

export const roadmapService = {
  getRoadmap: () => api.get('/roadmap'),
  updateTopic: (topicId, done) => api.patch(`/roadmap/topic/${topicId}`, { done }),
}

export const progressService = {
  getProgress: () => api.get('/progress'),
}

export default api
