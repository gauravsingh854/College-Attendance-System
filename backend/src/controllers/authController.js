import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.js';
import { Student } from '../models/Student.js';
import { Teacher } from '../models/Teacher.js';
import { Subject } from '../models/Subject.js';
import { generateAuthToken } from '../services/tokenService.js';

export const register = asyncHandler(async (req, res) => {
  const { 
    name, email, password, role, 
    rollNumber, branch, section, semester,
    facultyId, designation, teachingAssignments, phoneNumber
  } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const roleToSet = role || 'student';

  if (roleToSet === 'student') {
    const existingStudent = await Student.findOne({ rollNumber: rollNumber.toUpperCase() });
    if (existingStudent) {
      throw new ApiError(409, 'Student with this roll number already exists');
    }
  }

  if (roleToSet === 'teacher') {
    const existingTeacher = await Teacher.findOne({ facultyId: facultyId.toUpperCase() });
    if (existingTeacher) {
      throw new ApiError(409, 'Teacher with this faculty ID already exists');
    }
  }

  const user = await User.create({
    name,
    email,
    password,
    role: roleToSet,
  });

  if (roleToSet === 'student') {
    const derivedAcademicYear = semester <= 2 ? '1st Year' : semester <= 4 ? '2nd Year' : semester <= 6 ? '3rd Year' : '4th Year';
    const subjects = await Subject.find({ branch, semester });
    const enrolledSubjectIds = subjects.map(s => s._id);

    await Student.create({
      user: user._id,
      rollNumber: rollNumber.toUpperCase(),
      branch,
      section,
      academicYear: derivedAcademicYear,
      semester,
      enrolledSubjects: enrolledSubjectIds,
      consentGiven: true, // They must consent to register
      consentDate: new Date()
    });
  } else if (roleToSet === 'teacher') {
    const populatedAssignments = (teachingAssignments || []).map(assignment => {
      const sem = assignment.semester || 1;
      const derivedYear = sem <= 2 ? '1st Year' : sem <= 4 ? '2nd Year' : sem <= 6 ? '3rd Year' : '4th Year';
      return {
        ...assignment,
        academicYear: assignment.academicYear || derivedYear
      };
    });

    await Teacher.create({
      user: user._id,
      facultyId: facultyId.toUpperCase(),
      branch,
      designation,
      teachingAssignments: populatedAssignments,
      phoneNumber
    });
  }

  const token = generateAuthToken(user);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateAuthToken(user);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, 'Both old and new passwords are required');
  }

  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (!(await user.comparePassword(oldPassword))) {
    throw new ApiError(401, 'Incorrect old password');
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully'
  });
});
