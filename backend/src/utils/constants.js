export const ROLES = Object.freeze({
  TEACHER: 'teacher',
  STUDENT: 'student',
  ADMIN: 'admin',
});

export const SESSION_STATUS = Object.freeze({
  ACTIVE: 'active',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
});

export const ATTENDANCE_STATUS = Object.freeze({
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
});

export const VERIFICATION_METHOD = Object.freeze({
  QR_ONLY: 'qr_only',
  FACE_VERIFIED: 'face_verified',
  MANUAL_OVERRIDE: 'manual_override',
});
