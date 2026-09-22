import axiosClient from './axiosClient.js';

export const attendanceApi = {
  markAttendance: (payload) => axiosClient.post('/attendance/mark', payload),
  getMyHistory: () => axiosClient.get('/attendance/my-history'),
  exportSessionCsv: (sessionId) =>
    axiosClient.get(`/attendance/session/${sessionId}/export`, {
      responseType: 'blob',
    }),
};
