// modules/schedules/schedule.routes.js
import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { scheduleValidationRules } from './schedule.validation.js';
import {
  createScheduleHandler,
  getAllSchedulesHandler,
} from './schedule.service.js';
import { authenticate, restrictTo } from '../../middlewares/auth.js';

const router = Router();

const routes = [
  {
    method: 'post',
    path: '/',
    handler: createScheduleHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'user'),
      scheduleValidationRules,
      validate,
    ],
    description: 'Create a new schedule',
  },
  {
    method: 'get',
    path: '/',
    handler: getAllSchedulesHandler,
    middleware: [authenticate, restrictTo('super-user', 'user')],
    description: 'Get all schedules with optional filtering',
  },
];

routes.forEach((route) => {
  const { method, path, handler, middleware = [], description } = route;
  router[method](path, ...middleware, handler);
});

export { router as scheduleRouter };
