import { Router } from 'express';
import {
  createStudentHandler,
  getAllStudentsHandler,
  getStudentByIdHandler,
  updateStudentByIdHandler,
  deleteStudentByIdHandler,
  graduateStudentHandler,
  changeStudentFieldHandler,
  addStudentToClassHandler, // Added new handler
} from './student.service.js';
import {
  studentValidationRules,
  studentPatchValidationRules, // Added for PATCH
  studentGraduatedStatusRules,
  studentChangeFieldRules,
  studentClassAssignmentRules, // Added for class assignment
} from './student.validation.js';
import { validate } from '../../middlewares/validate.js';
import createHttpError from 'http-errors';
import { authenticate, restrictTo } from '../../middlewares/auth.js';

const router = Router();

// Middleware: Validate student ID
const validateStudentId = (req, res, next) => {
  const studentId = parseInt(req.params.studentId || req.params.id, 10);
  if (isNaN(studentId) || studentId < 1) {
    return next(createHttpError.BadRequest('Invalid student ID'));
  }
  next();
};

const routes = [
  // Specific routes with parameters
  {
    method: 'patch',
    path: '/:id/class',
    handler: addStudentToClassHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'user'),
      validateStudentId,
      studentClassAssignmentRules,
      validate,
    ],
    description: 'Assign a student to a class',
  },
  {
    method: 'patch',
    path: '/:id/field',
    handler: changeStudentFieldHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'user'),
      validateStudentId,
      studentChangeFieldRules,
      validate,
    ],
    description: 'Change a student’s subField',
  },
  {
    method: 'patch',
    path: '/:id/graduate',
    handler: graduateStudentHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'user'),
      validateStudentId,
      studentGraduatedStatusRules,
      validate,
    ],
    description: 'Update a student’s graduation status',
  },
  {
    method: 'patch',
    path: '/:id',
    handler: updateStudentByIdHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'user'),
      validateStudentId,
      studentPatchValidationRules,
      validate,
    ],
    description: 'Partially update a student',
  },
  {
    method: 'delete',
    path: '/:id',
    handler: deleteStudentByIdHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'user'),
      validateStudentId,
    ],
    description: 'Delete a student by ID',
  },
  {
    method: 'get',
    path: '/:id',
    handler: getStudentByIdHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'user'),
      validateStudentId,
    ],
    description: 'Get a student by ID',
  },
  // General routes
  {
    method: 'post',
    path: '/',
    handler: createStudentHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'user'),
      studentValidationRules,
      validate,
    ],
    description: 'Create a new student',
  },
  {
    method: 'get',
    path: '/',
    handler: getAllStudentsHandler,
    middleware: [authenticate, restrictTo('super-user', 'user')],
    description: 'Get all students with optional filtering',
  },
];

routes.forEach((route) => {
  const { method, path, handler, middleware = [], description } = route;
  router[method](path, ...middleware, handler);
  // Optional: Log route registration for debugging
  // console.log(`Registered route: ${method.toUpperCase()} ${path} - ${description}`);
});

export { router as studentRouter };
