import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    facultyId: {
      type: String,
      required: [true, 'Faculty ID is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      enum: ['BCA', 'BTech CSE', 'BTech IT', 'BBA', 'MCA', 'Other'],
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      enum: ['Assistant Professor', 'Associate Professor', 'Professor', 'HOD', 'Guest Faculty', 'Other'],
    },
    teachingAssignments: [
      {
        branch: { type: String, required: true },
        section: { type: String, required: true, enum: ['A', 'B', 'C', 'D'] },
        academicYear: { type: String, required: true, enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'] },
        semester: { type: Number, required: true, min: 1, max: 12 },
        subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true }
      }
    ],
    phoneNumber: {
      type: String,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'],
    },
  },
  {
    timestamps: true,
  }
);

export const Teacher = mongoose.model('Teacher', teacherSchema);
