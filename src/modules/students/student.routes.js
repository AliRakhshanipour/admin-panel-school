import { Router } from 'express';
import {
  createStudentHandler,
  getAllStudentsHandler,
  getStudentByIdHandler,
  updateStudentByIdHandler,
  deleteStudentByIdHandler,
  graduateStudentHandler,
  changeStudentFieldHandler,
} from './student.service.js';
import {
  studentChangeFieldRules,
  studentGraduatedStatusRules,
  studentValidationRules,
} from './student.validation.js';
import { validate } from '../../middlewares/validate.js';

const router = Router();

const routes = [
  {
    method: 'post',
    path: '/',
    handler: createStudentHandler,
    middleware: [studentValidationRules, validate],
  },
  {
    method: 'get',
    path: '/',
    handler: getAllStudentsHandler,
  },
  {
    method: 'get',
    path: '/:id',
    handler: getStudentByIdHandler,
  },
  {
    method: 'put',
    path: '/:id',
    handler: updateStudentByIdHandler,
    middleware: [studentValidationRules, validate],
  },
  {
    method: 'patch',
    path: '/graduated-status/:id',
    handler: graduateStudentHandler,
    middleware: [studentGraduatedStatusRules, validate],
  },
  {
    method: 'patch',
    path: '/change-field/:id',
    handler: changeStudentFieldHandler,
    middleware: [studentChangeFieldRules, validate],
  },
  {
    method: 'delete',
    path: '/:id',
    handler: deleteStudentByIdHandler,
  },
];

routes.forEach((route) => {
  const { method, path, handler, middleware = [] } = route;
  router[method](path, ...middleware, handler);
});

export { router as studentRouter };
