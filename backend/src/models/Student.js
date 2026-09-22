import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: 1,
      max: 12,
    },
    faceDescriptor: {
      type: [Number], // 128-dimensional embedding array
      default: [],
      select: false, // Protected from general query dumps
    },
    isFaceEnrolled: {
      type: Boolean,
      default: false,
    },
    consentGiven: {
      type: Boolean,
      default: false,
    },
    consentDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Student = mongoose.model('Student', studentSchema);
