// initialDB.js
import bcrypt from 'bcrypt';
import { sequelize } from '../configs/db.config.js';
import { Attendance } from '../modules/attendances/attendance.model.js';
import { Class } from '../modules/class/class.model.js';
import { Field } from '../modules/fields/field.model.js';
import { Schedule } from '../modules/schedules/schedule.model.js';
import { Student } from '../modules/students/student.model.js';
import { Teacher } from '../modules/teacher/teacher.model.js';
import { User } from '../modules/users/user.model.js';

const initialDB = async () => {
  try {
    // Existing associations...
    Field.hasMany(Field, { foreignKey: 'parent_id', as: 'subFields' });
    Field.belongsTo(Field, { foreignKey: 'parent_id', as: 'parentField' });
    Student.belongsTo(Field, { foreignKey: 'subFieldId', as: 'subField' });
    Field.hasMany(Student, { foreignKey: 'subFieldId', as: 'students' });
    Student.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
    Class.hasMany(Student, { foreignKey: 'classId', as: 'students' });
    Schedule.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });
    Class.hasMany(Schedule, { foreignKey: 'class_id', as: 'schedules' });
    Schedule.belongsTo(Teacher, { foreignKey: 'teacher_id_1', as: 'teacher1' });
    Schedule.belongsTo(Teacher, { foreignKey: 'teacher_id_2', as: 'teacher2' });
    Teacher.hasMany(Schedule, { foreignKey: 'teacher_id_1', as: 'schedules1' });
    Teacher.hasMany(Schedule, { foreignKey: 'teacher_id_2', as: 'schedules2' });

    // Attendance associations
    Student.hasMany(Attendance, {
      foreignKey: 'entity_id',
      constraints: false,
      as: 'attendances',
      scope: { entity_type: 'student' },
    });
    Attendance.belongsTo(Student, {
      foreignKey: 'entity_id',
      constraints: false,
      as: 'student',
    });
    Teacher.hasMany(Attendance, {
      foreignKey: 'entity_id',
      constraints: false,
      as: 'attendances',
      scope: { entity_type: 'teacher' },
    });
    Attendance.belongsTo(Teacher, {
      foreignKey: 'entity_id',
      constraints: false,
      as: 'teacher',
    });

    await sequelize.sync({ alter: true });
    console.log('database syncronized successfully!');

    // Seed super-user
    const superUser = await User.findOne({ where: { username: 'superadmin' } });
    if (!superUser) {
      const hashedPassword = await bcrypt.hash('superpassword123', 10);
      await User.create({
        username: 'superadmin',
        password: hashedPassword,
        role: 'super-user',
      });
      console.log('Default super-user created: superadmin / superpassword123');
    }
  } catch (error) {
    console.error('Error initializing the database:', error);
    throw error;
  }
};

export { initialDB };
