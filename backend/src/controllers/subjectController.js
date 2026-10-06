import { asyncHandler } from '../utils/asyncHandler.js';
import { Subject } from '../models/Subject.js';

export const getAllSubjects = asyncHandler(async (req, res) => {
  const { branch, semester } = req.query;
  const filter = {};
  if (branch) filter.branch = branch;
  if (semester) filter.semester = parseInt(semester, 10);

  const subjects = await Subject.find(filter).sort({ name: 1 });
  res.status(200).json({ success: true, data: subjects });
});
