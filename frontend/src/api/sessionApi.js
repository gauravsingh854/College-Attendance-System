import axiosClient from './axiosClient.js';

export const sessionApi = {
  createSession: (data) => axiosClient.post('/sessions', data),
  getMySessions: () => axiosClient.get('/sessions/my-sessions'),
  getSessionQr: (sessionId) => axiosClient.get(`/sessions/${sessionId}/qr`),
};
