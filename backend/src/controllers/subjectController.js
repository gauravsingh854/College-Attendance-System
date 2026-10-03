import { asyncHandler } from '../utils/asyncHandler.js';
import { Subject } from '../models/Subject.js';

export const getAllSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find().sort({ name: 1 });
  res.status(200).json({ success: true, data: subjects });
});
