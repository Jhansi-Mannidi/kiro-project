import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000',
});

export const getTrains = async () => {
  return await api.get('/trains');
};

export const getTrainById = async (id) => {
  return await api.get(`/trains/${id}`);
};

export const createTrain = async (data) => {
  return await api.post('/trains', data);
};

export const updateTrain = async (id, data) => {
  return await api.put(`/trains/${id}`, data);
};

export const deleteTrain = async (id) => {
  return await api.delete(`/trains/${id}`);
};