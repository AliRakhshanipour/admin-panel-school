// modules/teachers/teacher.routes.js
import { Router } from 'express';
import {
  createTeacherHandler,
  getAllTeachersHandler,
  getTeacherByIdHandler,
  updateTeacherHandler,
  deleteTeacherHandler,
  getTeacherScheduleHandler,
} from './teacher.service.js';
import {
  teacherValidationRules,
  teacherPatchValidationRules,
} from './teacher.validation.js';
import { validate } from '../../middlewares/validate.js';
import createHttpError from 'http-errors';
import { authenticate, restrictTo } from '../../middlewares/auth.js';

const router = Router();

// Middleware: Validate teacher ID
const validateTeacherId = (req, res, next) => {
  const teacherId = parseInt(req.params.id, 10);
  if (isNaN(teacherId) || teacherId < 1) {
    return next(createHttpError.BadRequest('Invalid teacher ID'));
  }
  next();
};

const routes = [
  {
    method: 'patch',
    path: '/:id',
    handler: updateTeacherHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'user'),
      validateTeacherId,
      teacherPatchValidationRules,
      validate,
    ],
    description: 'Partially update a teacher',
  },
  {
    method: 'delete',
    path: '/:id',
    handler: deleteTeacherHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'user'),
      validateTeacherId,
    ],
    description: 'Delete a teacher by ID',
  },
  {
    method: 'get',
    path: '/:id/schedule',
    handler: getTeacherScheduleHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'user'),
      validateTeacherId,
    ],
    description: 'Get a teacher by ID',
  },
  {
    method: 'get',
    path: '/:id',
    handler: getTeacherByIdHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'user'),
      validateTeacherId,
    ],
    description: 'Get a teacher by ID',
  },
  {
    method: 'post',
    path: '/',
    handler: createTeacherHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'user'),
      teacherValidationRules,
      validate,
    ],
    description: 'Create a new teacher',
  },
  {
    method: 'get',
    path: '/',
    handler: getAllTeachersHandler,
    middleware: [authenticate, restrictTo('super-user', 'user')],
    description: 'Get all teachers with optional filtering',
  },
];

routes.forEach((route) => {
  const { method, path, handler, middleware = [], description } = route;
  router[method](path, ...middleware, handler);
});

export { router as teacherRouter };
