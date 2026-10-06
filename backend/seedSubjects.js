import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Subject } from './src/models/Subject.js';

dotenv.config();

const mcaSubjects = [
  // Semester 1 Theory
  { code: '23MCA101', name: 'Design and Analysis of Algorithm', branch: 'MCA', semester: 1, category: 'CC', type: 'theory', credits: 4, academicYear: '1st Year' },
  { code: '23MCA102', name: 'Essentials of Networking', branch: 'MCA', semester: 1, category: 'CC', type: 'theory', credits: 4, academicYear: '1st Year' },
  { code: '23MCA103', name: 'Information System Analysis & Design', branch: 'MCA', semester: 1, category: 'CC', type: 'theory', credits: 4, academicYear: '1st Year' },
  { code: '23MCA104', name: 'Software Engineering', branch: 'MCA', semester: 1, category: 'CC', type: 'theory', credits: 4, academicYear: '1st Year' },
  { code: 'SEC-FT-01', name: 'Entrepreneurship and New Venture Management', branch: 'MCA', semester: 1, category: 'OE', type: 'theory', credits: 3, academicYear: '1st Year' },
  // Semester 1 Practical
  { code: '23MCA151', name: 'Design and Analysis of Algorithm Lab', branch: 'MCA', semester: 1, category: 'P', type: 'practical', credits: 1, academicYear: '1st Year' },
  { code: '23MCA152', name: 'Networking Lab', branch: 'MCA', semester: 1, category: 'P', type: 'practical', credits: 1, academicYear: '1st Year' },
  { code: '23MCA153', name: 'Software Engineering Lab', branch: 'MCA', semester: 1, category: 'P', type: 'practical', credits: 1, academicYear: '1st Year' },
  { code: '23SS152', name: 'Teamwork & Interpersonal Skills', branch: 'MCA', semester: 1, category: 'SEC', type: 'practical', credits: 1, academicYear: '1st Year' },

  // Semester 2 Theory
  { code: '23MCA201', name: 'Distributed Operating System', branch: 'MCA', semester: 2, category: 'CC', type: 'theory', credits: 4, academicYear: '1st Year' },
  { code: '24MCA202', name: 'Java Programming', branch: 'MCA', semester: 2, category: 'CC', type: 'theory', credits: 4, academicYear: '1st Year' },
  { code: '23MCA203', name: 'Cloud Computing', branch: 'MCA', semester: 2, category: 'CC', type: 'theory', credits: 4, academicYear: '1st Year' },
  { code: '24MCA204', name: 'Discrete Mathematics & Graph Theory', branch: 'MCA', semester: 2, category: 'CC', type: 'theory', credits: 4, academicYear: '1st Year' },
  { code: '21ESUG202/203', name: 'Sustainable Growth Development/Waste Management', branch: 'MCA', semester: 2, category: 'OE', type: 'theory', credits: 3, academicYear: '1st Year' },
  // Semester 2 Practical
  { code: '24MCA252', name: 'Java Programming Lab', branch: 'MCA', semester: 2, category: 'P', type: 'practical', credits: 1, academicYear: '1st Year' },
  { code: '23MCA253', name: 'Cloud Computing Lab', branch: 'MCA', semester: 2, category: 'P', type: 'practical', credits: 1, academicYear: '1st Year' },
  // Flag: Live Project-I had conflicting codes (23MCA254 vs 23MCA211). Timetable uses 23MCA211. Check manually before prod.
  { code: '23MCA211', name: 'Live Project-I', branch: 'MCA', semester: 2, category: 'LP', type: 'practical', credits: 1, academicYear: '1st Year' },
  { code: '23SS254', name: 'Professional Writing Skills & Interpersonal Skills: Strategies', branch: 'MCA', semester: 2, category: 'SEC', type: 'practical', credits: 1, academicYear: '1st Year' },
  { code: '23CS0301', name: 'Design Thinking and Augmented Virtual Reality - Level-I', branch: 'MCA', semester: 2, category: 'SEC', type: 'practical', credits: 1, academicYear: '1st Year' },

  // Semester 3 Theory
  { code: '23MCA301', name: 'Big Data & Analytics', branch: 'MCA', semester: 3, category: 'CC', type: 'theory', credits: 4, academicYear: '2nd Year' },
  { code: '24MCA302', name: 'Python Programming', branch: 'MCA', semester: 3, category: 'CC', type: 'theory', credits: 4, academicYear: '2nd Year' },
  { code: '24MCA303', name: 'Artificial Intelligence', branch: 'MCA', semester: 3, category: 'CC', type: 'theory', credits: 4, academicYear: '2nd Year' },
  { code: '23MCA304', name: 'Network Security', branch: 'MCA', semester: 3, category: 'CC', type: 'theory', credits: 4, academicYear: '2nd Year' },
  { code: '23MCA306D', name: 'Internet of Things', branch: 'MCA', semester: 3, category: 'PE', type: 'theory', credits: 4, academicYear: '2nd Year' },
  // Semester 3 Practical
  { code: '23MCA305', name: 'Seminar', branch: 'MCA', semester: 3, category: 'P', type: 'practical', credits: 2, academicYear: '2nd Year' },
  { code: '24MCA352', name: 'Python Programming Lab', branch: 'MCA', semester: 3, category: 'P', type: 'practical', credits: 1, academicYear: '2nd Year' },
  { code: '24MCA353', name: 'Artificial Intelligence Lab', branch: 'MCA', semester: 3, category: 'P', type: 'practical', credits: 1, academicYear: '2nd Year' },
  { code: '23MCA354', name: 'Live Project-II', branch: 'MCA', semester: 3, category: 'LP', type: 'practical', credits: 1, academicYear: '2nd Year' },
  { code: '23AR355', name: 'Aptitude and Reasoning', branch: 'MCA', semester: 3, category: 'SEC', type: 'practical', credits: 1, academicYear: '2nd Year' },

  // Semester 4 Theory
  { code: '23MCA401c', name: 'Combinatorial Optimization', branch: 'MCA', semester: 4, category: 'PE', type: 'theory', credits: 4, academicYear: '2nd Year' },
  // Semester 4 Practical
  { code: '21MCA411', name: 'Major Project', branch: 'MCA', semester: 4, category: 'LP', type: 'practical', credits: 8, academicYear: '2nd Year' },
  { code: '23CS0302', name: 'Big Data Analytics, Tools and Techniques', branch: 'MCA', semester: 4, category: 'SEC', type: 'practical', credits: 1, academicYear: '2nd Year' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Rename old placeholders so they don't get duplicated or left behind
    await Subject.updateOne({ code: '21XXX-OE2' }, { $set: { code: '21ESUG202/203', name: 'Sustainable Growth Development/Waste Management' } });
    await Subject.updateOne({ code: 'PE-301' }, { $set: { code: '23MCA306D', name: 'Internet of Things' } });
    await Subject.updateOne({ code: 'PE-402' }, { $set: { code: '23MCA401c', name: 'Combinatorial Optimization' } });
    await Subject.updateOne({ code: 'MP-401' }, { $set: { code: '21MCA411', name: 'Major Project' } });
    await Subject.updateOne({ code: 'SEC-FT-01' }, { $set: { name: 'Entrepreneurship and New Venture Management' } });
    await Subject.updateOne({ code: '23MCA254' }, { $set: { code: '23MCA211' } });

    let insertedCount = 0;
    let skippedCount = 0;

    for (const sub of mcaSubjects) {
      const exists = await Subject.findOne({ code: sub.code });
      if (exists) {
        console.log(`Skipped existing subject: ${sub.name} (${sub.code})`);
        skippedCount++;
      } else {
        await Subject.create(sub);
        console.log(`Inserted subject: ${sub.name} (${sub.code})`);
        insertedCount++;
      }
    }

    console.log(`Successfully seeded subjects. Inserted: ${insertedCount}, Skipped: ${skippedCount}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding subjects:', error);
    process.exit(1);
  }
};

seed();
