import { sequelize } from '../configs/db.config.js';
import { Class } from '../modules/class/class.model.js';
import { Field } from '../modules/fields/field.model.js';
import { Student } from '../modules/students/student.model.js';

const initialDB = async () => {
  try {
    // Set up associations here
    Student.belongsTo(Field, { foreignKey: 'subFieldId', as: 'subField' });
    Field.hasMany(Student, { foreignKey: 'subFieldId' });
    Field.hasMany(Field, { foreignKey: 'parentId', as: 'subFields' });
    Field.belongsTo(Field, { foreignKey: 'parentId', as: 'parentField' });

    // New Class-Student associations
    Student.belongsTo(Class, { foreignKey: 'classId', as: 'class' });
    Class.hasMany(Student, { foreignKey: 'classId', as: 'students' });

    // Sync the database (alter to make necessary changes)
    await sequelize.sync({ alter: true }); // Safer than force in development

    console.log('Database synced successfully!');
  } catch (error) {
    console.error('Error syncing the database:', error);
  }
};

export { initialDB };
