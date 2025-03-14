import { Router } from 'express';
import {
  createClassHandler,
  getAllClassesHandler,
  getClassByIdHandler,
  getClassStudentsHandler, // Added missing import
} from './class.service.js';
import { classValidationRules } from './class.validation.js';
import { validate } from '../../middlewares/validate.js';

const router = Router();

const routes = [
  // Most specific routes first
  {
    method: 'get',
    path: '/:id/students',
    handler: getClassStudentsHandler, // Correct handler
    middleware: [], // Add validation if needed
  },
  {
    method: 'get',
    path: '/:id',
    handler: getClassByIdHandler,
    middleware: [],
  },
  // Less specific routes
  {
    method: 'post',
    path: '/',
    handler: createClassHandler,
    middleware: [classValidationRules, validate],
  },
  {
    method: 'get',
    path: '/',
    handler: getAllClassesHandler,
    middleware: [],
  },
];

routes.forEach((route) => {
  const { method, path, handler, middleware = [] } = route;
  router[method](path, ...middleware, handler);
});

export { router as classRouter };
