import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000',
});

export const getMovies = () => api.get('/movies');
export const getMovieById = (id) => api.get(`/movies/${id}`);
export const createMovie = (data) => api.post('/movies', data);
export const updateMovie = (id, data) => api.put(`/movies/${id}`, data);
export const deleteMovie = (id) => api.delete(`/movies/${id}`);

export const getTheaters = () => api.get('/theaters');
export const getTheaterById = (id) => api.get(`/theaters/${id}`);
export const createTheater = (data) => api.post('/theaters', data);
export const updateTheater = (id, data) => api.put(`/theaters/${id}`, data);
export const deleteTheater = (id) => api.delete(`/theaters/${id}`);

export const getShowtimes = () => api.get('/showtimes');
export const getShowtimeById = (id) => api.get(`/showtimes/${id}`);
export const createShowtime = (data) => api.post('/showtimes', data);
export const updateShowtime = (id, data) => api.put(`/showtimes/${id}`, data);
export const deleteShowtime = (id) => api.delete(`/showtimes/${id}`);

export const getTickets = () => api.get('/tickets');
export const getTicketById = (id) => api.get(`/tickets/${id}`);
export const createTicket = (data) => api.post('/tickets', data);
export const updateTicket = (id, data) => api.put(`/tickets/${id}`, data);
export const deleteTicket = (id) => api.delete(`/tickets/${id}`);