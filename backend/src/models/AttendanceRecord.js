import mongoose from 'mongoose';

const attendanceRecordSchema = new mongoose.Schema(
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
    markedAt: {
      type: Date,
      default: Date.now,
    },
    verificationMethod: {
      type: String,
      enum: ['qr_face'],
      default: 'qr_face',
    },
    faceMatchConfidence: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['present'],
      default: 'present',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate attendance for the same student in the same session
attendanceRecordSchema.index({ session: 1, student: 1 }, { unique: true });

export const AttendanceRecord = mongoose.model('AttendanceRecord', attendanceRecordSchema);
