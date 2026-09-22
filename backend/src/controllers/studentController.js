import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Student } from '../models/Student.js';

export const getStudentProfile = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user.id }).populate('user', 'name email');
  if (!student) {
    throw new ApiError(404, 'Student profile not found. Please complete profile setup.');
  }

  res.status(200).json({
    success: true,
    data: student,
  });
});

export const updateStudentProfile = asyncHandler(async (req, res) => {
  const { rollNumber, department, semester } = req.body;

  let student = await Student.findOne({ user: req.user.id });

  if (student) {
    student.rollNumber = rollNumber || student.rollNumber;
    student.department = department || student.department;
    student.semester = semester || student.semester;
    await student.save();
  } else {
    student = await Student.create({
      user: req.user.id,
      rollNumber,
      department,
      semester,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: student,
  });
});

export const enrollFace = asyncHandler(async (req, res) => {
  const { faceDescriptor, consentGiven } = req.body;

  if (!consentGiven) {
    throw new ApiError(400, 'Explicit consent required for face enrollment');
  }

  const student = await Student.findOne({ user: req.user.id });
  if (!student) {
    throw new ApiError(404, 'Student profile not found. Complete profile first.');
  }

  student.faceDescriptor = faceDescriptor;
  student.isFaceEnrolled = true;
  student.consentGiven = true;
  student.consentDate = new Date();
  await student.save();

  res.status(200).json({
    success: true,
    message: 'Face biometric embedding enrolled securely',
    data: {
      isFaceEnrolled: true,
      consentDate: student.consentDate,
    },
  });
});
