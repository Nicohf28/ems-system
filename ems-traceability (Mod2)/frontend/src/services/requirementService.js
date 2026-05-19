
import axios from 'axios';

const API = 'http://localhost:3001/requirements';

export const createRequirement = (data) =>
  axios.post(API, data);

export const getRequirements = (projectId) =>
  axios.get(`${API}/${projectId}`);

export const updateRequirement = (id, data) =>
  axios.put(`${API}/${id}`, data);