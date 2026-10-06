export const validateRegister = (data = {}) => {
  const errors = [];
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 3 || !/^[A-Za-z\s]+$/.test(data.name)) {
    errors.push('Name must be at least 3 characters long and contain only letters and spaces');
  }
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push('A valid email address is required');
  }
  if (!data.password || typeof data.password !== 'string' || data.password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (data.role && !['student', 'teacher', 'admin'].includes(data.role)) {
    errors.push('Role must be student, teacher, or admin');
  }

  // Student specific validations
  if (!data.role || data.role === 'student') {
    if (!data.rollNumber || !/^[A-Za-z0-9-]+$/.test(data.rollNumber)) {
      errors.push('Roll number is required and can only contain letters, numbers, and hyphens');
    }
    if (!data.branch) {
      errors.push('Branch is required');
    }
    if (!data.section || !['A', 'B', 'C', 'D'].includes(data.section)) {
      errors.push('Section must be A, B, C, or D');
    }
    if (!data.semester || isNaN(Number(data.semester)) || Number(data.semester) < 1 || Number(data.semester) > 12) {
      errors.push('Valid Semester (1-12) is required');
    }
  }

  // Teacher specific validations
  if (data.role === 'teacher') {
    if (!data.facultyId || !/^[A-Za-z0-9-]+$/.test(data.facultyId)) {
      errors.push('Faculty ID is required and can only contain letters, numbers, and hyphens');
    }
    if (!data.branch || !['BCA', 'BTech CSE', 'BTech IT', 'BBA', 'MCA', 'Other'].includes(data.branch)) {
      errors.push('Valid Branch is required');
    }
    if (!data.designation || !['Assistant Professor', 'Associate Professor', 'Professor', 'HOD', 'Guest Faculty', 'Other'].includes(data.designation)) {
      errors.push('Valid Designation is required');
    }
    if (!data.teachingAssignments || !Array.isArray(data.teachingAssignments)) {
      errors.push('Teaching Assignments must be an array');
    } else {
      data.teachingAssignments.forEach((assignment, index) => {
        if (!assignment.branch || !assignment.section || !assignment.semester || !assignment.subject) {
          errors.push(`Teaching Assignment at index ${index} is missing required fields`);
        }
      });
    }
    if (data.phoneNumber && !/^[6-9]\d{9}$/.test(data.phoneNumber)) {
      errors.push('Phone number must be a valid 10-digit Indian mobile number');
    }
  }

  return {
    error: errors.length > 0 ? errors : null,
    value: data,
  };
};

export const validateLogin = (data = {}) => {
  const errors = [];
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push('A valid email address is required');
  }
  if (!data.password || typeof data.password !== 'string') {
    errors.push('Password is required');
  }

  return {
    error: errors.length > 0 ? errors : null,
    value: data,
  };
};
