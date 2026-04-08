import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000',
});

export const login = (username, password) => {
  return api.post('/login', { username, password });
};

export const logout = () => {
  return api.get('/logout');
};

export const getUserInfo = () => {
  return api.get('/user-info');
};