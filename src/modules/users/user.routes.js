// modules/users/user.routes.js
import { Router } from 'express';
import { authenticate, restrictTo } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import {
  createUserHandler,
  deleteUserHandler,
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
} from './user.service.js';
import {
  userPatchValidationRules,
  userValidationRules,
} from './user.validation.js';

const router = Router();

const routes = [
  {
    method: 'post',
    path: '/',
    handler: createUserHandler,
    middleware: [
      authenticate,
      restrictTo('super-user'),
      userValidationRules,
      validate,
    ],
    description: 'Create a new user (super-user only)',
  },
  {
    method: 'get',
    path: '/',
    handler: getAllUsersHandler,
    middleware: [authenticate, restrictTo('super-user', 'user')],
    description: 'Get all users',
  },
  {
    method: 'get',
    path: '/:id',
    handler: getUserByIdHandler,
    middleware: [authenticate, restrictTo('super-user', 'user')],
    description: 'Get a user by ID',
  },
  {
    method: 'patch',
    path: '/:id',
    handler: updateUserHandler,
    middleware: [
      authenticate,
      restrictTo('super-user'),
      userPatchValidationRules,
      validate,
    ],
    description: 'Update a user (super-user only)',
  },
  {
    method: 'delete',
    path: '/:id',
    handler: deleteUserHandler,
    middleware: [authenticate, restrictTo('super-user')],
    description: 'Delete a user (super-user only)',
  },
];

routes.forEach((route) => {
  const { method, path, handler, middleware = [] } = route;
  router[method](path, ...middleware, handler);
});

export { router as userRouter };
