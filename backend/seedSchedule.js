import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Subject } from './src/models/Subject.js';
import { Teacher } from './src/models/Teacher.js';
import { User } from './src/models/User.js';
import { ClassSchedule } from './src/models/ClassSchedule.js';

dotenv.config();

const teachersData = [
  { name: 'Dr Mani', email: 'mani@college.edu', facultyId: 'FAC001', designation: 'Assistant Professor' },
  { name: 'Mr. Ankit', email: 'ankit@college.edu', facultyId: 'FAC002', designation: 'Assistant Professor' },
  { name: 'Dr. Shashank', email: 'shashank@college.edu', facultyId: 'FAC003', designation: 'Associate Professor' },
  { name: 'Dr. Saroj Kumar', email: 'saroj@college.edu', facultyId: 'FAC004', designation: 'Professor' },
];

const scheduleData = [
  // SEMESTER 1 (Room A-303, Class In-charge: Dr Mani)
  { semester: 1, room: 'A-303', teacherName: 'Dr Mani', schedule: [
    { day: 'Monday', time: '09:30-10:30', code: '23SS152', teacherName: 'Mr. Ankit' },
    { day: 'Monday', time: '10:30-11:30', code: '23MCA104', teacherName: 'Dr Mani' },
    { day: 'Monday', time: '11:30-12:30', code: '23MCA103', teacherName: 'Dr. Shashank' },
    { day: 'Monday', time: '13:30-14:30', code: '23MCA102', teacherName: 'Dr. Saroj Kumar' },
    { day: 'Monday', time: '14:30-15:30', code: '23MCA101', teacherName: 'Mr. Ankit' },
    { day: 'Monday', time: '15:30-16:30', code: 'SEC-FT-01', teacherName: 'Dr. Shashank' },
    { day: 'Tuesday', time: '09:30-11:30', code: '23MCA152', teacherName: 'Dr. Saroj Kumar' },
    { day: 'Tuesday', time: '13:30-14:30', code: '23MCA101', teacherName: 'Mr. Ankit' },
    { day: 'Wednesday', time: '13:30-15:30', code: '23MCA153', teacherName: 'Dr Mani' },
    { day: 'Thursday', time: '09:30-10:30', code: '23SS152', teacherName: 'Mr. Ankit' },
    { day: 'Thursday', time: '10:30-11:30', code: '23MCA102', teacherName: 'Dr. Saroj Kumar' },
    { day: 'Thursday', time: '11:30-12:30', code: '23MCA103', teacherName: 'Dr. Shashank' },
    { day: 'Thursday', time: '13:30-14:30', code: '23MCA151', teacherName: 'Mr. Ankit' },
    { day: 'Friday', time: '09:30-10:30', code: '23MCA102', teacherName: 'Dr. Saroj Kumar' },
    { day: 'Friday', time: '10:30-11:30', code: 'SEC-FT-01', teacherName: 'Dr. Shashank' },
  ]},

  // SEMESTER 2 (Room A-503, Class In-charge: Mr. Ankit)
  { semester: 2, room: 'A-503', teacherName: 'Mr. Ankit', schedule: [
    { day: 'Monday', time: '10:30-11:30', code: '24MCA202' }, // Java Programming
    { day: 'Monday', time: '13:30-14:30', code: '23MCA203' }, // Cloud Computing
    { day: 'Monday', time: '14:30-15:30', code: '21ESUG202/203' }, // Sustainable Growth Development/Waste Management
    { day: 'Tuesday', time: '09:30-11:30', code: '24MCA252' }, // Java Programming Lab
    { day: 'Tuesday', time: '11:30-12:30', code: '24MCA204' }, // Discrete Mathematics & Graph Theory
    { day: 'Tuesday', time: '13:30-14:30', code: '24MCA202' }, // Java Programming
    { day: 'Tuesday', time: '14:30-15:30', code: '23MCA201' }, // Distributed Operating System
    { day: 'Wednesday', time: '09:30-10:30', code: '24MCA204' }, // Discrete Mathematics & Graph Theory
    { day: 'Wednesday', time: '10:30-11:30', code: '23MCA201' }, // Distributed Operating System
    { day: 'Wednesday', time: '11:30-12:30', code: '23MCA203' }, // Cloud Computing
    { day: 'Wednesday', time: '14:30-15:30', code: '24MCA202' }, // Java Programming
    { day: 'Thursday', time: '09:30-10:30', code: '24MCA204' }, // Discrete Mathematics & Graph Theory
    { day: 'Thursday', time: '10:30-11:30', code: '23MCA203' }, // Cloud Computing
    { day: 'Thursday', time: '11:30-12:30', code: '23MCA201' }, // Distributed Operating System
    { day: 'Thursday', time: '14:30-15:30', code: '24MCA202' }, // Java Programming
    { day: 'Friday', time: '09:30-11:30', code: '23MCA253' }, // Cloud Computing Lab
    { day: 'Friday', time: '11:30-12:30', code: '24MCA204' }, // Discrete Mathematics & Graph Theory
    { day: 'Friday', time: '14:30-15:30', code: '23CS0301' }, // Design Thinking and Augmented Virtual Reality - Level-I
    { day: 'Friday', time: '15:30-16:30', code: '23MCA201' }, // Distributed Operating System
  ]},

  // SEMESTER 3 (Room 09 Old Law Block, Class In-charge: Dr. Shashank)
  { semester: 3, room: '09 Old Law Block', teacherName: 'Dr. Shashank', schedule: [
    { day: 'Monday', time: '09:30-11:30', code: '24MCA302' }, // Python Programming (2-hour block)
    { day: 'Monday', time: '11:30-13:30', code: '23MCA301' }, // Big Data & Analytics (2-hour block)
    { day: 'Monday', time: '14:30-15:30', code: '23AR355' }, // Aptitude and Reasoning
    { day: 'Monday', time: '15:30-16:30', code: '23MCA304' }, // Network Security
    { day: 'Tuesday', time: '09:30-10:30', code: '24MCA302' }, // Python Programming
    { day: 'Tuesday', time: '10:30-11:30', code: '24MCA303' }, // Artificial Intelligence
    { day: 'Tuesday', time: '12:30-13:30', code: '23MCA306D' }, // Internet of Things (Wait, 12:30-1:30 is lunch normally, but listed here, I'll schedule it)
    { day: 'Tuesday', time: '14:30-15:30', code: '23AR355' }, // Aptitude and Reasoning
    { day: 'Tuesday', time: '15:30-16:30', code: '23MCA304' }, // Network Security
    { day: 'Wednesday', time: '09:30-11:30', code: '23MCA301' }, // Big Data & Analytics
    { day: 'Wednesday', time: '11:30-12:30', code: '23MCA306D' }, // Internet of Things
    { day: 'Wednesday', time: '13:30-14:30', code: '24MCA302' }, // Python Programming
    { day: 'Wednesday', time: '14:30-15:30', code: '23MCA304' }, // Network Security
    { day: 'Thursday', time: '09:30-11:30', code: '24MCA303' }, // Artificial Intelligence
    { day: 'Thursday', time: '11:30-13:30', code: '24MCA352' }, // Python Programming Lab
    { day: 'Thursday', time: '14:30-15:30', code: '23MCA304' }, // Network Security
    { day: 'Thursday', time: '15:30-16:30', code: '23MCA305' }, // Seminar
    { day: 'Friday', time: '09:30-10:30', code: '24MCA353' }, // Artificial Intelligence Lab
    { day: 'Friday', time: '11:30-12:30', code: '23MCA306D' }, // Internet of Things
    { day: 'Friday', time: '12:30-13:30', code: '23MCA306D' }, // Internet of Things (Lunch slot used)
    { day: 'Friday', time: '14:30-15:30', code: '23MCA305' }, // Seminar
    { day: 'Friday', time: '15:30-16:30', code: '23MCA354' }, // Live Project-II
  ]},

  // SEMESTER 4 (Class In-charge: Dr. Saroj Kumar)
  { semester: 4, room: 'Project Room', teacherName: 'Dr. Saroj Kumar', schedule: [
    { day: 'Monday', time: '09:30-10:30', code: '23MCA401c' }, // Combinatorial Optimization
    { day: 'Monday', time: '14:30-16:30', code: '21MCA411' }, // Major Project
    { day: 'Tuesday', time: '14:30-15:30', code: '23MCA401c' }, // Combinatorial Optimization
    { day: 'Wednesday', time: '14:30-15:30', code: '23MCA401c' }, // Combinatorial Optimization
    { day: 'Thursday', time: '09:30-11:30', code: '23CS0302' }, // Big Data Analytics, Tools and Techniques
    { day: 'Thursday', time: '14:30-15:30', code: '23MCA401c' }, // Combinatorial Optimization
  ]}
];

