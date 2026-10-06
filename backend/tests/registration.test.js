import assert from 'node:assert';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Subject } from '../src/models/Subject.js';
import { Student } from '../src/models/Student.js';
import { User } from '../src/models/User.js';
import * as authController from '../src/controllers/authController.js';

dotenv.config();

// Since there is no testing framework configured, we use standard assertions.
// In a real project, this would use Jest/Mocha + Supertest.

async function runTests() {
  console.log('[Test] Running registration tests...');
  
  // Connect to DB for integration test style logic
  await mongoose.connect(process.env.MONGODB_URI);

  // 1. Test: Tampered enrolledSubjects is ignored server-side
  // We simulate the controller request
  const mockReq = {
    body: {
      name: 'Test Student',
      email: 'test.tamper@college.edu',
      password: 'password123',
      role: 'student',
      rollNumber: 'TEST001',
      branch: 'MCA',
      section: 'A',
      semester: 1,
      enrolledSubjects: ['fakeSubjectId1', 'fakeSubjectId2'] // Tampered list
    }
  };
  
  const mockRes = {
    status: function (code) { this.statusCode = code; return this; },
    json: function (data) { this.data = data; return this; }
  };
  
  const mockNext = (err) => {
    if (err) throw err;
  };

  try {
    // Make sure user doesn't exist
    await User.deleteOne({ email: mockReq.body.email });
    await Student.deleteOne({ rollNumber: mockReq.body.rollNumber });

    // Seed real subjects
    const testSubject = await Subject.create({
      name: 'Test Java', code: 'TEST101', branch: 'MCA', academicYear: '1st Year', semester: 1
    });

    // Run controller
    await authController.register(mockReq, mockRes, mockNext);
    
    assert.strictEqual(mockRes.statusCode, 201, 'Expected registration to succeed');

    // Check student in DB
    const student = await Student.findOne({ rollNumber: 'TEST001' });
    assert.ok(student, 'Student should be created');
    
    // Verify enrolledSubjects matches DB subjects, NOT the tampered list
    assert.strictEqual(student.enrolledSubjects.length, 1);
    assert.strictEqual(student.enrolledSubjects[0].toString(), testSubject._id.toString());
    assert.ok(!student.enrolledSubjects.includes('fakeSubjectId1'));

    console.log('[Test] Passed: Tampered enrolledSubjects value in the registration request is ignored server-side.');

  } catch (error) {
    console.error('[Test] Failed:', error);
  } finally {
    // Cleanup
    await User.deleteOne({ email: mockReq.body.email });
    await Student.deleteOne({ rollNumber: mockReq.body.rollNumber });
    await Subject.deleteOne({ code: 'TEST101' });
    await mongoose.disconnect();
  }
}

runTests();
