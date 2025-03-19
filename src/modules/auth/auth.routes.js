// modules/auth/auth.routes.js
import { Router } from 'express';
import { loginHandler } from './auth.service.js';
import { loginValidationRules } from './auth.validation.js';
import { validate } from '../../middlewares/validate.js';

const router = Router();

const routes = [
  {
    method: 'post',
    path: '/login',
    handler: loginHandler,
    middleware: [loginValidationRules, validate],
    description: 'Login a user and return a JWT token',
  },
];

routes.forEach((route) => {
  const { method, path, handler, middleware = [] } = route;
  router[method](path, ...middleware, handler);
});

export { router as authRouter };
