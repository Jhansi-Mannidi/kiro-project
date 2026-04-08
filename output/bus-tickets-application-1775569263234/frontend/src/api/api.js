import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000',
});

export const getBusTickets = async () => {
  return await api.get('/bus-tickets');
};

export const getBusTicketById = async (id) => {
  return await api.get(`/bus-tickets/${id}`);
};

export const createBusTicket = async (data) => {
  return await api.post('/bus-tickets', data);
};

export const updateBusTicket = async (id, data) => {
  return await api.put(`/bus-tickets/${id}`, data);
};

export const deleteBusTicket = async (id) => {
  return await api.delete(`/bus-tickets/${id}`);
};