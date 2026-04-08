import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000',
});

export const getBooks = () => api.get('/books');
export const getBook = (id) => api.get(`/books/${id}`);
export const createBook = (data) => api.post('/books', data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);