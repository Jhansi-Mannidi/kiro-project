import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000',
});

export const getProducts = async () => {
  return await api.get('/products');
};

export const getProduct = async (id) => {
  return await api.get(`/products/${id}`);
};

export const createProduct = async (data) => {
  return await api.post('/products', data);
};

export const updateProduct = async (id, data) => {
  return await api.put(`/products/${id}`, data);
};

export const deleteProduct = async (id) => {
  return await api.delete(`/products/${id}`);
};