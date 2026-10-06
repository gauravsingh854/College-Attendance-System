import axiosClient from './axiosClient.js';

export const subjectApi = {
  getAll: (params) => axiosClient.get('/subjects', { params }),
};
