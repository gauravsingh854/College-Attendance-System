import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Subject } from './src/models/Subject.js';

dotenv.config();

const subjects = [
  { name: 'Data Structures and Algorithms', code: 'CS201', branch: 'BTech CSE', academicYear: '2nd Year', semester: 3 },
  { name: 'Database Management Systems', code: 'CS301', branch: 'BTech CSE', academicYear: '3rd Year', semester: 5 },
  { name: 'Computer Networks', code: 'CS401', branch: 'BTech CSE', academicYear: '4th Year', semester: 7 },
  { name: 'Web Development', code: 'CS402', branch: 'BTech CSE', academicYear: '4th Year', semester: 7 },
  { name: 'Software Engineering', code: 'CS302', branch: 'BTech CSE', academicYear: '3rd Year', semester: 6 },
  { name: 'Programming in C', code: 'BCA101', branch: 'BCA', academicYear: '1st Year', semester: 1 },
  { name: 'Data Structures using C', code: 'BCA201', branch: 'BCA', academicYear: '2nd Year', semester: 3 },
  { name: 'Operating Systems', code: 'BCA301', branch: 'BCA', academicYear: '3rd Year', semester: 5 },
  { name: 'Java Programming', code: 'MCA101', branch: 'MCA', academicYear: '1st Year', semester: 1 },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing subjects
    await Subject.deleteMany({});
    console.log('Cleared existing subjects');
    
    // Insert new subjects
    await Subject.insertMany(subjects);
    console.log('Successfully seeded subjects');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding subjects:', error);
    process.exit(1);
  }
};

seed();
