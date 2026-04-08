import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000',
});

export const getMovies = () => api.get('/movies');
export const getMovie = (id) => api.get(`/movies/${id}`);
export const createMovie = (data) => api.post('/movies', data);
export const updateMovie = (id, data) => api.put(`/movies/${id}`, data);
export const deleteMovie = (id) => api.delete(`/movies/${id}`);

export const getTheaters = () => api.get('/theaters');
export const getTheater = (id) => api.get(`/theaters/${id}`);
export const createTheater = (data) => api.post('/theaters', data);
export const updateTheater = (id, data) => api.put(`/theaters/${id}`, data);
export const deleteTheater = (id) => api.delete(`/theaters/${id}`);

export const getShows = () => api.get('/shows');
export const getShow = (id) => api.get(`/shows/${id}`);
export const createShow = (data) => api.post('/shows', data);
export const updateShow = (id, data) => api.put(`/shows/${id}`, data);
export const deleteShow = (id) => api.delete(`/shows/${id}`);

export const getSeats = () => api.get('/seats');
export const getSeat = (id) => api.get(`/seats/${id}`);
export const createSeat = (data) => api.post('/seats', data);
export const updateSeat = (id, data) => api.put(`/seats/${id}`, data);
export const deleteSeat = (id) => api.delete(`/seats/${id}`);

export const getBookings = () => api.get('/bookings');
export const getBooking = (id) => api.get(`/bookings/${id}`);
export const createBooking = (data) => api.post('/bookings', data);
export const updateBooking = (id, data) => api.put(`/bookings/${id}`, data);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);

export default api;