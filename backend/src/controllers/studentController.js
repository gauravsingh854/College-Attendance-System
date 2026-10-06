import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Student } from '../models/Student.js';
import { Attendance } from '../models/Attendance.js';
import { AttendanceSession } from '../models/AttendanceSession.js';
import { Subject } from '../models/Subject.js';
import { CorrectionRequest } from '../models/CorrectionRequest.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { ClassSchedule } from '../models/ClassSchedule.js';

export const getStudentProfile = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user.id }).populate('user', 'name email');
  if (!student) {
    throw new ApiError(404, 'Student profile not found. Please complete profile setup.');
  }

  res.status(200).json({
    success: true,
    data: student,
  });
});

export const updateStudentProfile = asyncHandler(async (req, res) => {
  const { rollNumber, department, semester } = req.body;

  let student = await Student.findOne({ user: req.user.id });

  if (student) {
    student.rollNumber = rollNumber || student.rollNumber;
    student.department = department || student.department;
    student.semester = semester || student.semester;
    await student.save();
  } else {
    student = await Student.create({
      user: req.user.id,
      rollNumber,
      department,
      semester,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: student,
  });
});

export const enrollFace = asyncHandler(async (req, res) => {
  const { faceDescriptor, consentGiven } = req.body;

  if (!consentGiven) {
    throw new ApiError(400, 'Explicit consent required for face enrollment');
  }

  const student = await Student.findOne({ user: req.user.id });
  if (!student) {
    throw new ApiError(404, 'Student profile not found. Complete profile first.');
  }

  student.faceDescriptor = faceDescriptor;
  student.isFaceEnrolled = true;
  student.consentGiven = true;
  student.consentDate = new Date();
  await student.save();

  res.status(200).json({
    success: true,
    message: 'Face biometric embedding enrolled securely',
    data: {
      isFaceEnrolled: true,
      consentDate: student.consentDate,
    },
  });
});

export const getDashboardData = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user.id });
  if (!student) throw new ApiError(404, 'Student profile not found');

  // 1. Today's active classes
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const subjects = await Subject.find({ branch: student.branch, semester: student.semester });
  const subjectIds = subjects.map(s => s._id);

  const activeSessions = await AttendanceSession.find({
    subject: { $in: subjectIds },
    sessionDate: { $gte: today, $lt: tomorrow },
    status: 'active'
  }).populate('subject', 'name code').populate('teacher', 'name');

  // Determine if student has already marked attendance for these sessions
  const todayClasses = await Promise.all(activeSessions.map(async (session) => {
    const att = await Attendance.findOne({ session: session._id, student: student._id });
    return {
      session,
      isAttended: !!att
    };
  }));

  // 2. Subject-wise attendance
  const subjectAttendance = [];
  let totalClassesOverall = 0;
  let hasAtRiskSubject = false;
  let hasNotEligibleSubject = false;

  for (const subject of subjects) {
    const totalSessions = await AttendanceSession.countDocuments({ subject: subject._id, status: { $ne: 'cancelled' } });
    const attendedSessions = await Attendance.countDocuments({ subject: subject._id, student: student._id, status: 'present' });
    
    let percentage = 0;
    let status = 'Not Started';

    if (totalSessions > 0) {
      percentage = Math.round((attendedSessions / totalSessions) * 100);
      if (percentage >= 75) {
        status = 'Eligible';
      } else if (percentage >= 65) {
        status = 'At Risk';
        hasAtRiskSubject = true;
      } else {
        status = 'Not Eligible';
        hasNotEligibleSubject = true;
      }
    }

    totalClassesOverall += totalSessions;

    subjectAttendance.push({
      subject,
      attended: attendedSessions,
      total: totalSessions,
      percentage,
      status
    });
  }

  let overallStatus = 'Not Started';
  if (totalClassesOverall > 0) {
    if (hasNotEligibleSubject) {
      overallStatus = 'Not Eligible';
    } else if (hasAtRiskSubject) {
      overallStatus = 'At Risk';
    } else {
      overallStatus = 'Eligible';
    }
  }

  res.status(200).json({
    success: true,
    data: {
      todayClasses,
      subjectAttendance,
      overallStatus,
      totalClassesOverall
    }
  });
});

export const getAttendanceHistory = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user.id });
  
  const history = await Attendance.find({ student: student._id })
    .populate('session')
    .populate('subject')
    .sort({ recordedAt: -1 });

  res.status(200).json({ success: true, data: history });
});

export const createCorrectionRequest = asyncHandler(async (req, res) => {
  const { session, reason, note } = req.body;
  const student = await Student.findOne({ user: req.user.id });

  const existing = await CorrectionRequest.findOne({ student: student._id, session });
  if (existing) {
    throw new ApiError(400, 'Correction request already submitted for this session');
  }

  const request = await CorrectionRequest.create({
    student: student._id,
    session,
    reason,
    note
  });

  res.status(201).json({ success: true, data: request });
});

export const getCorrectionRequests = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user.id });
  const requests = await CorrectionRequest.find({ student: student._id })
    .populate({ path: 'session', populate: { path: 'subject' } })
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: requests });
});

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: notifications });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findOneAndUpdate(
    { _id: id, user: req.user.id },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new ApiError(404, 'Notification not found');
  res.status(200).json({ success: true, data: notification });
});

export const getTodaySchedule = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user.id });
  if (!student) throw new ApiError(404, 'Student profile not found');

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long' }); // e.g. "Monday"

  // Find schedule entries for this student's branch/section/semester for today
  const scheduleEntries = await ClassSchedule.find({
    branch: student.branch || student.department, // backward compatibility with department field if needed
    section: student.section,
    semester: student.semester,
    dayOfWeek: todayStr
  }).populate('subject', 'name code type').populate({ path: 'teacher', populate: { path: 'user', select: 'name email' } }).sort({ startTime: 1 });

  // Check for active sessions for these classes today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const activeSessions = await AttendanceSession.find({
    sessionDate: { $gte: today, $lt: tomorrow },
    status: 'active'
  });

  const scheduledClasses = scheduleEntries.map(entry => {
    // Find if there's an active session matching this subject and teacher
    // We could match by exact time, but session logic currently relies on subject/teacher mostly
    const activeSession = activeSessions.find(s => 
      s.subject.toString() === entry.subject._id.toString() &&
      s.teacher.toString() === entry.teacher._id.toString()
    );

    return {
      _id: entry._id,
      subject: entry.subject,
      teacher: entry.teacher,
      startTime: entry.startTime,
      endTime: entry.endTime,
      room: entry.room,
      sessionType: entry.sessionType,
      activeSessionId: activeSession ? activeSession._id : null
    };
  });

  res.status(200).json({ success: true, data: scheduledClasses });
});
