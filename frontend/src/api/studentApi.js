import axiosClient from './axiosClient.js';

export const studentApi = {
  getProfile: () => axiosClient.get('/students/profile'),
  updateProfile: (profileData) => axiosClient.put('/students/profile', profileData),
  enrollFace: (biometricData) => axiosClient.post('/students/face-enroll', biometricData),
};
