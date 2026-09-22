import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Attendance } from '../models/Attendance.js';
import { AttendanceSession } from '../models/AttendanceSession.js';
import { Student } from '../models/Student.js';
import { verifyDynamicQrToken } from '../services/qrService.js';
import { generateAttendanceCsv } from '../services/csvService.js';
import { ATTENDANCE_STATUS, VERIFICATION_METHOD } from '../utils/constants.js';

export const markAttendance = asyncHandler(async (req, res) => {
  const { sessionId, qrToken, verificationMethod, confidenceScore } = req.body;

  const session = await AttendanceSession.findById(sessionId);
  if (!session) {
    throw new ApiError(404, 'Attendance session not found');
  }

  if (session.status !== 'active') {
    throw new ApiError(400, `Cannot mark attendance. Session is ${session.status}`);
  }

  // Verify rotating QR token
  try {
    const payload = verifyDynamicQrToken(qrToken, session.qrSecret);
    if (payload.sessionId !== sessionId) {
      throw new ApiError(400, 'Invalid QR payload for this session');
    }
  } catch (error) {
    throw new ApiError(400, 'QR Code is expired or invalid. Please scan the current code.');
  }

  // Retrieve student record
  const student = await Student.findOne({ user: req.user.id });
  if (!student) {
    throw new ApiError(404, 'Student profile not found. Please complete profile setup.');
  }

  // Check duplicate
  const existingRecord = await Attendance.findOne({ session: sessionId, student: student._id });
  if (existingRecord) {
    throw new ApiError(409, 'Attendance has already been recorded for this session');
  }

  const attendance = await Attendance.create({
    session: sessionId,
    student: student._id,
    subject: session.subject,
    status: ATTENDANCE_STATUS.PRESENT,
    verificationMethod: verificationMethod || VERIFICATION_METHOD.QR_ONLY,
    confidenceScore: confidenceScore || null,
    ipAddress: req.ip,
    deviceInfo: req.headers['user-agent'] || '',
  });

  res.status(201).json({
    success: true,
    message: 'Attendance recorded successfully',
    data: attendance,
  });
});

export const getStudentAttendance = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user.id });
  if (!student) {
    throw new ApiError(404, 'Student profile not found');
  }

  const records = await Attendance.find({ student: student._id })
    .populate('subject', 'name code')
    .populate('session', 'sessionDate startTime endTime')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: records.length,
    data: records,
  });
});

export const exportSessionAttendanceCsv = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const records = await Attendance.find({ session: sessionId })
    .populate({
      path: 'student',
      populate: { path: 'user', select: 'name email' },
    })
    .populate('session', 'sessionDate');

  const csv = generateAttendanceCsv(records);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="attendance_${sessionId}.csv"`);
  res.status(200).send(csv);
});
