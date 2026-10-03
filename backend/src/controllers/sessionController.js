import crypto from 'crypto';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { AttendanceSession } from '../models/AttendanceSession.js';
import { AttendanceRecord } from '../models/AttendanceRecord.js';
import { Teacher } from '../models/Teacher.js';
import { Student } from '../models/Student.js';
import { env } from '../config/env.js';

// Helper to generate a new QR token
const generateNewToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const startSession = asyncHandler(async (req, res) => {
  const { teachingAssignmentId } = req.body;

  const teacherProfile = await Teacher.findOne({ user: req.user.id });
  if (!teacherProfile) {
    throw new ApiError(404, 'Teacher profile not found');
  }

  const assignment = teacherProfile.teachingAssignments.id(teachingAssignmentId);
  if (!assignment) {
    throw new ApiError(403, 'Unauthorized: Assignment not found in your profile');
  }

  // Reject if teacher already has another active session
  const existingSession = await AttendanceSession.findOne({
    teacher: req.user.id,
    status: 'active'
  });
  
  if (existingSession) {
    throw new ApiError(400, 'You already have an active session');
  }

  // Get total enrolled students for this class
  const totalEnrolledStudents = await Student.countDocuments({
    branch: assignment.branch,
    section: assignment.section,
    academicYear: assignment.academicYear,
    semester: assignment.semester,
    enrolledSubjects: assignment.subject
  });

  const qrToken = generateNewToken();
  const sessionEndsAt = new Date(Date.now() + 45 * 60 * 1000); // 45 minutes

  const session = await AttendanceSession.create({
    teacher: req.user.id,
    teachingAssignment: {
      branch: assignment.branch,
      section: assignment.section,
      academicYear: assignment.academicYear,
      semester: assignment.semester,
      subject: assignment.subject
    },
    qrToken,
    qrTokenExpiresAt: new Date(Date.now() + 15 * 1000), // 15 seconds
    sessionStartedAt: new Date(),
    sessionEndsAt,
    totalEnrolledStudents
  });

  res.status(201).json({
    success: true,
    data: {
      sessionId: session._id,
      qrPayload: { sessionId: session._id, token: qrToken }
    }
  });
});

export const getSessionQr = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await AttendanceSession.findOne({
    _id: sessionId,
    teacher: req.user.id,
    status: 'active'
  });

  if (!session) {
    throw new ApiError(404, 'Active attendance session not found');
  }

  const now = new Date();
  
  // If session time is over, auto expire it
  if (now > session.sessionEndsAt) {
    session.status = 'expired';
    await session.save();
    throw new ApiError(400, 'Session has ended automatically');
  }

  let tokenToReturn = session.qrToken;

  // If token expired, generate a new one
  if (now > session.qrTokenExpiresAt) {
    tokenToReturn = generateNewToken();
    session.qrToken = tokenToReturn;
    session.qrTokenExpiresAt = new Date(Date.now() + 15 * 1000); // 15 seconds
    await session.save();
  }

  res.status(200).json({
    success: true,
    data: {
      sessionId: session._id,
      token: tokenToReturn
    }
  });
});

export const getSessionLive = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await AttendanceSession.findOne({
    _id: sessionId,
    teacher: req.user.id
  });

  if (!session) {
    throw new ApiError(404, 'Attendance session not found');
  }

  // Get marked students
  const records = await AttendanceRecord.find({ session: sessionId })
    .populate('student', 'name rollNumber') // Assuming student ref is Student. Wait, AttendanceRecord has student ref Student. Wait, I'll need to make sure the student model gets populated correctly. Student model has `rollNumber`, but name is on the `User` model. I will populate it.
    .populate({
      path: 'student',
      populate: {
        path: 'user',
        select: 'name'
      }
    })
    .sort({ markedAt: -1 });

  const markedStudents = records.map(record => ({
    name: record.student.user?.name || 'Unknown',
    rollNumber: record.student.rollNumber,
    time: record.markedAt
  }));

  res.status(200).json({
    success: true,
    data: {
      totalEnrolled: session.totalEnrolledStudents,
      markedCount: records.length,
      markedStudents,
      status: session.status,
      sessionEndsAt: session.sessionEndsAt
    }
  });
});

export const endSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await AttendanceSession.findOne({
    _id: sessionId,
    teacher: req.user.id
  });

  if (!session) {
    throw new ApiError(404, 'Attendance session not found');
  }

  session.status = 'ended';
  session.sessionEndsAt = new Date();
  await session.save();

  res.status(200).json({
    success: true,
    message: 'Session ended successfully'
  });
});

export const getTeacherSessions = asyncHandler(async (req, res) => {
  const sessions = await AttendanceSession.find({ teacher: req.user.id })
    .populate('teachingAssignment.subject', 'name code')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: sessions,
  });
});
