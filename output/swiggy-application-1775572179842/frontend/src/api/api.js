import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000',
});

export const getRestaurants = async () => {
  return await api.get('/restaurants');
};

export const getRestaurant = async (id) => {
  return await api.get(`/restaurants/${id}`);
};

export const createOrder = async (data) => {
  return await api.post('/orders', data);
};

export const getOrder = async (id) => {
  return await api.get(`/orders/${id}`);
};

export const updateOrder = async (id, data) => {
  return await api.put(`/orders/${id}`, data);
};

export const deleteOrder = async (id) => {
  return await api.delete(`/orders/${id}`);
};