export const generateAttendanceCsv = (records = []) => {
  const headers = ['Roll Number', 'Student Name', 'Department', 'Semester', 'Date', 'Status', 'Verification Method', 'Recorded At'];
  const rows = records.map((record) => {
    const student = record.student || {};
    const user = student.user || {};
    return [
      `"${student.rollNumber || 'N/A'}"`,
      `"${user.name || 'N/A'}"`,
      `"${student.department || 'N/A'}"`,
      `"${student.semester || 'N/A'}"`,
      `"${record.session?.sessionDate ? new Date(record.session.sessionDate).toISOString().split('T')[0] : 'N/A'}"`,
      `"${record.status}"`,
      `"${record.verificationMethod}"`,
      `"${new Date(record.recordedAt).toLocaleString()}"`,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};
