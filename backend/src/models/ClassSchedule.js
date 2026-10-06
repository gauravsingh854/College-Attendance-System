import mongoose from 'mongoose';

const classScheduleSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject is required'],
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: [true, 'Teacher is required'],
    },
    branch: {
      type: String,
      required: true,
      trim: true,
    },
    section: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    dayOfWeek: {
      type: String,
      required: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    startTime: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please use 24-hour HH:MM format'],
    },
    endTime: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please use 24-hour HH:MM format'],
    },
    room: {
      type: String,
      required: true,
      trim: true,
    },
    sessionType: {
      type: String,
      required: true,
      enum: ['theory', 'practical', 'library', 'seminar', 'project'],
    },
  },
  { timestamps: true }
);

// Index for efficient querying by branch, semester, section, and day
classScheduleSchema.index({ branch: 1, semester: 1, section: 1, dayOfWeek: 1 });

export const ClassSchedule = mongoose.model('ClassSchedule', classScheduleSchema);
