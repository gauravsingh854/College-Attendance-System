export const validateCreateSession = (data = {}) => {
  const errors = [];
  if (!data.subjectId || typeof data.subjectId !== 'string') {
    errors.push('Subject ID is required');
  }
  if (!data.startTime) {
    errors.push('Start time is required');
  }
  if (!data.endTime) {
    errors.push('End time is required');
  }
  if (data.startTime && data.endTime && new Date(data.startTime) >= new Date(data.endTime)) {
    errors.push('End time must be after start time');
  }

  return {
    error: errors.length > 0 ? errors : null,
    value: data,
  };
};

export const validateMarkAttendance = (data = {}) => {
  const errors = [];
  if (!data.sessionId || typeof data.sessionId !== 'string') {
    errors.push('Session ID is required');
  }
  if (!data.qrToken || typeof data.qrToken !== 'string') {
    errors.push('QR token is required');
  }

  return {
    error: errors.length > 0 ? errors : null,
    value: data,
  };
};
