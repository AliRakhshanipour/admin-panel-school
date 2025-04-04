import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { ErrorHandler } from './src/common/error.handler.js';
import { initialDB } from './src/common/initial.db.js';
import { authenticateDB } from './src/configs/db.config.js';
import { stratServer } from './src/configs/server.config.js';
import { setupSwagger } from './src/configs/swagger.config.js';
import { attendanceRouter } from './src/modules/attendances/attendance.routes.js';
import { authRouter } from './src/modules/auth/auth.routes.js';
import { classRouter } from './src/modules/class/class.routes.js';
import { fieldRouter } from './src/modules/fields/field.routes.js';
import { scheduleRouter } from './src/modules/schedules/schedule.routes.js';
import { studentRouter } from './src/modules/students/student.routes.js';
import { teacherRouter } from './src/modules/teacher/teacher.routes.js';
import { userRouter } from './src/modules/users/user.routes.js';

const bootstrap = async () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(morgan('dev'));

  setupSwagger(app);
  app.use('/students', studentRouter);
  app.use('/fields', fieldRouter);
  app.use('/classes', classRouter);
  app.use('/teachers', teacherRouter);
  app.use('/schedules', scheduleRouter);
  app.use('/users', userRouter);
  app.use('/auth', authRouter);
  app.use('/attendance', attendanceRouter);
  await initialDB();
  await authenticateDB();

  new ErrorHandler(app);
  stratServer(app);
};

await bootstrap();
