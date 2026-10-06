import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      trim: true,
    },
    academicYear: {
      type: String,
      required: [true, 'Academic Year is required'],
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    category: {
      type: String,
      enum: ['CC', 'OE', 'PE', 'P', 'LP', 'SEC'],
      required: false,
    },
    type: {
      type: String,
      enum: ['theory', 'practical'],
      required: false,
    },
    credits: {
      type: Number,
      required: false,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Subject = mongoose.model('Subject', subjectSchema);
