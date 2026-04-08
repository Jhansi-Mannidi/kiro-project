import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000',
});

export const getBusTickets = () => api.get('/bus-tickets');
export const getBusTicket = (id) => api.get(`/bus-tickets/${id}`);
export const createBusTicket = (data) => api.post('/bus-tickets', data);
export const updateBusTicket = (id, data) => api.put(`/bus-tickets/${id}`, data);
export const deleteBusTicket = (id) => api.delete(`/bus-tickets/${id}`);