import axiosClient from './axiosClient.js';

export const subjectApi = {
  getAll: () => axiosClient.get('/subjects'),
};
