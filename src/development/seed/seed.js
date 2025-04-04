// src/seed.js
import { Faker, fa } from '@faker-js/faker';
import { sequelize } from '../../configs/db.config.js';
import { Attendance } from '../../modules/attendances/attendance.model.js';
import { Class } from '../../modules/class/class.model.js';
import { Field } from '../../modules/fields/field.model.js';
import { Schedule } from '../../modules/schedules/schedule.model.js';
import { Student } from '../../modules/students/student.model.js';
import { Teacher } from '../../modules/teacher/teacher.model.js';
import { User } from '../../modules/users/user.model.js';

const faker = new Faker({ locale: [fa] });

async function seedDatabase() {
  try {
    await sequelize.sync({ force: true });

    // 1. Define Farsi fields
    const farsiFields = [
      'ریاضی',
      'تجربی',
      'انسانی',
      'معماری',
      'هنر',
      'کامپیوتر',
      'ادبیات',
      'تاریخ',
      'زبان‌های خارجی',
    ];

    const fields = farsiFields.map((name) => ({
      name,
      description: faker.lorem.sentence(),
      parentId: null,
    }));
    const createdFields = await Field.bulkCreate(fields);

    // 2. Create 22 Classes
    const classes = [];
    for (let i = 0; i < 22; i++) {
      classes.push({
        number: 101 + i,
        name: `کلاس ${i + 1}`,
        description: faker.lorem.sentence(),
        capacity: faker.number.int({ min: 30, max: 40 }),
      });
    }
    const createdClasses = await Class.bulkCreate(classes);

    // 3. Create Teachers with Unique Codes
    const teacherCount = faker.number.int({ min: 45, max: 55 });
    const teachers = [];
    const usedTeacherCodes = new Set();

    const generateUniqueTeacherCode = () => {
      let code;
      do {
        code = `T${faker.number.int({ min: 1000, max: 9999 })}`;
      } while (usedTeacherCodes.has(code));
      usedTeacherCodes.add(code);
      return code;
    };

    for (let i = 0; i < teacherCount; i++) {
      teachers.push({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        teacher_code: generateUniqueTeacherCode(),
        phone: `09${faker.number.int({ min: 100000000, max: 999999999 })}`,
        email: faker.internet.email(),
        status: 'active',
      });
    }
    const createdTeachers = await Teacher.bulkCreate(teachers);

    // 4. Create 800 Students with Unique Codes
    const students = [];
    const usedStudentCodes = new Set();
    const generateUniqueStudentCode = () => {
      let code;
      do {
        code = `S${faker.number.int({ min: 10000, max: 99999 })}`;
      } while (usedStudentCodes.has(code));
      usedStudentCodes.add(code);
      return code;
    };

    for (let i = 0; i < 800; i++) {
      students.push({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        studentCode: generateUniqueStudentCode(),
        phone: `09${faker.number.int({ min: 100000000, max: 999999999 })}`,
        staticPhone: `021${faker.number.int({ min: 10000000, max: 99999999 })}`,
        nationalCode: faker.number
          .int({ min: 1000000000, max: 9999999999 })
          .toString(),
        nationality: 'ایران',
        dropOutSchool: faker.datatype.boolean(),
        address: faker.location.streetAddress(),
        gender: faker.helpers.arrayElement(['male', 'female']),
        fatherName: faker.person.firstName(),
        fatherPhone: `09${faker.number.int({
          min: 100000000,
          max: 999999999,
        })}`,
        motherPhone: `09${faker.number.int({
          min: 100000000,
          max: 999999999,
        })}`,
        siblingsNumber: faker.number.int({ min: 0, max: 5 }),
        age: faker.number.int({ min: 15, max: 20 }),
        field: faker.helpers.arrayElement(farsiFields),
        status: 'active',
        graduated: faker.datatype.boolean(),
        lastSchool: faker.company.name(),
        lastYearAverage: faker.number.float({
          min: 10,
          max: 20,
          precision: 0.1,
        }),
        subFieldId: faker.helpers.arrayElement(createdFields).id,
        classId: faker.helpers.arrayElement(createdClasses).id,
      });
    }
    const createdStudents = await Student.bulkCreate(students);

    // 5. Create Schedules (at least 1 session per teacher)
    const schedules = [];
    const usedKeys = new Set();
    const weekdays = [0, 1, 2, 3, 4]; // Saturday to Wednesday

    for (const teacher of createdTeachers) {
      const sessionCount = faker.number.int({ min: 1, max: 5 });
      for (let i = 0; i < sessionCount; i++) {
        const classId = faker.helpers.arrayElement(createdClasses).id;
        const dayOfWeek = faker.helpers.arrayElement(weekdays);
        const sessionNumber = faker.number.int({ min: 1, max: 4 });
        const key = `${classId}-${dayOfWeek}-${sessionNumber}`;
        if (usedKeys.has(key)) continue;
        usedKeys.add(key);

        schedules.push({
          class_id: classId,
          teacher_id_1: teacher.id,
          teacher_id_2: null,
          day_of_week: dayOfWeek,
          session_number: sessionNumber,
          start_time: '08:00:00',
          end_time: '09:30:00',
          lesson_name: faker.helpers.arrayElement(farsiFields),
          room: `کلاس ${faker.number.int({ min: 1, max: 22 })}`,
        });
      }
    }
    await Schedule.bulkCreate(schedules);

    // 6. Attendance Records
    const attendanceRecords = [];
    for (let i = 0; i < 500; i++) {
      const isStudent = faker.datatype.boolean();
      attendanceRecords.push({
        entityId: isStudent
          ? faker.helpers.arrayElement(createdStudents).id
          : faker.helpers.arrayElement(createdTeachers).id,
        entityType: isStudent ? 'student' : 'teacher',
        date: faker.date.recent(30).toISOString().split('T')[0],
        status: faker.helpers.arrayElement(['present', 'absent', 'late']),
      });
    }
    await Attendance.bulkCreate(attendanceRecords);

    // 7. Admin and user accounts
    const users = [
      {
        username: 'admin',
        password: 'admin123',
        role: 'super-user',
      },
      {
        username: 'user1',
        password: 'user123',
        role: 'user',
      },
    ];
    await User.bulkCreate(users);

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();
