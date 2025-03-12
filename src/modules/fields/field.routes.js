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

const router = Router();

const routes = [
  {
    method: 'post',
    path: '/',
    handler: createFieldHandler,
    middleware: [fieldValidationRules, validate],
  },
  {
    method: 'get',
    path: '/',
    handler: getAllFieldsHandler,
  },
  {
    method: 'get',
    path: '/:id',
    handler: getFieldByIdHandler,
  },
  {
    method: 'put',
    path: '/:id',
    handler: updateFieldHandler,
    middleware: [fieldValidationRules, validate],
  },
  {
    method: 'delete',
    path: '/:id',
    handler: deleteFieldHandler,
    middleware: [],
  },
];

routes.forEach((route) => {
  const { method, path, handler, middleware = [] } = route;
  router[method](path, ...middleware, handler);
});

export { router as fieldRouter };
