import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('careernova_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err)
  }
)

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => {
    localStorage.removeItem('careernova_token')
    localStorage.removeItem('careernova_user')
  },
}

export const userService = {
  createUser: (data) => api.post('/users', data),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.patch(`/users/${id}`, data),
  updateSkills: (id, skills) => api.patch(`/users/${id}/skills`, { skills }),
}

export const careerService = {
  getCareers: () => api.get('/careers'),
  getCareerById: (id) => api.get(`/careers/${id}`),
  getCareerSkills: (id) => api.get(`/careers/${id}/skills`),
}

export const analysisService = {
  getSkillGap: (studentId, careerId) => api.post('/analysis/skill-gap', { studentId, careerId }),
  getRecommendations: (params) => api.post('/analysis/recommendations', params),
}

export const roadmapService = {
  generateRoadmap: (studentId, careerId) => api.post('/roadmap/generate', { studentId, careerId }),
  getRoadmap: (studentId, careerId) => api.get(`/roadmap/${studentId}/${careerId}`),
  updateMilestone: (roadmapId, milestoneId, status) =>
    api.patch(`/roadmap/${roadmapId}/milestone/${milestoneId}`, { status }),
  getProgress: (roadmapId) => api.get(`/roadmap/${roadmapId}/progress`),
}

export const assessmentService = {
  startAssessment: (skill) => api.post('/assessment/start', { skill }),
  getQuestions: (skill) => api.get(`/assessment/questions/${skill}`),
  submitAssessment: (data) => api.post('/assessment/submit', data),
  getResult: (id) => api.get(`/assessment/result/${id}`),
  getHistory: (studentId) => api.get(`/assessment/history/${studentId}`),
  getCodingProblem: (skill) => api.get(`/coding/problem/${skill}`),
  runCoding: (data) => api.post('/coding/run', data),
  submitCoding: (data) => api.post('/coding/submit', data),
}

export default api
