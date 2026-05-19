import axios from 'axios'

const BASE_URL = 'http://localhost:3006'

export const createChange = async (data) => {
  const response = await axios.post(`${BASE_URL}/changes`, data, {
    headers: { 'Content-Type': 'application/json' }
  })
  return response.data
}

export const getChangesByProject = async (projectId) => {
  const response = await axios.get(`${BASE_URL}/changes/${projectId}`, {
    headers: { 'Content-Type': 'application/json' }
  })
  return response.data
}

export const updateChange = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/changes/${id}`, data, {
    headers: { 'Content-Type': 'application/json' }
  })
  return response.data
}
