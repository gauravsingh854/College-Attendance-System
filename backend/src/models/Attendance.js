import mongoose from 'mongoose';
import { ATTENDANCE_STATUS, VERIFICATION_METHOD } from '../utils/constants.js';

const attendanceSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AttendanceSession',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ATTENDANCE_STATUS),
      default: ATTENDANCE_STATUS.PRESENT,
    },
    verificationMethod: {
      type: String,
      enum: Object.values(VERIFICATION_METHOD),
      default: VERIFICATION_METHOD.QR_ONLY,
    },
    confidenceScore: {
      type: Number,
      default: null, // For face match distance/confidence
    },
    recordedAt: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    deviceInfo: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate attendance for the same student in the same session
attendanceSchema.index({ session: 1, student: 1 }, { unique: true });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
