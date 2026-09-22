import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { AttendanceSession } from '../models/AttendanceSession.js';
import { generateSessionQrSecret, generateDynamicQrToken } from '../services/qrService.js';
import { env } from '../config/env.js';

export const createSession = asyncHandler(async (req, res) => {
  const { subjectId, startTime, endTime, geofence } = req.body;

  const qrSecret = generateSessionQrSecret();

  const session = await AttendanceSession.create({
    subject: subjectId,
    teacher: req.user.id,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    qrSecret,
    geofence: geofence || { enabled: false },
  });

  res.status(201).json({
    success: true,
    message: 'Attendance session created',
    data: session,
  });
});

export const getSessionQr = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const session = await AttendanceSession.findOne({
    _id: id,
    teacher: req.user.id,
  });

  if (!session) {
    throw new ApiError(404, 'Attendance session not found or unauthorized');
  }

  const token = generateDynamicQrToken(session._id.toString(), session.qrSecret, 30);

  res.status(200).json({
    success: true,
    data: {
      sessionId: session._id,
      qrToken: token,
      refreshIntervalSeconds: 30,
    },
  });
});

export const getTeacherSessions = asyncHandler(async (req, res) => {
  const sessions = await AttendanceSession.find({ teacher: req.user.id })
    .populate('subject', 'name code')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: sessions,
  });
});
