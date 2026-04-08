import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000'
});

export const getFlights = () => api.get('/flights');
export const getFlight = (id) => api.get(`/flights/${id}`);
export const createFlight = (data) => api.post('/flights', data);
export const updateFlight = (id, data) => api.put(`/flights/${id}`, data);
export const deleteFlight = (id) => api.delete(`/flights/${id}`);

export const getPassengers = () => api.get('/passengers');
export const getPassenger = (id) => api.get(`/passengers/${id}`);
export const createPassenger = (data) => api.post('/passengers', data);
export const updatePassenger = (id, data) => api.put(`/passengers/${id}`, data);
export const deletePassenger = (id) => api.delete(`/passengers/${id}`);

export const getBooking = () => api.get('/bookings');
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const createBooking = (data) => api.post('/bookings', data);
export const updateBooking = (id, data) => api.put(`/bookings/${id}`, data);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);