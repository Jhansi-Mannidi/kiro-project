import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000',
});

export const getEmployees = async () => {
  return await api.get('/employees');
};

export const getEmployeeById = async (id) => {
  return await api.get(`/employees/${id}`);
};

export const createEmployee = async (data) => {
  return await api.post('/employees', data);
};

export const updateEmployee = async (id, data) => {
  return await api.put(`/employees/${id}`, data);
};

export const deleteEmployee = async (id) => {
  return await api.delete(`/employees/${id}`);
};

export const clockIn = async (data) => {
  return await api.post('/clockin', data);
};

export const clockOut = async (data) => {
  return await api.post('/clockout', data);
};