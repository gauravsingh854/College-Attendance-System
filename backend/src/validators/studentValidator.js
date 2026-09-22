export const validateStudentProfile = (data = {}) => {
  const errors = [];
  if (!data.rollNumber || typeof data.rollNumber !== 'string') {
    errors.push('Roll number is required');
  }
  if (!data.department || typeof data.department !== 'string') {
    errors.push('Department is required');
  }
  if (!data.semester || typeof data.semester !== 'number' || data.semester < 1 || data.semester > 12) {
    errors.push('Semester must be an integer between 1 and 12');
  }

  return {
    error: errors.length > 0 ? errors : null,
    value: data,
  };
};

export const validateFaceEnrollment = (data = {}) => {
  const errors = [];
  if (!Array.isArray(data.faceDescriptor) || data.faceDescriptor.length !== 128) {
    errors.push('Face descriptor must be a 128-dimensional numeric embedding');
  }
  if (data.consentGiven !== true) {
    errors.push('Explicit consent is required for biometric enrollment');
  }

  return {
    error: errors.length > 0 ? errors : null,
    value: data,
  };
};
