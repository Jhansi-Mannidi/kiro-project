import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000',
});

export const getShows = async () => {
  return await api.get('/shows');
};

export const getShowById = async (id) => {
  return await api.get(`/shows/${id}`);
};

export const createShow = async (showData) => {
  return await api.post('/shows', showData);
};

export const updateShow = async (id, showData) => {
  return await api.put(`/shows/${id}`, showData);
};

export const deleteShow = async (id) => {
  return await api.delete(`/shows/${id}`);
};