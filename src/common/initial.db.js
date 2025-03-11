import { sequelize } from '../configs/db.config.js';
import { Student } from '../modules/students/student.model.js';

const initialDB = async () => {
  try {
    // await Student.sync({ alter: true });
    await sequelize.sync({ alter: true });
    // await sequelize.sync({ force: true });
  } catch (error) {
    console.log(error);
  }
};

export { initialDB };
