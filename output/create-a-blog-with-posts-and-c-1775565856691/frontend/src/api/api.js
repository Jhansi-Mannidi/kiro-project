import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000',
});

export const getPosts = () => api.get('/posts');
export const getPostById = (id) => api.get(`/posts/${id}`);
export const createPost = (data) => api.post('/posts', data);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);

export const getComments = () => api.get('/comments');
export const getCommentById = (id) => api.get(`/comments/${id}`);
export const createComment = (data) => api.post('/comments', data);
export const updateComment = (id, data) => api.put(`/comments/${id}`, data);
export const deleteComment = (id) => api.delete(`/comments/${id}`);

export default api;