const seedSchedule = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing schedule to make it idempotent
    await ClassSchedule.deleteMany({ branch: 'MCA', section: 'A' });
    console.log('Cleared existing MCA Section A schedule');

    // Create or find teachers
    const teacherMap = {};
    for (const tData of teachersData) {
      let user = await User.findOne({ email: tData.email });
      if (!user) {
        user = await User.create({ name: tData.name, email: tData.email, password: 'password123', role: 'teacher' });
      }
      let teacher = await Teacher.findOne({ user: user._id });
      if (!teacher) {
        teacher = await Teacher.create({
          user: user._id,
          facultyId: tData.facultyId,
          branch: 'MCA',
          designation: tData.designation,
          teachingAssignments: []
        });
      }
      teacherMap[tData.name] = teacher._id;
    }

    // Process and insert schedule
    let insertedCount = 0;
    for (const semData of scheduleData) {
      for (const entry of semData.schedule) {
        const teacherName = entry.teacherName || semData.teacherName;
        const teacherId = teacherMap[teacherName];
        const subject = await Subject.findOne({ code: entry.code, branch: 'MCA' });
        if (!subject) {
          console.warn(`Warning: Subject ${entry.code} not found for semester ${semData.semester}. Skipping.`);
          continue;
        }
        const [startTime, endTime] = entry.time.split('-');
        
        await ClassSchedule.create({
          subject: subject._id,
          teacher: teacherId,
          branch: 'MCA',
          section: 'A',
          semester: semData.semester,
          dayOfWeek: entry.day,
          startTime,
          endTime,
          room: semData.room,
          sessionType: subject.type === 'theory' ? 'theory' : 'practical'
        });
        insertedCount++;
      }
    }

    console.log(`Successfully inserted ${insertedCount} schedule entries for MCA Section A`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding schedule:', error);
    process.exit(1);
  }
};

seedSchedule();
