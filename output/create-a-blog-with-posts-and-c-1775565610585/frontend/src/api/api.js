import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000',
});

export const getPosts = async () => {
  return await api.get('/posts');
};

export const getPost = async (id) => {
  return await api.get(`/posts/${id}`);
};

export const createPost = async (data) => {
  return await api.post('/posts', data);
};

export const updatePost = async (id, data) => {
  return await api.put(`/posts/${id}`, data);
};

export const deletePost = async (id) => {
  return await api.delete(`/posts/${id}`);
};

export const getComments = async (postId) => {
  return await api.get(`/comments?postId=${postId}`);
};

export const createComment = async (data) => {
  return await api.post('/comments', data);
};

export const updateComment = async (id, data) => {
  return await api.put(`/comments/${id}`, data);
};

export const deleteComment = async (id) => {
  return await api.delete(`/comments/${id}`);
};