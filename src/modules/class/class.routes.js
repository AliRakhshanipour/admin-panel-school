import { Router } from 'express';
import {
  createClassHandler,
  getAllClassesHandler,
  getClassByIdHandler,
  getClassStudentsHandler,
  updateClassHandler, // Added for PATCH
  deleteClassHandler, // Added for DELETE
} from './class.service.js';
import {
  classPatchValidationRules,
  classValidationRules,
} from './class.validation.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate, restrictTo } from '../../middlewares/auth.js';

const router = Router();

// Middleware to validate classId parameter
const validateClassId = (req, res, next) => {
  const classId = parseInt(req.params.id, 10);
  if (isNaN(classId) || classId < 1) {
    return next(createHttpError.BadRequest('Invalid class ID'));
  }
  next();
};

const routes = [
  // Specific routes (with parameters)
  {
    method: 'get',
    path: '/:id/students',
    handler: getClassStudentsHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'user'),
      validateClassId,
    ],
    description: 'Get students of a specific class',
  },
  {
    method: 'delete',
    path: '/:id',
    handler: deleteClassHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'user'),
      validateClassId,
    ],
    description: 'Delete a specific class by ID',
  },
  {
    method: 'patch',
    path: '/:id',
    handler: updateClassHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'user'),
      validateClassId,
      classPatchValidationRules,
      validate,
    ],
    description: 'Update a specific class by ID',
  },
  {
    method: 'get',
    path: '/:id',
    handler: getClassByIdHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'user'),
      validateClassId,
    ],
    description: 'Get a specific class by ID',
  },
  // General routes (no parameters)
  {
    method: 'post',
    path: '/',
    handler: createClassHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'user'),
      classValidationRules,
      validate,
    ],
    description: 'Create a new class',
  },
  {
    method: 'get',
    path: '/',
    handler: getAllClassesHandler,
    middleware: [authenticate, restrictTo('super-user', 'user')],
    description: 'Get all classes with pagination',
  },
];

routes.forEach((route) => {
  const { method, path, handler, middleware = [], description } = route;
  router[method](path, ...middleware, handler);
  // Optional: Log route registration for debugging
  // console.log(`Registered route: ${method.toUpperCase()} ${path} - ${description}`);
});

export { router as classRouter };
