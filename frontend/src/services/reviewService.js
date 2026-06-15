import api from './api';

export const getReviewsApi = async (params = {}) => {
  const response = await api.get('/reviews', { params });
  return response.data;
};

export const getReviewByIdApi = async (id) => {
  const response = await api.get(`/reviews/${id}`);
  return response.data;
};

export const createReviewApi = async (data) => {
  const response = await api.post('/reviews', data);
  return response.data;
};

export const updateReviewApi = async (id, data) => {
  const response = await api.patch(`/reviews/${id}`, data);
  return response.data;
};

export const deleteReviewApi = async (id) => {
  const response = await api.delete(`/reviews/${id}`);
  return response.data;
};
