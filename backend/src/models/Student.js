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
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      trim: true,
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: 1,
      max: 12,
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
      enum: ['A', 'B', 'C', 'D'],
    },
    academicYear: {
      type: String,
      required: [true, 'Academic Year is required'],
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    },
    enrolledSubjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
      },
    ],
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
