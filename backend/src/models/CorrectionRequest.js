import mongoose from 'mongoose';

const correctionRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AttendanceSession',
      required: true,
    },
    reason: {
      type: String,
      enum: ['QR Issue', 'Camera Issue', 'Face Issue', 'Other'],
      required: true,
    },
    note: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

export const CorrectionRequest = mongoose.model('CorrectionRequest', correctionRequestSchema);
