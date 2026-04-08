import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000',
});

export const getTempleRuns = async () => {
  return await api.get('/templeruns');
};

export const getTempleRunById = async (id) => {
  return await api.get(`/templeruns/${id}`);
};

export const createTempleRun = async (data) => {
  return await api.post('/templeruns', data);
};

export const updateTempleRun = async (id, data) => {
  return await api.put(`/templeruns/${id}`, data);
};

export const deleteTempleRun = async (id) => {
  return await api.delete(`/templeruns/${id}`);
};