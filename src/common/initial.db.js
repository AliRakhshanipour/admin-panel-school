// initialDB.js
import { sequelize } from '../configs/db.config.js';
import { Class } from '../modules/class/class.model.js';
import { Field } from '../modules/fields/field.model.js';
import { Schedule } from '../modules/schedules/schedule.model.js';
import { Student } from '../modules/students/student.model.js';
import { Teacher } from '../modules/teacher/teacher.model.js';
import { User } from '../modules/users/user.model.js';

const initialDB = async () => {
  try {
    // === Field Associations ===
    // Field can have subFields (self-referencing)
    Field.hasMany(Field, { foreignKey: 'parent_id', as: 'subFields' });
    Field.belongsTo(Field, { foreignKey: 'parent_id', as: 'parentField' });

    // Student belongs to a Field (subField)
    Student.belongsTo(Field, { foreignKey: 'subFieldId', as: 'subField' }); // Matches camelCase from student.model.js
    Field.hasMany(Student, { foreignKey: 'subFieldId', as: 'students' });

    // === Student-Class Associations ===
    Student.belongsTo(Class, { foreignKey: 'classId', as: 'class' }); // Matches camelCase from student.model.js
    Class.hasMany(Student, { foreignKey: 'classId', as: 'students' });

    // === Schedule Associations ===
    Schedule.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });
    Class.hasMany(Schedule, { foreignKey: 'class_id', as: 'schedules' });
    Schedule.belongsTo(Teacher, { foreignKey: 'teacher_id_1', as: 'teacher1' });
    Schedule.belongsTo(Teacher, { foreignKey: 'teacher_id_2', as: 'teacher2' });
    Teacher.hasMany(Schedule, { foreignKey: 'teacher_id_1', as: 'schedules1' });
    Teacher.hasMany(Schedule, { foreignKey: 'teacher_id_2', as: 'schedules2' });

    // Sync the database
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully!');

    // Seed a default super-user
    const superUser = await User.findOne({ where: { username: 'superadmin' } });
    if (!superUser) {
      await User.create({
        username: 'superadmin',
        password: 'superpassword123',
        role: 'super-user',
      });
      console.log('Default super-user created: superadmin / superpassword123');
    }
  } catch (error) {
    console.error('Error syncing the database:', error);
    throw error;
  }
};

export { initialDB };
