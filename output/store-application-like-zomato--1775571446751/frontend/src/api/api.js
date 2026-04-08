import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000',
});

export const getStores = () => api.get('/stores');
export const getStore = (id) => api.get(`/stores/${id}`);
export const createStore = (data) => api.post('/stores', data);
export const updateStore = (id, data) => api.put(`/stores/${id}`, data);
export const deleteStore = (id) => api.delete(`/stores/${id}`);

export const getReviews = () => api.get('/reviews');
export const getReview = (id) => api.get(`/reviews/${id}`);
export const createReview = (data) => api.post('/reviews', data);
export const updateReview = (id, data) => api.put(`/reviews/${id}`, data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);

export const getCategories = () => api.get('/categories');
export const getCategory = (id) => api.get(`/categories/${id}`);