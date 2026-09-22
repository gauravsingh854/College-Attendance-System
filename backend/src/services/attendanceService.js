export const calculateAttendancePercentage = (attendedCount, totalSessions) => {
  if (!totalSessions || totalSessions === 0) return 0;
  return Math.round((attendedCount / totalSessions) * 100 * 10) / 10;
};

export const summarizeStudentAttendance = (records = [], totalSubjectSessions = 0) => {
  const presentCount = records.filter((r) => r.status === 'present').length;
  const lateCount = records.filter((r) => r.status === 'late').length;
  const percentage = calculateAttendancePercentage(presentCount + lateCount, totalSubjectSessions);

  return {
    totalSessions: totalSubjectSessions,
    attendedSessions: presentCount,
    lateSessions: lateCount,
    percentage,
    eligibleForExam: percentage >= 75,
  };
};
