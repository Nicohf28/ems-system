import axios from 'axios'

const BASE = 'http://localhost:3003'

const api = {
  getTasks: (projectId) => axios.get(`${BASE}/schedule/${projectId}`),
  getProgress: (projectId) => axios.get(`${BASE}/schedule/${projectId}/progress`),
  getCCM: (projectId) => axios.get(`${BASE}/schedule/${projectId}/ccm`),
  createTask: (data) => axios.post(`${BASE}/schedule`, data),
  updateTask: (id, data) => axios.put(`${BASE}/schedule/${id}`, data),
  deleteTask: (id) => axios.delete(`${BASE}/schedule/${id}`),
}

export default api
