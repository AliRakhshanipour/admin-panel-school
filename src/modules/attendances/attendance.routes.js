import { Router } from 'express';
import createHttpError from 'http-errors';
import { authenticate, restrictTo } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import {
  createAttendanceHandler,
  deleteAttendanceHandler,
  getAttendanceByEntityHandler,
  getClassAttendanceHandler,
  updateAttendanceHandler,
} from './attendance.service.js';
import {
  attendancePatchValidationRules,
  attendanceValidationRules,
} from './attendance.validation.js';

const router = Router();

// Middleware: Validate attendance ID
const validateAttendanceId = (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id < 1) {
    return next(createHttpError.BadRequest('Invalid attendance ID'));
  }
  next();
};

// Middleware: Validate entity ID and type
const validateEntity = (req, res, next) => {
  const entityId = parseInt(req.params.entityId, 10);
  const { entityType } = req.params;
  if (isNaN(entityId) || entityId < 1) {
    return next(createHttpError.BadRequest('Invalid entity ID'));
  }
  if (!['student', 'teacher'].includes(entityType)) {
    return next(createHttpError.BadRequest('Invalid entity type'));
  }
  next();
};

// Middleware: Validate class ID
const validateClassId = (req, res, next) => {
  const classId = parseInt(req.params.classId, 10);
  if (isNaN(classId) || classId < 1) {
    return next(createHttpError.BadRequest('Invalid class ID'));
  }
  next();
};

const routes = [
  {
    method: 'post',
    path: '/',
    handler: createAttendanceHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'admin'),
      attendanceValidationRules,
      validate,
    ],
    description: 'Create a new attendance record',
  },
  {
    method: 'patch',
    path: '/:id',
    handler: updateAttendanceHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'admin'),
      validateAttendanceId,
      attendancePatchValidationRules,
      validate,
    ],
    description: 'Partially update an attendance record',
  },
  {
    method: 'delete',
    path: '/:id',
    handler: deleteAttendanceHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'admin'),
      validateAttendanceId,
    ],
    description: 'Delete an attendance record by ID',
  },
  {
    method: 'get',
    path: '/:entityType/:entityId',
    handler: getAttendanceByEntityHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'admin'),
      validateEntity,
    ],
    description: 'Get attendance for a specific student or teacher',
  },
  {
    method: 'get',
    path: '/class/:classId',
    handler: getClassAttendanceHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'admin'),
      validateClassId,
    ],
    description: 'Get student attendance for a class',
  },
];

routes.forEach((route) => {
  const { method, path, handler, middleware = [], description } = route;
  router[method](path, ...middleware, handler);
});

export { router as attendanceRouter };
