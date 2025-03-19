import { Router } from 'express';
import { fieldValidationRules } from './field.validation.js';
import { validate } from '../../middlewares/validate.js';
import {
  createFieldHandler,
  deleteFieldHandler,
  getAllFieldsHandler,
  getFieldByIdHandler,
  updateFieldHandler,
} from './field.service.js';
import { authenticate, restrictTo } from '../../middlewares/auth.js';

const router = Router();

const routes = [
  {
    method: 'post',
    path: '/',
    handler: createFieldHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'user'),
      fieldValidationRules,
      validate,
    ],
  },
  {
    method: 'get',
    path: '/',
    handler: getAllFieldsHandler,
    middleware: [authenticate, restrictTo('super-user', 'user')],
  },
  {
    method: 'get',
    path: '/:id',
    handler: getFieldByIdHandler,
    middleware: [authenticate, restrictTo('super-user', 'user')],
  },
  {
    method: 'put',
    path: '/:id',
    handler: updateFieldHandler,
    middleware: [
      authenticate,
      restrictTo('super-user', 'user'),
      fieldValidationRules,
      validate,
    ],
  },
  {
    method: 'delete',
    path: '/:id',
    handler: deleteFieldHandler,
    middleware: [authenticate, restrictTo('super-user', 'user')],
  },
];

routes.forEach((route) => {
  const { method, path, handler, middleware = [] } = route;
  router[method](path, ...middleware, handler);
});

export { router as fieldRouter };
