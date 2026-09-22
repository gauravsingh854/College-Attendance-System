import mongoose from 'mongoose';
import { SESSION_STATUS } from '../utils/constants.js';

const attendanceSessionSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sessionDate: {
      type: Date,
      default: Date.now,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(SESSION_STATUS),
      default: SESSION_STATUS.ACTIVE,
    },
    qrSecret: {
      type: String,
      required: true,
    },
    tokenRefreshIntervalSec: {
      type: Number,
      default: 30, // seconds
    },
    geofence: {
      enabled: {
        type: Boolean,
        default: false,
      },
      latitude: Number,
      longitude: Number,
      radiusMeters: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const AttendanceSession = mongoose.model(
  'AttendanceSession',
  attendanceSessionSchema
);
