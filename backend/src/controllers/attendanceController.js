import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { AttendanceRecord } from '../models/AttendanceRecord.js';
import { AttendanceSession } from '../models/AttendanceSession.js';
import { Student } from '../models/Student.js';
import { isFaceMatch } from '../utils/faceMatcher.js';

// Cache failed attempts (in memory, consider Redis in production)
const rateLimiter = new Map();

export const markAttendance = asyncHandler(async (req, res) => {
  const { sessionId, qrToken, faceDescriptor } = req.body;

  if (!sessionId || !qrToken || !faceDescriptor) {
    throw new ApiError(400, 'Session ID, QR token, and face descriptor are required.');
  }

  // 1. Session validation
  const session = await AttendanceSession.findById(sessionId);
  if (!session) {
    throw new ApiError(404, 'Attendance session not found');
  }

  if (session.status !== 'active') {
    throw new ApiError(400, 'Cannot mark attendance. Session is no longer active.');
  }

  // 2. QR Token validation
  if (session.qrToken !== qrToken) {
    throw new ApiError(400, 'Invalid or stale QR token. Please scan the current code.');
  }
  
  if (new Date() > session.qrTokenExpiresAt) {
    throw new ApiError(400, 'QR Code has expired. Please scan the newly generated code.');
  }

  // Retrieve student record (with the face descriptor included, since it's select: false)
  const student = await Student.findOne({ user: req.user.id }).select('+faceDescriptor');
  if (!student) {
    throw new ApiError(404, 'Student profile not found.');
  }
  
  // Rate limiting face match attempts
  const rateKey = `${sessionId}_${student._id}`;
  const attempts = rateLimiter.get(rateKey) || 0;
  if (attempts >= 5) {
    throw new ApiError(429, 'Too many failed face verification attempts. Please contact your teacher.');
  }

  // 3. Class validation
  const tAssign = session.teachingAssignment;
  const isEnrolled = student.enrolledSubjects.some(subjId => subjId.toString() === tAssign.subject.toString());
  
  if (
    student.branch !== tAssign.branch ||
    student.section !== tAssign.section ||
    student.academicYear !== tAssign.academicYear ||
    student.semester !== tAssign.semester ||
    !isEnrolled
  ) {
    throw new ApiError(403, 'You are not a part of this class session.');
  }

  // 4. Duplicate validation
  const existingRecord = await AttendanceRecord.findOne({ session: sessionId, student: student._id });
  if (existingRecord) {
    // Return early with existing record (as per instructions: "show existing markedAt time")
    return res.status(200).json({
      success: true,
      message: 'You are already marked present for this session',
      data: {
        markedAt: existingRecord.markedAt,
        subject: session.teachingAssignment.subject
      }
    });
  }

  // 5. Face Verification
  if (!student.isFaceEnrolled || !student.faceDescriptor || student.faceDescriptor.length === 0) {
    throw new ApiError(400, 'Face not enrolled. Please complete face enrollment first.');
  }

  const matchResult = isFaceMatch(faceDescriptor, student.faceDescriptor);
  
  if (!matchResult.isMatch) {
    rateLimiter.set(rateKey, attempts + 1);
    
    // Ideally log this failed attempt to DB for teacher review
    console.warn(`Failed face match for student ${student._id} in session ${sessionId}. Confidence: ${matchResult.confidence}`);

    throw new ApiError(401, 'Face verification failed, please try again.');
  }

  // Success!
  const attendance = await AttendanceRecord.create({
    session: sessionId,
    student: student._id,
    subject: session.teachingAssignment.subject,
    status: 'present',
    verificationMethod: 'qr_face',
    faceMatchConfidence: matchResult.confidence,
  });

  res.status(201).json({
    success: true,
    message: 'Attendance recorded successfully',
    data: {
      markedAt: attendance.markedAt,
      subject: attendance.subject
    },
  });
});

export const getStudentAttendance = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user.id });
  if (!student) {
    throw new ApiError(404, 'Student profile not found');
  }

  const records = await AttendanceRecord.find({ student: student._id })
    .populate('subject', 'name code')
    .populate('session', 'sessionStartedAt sessionEndsAt')
    .sort({ markedAt: -1 });

  res.status(200).json({
    success: true,
    count: records.length,
    data: records,
  });
});

export const exportSessionAttendanceCsv = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  
  const records = await AttendanceRecord.find({ session: sessionId })
    .populate({
      path: 'student',
      populate: { path: 'user', select: 'firstName lastName email' }
    });

  if (!records || records.length === 0) {
    throw new ApiError(404, 'No attendance records found for this session');
  }

  let csv = 'Roll Number,Name,Email,Status,Marked At\\n';
  records.forEach(record => {
    const student = record.student;
    const user = student.user;
    const name = user ? `${user.firstName} ${user.lastName}` : 'Unknown';
    const email = user ? user.email : 'Unknown';
    const rollNumber = student.rollNumber || 'Unknown';
    csv += `${rollNumber},${name},${email},${record.status},${record.markedAt}\\n`;
  });

  res.header('Content-Type', 'text/csv');
  res.attachment(`attendance_session_${sessionId}.csv`);
  return res.send(csv);
});
