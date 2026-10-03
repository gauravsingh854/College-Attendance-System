import axiosClient from './axiosClient.js';

export const teacherApi = {
  getAssignedClasses: () => axiosClient.get('/teachers/classes'),
  getClassStudents: (assignmentId) => axiosClient.get(`/teachers/classes/${assignmentId}/students`),
  getSubjects: () => axiosClient.get('/teachers/subjects'),
};
