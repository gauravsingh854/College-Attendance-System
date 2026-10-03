import { asyncHandler } from '../utils/asyncHandler.js';
import { Subject } from '../models/Subject.js';
import { Student } from '../models/Student.js';
import { Teacher } from '../models/Teacher.js';
import { ApiError } from '../utils/ApiError.js';

export const getTeacherProfile = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user.id }).populate('user', 'name email').populate('assignedSubjects');
  if (!teacher) {
    throw new ApiError(404, 'Teacher profile not found');
  }
  res.status(200).json({
    success: true,
    data: teacher,
  });
});

export const updateTeacherProfile = asyncHandler(async (req, res) => {
  const updates = req.body;
  // Prevent changing critical fields directly via profile update
  delete updates.user;
  delete updates.facultyId;

  const teacher = await Teacher.findOneAndUpdate(
    { user: req.user.id },
    { $set: updates },
    { new: true, runValidators: true }
  ).populate('user', 'name email').populate('assignedSubjects');

  if (!teacher) {
    throw new ApiError(404, 'Teacher profile not found');
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: teacher,
  });
});

export const getTeacherSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({ teacher: req.user.id });
  res.status(200).json({
    success: true,
    data: subjects,
  });
});

export const createSubject = asyncHandler(async (req, res) => {
  const { name, code, branch, academicYear, semester } = req.body;

  const subject = await Subject.create({
    name,
    code,
    branch,
    academicYear,
    semester,
    teacher: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: 'Subject created successfully',
    data: subject,
  });
});

export const getAssignedClasses = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user.id }).populate('teachingAssignments.subject');
  if (!teacher) {
    throw new ApiError(404, 'Teacher profile not found');
  }

  const assignments = await Promise.all(
    teacher.teachingAssignments.map(async (assignment) => {
      const studentCount = await Student.countDocuments({
        branch: assignment.branch,
        section: assignment.section,
        academicYear: assignment.academicYear,
        semester: assignment.semester,
        enrolledSubjects: assignment.subject._id,
      });

      return {
        _id: assignment._id,
        branch: assignment.branch,
        section: assignment.section,
        academicYear: assignment.academicYear,
        semester: assignment.semester,
        subject: assignment.subject,
        studentCount,
      };
    })
  );

  res.status(200).json({
    success: true,
    data: assignments,
  });
});

export const getClassStudents = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  
  const teacher = await Teacher.findOne({ user: req.user.id });
  if (!teacher) {
    throw new ApiError(404, 'Teacher profile not found');
  }

  const assignment = teacher.teachingAssignments.id(assignmentId);
  if (!assignment) {
    throw new ApiError(403, 'Unauthorized access to class assignment');
  }

  const students = await Student.find({
    branch: assignment.branch,
    section: assignment.section,
    academicYear: assignment.academicYear,
    semester: assignment.semester,
    enrolledSubjects: assignment.subject,
  }).populate('user', 'name email');

  // Need to calculate attendance percentage if Attendance logic is ready
  // For now, mapping safe fields
  const safeStudents = students.map((s) => ({
    _id: s._id,
    fullName: s.user.name,
    email: s.user.email,
    rollNumber: s.rollNumber,
    branch: s.branch,
    section: s.section,
    academicYear: s.academicYear,
    semester: s.semester,
    attendancePercentage: 0 // Mock value until attendance aggregation is added
  }));

  res.status(200).json({
    success: true,
    count: safeStudents.length,
    data: safeStudents,
  });
});
