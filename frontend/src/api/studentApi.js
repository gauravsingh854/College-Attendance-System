import axiosClient from './axiosClient.js';

export const studentApi = {
  getProfile: () => axiosClient.get('/students/profile'),
  updateProfile: (profileData) => axiosClient.put('/students/profile', profileData),
  enrollFace: (biometricData) => axiosClient.post('/students/face-enroll', biometricData),
  getDashboardData: () => axiosClient.get('/students/dashboard'),
  getHistory: () => axiosClient.get('/students/attendance/history'),
  createCorrection: (data) => axiosClient.post('/students/correction', data),
  getCorrections: () => axiosClient.get('/students/correction'),
  getNotifications: () => axiosClient.get('/students/notifications'),
  readNotification: (id) => axiosClient.put(`/students/notifications/${id}/read`),
  changePassword: (data) => axiosClient.put('/auth/change-password', data),
  getTodaySchedule: () => axiosClient.get('/students/schedule/today'),
};
