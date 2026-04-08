import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000',
});

export const getTracks = () => api.get('/tracks');
export const getTrackById = (id) => api.get(`/tracks/${id}`);
export const createTrack = (data) => api.post('/tracks', data);
export const updateTrack = (id, data) => api.put(`/tracks/${id}`, data);
export const deleteTrack = (id) => api.delete(`/tracks/${id}`);

export const getArtists = () => api.get('/artists');
export const getArtistById = (id) => api.get(`/artists/${id}`);
export const createArtist = (data) => api.post('/artists', data);
export const updateArtist = (id, data) => api.put(`/artists/${id}`, data);
export const deleteArtist = (id) => api.delete(`/artists/${id}`);

export const getAlbums = () => api.get('/albums');
export const getAlbumById = (id) => api.get(`/albums/${id}`);
export const createAlbum = (data) => api.post('/albums', data);
export const updateAlbum = (id, data) => api.put(`/albums/${id}`, data);
export const deleteAlbum = (id) => api.delete(`/albums/${id}`);

export default api;