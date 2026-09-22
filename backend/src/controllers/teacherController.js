import { asyncHandler } from '../utils/asyncHandler.js';
import { Subject } from '../models/Subject.js';
import { Student } from '../models/Student.js';

export const getTeacherSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({ teacher: req.user.id });
  res.status(200).json({
    success: true,
    data: subjects,
  });
});

export const createSubject = asyncHandler(async (req, res) => {
  const { name, code, department, semester } = req.body;

  const subject = await Subject.create({
    name,
    code,
    department,
    semester,
    teacher: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: 'Subject created successfully',
    data: subject,
  });
});

export const getEnrolledStudents = asyncHandler(async (req, res) => {
  const { department, semester } = req.query;
  const filter = {};
  if (department) filter.department = department;
  if (semester) filter.semester = Number(semester);

  const students = await Student.find(filter).populate('user', 'name email');

  res.status(200).json({
    success: true,
    count: students.length,
    data: students,
  });
});
