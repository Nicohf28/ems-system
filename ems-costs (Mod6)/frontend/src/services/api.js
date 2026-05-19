import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createCost = async (costData) => {
  const response = await api.post('/costs', costData);
  return response.data;
};

export const getCostsByProjectId = async (projectId) => {
  const response = await api.get(`/costs/${projectId}`);
  return response.data;
};

export const getTotalByProjectId = async (projectId) => {
  const response = await api.get(`/costs/${projectId}/total`);
  return response.data;
};

export default api;
