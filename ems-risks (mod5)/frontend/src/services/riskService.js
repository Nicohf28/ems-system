import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3004';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function createRisk(payload) {
  const response = await api.post('/risks', payload);
  return response.data;
}

export async function getRisksByProject(projectId) {
  const response = await api.get(`/risks/${projectId}`);
  return response.data;
}
