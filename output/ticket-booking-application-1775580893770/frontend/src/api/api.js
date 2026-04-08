import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000',
});

export const getTickets = async () => {
  return await api.get('/tickets');
};

export const getTicket = async (id) => {
  return await api.get(`/tickets/${id}`);
};

export const createTicket = async (data) => {
  return await api.post('/tickets', data);
};

export const updateTicket = async (id, data) => {
  return await api.put(`/tickets/${id}`, data);
};

export const deleteTicket = async (id) => {
  return await api.delete(`/tickets/${id}`);
};