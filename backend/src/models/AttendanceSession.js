import mongoose from 'mongoose';

const attendanceSessionSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teachingAssignment: {
      branch: { type: String, required: true },
      section: { type: String, required: true },
      academicYear: { type: String, required: true },
      semester: { type: Number, required: true },
      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['active', 'ended', 'expired'],
      default: 'active',
    },
    qrToken: {
      type: String,
      required: true,
    },
    qrTokenExpiresAt: {
      type: Date,
      required: true,
    },
    sessionStartedAt: {
      type: Date,
      default: Date.now,
    },
    sessionEndsAt: {
      type: Date,
      required: true,
    },
    totalEnrolledStudents: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

export const AttendanceSession = mongoose.model(
  'AttendanceSession',
  attendanceSessionSchema
);
